# Comments Service

Microservice for managing document comment threads, backed by an H2 In-Memory Database (via Spring Data JPA).

## Tech Stack

- **Framework:** Spring Boot 3.4.5
- **Database:** H2 In-Memory DB
- **Java:** 21

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/comments?documentId={id}` | Get comments for a document |
| `POST` | `/api/comments` | Add a comment |
| `DELETE` | `/api/comments/{id}` | Delete a comment |

## Running Locally

```bash
# Start with Spring Boot Maven plugin
./mvnw spring-boot:run

# Access at http://localhost:8082
```

## Docker Deployment

```bash
# Build image
docker build -t dms-comments .

# Run container
docker run -p 8082:8082 dms-comments

# Run with docker-compose (recommended)
cd ../../infra/docker
docker-compose -f docker-compose.full.yml up comments-service
```

## Database

Uses H2 in-memory database for high-performance comment storage. Data is stored in memory and persists only while the service is running.

**Schema:**
```sql
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Access H2 Console (Development):**
- URL: http://localhost:8082/h2-console
- JDBC URL: jdbc:h2:mem:commentsdb
- Username: sa
- Password: (empty)
