-- Migration: 007_add_user_id_to_events.sql
-- Add user_id field to events table

ALTER TABLE events ADD COLUMN user_id INT AFTER id;
ALTER TABLE events ADD CONSTRAINT fk_events_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Set default user_id for existing events (assuming user id 3 is the regular user)
UPDATE events SET user_id = 3 WHERE user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE events MODIFY COLUMN user_id INT NOT NULL;