-- Migration: 014_create_chats_table.sql
-- Create chats table for 1-on-1 conversations between users and vendors

CREATE TABLE IF NOT EXISTS chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vendor_id INT NOT NULL,
    event_id INT NOT NULL,
    last_message_id INT DEFAULT NULL,
    last_message_at TIMESTAMP DEFAULT NULL,
    user_unread_count INT DEFAULT 0,
    vendor_unread_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_vendor_event (user_id, vendor_id, event_id)
);



