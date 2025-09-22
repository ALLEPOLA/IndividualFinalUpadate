-- Migration: 009_insert_sample_data.sql
-- Insert sample service categories

INSERT INTO service_categories (name, description) VALUES
('Venue', 'Event venues and spaces'),
('Catering', 'Food and beverage services'),
('Photography', 'Photography and videography services'),
('Entertainment', 'Music, performances, and entertainment services'),
('Decoration', 'Event decoration and design services');

-- Insert sample admin user (password: admin123)
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