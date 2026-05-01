-- Lab 8 Exercise C3: PostgreSQL Partitioning
-- This script creates partitioned tables for the DMS system

-- Create partitioned documents table
CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL,
    title TEXT NOT NULL,
    description TEXT,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    owner TEXT,
    category_id BIGINT,
    department_id BIGINT,
    file_type TEXT,
    size_kb INTEGER,
    sensitivity TEXT DEFAULT 'internal',
    file_url TEXT
) PARTITION BY RANGE (created_at);

-- Create partitions for 2025 (quarterly)
CREATE TABLE documents_2025_q1
PARTITION OF documents
FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

CREATE TABLE documents_2025_q2
PARTITION OF documents
FOR VALUES FROM ('2025-04-01') TO ('2025-07-01');

CREATE TABLE documents_2025_q3
PARTITION OF documents
FOR VALUES FROM ('2025-07-01') TO ('2025-10-01');

CREATE TABLE documents_2025_q4
PARTITION OF documents
FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');

-- Create partitions for 2026 (quarterly)
CREATE TABLE documents_2026_q1
PARTITION OF documents
FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

CREATE TABLE documents_2026_q2
PARTITION OF documents
FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');

CREATE TABLE documents_2026_q3
PARTITION OF documents
FOR VALUES FROM ('2026-07-01') TO ('2026-10-01');

CREATE TABLE documents_2026_q4
PARTITION OF documents
FOR VALUES FROM ('2026-10-01') TO ('2027-01-01');

-- Create indexes on partitions for better query performance
CREATE INDEX idx_documents_2025_q1_owner ON documents_2025_q1(owner);
CREATE INDEX idx_documents_2025_q2_owner ON documents_2025_q2(owner);
CREATE INDEX idx_documents_2025_q3_owner ON documents_2025_q3(owner);
CREATE INDEX idx_documents_2025_q4_owner ON documents_2025_q4(owner);
CREATE INDEX idx_documents_2026_q1_owner ON documents_2026_q1(owner);
CREATE INDEX idx_documents_2026_q2_owner ON documents_2026_q2(owner);
CREATE INDEX idx_documents_2026_q3_owner ON documents_2026_q3(owner);
CREATE INDEX idx_documents_2026_q4_owner ON documents_2026_q4(owner);

-- Create index on parent table (applies to all partitions)
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_department ON documents(department_id);

-- Insert sample data for testing
INSERT INTO documents (title, description, created_at, owner, category_id, department_id, file_type, size_kb, sensitivity)
VALUES 
    ('Q1 Financial Report', 'Quarterly financial summary', '2025-02-15', 'John Doe', 1, 1, 'pdf', 1024, 'restricted'),
    ('Q2 Budget Plan', 'Budget planning document', '2025-05-20', 'Jane Smith', 1, 1, 'xlsx', 512, 'internal'),
    ('Q3 Performance Review', 'Team performance metrics', '2025-08-10', 'Bob Johnson', 2, 2, 'docx', 256, 'internal'),
    ('Q4 Strategy Document', 'Strategic planning for next year', '2025-11-05', 'Alice Williams', 3, 1, 'pdf', 2048, 'restricted'),
    ('2026 Roadmap', 'Product roadmap for 2026', '2026-01-15', 'Charlie Brown', 3, 2, 'pptx', 4096, 'public');

-- Verify partition distribution
SELECT 
    tableoid::regclass AS partition_name,
    COUNT(*) AS row_count,
    MIN(created_at) AS min_date,
    MAX(created_at) AS max_date
FROM documents
GROUP BY tableoid
ORDER BY partition_name;

-- Create hash-partitioned table for comparison (Optional Exercise P4)
CREATE TABLE documents_hash (
    id BIGSERIAL,
    title TEXT NOT NULL,
    description TEXT,
    created_at DATE DEFAULT CURRENT_DATE,
    owner TEXT,
    category_id BIGINT,
    department_id BIGINT
) PARTITION BY HASH (id);

-- Create 4 hash partitions for even distribution
CREATE TABLE documents_hash_0 PARTITION OF documents_hash
FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE documents_hash_1 PARTITION OF documents_hash
FOR VALUES WITH (MODULUS 4, REMAINDER 1);

CREATE TABLE documents_hash_2 PARTITION OF documents_hash
FOR VALUES WITH (MODULUS 4, REMAINDER 2);

CREATE TABLE documents_hash_3 PARTITION OF documents_hash
FOR VALUES WITH (MODULUS 4, REMAINDER 3);

-- Create users and departments tables (non-partitioned)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    department_id BIGINT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (name, email, password, role, department_id, status)
VALUES 
    ('IT Admin', 'admin@dms.com', '123', 'admin', 1, 'active'),
    ('Samir Guenchii', 'user@dms.com', '123', 'user', 2, 'active'),
    ('Amina B.', 'amina@dms.com', '123', 'user', 3, 'active');

-- Insert sample departments
INSERT INTO departments (name, description)
VALUES 
    ('Engineering', 'Software development and IT'),
    ('Finance', 'Financial planning and accounting'),
    ('HR', 'Human resources and recruitment');

-- Insert sample categories
INSERT INTO categories (name, description)
VALUES 
    ('Financial', 'Financial documents and reports'),
    ('Technical', 'Technical documentation'),
    ('Strategic', 'Strategic planning documents');

-- Print summary
SELECT 'Partitioned tables created successfully!' AS status;
SELECT 'Sample data inserted for testing' AS status;
