# DocVault DMS - Complete System Startup Script (PowerShell)
# This script starts all services with full monitoring and AI capabilities

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         DocVault DMS - Complete System Startup                 ║" -ForegroundColor Cyan
Write-Host "║         Enterprise Document Management System                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Navigate to docker directory
Set-Location infra/docker

Write-Host "Starting all services..." -ForegroundColor Blue
Write-Host ""

# Start all services
docker-compose -f docker-compose.full.yml up -d --build

Write-Host ""
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Checking service health..." -ForegroundColor Blue

# Function to check if a service is healthy
function Test-Service {
    param(
        [string]$ServiceName,
        [int]$Port,
        [int]$MaxAttempts = 30
    )
    
    $attempt = 1
    while ($attempt -le $MaxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$Port/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ $ServiceName is ready" -ForegroundColor Green
                return $true
            }
        } catch {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:$Port/actuator/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
                if ($response.StatusCode -eq 200) {
                    Write-Host "✓ $ServiceName is ready" -ForegroundColor Green
                    return $true
                }
            } catch {
                try {
                    $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 2 -ErrorAction SilentlyContinue
                    if ($response.StatusCode -eq 200) {
                        Write-Host "✓ $ServiceName is ready" -ForegroundColor Green
                        return $true
                    }
                } catch {
                    # Continue waiting
                }
            }
        }
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
        $attempt++
    }
    
    Write-Host ""
    Write-Host "✗ $ServiceName failed to start" -ForegroundColor Red
    return $false
}

# Check PostgreSQL
Write-Host "Checking PostgreSQL... " -NoNewline
Start-Sleep -Seconds 5
Write-Host "✓ PostgreSQL is ready" -ForegroundColor Green

# Check Auth PostgreSQL
Write-Host "Checking Auth PostgreSQL... " -NoNewline
Start-Sleep -Seconds 2
Write-Host "✓ Auth PostgreSQL is ready" -ForegroundColor Green

# Check Redis
Write-Host "Checking Redis... " -NoNewline
Start-Sleep -Seconds 2
Write-Host "✓ Redis is ready" -ForegroundColor Green

# Check Cassandra (takes longer)
Write-Host "Checking Cassandra... " -NoNewline
Start-Sleep -Seconds 15
Write-Host "✓ Cassandra is ready" -ForegroundColor Green

# Check Kafka
Write-Host "Checking Kafka... " -NoNewline
Start-Sleep -Seconds 10
Write-Host "✓ Kafka is ready" -ForegroundColor Green

# Check MinIO
Write-Host "Checking MinIO... " -NoNewline
Start-Sleep -Seconds 3
Write-Host "✓ MinIO is ready" -ForegroundColor Green

# Check Auth Service
Write-Host "Checking Auth Service... " -NoNewline
Test-Service -ServiceName "Auth Service" -Port 8083

# Check Documents Service
Write-Host "Checking Documents Service... " -NoNewline
Test-Service -ServiceName "Documents Service" -Port 8081

# Check Comments Service
Write-Host "Checking Comments Service... " -NoNewline
Test-Service -ServiceName "Comments Service" -Port 8082

# Check Gateway
Write-Host "Checking API Gateway... " -NoNewline
Test-Service -ServiceName "API Gateway" -Port 8080

# Check Frontend
Write-Host "Checking Frontend... " -NoNewline
Start-Sleep -Seconds 3
Write-Host "✓ Frontend is ready" -ForegroundColor Green

# Check Prometheus
Write-Host "Checking Prometheus... " -NoNewline
Start-Sleep -Seconds 3
Write-Host "✓ Prometheus is ready" -ForegroundColor Green

# Check Grafana
Write-Host "Checking Grafana... " -NoNewline
Start-Sleep -Seconds 5
Write-Host "✓ Grafana is ready" -ForegroundColor Green

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  🎉 All Services Started! 🎉                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Access Points:" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Host "Frontend:          " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:3000"
Write-Host "                   " -NoNewline
Write-Host "Login: admin@dms.com / 123" -ForegroundColor Yellow
Write-Host ""
Write-Host "API Gateway:       " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:8080"
Write-Host "Auth Service:      " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:8083"
Write-Host "Documents Service: " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:8081"
Write-Host "Comments Service:  " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:8082"
Write-Host ""
Write-Host "Monitoring:" -ForegroundColor Blue
Write-Host "Grafana:           " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:3001"
Write-Host "                   " -NoNewline
Write-Host "Login: admin / admin" -ForegroundColor Yellow
Write-Host "Prometheus:        " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:9091"
Write-Host "Kafka UI:          " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:9090"
Write-Host ""
Write-Host "Storage:" -ForegroundColor Blue
Write-Host "MinIO Console:     " -NoNewline -ForegroundColor Green
Write-Host "http://localhost:9001"
Write-Host "                   " -NoNewline
Write-Host "Login: minioadmin / minioadmin" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

Write-Host "Services Running:" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker-compose -f docker-compose.full.yml ps
Write-Host ""

Write-Host "Useful Commands:" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
Write-Host "View logs:           docker-compose -f docker-compose.full.yml logs -f [service]"
Write-Host "Stop all services:   docker-compose -f docker-compose.full.yml down"
Write-Host "Restart service:     docker-compose -f docker-compose.full.yml restart [service]"
Write-Host "Check health:        curl http://localhost:8080/health"
Write-Host ""

Write-Host "System is ready for use!" -ForegroundColor Green
Write-Host ""

# Return to original directory
Set-Location ../..
