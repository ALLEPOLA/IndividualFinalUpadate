-- EventEase Database Schema
-- Run this script in MySQL Workbench to create the database and tables

-- Create database (uncomment if you need to create the database)
-- CREATE DATABASE IF NOT EXISTS eventease_db;
-- USE eventease_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('user', 'vendor', 'admin') NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vendors table (for businesses)
CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    businessName VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    postalCode VARCHAR(10) NOT NULL,
    capacity INT NOT NULL,
    websiteUrl VARCHAR(255) NULL,
    businessRegistrationNumber VARCHAR(50) NOT NULL,
    businessLicenseNumber VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_vendor (userId)
);

-- Service Categories table
CREATE TABLE IF NOT EXISTS service_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vendor Services table
CREATE TABLE IF NOT EXISTS vendor_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    capacity INT NOT NULL,
    advance_percentage INT NOT NULL,
    isActive BOOLEAN DEFAULT true,
    image_url VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(100) NOT NULL,
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    image_url VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Events table
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

-- Insert sample service categories
INSERT INTO service_categories (name, description) VALUES
('Venue', 'Event venues and spaces'),
('Catering', 'Food and beverage services'),
('Photography', 'Photography and videography services'),
('Entertainment', 'Music, performances, and entertainment services'),
('Decoration', 'Event decoration and design services');

-- Insert sample admin user (password: admin123)
-- Note: This password should be hashed in production
INSERT IGNORE INTO users (firstName, lastName, phone, role, email, password) 
VALUES ('Admin', 'User', '1234567890', 'admin', 'admin@eventease.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2');

-- Insert sample vendor user (password: vendor123)
INSERT IGNORE INTO users (firstName, lastName, phone, role, email, password) 
VALUES ('Vendor', 'User', '1234567891', 'vendor', 'vendor@eventease.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2');

-- Insert sample regular user (password: user123)
INSERT IGNORE INTO users (firstName, lastName, phone, role, email, password) 
VALUES ('Regular', 'User', '1234567892', 'user', 'user@eventease.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2');

-- Insert sample vendor (assuming vendor user id is 2)
INSERT IGNORE INTO vendors (userId, businessName, description, address, city, province, postalCode, capacity, websiteUrl, businessRegistrationNumber, businessLicenseNumber)
VALUES (2, 'Elite Events Co.', 'Premium event planning and management services', '123 Event Street', 'Toronto', 'Ontario', 'M5V 3A1', 500, 'https://eliteevents.com', 'BRN123456789', 'BLN987654321');

-- Insert sample events (assuming vendor id is 1)
INSERT IGNORE INTO events (name, description, type, date, start_time, end_time, special_requirements, vendor_id, vendor_name, services, total_amount, advance_amount, remaining_amount, advance_percentage, payment_status, status) VALUES
('Summer Wedding Celebration', 'Beautiful outdoor wedding ceremony and reception with full catering and photography services', 'Wedding', '2024-07-15', '16:00:00', '23:00:00', 'Vegetarian menu options, outdoor tent setup, live music preferred', 1, 'Elite Events Co.', '[{"id": 1, "name": "Venue Rental", "base_price": 2000.00, "advance_percentage": 30}, {"id": 2, "name": "Catering Service", "base_price": 3500.00, "advance_percentage": 25}, {"id": 3, "name": "Photography Package", "base_price": 1500.00, "advance_percentage": 50}]', 7000.00, 1925.00, 5075.00, 27.50, 'pending', 'pending'),
('Corporate Annual Meeting', 'Annual company meeting with presentation setup, catering, and networking session', 'Corporate', '2024-08-20', '09:00:00', '17:00:00', 'AV equipment for presentations, lunch catering for 150 people, parking arrangements', 1, 'Elite Events Co.', '[{"id": 1, "name": "Venue Rental", "base_price": 1500.00, "advance_percentage": 30}, {"id": 4, "name": "AV Equipment", "base_price": 800.00, "advance_percentage": 40}]', 2300.00, 770.00, 1530.00, 33.48, 'advance_paid', 'confirmed'),
('Birthday Party Extravaganza', 'Fun 30th birthday celebration with DJ, decorations, and catering', 'Birthday', '2024-06-10', '19:00:00', '02:00:00', 'DJ with sound system, birthday cake, colorful decorations, photo booth', 1, 'Elite Events Co.', '[{"id": 2, "name": "Catering Service", "base_price": 1200.00, "advance_percentage": 25}, {"id": 4, "name": "Entertainment", "base_price": 800.00, "advance_percentage": 40}, {"id": 5, "name": "Decoration Package", "base_price": 600.00, "advance_percentage": 35}]', 2600.00, 830.00, 1770.00, 31.92, 'pending', 'pending'),
('Charity Fundraising Gala', 'Elegant charity fundraising event with dinner, auction, and entertainment', 'Charity', '2024-09-25', '18:30:00', '23:30:00', 'Formal dinner setup, auction display area, stage for presentations, elegant decorations', 1, 'Elite Events Co.', '[{"id": 1, "name": "Venue Rental", "base_price": 2500.00, "advance_percentage": 30}, {"id": 2, "name": "Catering Service", "base_price": 4000.00, "advance_percentage": 25}, {"id": 4, "name": "Entertainment", "base_price": 1000.00, "advance_percentage": 40}]', 7500.00, 2150.00, 5350.00, 28.67, 'fully_paid', 'confirmed');

-- Show created tables
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE vendors;
DESCRIBE service_categories;
DESCRIBE vendor_services;
DESCRIBE team_members;
DESCRIBE events;

-- Show sample data
SELECT id, firstName, lastName, phone, role, email, createdAt FROM users;
SELECT id, name, description FROM service_categories;
SELECT id, name, type, date, start_time, end_time, status, vendor_id, vendor_name, services FROM events;
