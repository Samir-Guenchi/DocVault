@echo off
REM DocVault DMS - Stop All Services Script for Windows
REM This script stops all running services

echo ==========================================
echo   DocVault DMS - Stopping All Services
echo ==========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running.
    pause
    exit /b 1
)

echo Navigating to infrastructure directory...
cd infra\docker

echo.
echo Stopping all services...
docker-compose -f docker-compose.full.yml down

echo.
echo ==========================================
echo   All Services Stopped Successfully!
echo ==========================================
echo.
echo To start services again, run:
echo   START.bat
echo.
echo To remove all data (clean reset), run:
echo   cd infra\docker
echo   docker-compose -f docker-compose.full.yml down -v
echo.
pause
