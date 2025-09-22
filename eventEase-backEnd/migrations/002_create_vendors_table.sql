-- Migration: 002_create_vendors_table.sql
-- Create vendors table

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