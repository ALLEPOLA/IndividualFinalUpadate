-- Migration: 006_create_events_table.sql
-- Create events table

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    special_requirements TEXT,
    vendor_id INT NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    services JSON,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    advance_amount DECIMAL(10,2) DEFAULT 0.00,
    remaining_amount DECIMAL(10,2) DEFAULT 0.00,
    advance_percentage DECIMAL(5,2) DEFAULT 0.00,
    payment_status ENUM('pending', 'advance_paid', 'fully_paid') DEFAULT 'pending',
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);