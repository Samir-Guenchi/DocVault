# Infrastructure

DevOps configuration for deploying and operating the DocVault DMS platform.

## Directory Structure

```
infra/
├── docker/
│   ├── docker-compose.yml          # Lite stack (PG + Docs + Gateway + UI)
│   └── docker-compose.full.yml     # Full stack (+ Kafka + MinIO + Redis + Translator)
├── k8s/
│   └── dms-k8s.yaml                # Kubernetes production manifests
├── init-scripts/
│   ├── 01-create-partitioned-tables.sql   # PostgreSQL schema + seed data
│   └── 02-cassandra-init.cql              # Cassandra keyspace + tables
├── k6-tests/                        # K6 load testing scripts
└── deploy.sh                        # One-command deployment script
```

## Quick Start

### Recommended: Use Startup Scripts

From the project root directory:

```bash
# Linux/macOS
bash START.sh

# Windows
START.bat
```

### Manual Deployment

```bash
cd docker
docker-compose -f docker-compose.full.yml up -d --build
```

## Services Included

**Full Stack (docker-compose.full.yml):**
- PostgreSQL (Database)
- Redis (Cache)
- MinIO (S3 Storage)
- Cassandra (NoSQL)
- Kafka + Zookeeper (Message Broker)
- Documents Service (Spring Boot)
- Comments Service (Spring Boot)
- Gateway (Spring Cloud)
- Translator Service (Python + Gemini AI)
- Translation Consumer (Python)
- Frontend UI (React + Nginx)
- Kafka UI (Management Console)

## Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| UI | http://localhost:3000 | admin@dms.com / 123 |
| Gateway | http://localhost:8080 | - |
| Kafka UI | http://localhost:9090 | - |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |

## Management Commands

```bash
# View logs
docker-compose -f docker-compose.full.yml logs -f

# Check status
docker-compose -f docker-compose.full.yml ps

# Stop all services
docker-compose -f docker-compose.full.yml down

# Restart services
docker-compose -f docker-compose.full.yml restart

# Rebuild and restart
docker-compose -f docker-compose.full.yml up -d --build
```

## Kubernetes Deployment

```bash
# Build images
docker build -t dms-documents:latest services/documents/
docker build -t dms-gateway:latest services/gateway/
docker build -t dms-ui:latest frontend/

# Deploy to cluster
kubectl apply -f k8s/dms-k8s.yaml

# Check status
kubectl get pods
kubectl get services

# Access UI at http://localhost:30080
```

## Database Schema

The `init-scripts/` directory contains:

- **PostgreSQL:** Partitioned `documents` table (quarterly ranges), `users`, `departments`, `categories` with seed data
- **Cassandra:** Keyspace definitions for future use

## Additional Information

For detailed setup instructions, see SETUP_GUIDE.md in the project root.
