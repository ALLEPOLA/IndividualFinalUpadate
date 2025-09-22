-- Migration: 008_add_paid_amount_to_events.sql
-- Add paid_amount field to events table

ALTER TABLE events ADD COLUMN paid_amount DECIMAL(10,2) DEFAULT 0.00 AFTER advance_amount;

-- Update existing records to set paid_amount based on payment_status
UPDATE events SET paid_amount = advance_amount WHERE payment_status = 'advance_paid';
UPDATE events SET paid_amount = total_amount WHERE payment_status = 'fully_paid';