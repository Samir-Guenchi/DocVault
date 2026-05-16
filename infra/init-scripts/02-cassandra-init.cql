-- Lab 8 Exercise C2: Cassandra Keyspace and Tables
-- Run this script after Cassandra starts:
-- docker exec -it dms-cassandra cqlsh -f /init-scripts/02-cassandra-init.cql

-- Create keyspace with SimpleStrategy (for single datacenter)
CREATE KEYSPACE IF NOT EXISTS dms
WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
};

USE dms;

-- Create comments table with UUID primary key
-- Optimized for write-heavy workloads with document_id filtering
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY,
    document_id BIGINT,
    user_id BIGINT,
    user_name TEXT,
    text TEXT,
    created_at TIMESTAMP
) WITH comment = 'Comments table for DMS - optimized for write-heavy workloads';

-- Create index on document_id for queries by document
CREATE INDEX IF NOT EXISTS idx_comments_document_id ON comments (document_id);

-- Create index on user_id for queries by user
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments (user_id);

-- Create activity_logs table for user activity tracking
CREATE TABLE IF NOT EXISTS activity_logs (
    user_id UUID,
    activity_id TIMEUUID,
    action TEXT,
    resource_type TEXT,
    resource_id TEXT,
    timestamp TIMESTAMP,
    metadata MAP<TEXT, TEXT>,
    PRIMARY KEY (user_id, activity_id)
) WITH CLUSTERING ORDER BY (activity_id DESC)
  AND comment = 'Activity logs table - write-optimized for user actions';

-- Insert sample comments for testing
INSERT INTO comments (id, document_id, user_id, user_name, text, created_at)
VALUES (uuid(), 1, 1, 'John Doe', 'Great document! Very informative.', toTimestamp(now()));

INSERT INTO comments (id, document_id, user_id, user_name, text, created_at)
VALUES (uuid(), 1, 2, 'Jane Smith', 'I have a question about section 3.', toTimestamp(now()));

INSERT INTO comments (id, document_id, user_id, user_name, text, created_at)
VALUES (uuid(), 1, 3, 'Bob Johnson', 'Thanks for sharing this!', toTimestamp(now()));

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, activity_id, action, resource_type, resource_id, timestamp, metadata)
VALUES (123e4567-e89b-12d3-a456-426614174000, now(), 'UPLOAD', 'document', '1', toTimestamp(now()), {'file_size': '1024', 'file_type': 'pdf'});

INSERT INTO activity_logs (user_id, activity_id, action, resource_type, resource_id, timestamp, metadata)
VALUES (123e4567-e89b-12d3-a456-426614174000, now(), 'VIEW', 'document', '2', toTimestamp(now()), {'duration': '120'});

-- Verify data
SELECT 'Cassandra keyspace and tables created successfully!' AS status;
SELECT COUNT(*) AS comment_count FROM comments;
SELECT COUNT(*) AS activity_count FROM activity_logs;

-- Show table structure
DESCRIBE TABLE comments;
DESCRIBE TABLE activity_logs;
