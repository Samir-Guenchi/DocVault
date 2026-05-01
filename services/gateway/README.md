# API Gateway

Spring Cloud Gateway that routes all client requests to the appropriate downstream microservice. Single entry point for the entire DMS platform.

## Tech Stack

- **Framework:** Spring Cloud Gateway 2025.1.1 (Spring Boot 4.0.2)
- **Java:** 21

## Route Configuration

| Route | Target | Pattern |
|-------|--------|---------|
| Documents | `documents-service:8081` | `/api/documents/**` |
| Users | `documents-service:8081` | `/api/users/**` |
| Categories | `documents-service:8081` | `/api/categories/**` |
| Departments | `documents-service:8081` | `/api/departments/**` |
| Comments | `comments-service:8082` | `/api/comments/**` |

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | `8080` | Gateway port |
| `DOCUMENTS_SERVICE_URL` | `http://localhost:8081` | Documents service URL |
| `COMMENTS_SERVICE_URL` | `http://localhost:8082` | Comments service URL |

## Features

- **CORS:** Global wildcard CORS for all origins
- **Routing:** Path-based routing to downstream services
- **Load Balancing:** Compatible with K8s service discovery

## Running

```bash
./mvnw spring-boot:run
# → http://localhost:8080
```
