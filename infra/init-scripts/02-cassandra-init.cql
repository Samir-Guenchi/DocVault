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

-- Create comments table with composite primary key
-- Partition key: doc_id (groups all comments for a document)
-- Clustering key: comment_id (orders comments by time, DESC = newest first)
CREATE TABLE IF NOT EXISTS comments (
    doc_id UUID,
    comment_id TIMEUUID,
    content TEXT,
    author TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (doc_id, comment_id)
) WITH CLUSTERING ORDER BY (comment_id DESC)
  AND comment = 'Comments table for DMS - optimized for write-heavy workloads';

-- Create index on author for queries by author
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments (author);

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
INSERT INTO comments (doc_id, comment_id, content, author, created_at)
VALUES (550e8400-e29b-41d4-a716-446655440000, now(), 'Great document! Very informative.', 'John Doe', toTimestamp(now()));

INSERT INTO comments (doc_id, comment_id, content, author, created_at)
VALUES (550e8400-e29b-41d4-a716-446655440000, now(), 'I have a question about section 3.', 'Jane Smith', toTimestamp(now()));

INSERT INTO comments (doc_id, comment_id, content, author, created_at)
VALUES (550e8400-e29b-41d4-a716-446655440000, now(), 'Thanks for sharing this!', 'Bob Johnson', toTimestamp(now()));

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
