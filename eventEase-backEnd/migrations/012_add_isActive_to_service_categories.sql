-- Migration: 012_add_isActive_to_service_categories.sql
-- Add isActive column to service_categories table

-- Add isActive column with default value true
ALTER TABLE service_categories 
ADD COLUMN isActive BOOLEAN DEFAULT TRUE NOT NULL;

-- Update existing records to be active
UPDATE service_categories SET isActive = TRUE WHERE isActive IS NULL;

