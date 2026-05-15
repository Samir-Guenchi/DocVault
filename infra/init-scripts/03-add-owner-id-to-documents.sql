-- Add owner_id column to documents table for JWT-based ownership tracking
-- This column stores the user ID from the JWT token, ensuring secure ownership

ALTER TABLE documents ADD COLUMN IF NOT EXISTS owner_id BIGINT;

-- Create index for faster queries by owner
CREATE INDEX IF NOT EXISTS idx_documents_owner_id ON documents(owner_id);

-- Add comment explaining the security model
COMMENT ON COLUMN documents.owner_id IS 'User ID from JWT token - populated server-side, never from client request';
