-- Deliverer Service Database Schema
-- SQLite3 Database for managing delivery personnel

-- Table: deliverers
CREATE TABLE IF NOT EXISTS deliverers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    national_id VARCHAR(50),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    status VARCHAR(50) NOT NULL DEFAULT 'INACTIVE',
    -- Status: ACTIVE, INACTIVE, ON_BREAK, OFF_DUTY, SUSPENDED
    hire_date DATE NOT NULL,
    termination_date DATE,
    rating DECIMAL(3, 2) DEFAULT 0.00, -- Average rating out of 5.00
    total_deliveries INTEGER DEFAULT 0,
    successful_deliveries INTEGER DEFAULT 0,
    failed_deliveries INTEGER DEFAULT 0,
    profile_photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: deliverer_vehicles
CREATE TABLE IF NOT EXISTS deliverer_vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deliverer_id INTEGER NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    -- Types: BIKE, SCOOTER, MOTORCYCLE, CAR, VAN
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    color VARCHAR(50),
    capacity_kg DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT 1,
    insurance_number VARCHAR(100),
    insurance_expiry DATE,
    registration_expiry DATE,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deliverer_id) REFERENCES deliverers(id) ON DELETE CASCADE
);

-- Table: deliverer_documents
CREATE TABLE IF NOT EXISTS deliverer_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deliverer_id INTEGER NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    -- Types: DRIVERS_LICENSE, ID_CARD, PASSPORT, INSURANCE, BACKGROUND_CHECK, CONTRACT
    document_number VARCHAR(100),
    document_url VARCHAR(500),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION',
    -- Status: PENDING_VERIFICATION, VERIFIED, EXPIRED, REJECTED
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deliverer_id) REFERENCES deliverers(id) ON DELETE CASCADE
);

-- Table: deliverer_availability
CREATE TABLE IF NOT EXISTS deliverer_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deliverer_id INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deliverer_id) REFERENCES deliverers(id) ON DELETE CASCADE
);

-- Table: deliverer_shifts
CREATE TABLE IF NOT EXISTS deliverer_shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deliverer_id INTEGER NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    -- Status: SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
    clock_in_time TIMESTAMP,
    clock_out_time TIMESTAMP,
    clock_in_location TEXT,
    clock_out_location TEXT,
    total_hours DECIMAL(5, 2),
    deliveries_completed INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deliverer_id) REFERENCES deliverers(id) ON DELETE CASCADE
);

-- Table: deliverer_locations
CREATE TABLE IF NOT EXISTS deliverer_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deliverer_id INTEGER NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location_name VARCHAR(255),
    accuracy DECIMAL(10, 2), -- in meters
    speed DECIMAL(10, 2), -- in km/h
    heading DECIMAL(5, 2), -- in degrees
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deliverer_id) REFERENCES deliverers(id) ON DELETE CASCADE
);

-- Table: deliverer_performance
CREATE TABLE IF NOT EXISTS deliverer_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deliverer_id INTEGER NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_deliveries INTEGER DEFAULT 0,
    successful_deliveries INTEGER DEFAULT 0,
    failed_deliveries INTEGER DEFAULT 0,
    average_delivery_time INTEGER, -- in minutes
    total_distance DECIMAL(10, 2), -- in km
    average_rating DECIMAL(3, 2),
    customer_complaints INTEGER DEFAULT 0,
    late_deliveries INTEGER DEFAULT 0,
    on_time_deliveries INTEGER DEFAULT 0,
    early_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deliverer_id) REFERENCES deliverers(id) ON DELETE CASCADE
);

-- Table: deliverer_ratings
CREATE TABLE IF NOT EXISTS deliverer_ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deliverer_id INTEGER NOT NULL,
    delivery_id INTEGER NOT NULL, -- Reference to delivery in Delivery Service
    customer_id INTEGER NOT NULL, -- Reference to customer in Order Service
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deliverer_id) REFERENCES deliverers(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_deliverers_status ON deliverers(status);
CREATE INDEX IF NOT EXISTS idx_deliverers_email ON deliverers(email);
CREATE INDEX IF NOT EXISTS idx_deliverer_vehicles_deliverer_id ON deliverer_vehicles(deliverer_id);
CREATE INDEX IF NOT EXISTS idx_deliverer_vehicles_is_active ON deliverer_vehicles(is_active);
CREATE INDEX IF NOT EXISTS idx_deliverer_documents_deliverer_id ON deliverer_documents(deliverer_id);
CREATE INDEX IF NOT EXISTS idx_deliverer_documents_status ON deliverer_documents(status);
CREATE INDEX IF NOT EXISTS idx_deliverer_documents_expiry_date ON deliverer_documents(expiry_date);
CREATE INDEX IF NOT EXISTS idx_deliverer_availability_deliverer_id ON deliverer_availability(deliverer_id);
CREATE INDEX IF NOT EXISTS idx_deliverer_shifts_deliverer_id ON deliverer_shifts(deliverer_id);
CREATE INDEX IF NOT EXISTS idx_deliverer_shifts_shift_date ON deliverer_shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_deliverer_shifts_status ON deliverer_shifts(status);
CREATE INDEX IF NOT EXISTS idx_deliverer_locations_deliverer_id ON deliverer_locations(deliverer_id);
CREATE INDEX IF NOT EXISTS idx_deliverer_locations_timestamp ON deliverer_locations(timestamp);
CREATE INDEX IF NOT EXISTS idx_deliverer_performance_deliverer_id ON deliverer_performance(deliverer_id);
CREATE INDEX IF NOT EXISTS idx_deliverer_performance_period ON deliverer_performance(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_deliverer_ratings_deliverer_id ON deliverer_ratings(deliverer_id);
CREATE INDEX IF NOT EXISTS idx_deliverer_ratings_delivery_id ON deliverer_ratings(delivery_id);

-- Trigger to update updated_at timestamp on deliverers
CREATE TRIGGER IF NOT EXISTS update_deliverers_timestamp 
AFTER UPDATE ON deliverers
BEGIN
    UPDATE deliverers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on deliverer_vehicles
CREATE TRIGGER IF NOT EXISTS update_deliverer_vehicles_timestamp 
AFTER UPDATE ON deliverer_vehicles
BEGIN
    UPDATE deliverer_vehicles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update deliverer rating when new rating is added
CREATE TRIGGER IF NOT EXISTS update_deliverer_rating 
AFTER INSERT ON deliverer_ratings
BEGIN
    UPDATE deliverers 
    SET rating = (
        SELECT AVG(rating) 
        FROM deliverer_ratings 
        WHERE deliverer_id = NEW.deliverer_id
    )
    WHERE id = NEW.deliverer_id;
END;
