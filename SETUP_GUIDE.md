# DocVault DMS - Complete Setup Guide

This guide provides step-by-step instructions to run the DocVault Document Management System.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Manual Setup](#manual-setup)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)
6. [Stopping Services](#stopping-services)

---

## Prerequisites

### Required Software

1. **Docker Desktop**
   - Version: 20.10 or higher
   - Download: https://www.docker.com/products/docker-desktop
   - Ensure Docker Desktop is running before starting services

2. **Docker Compose**
   - Version: 2.0 or higher
   - Usually included with Docker Desktop
   - Verify: `docker-compose --version`

### System Requirements

- **RAM:** Minimum 8GB (16GB recommended)
- **Disk Space:** 10GB free space
- **OS:** Windows 10/11, macOS, or Linux

### Port Requirements

Ensure the following ports are available (not used by other applications):

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

---

## Quick Start

### Option 1: One-Command Startup (Recommended)

#### On Linux/macOS:

```bash
bash START.sh
```

#### On Windows:

```cmd
START.bat
```

This script will:
1. Check if Docker is running
2. Start all services with docker-compose
3. Wait for services to initialize
4. Display access URLs and credentials

**Wait Time:** 30-60 seconds for all services to be fully ready.

### Option 2: Manual Docker Compose

```bash
# Navigate to infrastructure directory
cd infra/docker

# Start all services
docker-compose -f docker-compose.full.yml up -d --build

# Check status
docker-compose -f docker-compose.full.yml ps

# View logs (optional)
docker-compose -f docker-compose.full.yml logs -f
```

---

## Manual Setup

If you prefer to understand each step:

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd docvault
```

### Step 2: Verify Docker

```bash
# Check Docker is running
docker info

# Check Docker Compose version
docker-compose --version
```

### Step 3: Navigate to Infrastructure

```bash
cd infra/docker
```

### Step 4: Start Services

```bash
# Pull images and start services
docker-compose -f docker-compose.full.yml up -d --build
```

This command will:
- Download required Docker images (first time only)
- Build custom service images
- Start all containers in detached mode

### Step 5: Monitor Startup

```bash
# Watch logs
docker-compose -f docker-compose.full.yml logs -f

# Press Ctrl+C to stop watching logs (services continue running)
```

Look for these messages indicating services are ready:
- Gateway: "Started GatewayApplication"
- Documents: "Started DocumentsApplication"
- Frontend: "start worker processes"
- Kafka: "Kafka Server started"

### Step 6: Verify Services

```bash
# Check all containers are running
docker-compose -f docker-compose.full.yml ps

# All services should show "Up" status
```

---

## Verification

### 1. Check Service Health

```bash
# Gateway health check
curl http://localhost:8080/health

# Expected: {"status":"UP"}
```

### 2. Test API Endpoints

```bash
# Get users
curl http://localhost:3000/api/users

# Expected: JSON array with 3 users
```

### 3. Test Login

```bash
# Login as admin
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dms.com","password":"123"}'

# Expected: JSON object with user details
```

### 4. Access Web Interfaces

Open your browser and visit:

1. **Frontend Application**
   - URL: http://localhost:3000
   - Login: admin@dms.com / 123
   - Should see the DocVault landing page

2. **Kafka UI**
   - URL: http://localhost:9090
   - View topics: dms.documents.uploaded, dms.documents.translated

3. **MinIO Console**
   - URL: http://localhost:9001
   - Login: minioadmin / minioadmin
   - Check bucket: dms-documents

### 5. Test Document Upload

1. Log in to http://localhost:3000
2. Navigate to User Dashboard
3. Click "Upload Document"
4. Fill in the form and upload a file
5. Verify document appears in the list
6. Check Kafka UI for new message in dms.documents.uploaded topic

---

## Troubleshooting

### Issue: Docker is not running

**Error:** "Cannot connect to the Docker daemon"

**Solution:**
1. Start Docker Desktop
2. Wait for Docker to fully start (whale icon in system tray)
3. Run the start script again

### Issue: Port already in use

**Error:** "Bind for 0.0.0.0:3000 failed: port is already allocated"

**Solution:**
1. Find what's using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/macOS
   lsof -i :3000
   ```
2. Stop the conflicting application
3. Or modify the port in docker-compose.full.yml

### Issue: Services not starting

**Error:** Containers exit immediately or show "Unhealthy" status

**Solution:**
1. Check logs for specific service:
   ```bash
   docker-compose -f docker-compose.full.yml logs <service-name>
   ```
2. Common issues:
   - Database not ready: Wait 30 seconds and restart
   - Out of memory: Increase Docker memory limit in Docker Desktop settings
   - Network issues: Restart Docker Desktop

### Issue: Frontend shows "Connection Issue"

**Error:** "Cannot reach API. Start backend..."

**Solution:**
1. Verify gateway is running:
   ```bash
   docker ps | grep dms-gateway
   ```
2. Check gateway logs:
   ```bash
   docker logs dms-gateway
   ```
3. Restart frontend container:
   ```bash
   docker restart dms-ui
   ```
4. Wait 10 seconds and refresh browser

### Issue: Login fails with "Invalid credentials"

**Error:** Admin account may be suspended

**Solution:**
```bash
# Activate admin account
curl -X PATCH http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

### Issue: Kafka messages not being processed

**Solution:**
1. Check Kafka is running:
   ```bash
   docker ps | grep kafka
   ```
2. Check translator service logs:
   ```bash
   docker logs dms-translator-service
   ```
3. Verify Gemini API key is set in docker-compose.full.yml

### Issue: Out of disk space

**Solution:**
1. Clean up Docker:
   ```bash
   docker system prune -a --volumes
   ```
2. Remove old images:
   ```bash
   docker image prune -a
   ```

---

## Stopping Services

### Stop All Services

```bash
cd infra/docker
docker-compose -f docker-compose.full.yml down
```

### Stop and Remove Volumes (Clean Reset)

```bash
cd infra/docker
docker-compose -f docker-compose.full.yml down -v
```

**Warning:** This will delete all data (documents, users, etc.)

### Stop Specific Service

```bash
docker-compose -f docker-compose.full.yml stop <service-name>

# Example: Stop only the frontend
docker-compose -f docker-compose.full.yml stop dms-ui
```

### Restart Services

```bash
# Restart all
docker-compose -f docker-compose.full.yml restart

# Restart specific service
docker-compose -f docker-compose.full.yml restart dms-gateway
```

---

## Service Management Commands

### View Logs

```bash
# All services
docker-compose -f docker-compose.full.yml logs -f

# Specific service
docker-compose -f docker-compose.full.yml logs -f dms-gateway

# Last 100 lines
docker-compose -f docker-compose.full.yml logs --tail=100
```

### Check Status

```bash
# List all containers
docker-compose -f docker-compose.full.yml ps

# Detailed container info
docker ps -a
```

### Execute Commands in Container

```bash
# Access PostgreSQL
docker exec -it dms-postgres psql -U postgres -d dms

# Access container shell
docker exec -it dms-gateway sh
```

### Rebuild Services

```bash
# Rebuild all services
docker-compose -f docker-compose.full.yml up -d --build

# Rebuild specific service
docker-compose -f docker-compose.full.yml up -d --build dms-gateway
```

---

## Development Mode

For local development without Docker:

### Backend Services

```bash
# Start PostgreSQL only
cd infra/docker
docker-compose up postgres -d

# Start Documents Service
cd ../../services/documents
./mvnw spring-boot:run

# Start Gateway
cd ../gateway
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev

# Access at http://localhost:5173
```

---

## Production Deployment

### Kubernetes

```bash
# Build images
docker build -t dms-documents:latest services/documents/
docker build -t dms-gateway:latest services/gateway/
docker build -t dms-ui:latest frontend/

# Deploy to Kubernetes
kubectl apply -f infra/k8s/dms-k8s.yaml

# Check status
kubectl get pods
kubectl get services

# Access UI
# NodePort: http://<node-ip>:30080
```

---

## Environment Variables

Key environment variables in docker-compose.full.yml:

### Gemini API Key (Translation Service)

```yaml
translator-service:
  environment:
    GEMINI_API_KEY: AIzaSyA6enE-LWircHC2tSGFQEAkn5AvHmto_c8
```

### Database Configuration

```yaml
documents-service:
  environment:
    POSTGRES_HOST: postgres
    POSTGRES_PORT: 5432
    POSTGRES_DB: dms
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
```

### S3 Storage Configuration

```yaml
documents-service:
  environment:
    S3_ENDPOINT: http://minio:9000
    S3_ACCESS_KEY: minioadmin
    S3_SECRET_KEY: minioadmin
    S3_BUCKET: dms-documents
```

---

## Additional Resources

- **Main README:** See README.md for architecture overview
- **Verification Report:** See VERIFICATION_REPORT.md for feature verification
- **Frontend README:** See frontend/README.md for UI details
- **API Documentation:** Access Swagger UI at http://localhost:8081/swagger-ui.html (if enabled)

---

## Support

If you encounter issues not covered in this guide:

1. Check Docker logs: `docker-compose -f docker-compose.full.yml logs`
2. Verify all ports are available
3. Ensure Docker has sufficient resources (8GB RAM minimum)
4. Try a clean restart: `docker-compose down -v && docker-compose up -d`

---

## Summary

**Quick Start:**
```bash
# Linux/macOS
bash START.sh

# Windows
START.bat
```

**Access:**
- Frontend: http://localhost:3000 (admin@dms.com / 123)
- API: http://localhost:8080
- Kafka UI: http://localhost:9090
- MinIO: http://localhost:9001 (minioadmin / minioadmin)

**Stop:**
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml down
```

That's it! You're ready to use DocVault DMS.
