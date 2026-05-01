# Comments Service

Microservice for managing document comment threads, backed by Apache Cassandra for high-throughput distributed writes.

## Tech Stack

- **Framework:** Spring Boot
- **Database:** Apache Cassandra 4.1
- **Java:** 21

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/comments?documentId={id}` | Get comments for a document |
| `POST` | `/api/comments` | Add a comment |
| `DELETE` | `/api/comments/{id}` | Delete a comment |

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `CASSANDRA_HOST` | `localhost` | Cassandra host |
| `CASSANDRA_PORT` | `9042` | Cassandra port |
| `CASSANDRA_KEYSPACE` | `dms` | Keyspace name |
| `CASSANDRA_DC` | `datacenter1` | Data center |

## Running

```bash
./mvnw spring-boot:run
# → http://localhost:8082
```
