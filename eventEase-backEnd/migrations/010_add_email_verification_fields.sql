-- Migration: 010_add_email_verification_fields.sql
-- Add email verification fields to users table

ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER email;
ALTER TABLE users ADD COLUMN email_otp VARCHAR(6) NULL AFTER email_verified;
ALTER TABLE users ADD COLUMN email_otp_expires DATETIME NULL AFTER email_otp;