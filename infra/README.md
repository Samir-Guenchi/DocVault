# Infrastructure

DevOps configuration for deploying and operating the DocVault DMS platform.

## Directory Structure

```
infra/
├── docker/
│   ├── docker-compose.yml          # Lite stack (PG + Docs + Gateway + UI)
│   └── docker-compose.full.yml     # Full stack (+ Kafka + MinIO + Redis + Zookeeper + Translator)
├── k8s/
│   └── dms-k8s.yaml                # Kubernetes production manifests
├── init-scripts/
│   ├── 01-create-partitioned-tables.sql   # PostgreSQL schema + seed data
│   └── 02-cassandra-init.cql              # Cassandra keyspace + tables
├── k6-tests/                        # K6 load testing scripts
└── deploy.sh                        # One-command deployment script
```

## Deployment Options

### Docker Compose — Lite

Starts PostgreSQL, Documents Service, Gateway, and UI.

```bash
cd docker
docker-compose up --build
```

| Service | URL |
|---------|-----|
| UI | http://localhost:3000 |
| Gateway | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

### Docker Compose — Full

Adds Kafka, Zookeeper, MinIO, Redis, Translator, and Translation Consumer.

```bash
cd docker
docker-compose -f docker-compose.full.yml up --build
```

| Service | URL |
|---------|-----|
| UI | http://localhost:3000 |
| Gateway | http://localhost:8080 |
| Kafka UI | http://localhost:9090 |
| MinIO Console | http://localhost:9001 |

### Kubernetes

```bash
kubectl apply -f k8s/dms-k8s.yaml
# UI → http://localhost:30080
```

### Deploy Script

```bash
bash deploy.sh          # Lite mode
bash deploy.sh full     # Full mode
```

## Database Schema

The `init-scripts/` directory contains:

- **PostgreSQL:** Partitioned `documents` table (quarterly ranges), `users`, `departments`, `categories` with seed data
- **Cassandra:** (Legacy) Keyspace definitions, though current setup defaults to H2 for comments.
