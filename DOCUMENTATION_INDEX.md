# DocVault DMS - Documentation Index

Welcome to the DocVault Document Management System documentation. This index will help you find the right documentation for your needs.

---

## Quick Start

**Just want to run the system?**

1. Run: `bash START.sh` (Linux/macOS) or `START.bat` (Windows)
2. Open: http://localhost:3000
3. Login: admin@dms.com / 123

---

## Documentation by Role

### I'm a New User

Start here:
1. **SETUP_GUIDE.md** - Complete setup instructions
2. **QUICK_REFERENCE.md** - Common commands and URLs
3. **README.md** - System overview

### I'm a Developer

Read these:
1. **README.md** - Architecture and technology stack
2. **frontend/README.md** - Frontend development
3. **services/documents/README.md** - Documents API
4. **services/comments/README.md** - Comments API
5. **QUICK_REFERENCE.md** - Development commands

### I'm a System Administrator

Check these:
1. **infra/README.md** - Infrastructure and deployment
2. **SETUP_GUIDE.md** - Deployment procedures
3. **QUICK_REFERENCE.md** - Service management
4. **VERIFICATION_REPORT.md** - System verification

### I'm a Project Manager

Review these:
1. **README.md** - Project overview
2. **VERIFICATION_REPORT.md** - Feature status
3. **docs/README.md** - Lab references
4. **UPDATE_SUMMARY.md** - Recent changes

---

## Documentation by Task

### Setting Up the System

**First Time Setup:**
1. Read: **SETUP_GUIDE.md** - Prerequisites section
2. Run: `bash START.sh` or `START.bat`
3. Verify: Follow verification steps in **SETUP_GUIDE.md**

**Troubleshooting Setup:**
1. Check: **SETUP_GUIDE.md** - Troubleshooting section
2. Reference: **QUICK_REFERENCE.md** - Quick fixes
3. View logs: `docker-compose -f docker-compose.full.yml logs -f`

### Running the System

**Starting Services:**
- Quick: Run `bash START.sh` or `START.bat`
- Manual: See **infra/README.md** - Deployment section

**Stopping Services:**
- Quick: Run `bash STOP.sh` or `STOP.bat`
- Manual: See **QUICK_REFERENCE.md** - Service management

**Monitoring Services:**
- Commands: **QUICK_REFERENCE.md** - Service management
- Health checks: **QUICK_REFERENCE.md** - Health checks

### Developing Features

**Frontend Development:**
1. Read: **frontend/README.md**
2. Setup: **SETUP_GUIDE.md** - Development mode
3. API: **QUICK_REFERENCE.md** - API testing

**Backend Development:**
1. Read: **services/documents/README.md**
2. Read: **services/comments/README.md**
3. Setup: **SETUP_GUIDE.md** - Development mode

**Testing:**
1. API tests: **QUICK_REFERENCE.md** - API testing
2. Feature verification: **VERIFICATION_REPORT.md**

### Deploying to Production

**Docker Deployment:**
1. Read: **infra/README.md** - Docker section
2. Configure: **SETUP_GUIDE.md** - Environment variables
3. Deploy: Run `bash START.sh`

**Kubernetes Deployment:**
1. Read: **infra/README.md** - Kubernetes section
2. Build: **QUICK_REFERENCE.md** - Build commands
3. Deploy: `kubectl apply -f infra/k8s/dms-k8s.yaml`

### Troubleshooting Issues

**Common Issues:**
1. Check: **SETUP_GUIDE.md** - Troubleshooting section
2. Quick fixes: **QUICK_REFERENCE.md** - Troubleshooting
3. View logs: See **QUICK_REFERENCE.md** - Docker commands

**Specific Issues:**
- Frontend issues: **frontend/README.md**
- Backend issues: **services/*/README.md**
- Infrastructure issues: **infra/README.md**

---

## Complete File List

### Root Directory

| File | Purpose | Audience |
|------|---------|----------|
| **START.sh** | Start all services (Linux/macOS) | All users |
| **START.bat** | Start all services (Windows) | All users |
| **STOP.sh** | Stop all services (Linux/macOS) | All users |
| **STOP.bat** | Stop all services (Windows) | All users |
| **README.md** | Project overview and architecture | All users |
| **SETUP_GUIDE.md** | Complete setup instructions | New users, Admins |
| **QUICK_REFERENCE.md** | Quick reference card | All users |
| **VERIFICATION_REPORT.md** | Feature verification status | Developers, PMs |
| **UPDATE_SUMMARY.md** | Documentation update log | Developers, PMs |
| **DOCUMENTATION_INDEX.md** | This file | All users |

### Frontend Documentation

| File | Purpose |
|------|---------|
| **frontend/README.md** | Frontend architecture and development |

### Backend Documentation

| File | Purpose |
|------|---------|
| **services/documents/README.md** | Documents service API and development |
| **services/comments/README.md** | Comments service API and development |

### Infrastructure Documentation

| File | Purpose |
|------|---------|
| **infra/README.md** | Deployment and infrastructure |
| **infra/docker/docker-compose.full.yml** | Service configuration |
| **infra/k8s/dms-k8s.yaml** | Kubernetes manifests |

### Lab References

| File | Purpose |
|------|---------|
| **docs/README.md** | Lab references and deliverables |
| **docs/LAB_*.pdf** | Lab instructions (10 labs) |

---

## Documentation Standards

All documentation follows these standards:
- No emojis (professional appearance)
- Clear section headers
- Code blocks with syntax highlighting
- Tables for structured data
- Cross-references between documents
- Examples and commands tested
- Troubleshooting sections included

---

## Quick Links

### Access URLs

- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Kafka UI: http://localhost:9090
- MinIO Console: http://localhost:9001

### Credentials

- Frontend: admin@dms.com / 123
- MinIO: minioadmin / minioadmin

### Common Commands

```bash
# Start services
bash START.sh

# Stop services
bash STOP.sh

# View logs
cd infra/docker
docker-compose -f docker-compose.full.yml logs -f

# Check status
docker-compose -f docker-compose.full.yml ps
```

---

## Getting Help

### Step 1: Check Documentation

1. **SETUP_GUIDE.md** - Setup and troubleshooting
2. **QUICK_REFERENCE.md** - Common tasks
3. **README.md** - Architecture overview

### Step 2: Check Logs

```bash
cd infra/docker
docker-compose -f docker-compose.full.yml logs -f
```

### Step 3: Check Service Status

```bash
docker-compose -f docker-compose.full.yml ps
```

### Step 4: Try Clean Restart

```bash
cd infra/docker
docker-compose -f docker-compose.full.yml down -v
cd ../..
bash START.sh
```

---

## Documentation Updates

Last updated: May 2, 2026

For update history, see **UPDATE_SUMMARY.md**

---

## Feedback

If you find any issues with the documentation or have suggestions for improvement, please note them for the development team.

---

**Happy coding!**
