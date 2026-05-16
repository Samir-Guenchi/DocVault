# DocVault DMS - System Test Script
# This script tests all components of the system

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         DocVault DMS - System Test Script                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$testsPassed = 0
$testsFailed = 0

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "Testing $Name... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✓ PASS" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ FAIL (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "1. Testing Infrastructure Services" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Test MinIO
if (Test-Endpoint "MinIO" "http://localhost:9000/minio/health/live") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Kafka UI
if (Test-Endpoint "Kafka UI" "http://localhost:9090") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Prometheus
if (Test-Endpoint "Prometheus" "http://localhost:9091") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Grafana
if (Test-Endpoint "Grafana" "http://localhost:3001") {
    $testsPassed++
} else {
    $testsFailed++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "2. Testing Microservices" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Test Auth Service
if (Test-Endpoint "Auth Service" "http://localhost:8083/actuator/health") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Documents Service
if (Test-Endpoint "Documents Service" "http://localhost:8081/actuator/health") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Comments Service
if (Test-Endpoint "Comments Service" "http://localhost:8082/actuator/health") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Gateway
if (Test-Endpoint "API Gateway" "http://localhost:8080/actuator/health") {
    $testsPassed++
} else {
    $testsFailed++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "3. Testing Frontend" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Test Frontend
if (Test-Endpoint "Frontend UI" "http://localhost:3000") {
    $testsPassed++
} else {
    $testsFailed++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "4. Testing API Endpoints" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Test Login
Write-Host "Testing Login API... " -NoNewline
try {
    $loginBody = @{
        email = "admin@dms.com"
        password = "123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody `
        -TimeoutSec 5

    if ($loginResponse.token) {
        Write-Host "✓ PASS (Token received)" -ForegroundColor Green
        $token = $loginResponse.token
        $testsPassed++
    } else {
        Write-Host "✗ FAIL (No token in response)" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "✗ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
    $testsFailed++
}

# Test Documents API (if we have a token)
if ($token) {
    Write-Host "Testing Documents API... " -NoNewline
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        
        $documents = Invoke-RestMethod -Uri "http://localhost:8080/api/documents" `
            -Method Get `
            -Headers $headers `
            -TimeoutSec 5

        Write-Host "✓ PASS (Retrieved $($documents.Count) documents)" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host "✗ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        $testsFailed++
    }

    # Test Users API
    Write-Host "Testing Users API... " -NoNewline
    try {
        $users = Invoke-RestMethod -Uri "http://localhost:8080/api/users" `
            -Method Get `
            -Headers $headers `
            -TimeoutSec 5

        Write-Host "✓ PASS (Retrieved $($users.Count) users)" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host "✗ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        $testsFailed++
    }

    # Test Categories API
    Write-Host "Testing Categories API... " -NoNewline
    try {
        $categories = Invoke-RestMethod -Uri "http://localhost:8080/api/categories" `
            -Method Get `
            -Headers $headers `
            -TimeoutSec 5

        Write-Host "✓ PASS (Retrieved $($categories.Count) categories)" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host "✗ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        $testsFailed++
    }

    # Test Departments API
    Write-Host "Testing Departments API... " -NoNewline
    try {
        $departments = Invoke-RestMethod -Uri "http://localhost:8080/api/departments" `
            -Method Get `
            -Headers $headers `
            -TimeoutSec 5

        Write-Host "✓ PASS (Retrieved $($departments.Count) departments)" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host "✗ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        $testsFailed++
    }
}

# Test Comments API
Write-Host "Testing Comments API... " -NoNewline
try {
    $comments = Invoke-RestMethod -Uri "http://localhost:8080/api/comments/document/1" `
        -Method Get `
        -TimeoutSec 5

    Write-Host "✓ PASS" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host "✗ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
    $testsFailed++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "5. Testing Metrics Endpoints" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Test Gateway Metrics
if (Test-Endpoint "Gateway Metrics" "http://localhost:8080/actuator/prometheus") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Documents Metrics
if (Test-Endpoint "Documents Metrics" "http://localhost:8081/actuator/prometheus") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Comments Metrics
if (Test-Endpoint "Comments Metrics" "http://localhost:8082/actuator/prometheus") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test Auth Metrics
if (Test-Endpoint "Auth Metrics" "http://localhost:8083/actuator/prometheus") {
    $testsPassed++
} else {
    $testsFailed++
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                      Test Results                              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$totalTests = $testsPassed + $testsFailed
$passRate = [math]::Round(($testsPassed / $totalTests) * 100, 2)

Write-Host "Total Tests:  $totalTests" -ForegroundColor Blue
Write-Host "Passed:       $testsPassed" -ForegroundColor Green
Write-Host "Failed:       $testsFailed" -ForegroundColor Red
Write-Host "Pass Rate:    $passRate%" -ForegroundColor $(if ($passRate -ge 80) { "Green" } elseif ($passRate -ge 60) { "Yellow" } else { "Red" })
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed! System is fully operational." -ForegroundColor Green
} elseif ($passRate -ge 80) {
    Write-Host "⚠️  Most tests passed. Check failed tests above." -ForegroundColor Yellow
} else {
    Write-Host "❌ Many tests failed. System may not be fully operational." -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Blue
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "1. Open Frontend:    http://localhost:3000"
Write-Host "2. View Grafana:     http://localhost:3001 (admin/admin)"
Write-Host "3. Check Kafka UI:   http://localhost:9090"
Write-Host "4. View Prometheus:  http://localhost:9091"
Write-Host "5. MinIO Console:    http://localhost:9001 (minioadmin/minioadmin)"
Write-Host ""
