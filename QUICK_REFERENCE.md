# DocVault DMS - Quick Reference Card

## Start/Stop Commands

```bash
# Start all services
bash START.sh          # Linux/macOS
START.bat              # Windows

# Stop all services
bash STOP.sh           # Linux/macOS
STOP.bat               # Windows
```

## Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend UI | http://localhost:3000 | admin@dms.com / 123 |
| API Gateway | http://localhost:8080 | - |
| Kafka UI | http://localhost:9090 | - |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |

## Common Commands

### Service Management

```bash
cd infra/docker

# View logs (all services)
docker-compose -f docker-compose.full.yml logs -f

# View logs (specific service)
docker-compose -f docker-compose.full.yml logs -f dms-gateway

# Check status
docker-compose -f docker-compose.full.yml ps

# Restart all services
docker-compose -f docker-compose.full.yml restart

# Restart specific service
docker-compose -f docker-compose.full.yml restart dms-gateway

# Stop all services
docker-compose -f docker-compose.full.yml down

# Stop and remove all data
docker-compose -f docker-compose.full.yml down -v
```

### API Testing

```bash
# Health check
curl http://localhost:8080/health

# Get all users
curl http://localhost:3000/api/users

# Get all documents
curl http://localhost:3000/api/documents

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dms.com","password":"123"}'

# Create document
curl -X POST http://localhost:3000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Test Document",
    "description":"Test Description",
    "categoryId":1,
    "departmentId":1,
    "owner":"Admin",
    "sensitivity":"internal"
  }'

# Activate admin account (if suspended)
curl -X PATCH http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

### Docker Commands

```bash
# List all containers
docker ps -a

# View container logs
docker logs <container-name>
docker logs dms-gateway

# Execute command in container
docker exec -it <container-name> sh
docker exec -it dms-gateway sh

# Access PostgreSQL
docker exec -it dms-postgres psql -U postgres -d dms

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Clean up everything
docker system prune -a --volumes
```

## Service Ports

| Port | Service |
|------|---------|
| 3000 | Frontend UI |
| 8080 | API Gateway |
| 8081 | Documents Service |
| 8082 | Comments Service |
| 5432 | PostgreSQL |
| 6379 | Redis |
| 9000 | MinIO API |
| 9001 | MinIO Console |
| 9042 | Cassandra |
| 9090 | Kafka UI |
| 9092 | Kafka |
| 2181 | Zookeeper |

## Container Names

| Container | Service |
|-----------|---------|
| dms-ui | Frontend |
| dms-gateway | API Gateway |
| dms-documents-service | Documents API |
| dms-comments-service | Comments API |
| dms-translator-service | AI Translator |
| dms-translation-consumer | Translation Writer |
| dms-postgres | PostgreSQL |
| dms-redis | Redis |
| dms-minio | MinIO S3 |
| dms-cassandra | Cassandra |
| dms-kafka | Kafka |
| dms-zookeeper | Zookeeper |
| dms-kafka-ui | Kafka UI |

## Troubleshooting Quick Fixes

### Frontend shows "Connection Issue"

```bash
# Restart frontend
docker restart dms-ui

# Check gateway is running
docker ps | grep dms-gateway

# View gateway logs
docker logs dms-gateway
```

### Login fails

```bash
# Activate admin account
curl -X PATCH http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

### Service won't start

```bash
# Check logs
docker-compose -f docker-compose.full.yml logs <service-name>

# Restart service
docker-compose -f docker-compose.full.yml restart <service-name>

# Rebuild and restart
docker-compose -f docker-compose.full.yml up -d --build <service-name>
```

### Port already in use

```bash
# Find process using port (Windows)
netstat -ano | findstr :3000

# Find process using port (Linux/macOS)
lsof -i :3000

# Kill process or change port in docker-compose.full.yml
```

### Out of memory

1. Open Docker Desktop
2. Go to Settings > Resources
3. Increase Memory to at least 8GB
4. Click "Apply & Restart"

### Clean reset

```bash
cd infra/docker
docker-compose -f docker-compose.full.yml down -v
docker system prune -a --volumes
bash ../../START.sh
```

## Environment Variables

### Gemini API Key

Located in: `infra/docker/docker-compose.full.yml`

```yaml
translator-service:
  environment:
    GEMINI_API_KEY: AIzaSyA6enE-LWircHC2tSGFQEAkn5AvHmto_c8
```

### Database Credentials

```yaml
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
POSTGRES_DB: dms
```

### MinIO Credentials

```yaml
MINIO_ROOT_USER: minioadmin
MINIO_ROOT_PASSWORD: minioadmin
```

## File Locations

| File | Purpose |
|------|---------|
| START.sh / START.bat | Start all services |
| STOP.sh / STOP.bat | Stop all services |
| SETUP_GUIDE.md | Complete setup instructions |
| VERIFICATION_REPORT.md | Feature verification status |
| QUICK_REFERENCE.md | This file |
| README.md | Project overview |
| infra/docker/docker-compose.full.yml | Service configuration |

## Default Users

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@dms.com | 123 | admin | Active |
| user@dms.com | 123 | user | Active |
| amina@dms.com | 123 | user | Suspended |

## Kafka Topics

| Topic | Purpose |
|-------|---------|
| dms.documents.uploaded | Document creation events |
| dms.documents.translated | Translation results |

View in Kafka UI: http://localhost:9090

## MinIO Buckets

| Bucket | Purpose |
|--------|---------|
| dms-documents | Document file storage |

View in MinIO Console: http://localhost:9001

## Health Checks

```bash
# Gateway
curl http://localhost:8080/health

# Documents Service
curl http://localhost:8081/api/documents/health

# Frontend (should return HTML)
curl http://localhost:3000

# Kafka (check UI)
open http://localhost:9090

# MinIO (check console)
open http://localhost:9001
```

## Build Commands

```bash
# Build all services
cd infra/docker
docker-compose -f docker-compose.full.yml build

# Build specific service
docker-compose -f docker-compose.full.yml build dms-gateway

# Build without cache
docker-compose -f docker-compose.full.yml build --no-cache
```

## Development Mode

```bash
# Start only infrastructure
cd infra/docker
docker-compose up postgres redis kafka -d

# Run backend locally
cd ../../services/documents
./mvnw spring-boot:run

# Run frontend locally
cd ../../frontend
npm install
npm run dev
```

## Production Deployment

```bash
# Build images
docker build -t dms-documents:latest services/documents/
docker build -t dms-gateway:latest services/gateway/
docker build -t dms-ui:latest frontend/

# Deploy to Kubernetes
kubectl apply -f infra/k8s/dms-k8s.yaml

# Check deployment
kubectl get pods
kubectl get services
```

## Support

For detailed information:
- Setup: See SETUP_GUIDE.md
- Architecture: See README.md
- Features: See VERIFICATION_REPORT.md
- Frontend: See frontend/README.md
- Backend: See services/*/README.md
