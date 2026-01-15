-- Order Service Database Schema
-- SQLite3 Database for managing orders

-- Table: customers
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    -- Status: PENDING, CONFIRMED, PROCESSING, READY_FOR_DELIVERY, COMPLETED, CANCELLED
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_postal_code VARCHAR(20) NOT NULL,
    special_instructions TEXT,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    weight DECIMAL(10, 2), -- in kg
    dimensions VARCHAR(100), -- LxWxH in cm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Table: order_status_history
CREATE TABLE IF NOT EXISTS order_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Trigger to update updated_at timestamp on orders
CREATE TRIGGER IF NOT EXISTS update_orders_timestamp 
AFTER UPDATE ON orders
BEGIN
    UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at timestamp on customers
CREATE TRIGGER IF NOT EXISTS update_customers_timestamp 
AFTER UPDATE ON customers
BEGIN
    UPDATE customers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
