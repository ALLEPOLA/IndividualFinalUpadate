-- Migration: 017_fix_users_table_structure.sql
-- Fix users table structure to match the application requirements

-- Add middleName column (ignore error if it already exists)
ALTER TABLE users ADD COLUMN middleName VARCHAR(50) NULL AFTER lastName;

-- Add email_verified column (ignore error if it already exists)
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER email;

-- Add email_otp column (ignore error if it already exists)
ALTER TABLE users ADD COLUMN email_otp VARCHAR(6) NULL AFTER email_verified;

-- Add email_otp_expires column (ignore error if it already exists)
ALTER TABLE users ADD COLUMN email_otp_expires DATETIME NULL AFTER email_otp;
