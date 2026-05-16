# 🚀 START HERE - DocVault DMS Quick Start

## Welcome to DocVault Document Management System!

This is a **fully functional enterprise-grade microservices application** with 17 services running together.

---

## ⚡ Quick Start (3 Steps)

### Step 1: Ensure Docker is Running

Make sure Docker Desktop is running on your machine.

### Step 2: Start the System

**Windows (PowerShell):**
```powershell
.\START_COMPLETE_SYSTEM.ps1
```

**Linux/Mac/Git Bash:**
```bash
chmod +x START_COMPLETE_SYSTEM.sh
./START_COMPLETE_SYSTEM.sh
```

**Manual (if scripts don't work):**
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml up -d --build
```

### Step 3: Wait 2-3 Minutes

The system needs time to start all 17 services. The script will show you when everything is ready.

---

## 🌐 Access the Application

Once started, open your browser:

### Main Application
- **Frontend:** http://localhost:3000
  - Login: `admin@dms.com` / `123`

### Monitoring Dashboards
- **Grafana:** http://localhost:3001 (admin / admin)
- **Kafka UI:** http://localhost:9090
- **Prometheus:** http://localhost:9091
- **MinIO Console:** http://localhost:9001 (minioadmin / minioadmin)

---

## 🧪 Test the System

Run the test script to verify everything is working:

```powershell
.\TEST_SYSTEM.ps1
```

This will test all 17 services and show you the results.

---

## 📊 What's Running?

### Application Services (6)
1. **Auth Service** - User authentication (JWT)
2. **Documents Service** - Document management
3. **Comments Service** - Comment system
4. **API Gateway** - Routes all requests
5. **Translator Service** - AI translation (Google Gemini)
6. **Translation Consumer** - Saves translations

### Frontend (1)
7. **React UI** - Modern web interface

### Databases (4)
8. **PostgreSQL (Auth)** - User data
9. **PostgreSQL (Documents)** - Document data
10. **Cassandra** - High-speed comments
11. **Redis** - Caching layer

### Infrastructure (3)
12. **Kafka** - Message queue
13. **Zookeeper** - Kafka coordination
14. **MinIO** - File storage (S3-compatible)

### Monitoring (3)
15. **Prometheus** - Metrics collection
16. **Grafana** - Dashboards
17. **Kafka UI** - Message monitoring

---

## 🎯 What Can You Do?

### In the Frontend (http://localhost:3000)

1. **Login** as admin or user
2. **View Documents** - See all documents
3. **Upload Documents** - Add new documents with files
4. **Add Comments** - Comment on documents
5. **Manage Users** - Create/edit users (admin only)
6. **Manage Categories** - Organize documents
7. **Manage Departments** - Department-based access
8. **Export Data** - Export documents and comments

### Test the APIs

```bash
# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dms.com","password":"123"}'

# Get documents (use token from login)
curl http://localhost:8080/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create comment
curl -X POST http://localhost:8080/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": 1,
    "userId": 1,
    "userName": "Test User",
    "text": "This is a test comment"
  }'
```

---

## 📚 Documentation

### Quick References
- **QUICK_START_GUIDE.md** - Detailed startup instructions
- **RUN_LOCAL_GUIDE.md** - Comprehensive local setup guide
- **IMPLEMENTATION_STATUS.md** - Complete feature list
- **TEST_SYSTEM.ps1** - Automated testing script
- **README.md** - Project overview

### Architecture
- **17 Services** running in Docker
- **4 Databases** (PostgreSQL x2, Cassandra, Redis)
- **Event-Driven** with Apache Kafka
- **AI-Powered** with Google Gemini
- **Monitored** with Prometheus + Grafana

---

## 🛠️ Common Commands

### View Logs
```bash
cd infra/docker

# All services
docker-compose -f docker-compose.full.yml logs -f

# Specific service
docker-compose -f docker-compose.full.yml logs -f documents-service
```

### Check Status
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml ps
```

### Stop Everything
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml down
```

### Restart a Service
```bash
cd infra/docker
docker-compose -f docker-compose.full.yml restart documents-service
```

---

## 🐛 Troubleshooting

### Services Won't Start
1. Check Docker is running
2. Check ports are available (3000, 8080-8083, 5432, 5433, 6379, 9042, 9092)
3. View logs: `docker-compose -f docker-compose.full.yml logs [service-name]`

### Cassandra Takes Long to Start
- **Normal!** Cassandra takes 60-90 seconds to initialize
- Wait patiently, it will start

### Can't Access Frontend
1. Check Gateway is running: `curl http://localhost:8080/actuator/health`
2. Check Frontend is running: `curl http://localhost:3000`
3. Clear browser cache

### Login Doesn't Work
1. Check Auth service: `curl http://localhost:8083/actuator/health`
2. Try default credentials: `admin@dms.com` / `123`
3. Check browser console for errors

---

## 🎓 What You'll Learn

By running this system, you'll see:

1. **Microservices Architecture** - 6 independent services
2. **API Gateway Pattern** - Single entry point
3. **Event-Driven Design** - Kafka message queue
4. **Multi-Database Architecture** - PostgreSQL, Cassandra, Redis
5. **Caching Strategy** - Redis for performance
6. **AI Integration** - Google Gemini API
7. **Monitoring & Observability** - Prometheus + Grafana
8. **Containerization** - Docker + Docker Compose
9. **Modern Frontend** - React 18 SPA
10. **Security** - JWT authentication

---

## 📊 System Requirements

### Minimum
- **Docker Desktop** (latest version)
- **8GB RAM** available for Docker
- **20GB disk space**
- **Windows 10/11, macOS, or Linux**

### Recommended
- **16GB RAM** total (8GB for Docker)
- **50GB disk space**
- **SSD** for better performance

---

## 🎯 Next Steps

1. ✅ **Start the system** (Step 2 above)
2. ✅ **Open the frontend** (http://localhost:3000)
3. ✅ **Login** (admin@dms.com / 123)
4. ✅ **Explore the UI** - Create documents, add comments
5. ✅ **View Grafana** (http://localhost:3001) - See real-time metrics
6. ✅ **Check Kafka UI** (http://localhost:9090) - Monitor messages
7. ✅ **Run tests** (TEST_SYSTEM.ps1) - Verify everything works
8. ✅ **Read documentation** - Learn more about the architecture

---

## 🎉 Features Highlights

### ✅ Fully Implemented
- JWT Authentication
- Document CRUD operations
- File upload to S3 (MinIO)
- Comment system with Cassandra
- Redis caching for performance
- AI translation with Google Gemini
- Event-driven architecture with Kafka
- Real-time monitoring with Prometheus + Grafana
- Multi-language support (EN/FR/AR)
- Department-based access control
- Admin and user dashboards
- Export functionality

### 🚀 Production Ready
- All services containerized
- Health checks configured
- Metrics instrumentation
- Error handling
- Logging
- Security (JWT, CORS)
- Scalable architecture

---

## 💡 Tips

1. **First startup takes 2-3 minutes** - be patient!
2. **Cassandra is the slowest** to start (60-90 seconds)
3. **Check Grafana dashboards** to see real-time metrics
4. **Use Kafka UI** to monitor message flow
5. **Redis caching** improves performance after first request
6. **Translator service** processes documents asynchronously
7. **Check logs** if something doesn't work
8. **Use the test script** to verify everything

---

## 📞 Need Help?

### Check These First
1. **RUN_LOCAL_GUIDE.md** - Comprehensive troubleshooting
2. **Service logs** - `docker-compose logs -f [service-name]`
3. **Health endpoints** - `curl http://localhost:8080/actuator/health`

### Common Issues
- **Port conflicts** - Make sure ports 3000, 8080-8083, 5432, 5433, 6379, 9042, 9092 are free
- **Docker resources** - Allocate at least 8GB RAM to Docker
- **Startup time** - Wait 2-3 minutes for all services to start
- **Cassandra timeout** - Normal, takes 60-90 seconds

---

## 🎊 You're Ready!

Everything you need is here. Just run the startup script and explore the system!

**Happy coding! 🚀**

---

**Quick Links:**
- Frontend: http://localhost:3000
- Grafana: http://localhost:3001
- Kafka UI: http://localhost:9090
- API Gateway: http://localhost:8080

**Default Login:**
- Email: `admin@dms.com`
- Password: `123`

---

**Last Updated:** May 16, 2026  
**Status:** Production Ready  
**Version:** 1.0.0
