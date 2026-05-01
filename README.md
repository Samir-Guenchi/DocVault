<div align="center">

# DocVault

### Enterprise Document Management System

**A production-grade, distributed microservices platform for banking-level document lifecycle management.**

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Kafka](https://img.shields.io/badge/Apache_Kafka-7.5-231F20?logo=apachekafka&logoColor=white)](https://kafka.apache.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io)

</div>

---

## Architecture

```
                              ┌──────────────────────┐
                              │    FRONTEND (React)   │
                              │    Nginx · Port 3000  │
                              └──────────┬───────────┘
                                         │ /api/*
                              ┌──────────▼───────────┐
                              │    API GATEWAY        │
                              │  Spring Cloud · 8080  │
                              └───┬──────────────┬────┘
                                  │              │
                    ┌─────────────▼──┐    ┌──────▼──────────┐
                    │  DOCUMENTS SVC │    │  COMMENTS SVC   │
                    │  Spring · 8081 │    │  Spring · 8082  │
                    │                │    │                  │
                    │  ┌──────────┐  │    │  ┌───────────┐  │
                    │  │PostgreSQL│  │    │  │ H2 Mem DB  │  │
                    │  │  :5432   │  │    │  │   :8082    │  │
                    │  └──────────┘  │    │  └───────────┘  │
                    │  ┌──────────┐  │    └─────────────────┘
                    │  │MinIO S3  │  │
                    │  │  :9000   │  │
                    │  └──────────┘  │
                    └────────┬───────┘
                             │ Event
                    ┌────────▼───────┐
                    │     KAFKA      │
                    │     :9092      │
                    └──┬──────────┬──┘
                       │          │
              ┌────────▼──┐  ┌───▼────────────────┐
              │ TRANSLATOR│  │ TRANSLATION        │
              │ Python +  │  │ CONSUMER           │
              │ Gemini AI │  │ Python → PostgreSQL │
              └───────────┘  └────────────────────┘
```

## Project Structure

```
docvault/
│
├── services/                          # Backend Microservices
│   ├── documents/                     #   Documents + Users + Categories + Departments
│   │   └── src/main/java/.../
│   │       ├── controller/            #     REST API (full CRUD)
│   │       ├── entity/                #     JPA Entities
│   │       ├── repository/            #     Spring Data Repositories
│   │       ├── service/               #     Business Logic
│   │       ├── event/                 #     Kafka Event DTOs
│   │       └── config/               #     Kafka Producer Config
│   ├── comments/                      #   Comments Service (H2)
│   ├── gateway/                       #   API Gateway (Spring Cloud)
│   ├── translator/                    #   AI Translator (Python + Gemini)
│   └── translation-consumer/         #   Translation Writer (Kafka → PG)
│
├── frontend/                          # React 18 SPA
│   ├── src/
│   │   ├── pages/                     #   8 page components
│   │   ├── components/                #   Shared UI components
│   │   ├── context/                   #   State management + API layer
│   │   └── styles-professional-erp.css #  Design system
│   ├── Dockerfile                     #   Multi-stage (Vite → Nginx)
│   └── nginx.conf                     #   Reverse proxy config
│
├── infra/                             # Infrastructure & DevOps
│   ├── docker/
│   │   ├── docker-compose.yml         #   Lite stack (PG + Docs + Gateway + UI)
│   │   └── docker-compose.full.yml    #   Full stack (+ Kafka + Redis + Cassandra)
│   ├── k8s/
│   │   └── dms-k8s.yaml              #   Kubernetes manifests
│   ├── init-scripts/                  #   Database schemas & seed data
│   ├── k6-tests/                      #   Load testing
│   └── deploy.sh                      #   Deployment script
│
├── docs/                              # Documentation & Lab References
├── assets/                            # Static assets (logo, images)
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites

- **Docker** & **Docker Compose** v2+
- **Java 21** (for local service development)
- **Node.js 20+** (for local frontend development)

### Deploy with Docker

```bash
# Lite mode — PostgreSQL + Documents + Gateway + UI
cd infra
bash deploy.sh

# Full mode — adds Kafka, Redis, Cassandra, Translator
bash deploy.sh full
```

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API Gateway** | http://localhost:8080 |
| **Kafka UI** | http://localhost:9090 *(full mode)* |
| **MinIO Console** | http://localhost:9001 *(full mode)* |

### Deploy with Kubernetes

```bash
# Build images
docker build -t dms-documents services/documents/
docker build -t dms-gateway services/gateway/
docker build -t dms-ui frontend/

# Apply manifests
kubectl apply -f infra/k8s/dms-k8s.yaml

# Access UI at http://localhost:30080
```

### Local Development

```bash
# Backend — start infrastructure first
cd infra/docker && docker-compose up postgres -d

# Start Documents service
cd ../../services/documents && ./mvnw spring-boot:run

# Frontend
cd ../../frontend && npm install && npm run dev
# → http://localhost:5175
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@dms.com` | `123` |
| User | `user@dms.com` | `123` |

## API Reference

All endpoints are accessed through the Gateway at `:8080`.

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/documents` | List all documents |
| `GET` | `/api/documents/{id}` | Get by ID |
| `POST` | `/api/documents` | Create (metadata only, triggers Kafka) |
| `POST` | `/api/documents/upload` | Create with file → MinIO S3 + metadata |
| `PATCH` | `/api/documents/{id}` | Update fields |
| `DELETE` | `/api/documents/{id}` | Delete |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/login` | Login (email + password) |
| `GET` | `/api/users` | List all users |
| `POST` | `/api/users` | Create user |
| `PATCH` | `/api/users/{id}` | Update / suspend |

### Categories & Departments

| Method | Endpoint |
|--------|----------|
| `GET / POST / DELETE` | `/api/categories` |
| `GET / POST / DELETE` | `/api/departments` |

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18, Vite | Enterprise SPA with i18n (EN/FR/AR) |
| API Gateway | Spring Cloud Gateway 2025.1 | Routing, CORS, load balancing |
| Documents API | Spring Boot 3.4.5, JPA | Core CRUD, PostgreSQL persistence |
| Comments API | Spring Boot 3.4.5, H2 | High-throughput comments service |
| Primary DB | PostgreSQL 15 | Partitioned tables (quarterly ranges) |
| Cache | Redis 7 | Query caching, session storage |
| Messaging | Apache Kafka 3.8.1 | Event-driven document processing |
| Translation | Python + Google Gemini | AI document translation pipeline |
| Storage | MinIO (S3-compatible) | Binary file storage |
| Containers | Docker, Docker Compose | Service isolation |
| Orchestration | Kubernetes | Production scaling, self-healing |

## Enterprise Qualities

| Attribute | How It's Achieved |
|-----------|------------------|
| **Scalability** | Kafka decoupling · K8s HPA · PostgreSQL partitioning |
| **Availability** | Multi-replica pods · Redis failover |
| **Disaster Recovery** | PVC persistent storage · Kafka log retention · MinIO replication |
| **Consistency** | ACID transactions · Kafka idempotent producers · JPA locking |
| **Security** | Server-side auth · CORS policy · Role-based access |
| **Observability** | Spring Actuator · K8s probes · Structured logging |

## Database Schema

```sql
-- PostgreSQL (Partitioned by quarter)
documents (id, title, description, created_at, owner, category_id, department_id, file_type, size_kb, sensitivity, file_url)
users     (id, name, email, password, role, department_id, status)
categories (id, name, description)
departments (id, name, description)

-- H2 Comments DB
comments (id, document_id, user_name, text, created_at)
```

---

<div align="center">
<sub>Built with Spring Boot · React · PostgreSQL · Apache Kafka · Docker · Kubernetes</sub>
<br>
<sub>Enterprise Computing — ENSIA — Samir Guenchii · 2026</sub>
</div>
