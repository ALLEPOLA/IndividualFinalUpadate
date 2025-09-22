-- Add user_id field to events table
-- This field is needed to associate events with users for the dashboard analytics

-- Add user_id column to events table
ALTER TABLE events ADD COLUMN user_id INT AFTER id;

-- Add foreign key constraint
ALTER TABLE events ADD CONSTRAINT fk_events_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update existing events to have a user_id (assuming user id 3 is the regular user)
-- You may need to adjust this based on your actual user data
UPDATE events SET user_id = 3 WHERE user_id IS NULL;

-- Make user_id NOT NULL after setting values
ALTER TABLE events MODIFY COLUMN user_id INT NOT NULL;
