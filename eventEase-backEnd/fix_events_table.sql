-- Fix events table to include user_id and paid_amount fields
-- This script addresses the missing fields needed for dashboard functionality

-- First, check if user_id column exists, if not add it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'events' 
     AND COLUMN_NAME = 'user_id') > 0,
    'SELECT "user_id column already exists" as message;',
    'ALTER TABLE events ADD COLUMN user_id INT AFTER id;'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint for user_id if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'events' 
     AND CONSTRAINT_NAME = 'fk_events_user_id') > 0,
    'SELECT "user_id foreign key already exists" as message;',
    'ALTER TABLE events ADD CONSTRAINT fk_events_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if paid_amount column exists, if not add it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'events' 
     AND COLUMN_NAME = 'paid_amount') > 0,
    'SELECT "paid_amount column already exists" as message;',
    'ALTER TABLE events ADD COLUMN paid_amount DECIMAL(10,2) DEFAULT 0.00 AFTER advance_amount;'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing events to have user_id (assuming user id 3 is the regular user)
-- You may need to adjust this based on your actual user data
UPDATE events SET user_id = 3 WHERE user_id IS NULL;

-- Update existing records to set paid_amount based on payment_status
UPDATE events SET paid_amount = advance_amount WHERE payment_status = 'advance_paid' AND paid_amount = 0;
UPDATE events SET paid_amount = total_amount WHERE payment_status = 'fully_paid' AND paid_amount = 0;

-- Make user_id NOT NULL after setting values
ALTER TABLE events MODIFY COLUMN user_id INT NOT NULL;

-- Show the updated table structure
DESCRIBE events;
