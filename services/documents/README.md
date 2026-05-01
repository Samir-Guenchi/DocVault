# Documents Service

Core microservice handling documents, users, categories, and departments. Publishes Kafka events on document uploads for downstream processing.

## Tech Stack

- **Framework:** Spring Boot 3.4.5
- **Database:** PostgreSQL 15 (partitioned by quarter)
- **Storage:** MinIO (S3-Compatible) for binary files
- **Messaging:** Apache Kafka (producer)
- **Cache:** Redis 7 (optional)
- **Java:** 21

## API Endpoints

### Documents
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/documents` | List all |
| `GET` | `/api/documents/{id}` | Get by ID |
| `POST` | `/api/documents` | Create metadata only → publishes Kafka event |
| `POST` | `/api/documents/upload` | Create with file upload → MinIO S3 + metadata |
| `PATCH` | `/api/documents/{id}` | Partial update |
| `DELETE` | `/api/documents/{id}` | Delete |
| `GET` | `/api/documents/health` | Health check |

### Users
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/users` | List all |
| `POST` | `/api/users/login` | Authenticate |
| `POST` | `/api/users` | Create |
| `PUT` | `/api/users/{id}` | Full update |
| `PATCH` | `/api/users/{id}` | Partial update / suspend |
| `DELETE` | `/api/users/{id}` | Delete |

### Categories & Departments
| Method | Path |
|--------|------|
| `GET / POST / DELETE` | `/api/categories[/{id}]` |
| `GET / POST / DELETE` | `/api/departments[/{id}]` |

## Project Structure

```
src/main/java/com/example/demo/
├── controller/
│   ├── DocumentController.java     # Documents REST API
│   ├── UserController.java         # Users REST API + login
│   ├── CategoryController.java     # Categories REST API
│   └── DepartmentController.java   # Departments REST API
├── entity/
│   ├── Document.java               # JPA entity (partitioned table)
│   ├── AppUser.java                # JPA entity
│   ├── Category.java               # JPA entity
│   └── Department.java             # JPA entity
├── repository/
│   ├── DocumentRepository.java     # Spring Data JPA
│   ├── UserRepository.java
│   ├── CategoryRepository.java
│   └── DepartmentRepository.java
├── service/
│   ├── DocumentService.java        # Business logic
│   └── DocumentEventPublisher.java # Kafka producer
├── event/
│   └── DocumentUploadedEvent.java  # Kafka event DTO
└── config/
    └── KafkaProducerConfig.java    # Kafka serialization config
```

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_HOST` | `localhost` | PostgreSQL host |
| `POSTGRES_PORT` | `5432` | PostgreSQL port |
| `POSTGRES_DB` | `dms` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | `postgres` | Database password |
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9093` | Kafka broker |
| `S3_ENDPOINT` | `http://localhost:9000` | MinIO endpoint URL |
| `S3_ACCESS_KEY` | `minioadmin` | MinIO access key |
| `S3_SECRET_KEY` | `minioadmin` | MinIO secret key |

## Running

```bash
./mvnw spring-boot:run
# → http://localhost:8081
```

## Docker

```bash
docker build -t dms-documents .
docker run -p 8081:8081 -e POSTGRES_HOST=host.docker.internal dms-documents
```
