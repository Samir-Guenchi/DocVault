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

## Configuration

No external environment variables required (uses H2 memory DB).
Server port runs on `8082` by default.

## Running

```bash
./mvnw spring-boot:run
# → http://localhost:8082
```
