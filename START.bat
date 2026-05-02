@echo off
REM DocVault DMS - Quick Start Script for Windows
REM This script starts all services and displays access information

echo ==========================================
echo   DocVault DMS - Starting All Services
echo ==========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: docker-compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo Step 1: Navigating to infrastructure directory...
cd infra\docker

echo.
echo Step 2: Starting all services with Docker Compose...
echo This may take 1-2 minutes on first run (downloading images)...
echo.

REM Start all services
docker-compose -f docker-compose.full.yml up -d --build

echo.
echo Step 3: Waiting for services to be ready...
echo.

REM Wait for services to start
timeout /t 10 /nobreak >nul

REM Check if key services are running
echo Checking service status...
docker-compose -f docker-compose.full.yml ps

echo.
echo ==========================================
echo   All Services Started Successfully!
echo ==========================================
echo.
echo Access Points:
echo ----------------------------------------
echo   Frontend UI:      http://localhost:3000
echo   API Gateway:      http://localhost:8080
echo   Kafka UI:         http://localhost:9090
echo   MinIO Console:    http://localhost:9001
echo.
echo Login Credentials:
echo ----------------------------------------
echo   Frontend:         admin@dms.com / 123
echo   MinIO:            minioadmin / minioadmin
echo.
echo Useful Commands:
echo ----------------------------------------
echo   View logs:        docker-compose -f docker-compose.full.yml logs -f
echo   Stop services:    docker-compose -f docker-compose.full.yml down
echo   Restart:          docker-compose -f docker-compose.full.yml restart
echo   Check status:     docker-compose -f docker-compose.full.yml ps
echo.
echo Note: Services may take 30-60 seconds to fully initialize.
echo       If login fails, wait a moment and try again.
echo.
echo ==========================================
echo.
pause
