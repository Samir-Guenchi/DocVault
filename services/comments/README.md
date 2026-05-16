# Comments Service

Microservice for managing document comment threads, backed by **Apache Cassandra** for high-throughput write operations.

## Tech Stack

- **Framework:** Spring Boot 3.4.5
- **Database:** Apache Cassandra 4.1
- **Java:** 21

## Why Cassandra?

Cassandra is chosen for the comments service because:
- **High write throughput**: Optimized for write-heavy workloads (comments are frequently added)
- **Horizontal scalability**: Can scale across multiple nodes
- **Eventual consistency**: Acceptable for comments (doesn't need immediate consistency)
- **Distributed architecture**: No single point of failure

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/comments?documentId={id}` | Get comments for a document |
| `GET` | `/api/comments?userId={id}` | Get comments by user |
| `POST` | `/api/comments` | Add a comment |
| `DELETE` | `/api/comments/{id}` | Delete a comment |
| `GET` | `/api/comments/health` | Health check |

## Running Locally

```bash
# Start Cassandra first
docker run -d --name cassandra -p 9042:9042 cassandra:4.1

# Wait for Cassandra to start (30-60 seconds)
docker logs -f cassandra

# Start service
./mvnw spring-boot:run

# Access at http://localhost:8082
```

## Docker Deployment

```bash
# Build image
docker build -t dms-comments .

# Run with docker-compose (recommended)
cd ../../infra/docker
docker-compose -f docker-compose.full.yml up cassandra comments-service
```

## Database Schema

**Keyspace:** `dms`  
**Replication:** SimpleStrategy with replication_factor=1

**Table: comments**
```cql
CREATE TABLE comments (
    id UUID PRIMARY KEY,
    document_id BIGINT,
    user_id BIGINT,
    user_name TEXT,
    text TEXT,
    created_at TIMESTAMP
);

CREATE INDEX idx_comments_document_id ON comments (document_id);
CREATE INDEX idx_comments_user_id ON comments (user_id);
```

## Example Requests

**Create Comment:**
```bash
curl -X POST http://localhost:8082/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": 1,
    "userId": 1,
    "userName": "John Doe",
    "text": "Great document!"
  }'
```

**Get Comments for Document:**
```bash
curl http://localhost:8082/api/comments?documentId=1
```

**Delete Comment:**
```bash
curl -X DELETE http://localhost:8082/api/comments/{uuid}
```

## Monitoring

Prometheus metrics available at: `http://localhost:8082/actuator/prometheus`

Health check: `http://localhost:8082/actuator/health`
