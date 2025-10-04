-- Migration: 013_add_team_members_to_events.sql
-- Add team_members column to events table

-- Add team_members column to store JSON data of assigned team members
ALTER TABLE events 
ADD COLUMN team_members JSON DEFAULT NULL;
























