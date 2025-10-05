-- Migration: 018_add_middleName_column.sql
-- Add middleName column to users table

ALTER TABLE users ADD COLUMN middleName VARCHAR(50) NULL AFTER lastName;
