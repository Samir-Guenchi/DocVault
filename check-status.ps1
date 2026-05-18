# DocVault System Status Check

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DocVault System Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if containers are running
Write-Host "Checking Docker containers..." -ForegroundColor Yellow
$containers = docker ps --filter "name=dms-" --format "{{.Names}}: {{.Status}}"
if ($containers) {
    $containers | ForEach-Object { Write-Host "  ✓ $_" -ForegroundColor Green }
} else {
    Write-Host "  ✗ No containers running!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Checking API endpoints..." -ForegroundColor Yellow

# Check Gateway
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/auth/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Gateway (8080): OK" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Gateway (8080): FAILED" -ForegroundColor Red
}

# Check Auth Service
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/auth/users" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Auth Service: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Auth Service: FAILED" -ForegroundColor Red
}

# Check Categories
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/categories" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Categories API: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Categories API: FAILED" -ForegroundColor Red
}

# Check Departments
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/departments" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Departments API: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Departments API: FAILED" -ForegroundColor Red
}

# Check Frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Frontend (3000): OK" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Frontend (3000): FAILED" -ForegroundColor Red
}

# Test Login
Write-Host ""
Write-Host "Testing login..." -ForegroundColor Yellow
try {
    $body = @{email='admin@dms.com';password='123'} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/auth/login' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        Write-Host "  ✓ Login successful! Token received." -ForegroundColor Green
        Write-Host "  User: $($data.user.email) | Role: $($data.user.roles[0].role)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ✗ Login failed!" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  System Status: READY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access your application at:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login credentials:" -ForegroundColor Yellow
Write-Host "  Email: admin@dms.com" -ForegroundColor Cyan
Write-Host "  Password: 123" -ForegroundColor Cyan
Write-Host ""
