# Services

Backend microservices powering the DocVault DMS platform.

## Architecture

```
Gateway (:8080)  ──→  Documents Service (:8081)  ──→  PostgreSQL
                 ──→  Comments Service  (:8082)  ──→  Cassandra
                 
Documents Service  ──→  Kafka  ──→  Translator (Gemini AI)
                                ──→  Translation Consumer → PostgreSQL
```

## Services

| Service | Port | Technology | Database | Description |
|---------|------|-----------|----------|-------------|
| **[documents](./documents/)** | 8081 | Spring Boot 3.4.5 | PostgreSQL 15 | Core CRUD for documents, users, categories, departments |
| **[comments](./comments/)** | 8082 | Spring Boot | Cassandra 4.1 | High-throughput distributed comment threads |
| **[gateway](./gateway/)** | 8080 | Spring Cloud Gateway | — | API routing, CORS, load balancing |
| **[translator](./translator/)** | — | Python | Kafka | AI translation via Google Gemini API |
| **[translation-consumer](./translation-consumer/)** | — | Python | PostgreSQL | Persists translated documents from Kafka |
| **[categories](./categories/)** | — | Spring Boot | — | Category management (legacy, merged into documents) |
| **[esb](./esb/)** | 8084 | Spring Boot | — | Enterprise Service Bus (legacy) |

## Running Locally

### Prerequisites
- PostgreSQL running on localhost:5432
- Kafka running on localhost:9092 (for full functionality)
- MinIO running on localhost:9000 (for file uploads)

```bash
# Start infrastructure services
cd ../infra/docker
docker-compose -f docker-compose.full.yml up postgres kafka minio redis -d

# Run Documents Service
cd ../../services/documents
./mvnw spring-boot:run

# Run Comments Service
cd ../comments
./mvnw spring-boot:run

# Run Gateway
cd ../gateway
./mvnw spring-boot:run
```

### Running with Docker (Recommended)

```bash
cd ../infra/docker
docker-compose -f docker-compose.full.yml up --build
```

This starts all services with proper networking and configuration.
