-- Migration: Create stories and subscribers tables
-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create subscribers table (for newsletter)
CREATE TABLE IF NOT EXISTS subscribers (
    email TEXT PRIMARY KEY,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'active'
);
