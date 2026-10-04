-- Database Schema for iLovePDF Clone (PostgreSQL & SQLite compatible)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'enterprise')),
    storage_used_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File Metadata Table
CREATE TABLE IF NOT EXISTS files (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    page_count INTEGER DEFAULT 0,
    storage_path TEXT NOT NULL,
    is_processed BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PDF Operations History Table
CREATE TABLE IF NOT EXISTS operations_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    tool_type VARCHAR(50) NOT NULL, -- 'merge', 'split', 'compress', 'convert', 'edit', 'protect', 'sign', 'ocr'
    input_file_ids TEXT,            -- JSON array of file IDs
    output_file_id VARCHAR(36) REFERENCES files(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    parameters TEXT,                -- JSON string of options used
    original_size_bytes BIGINT,
    processed_size_bytes BIGINT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Saved Templates Table
CREATE TABLE IF NOT EXISTS saved_templates (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    tool_type VARCHAR(50) NOT NULL,
    configuration_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Analytics / Usage Aggregates
CREATE TABLE IF NOT EXISTS usage_analytics (
    id VARCHAR(36) PRIMARY KEY,
    date DATE NOT NULL,
    tool_type VARCHAR(50) NOT NULL,
    total_operations INTEGER DEFAULT 1,
    total_bytes_processed BIGINT DEFAULT 0,
    UNIQUE(date, tool_type)
);

-- Indexes for high-throughput queries
CREATE INDEX IF NOT EXISTS idx_files_expires_at ON files(expires_at) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_history_user_id ON operations_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_tool ON operations_history(tool_type);
