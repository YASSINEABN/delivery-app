-- Delivery Service Database Schema
-- SQLite3 Database for managing deliveries and tracking

-- Table: deliveries
CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delivery_number VARCHAR(50) UNIQUE NOT NULL,
    order_id INTEGER NOT NULL, -- Reference to order in Order Service
    order_number VARCHAR(50) NOT NULL, -- Denormalized for quick access
    deliverer_id INTEGER, -- Reference to deliverer in Deliverer Service
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
    -- Status: PENDING_ASSIGNMENT, ASSIGNED, PICKED_UP, IN_TRANSIT, ARRIVED, DELIVERED, FAILED, CANCELLED
    pickup_address TEXT NOT NULL,
    pickup_city VARCHAR(100) NOT NULL,
    pickup_postal_code VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_postal_code VARCHAR(20) NOT NULL,
    estimated_distance DECIMAL(10, 2), -- in km
    estimated_duration INTEGER, -- in minutes
    actual_distance DECIMAL(10, 2), -- in km
    actual_duration INTEGER, -- in minutes
    priority VARCHAR(20) DEFAULT 'NORMAL', -- URGENT, HIGH, NORMAL, LOW
    scheduled_pickup_time TIMESTAMP,
    actual_pickup_time TIMESTAMP,
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    special_instructions TEXT,
    notes TEXT,
    signature_data TEXT, -- Base64 encoded signature
    proof_of_delivery_url VARCHAR(500), -- URL to photo/document
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: delivery_tracking
CREATE TABLE IF NOT EXISTS delivery_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delivery_id INTEGER NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_name VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
);

-- Table: delivery_status_history
CREATE TABLE IF NOT EXISTS delivery_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delivery_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    changed_by VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
);

-- Table: delivery_issues
CREATE TABLE IF NOT EXISTS delivery_issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delivery_id INTEGER NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    -- Issue types: DELAY, DAMAGE, WRONG_ADDRESS, CUSTOMER_UNAVAILABLE, WEATHER, TRAFFIC, OTHER
    description TEXT NOT NULL,
    resolution_status VARCHAR(50) DEFAULT 'OPEN',
    -- Resolution status: OPEN, IN_PROGRESS, RESOLVED, ESCALATED
    reported_by VARCHAR(100),
    resolved_by VARCHAR(100),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
);

-- Table: delivery_notifications
CREATE TABLE IF NOT EXISTS delivery_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    delivery_id INTEGER NOT NULL,
    recipient_type VARCHAR(50) NOT NULL, -- CUSTOMER, DELIVERER, ADMIN
    recipient_id VARCHAR(100) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    -- Types: ASSIGNED, PICKED_UP, IN_TRANSIT, DELAY, ARRIVED, DELIVERED
    message TEXT NOT NULL,
    sent_status VARCHAR(20) DEFAULT 'PENDING',
    -- Status: PENDING, SENT, FAILED
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_deliverer_id ON deliveries(deliverer_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_created_at ON deliveries(created_at);
CREATE INDEX IF NOT EXISTS idx_deliveries_estimated_delivery_time ON deliveries(estimated_delivery_time);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_delivery_id ON delivery_tracking(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_timestamp ON delivery_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_delivery_status_history_delivery_id ON delivery_status_history(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_issues_delivery_id ON delivery_issues(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_issues_resolution_status ON delivery_issues(resolution_status);
CREATE INDEX IF NOT EXISTS idx_delivery_notifications_delivery_id ON delivery_notifications(delivery_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notifications_sent_status ON delivery_notifications(sent_status);

-- Trigger to update updated_at timestamp on deliveries
CREATE TRIGGER IF NOT EXISTS update_deliveries_timestamp 
AFTER UPDATE ON deliveries
BEGIN
    UPDATE deliveries SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to create status history entry when delivery status changes
CREATE TRIGGER IF NOT EXISTS track_delivery_status_change 
AFTER UPDATE OF status ON deliveries
WHEN NEW.status != OLD.status
BEGIN
    INSERT INTO delivery_status_history (delivery_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || OLD.status || ' to ' || NEW.status);
END;
