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

```bash
# Start PostgreSQL first
cd ../infra/docker && docker-compose up postgres -d

# Run Documents Service
cd documents && ./mvnw spring-boot:run

# Run Gateway
cd gateway && ./mvnw spring-boot:run
```
