# DocVault - Quick Start Guide

## ✅ System is Running!

Your DocVault Document Management System is now running locally with all services.

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main web application |
| **API Gateway** | http://localhost:8080 | Backend API gateway |
| **Kafka UI** | http://localhost:9090 | Message queue monitoring |
| **MinIO Console** | http://localhost:9001 | File storage management |

## 🔐 Login Credentials

### Frontend Application
- **Admin Account**
  - Email: `admin@dms.com`
  - Password: `123`
  
- **User Account**
  - Email: `user@dms.com`
  - Password: `123`

### MinIO Storage
- Username: `minioadmin`
- Password: `minioadmin`

## 🚀 What Was Fixed

The original issue was that the frontend was trying to call `/api/users/login` but the authentication service uses `/auth/login`. The following changes were made:

1. **Updated Frontend API Calls** (`frontend/src/context/AppContext.jsx`):
   - Changed login endpoint from `/api/users/login` to `/auth/login`
   - Changed users list endpoint from `/api/users` to `/auth/users`
   - Changed user registration endpoint from `/api/users` to `/auth/register`

2. **Created Initial Users**:
   - Registered admin and user accounts in the auth database
   - Both accounts are active and ready to use

## 📋 Running Services

All the following services are running in Docker containers:

- ✅ Frontend (React + Nginx) - Port 3000
- ✅ API Gateway (Spring Cloud) - Port 8080
- ✅ Auth Service (Spring Boot + PostgreSQL) - Port 8083
- ✅ Documents Service (Spring Boot + PostgreSQL) - Port 8081
- ✅ Comments Service (Spring Boot + Cassandra) - Port 8082
- ✅ Kafka Message Broker - Port 9092/9093
- ✅ Kafka UI - Port 9090
- ✅ PostgreSQL (Main DB) - Port 5432
- ✅ PostgreSQL (Auth DB) - Port 5433
- ✅ Redis Cache - Port 6379
- ✅ Cassandra - Port 9042
- ✅ MinIO S3 Storage - Port 9000/9001
- ✅ Translation Services (Python + AI)
- ✅ Prometheus Monitoring - Port 9091
- ✅ Grafana Dashboard - Port 3001

## 🛠️ Useful Commands

### View Logs
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml logs -f
```

### View Specific Service Logs
```bash
docker logs dms-ui -f          # Frontend
docker logs dms-gateway -f     # API Gateway
docker logs dms-auth-service -f # Auth Service
```

### Stop All Services
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml down
```

### Restart All Services
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml restart
```

### Restart Specific Service
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml restart dms-ui
```

### Check Service Status
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml ps
```

## 🔄 Starting the System Again

If you stop the services and want to start them again:

```bash
# Option 1: Use the start script
bash START.sh

# Option 2: Manual start
cd infra/docker
docker-compose -f docker-compose.full.yml up -d
```

## 📝 Notes

- Services may take 30-60 seconds to fully initialize after starting
- If you encounter login issues, wait a moment for all services to be ready
- The auth database now has the admin and user accounts pre-registered
- All data is persisted in Docker volumes, so your data will survive container restarts

## 🎯 Next Steps

1. Open http://localhost:3000 in your browser
2. Log in with admin@dms.com / 123
3. Explore the document management features
4. Try uploading documents, managing users, and viewing analytics

## 🐛 Troubleshooting

### If login still doesn't work:
```bash
# Check if all services are running
docker ps

# Check gateway logs
docker logs dms-gateway --tail 50

# Check auth service logs
docker logs dms-auth-service --tail 50

# Restart the gateway and frontend
cd infra/docker
docker-compose -f docker-compose.full.yml restart gateway dms-ui
```

### If you need to re-register users:
```powershell
# Run the registration script
.\register-admin.ps1
```

---

**Built with:** Spring Boot 3.4.5 | React 18 | PostgreSQL 15 | Apache Kafka 7.5 | Docker | Kubernetes

**Enterprise Computing - ENSIA - 2026**
