# Test Login Fix
Write-Host "=== Testing Login Fix ===" -ForegroundColor Cyan

Write-Host "`n1. Testing u1@ensia.dz login via API..." -ForegroundColor Yellow
$loginBody = @{
    email = "u1@ensia.dz"
    password = "123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8083/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    Write-Host "   ✓ Login successful!" -ForegroundColor Green
    Write-Host "   User ID: $($response.user.id)" -ForegroundColor Cyan
    Write-Host "   Email: $($response.user.email)" -ForegroundColor Cyan
    Write-Host "   Name: $($response.user.name)" -ForegroundColor Cyan
    Write-Host "   Role: $($response.user.roles[0].role)" -ForegroundColor Cyan
    Write-Host "   Departments: $(($response.user.departments | ForEach-Object { $_.departmentName }) -join ', ')" -ForegroundColor Cyan
    Write-Host "   Token: $($response.token.Substring(0,50))..." -ForegroundColor Gray
    
    Write-Host "`n2. Frontend should now:" -ForegroundColor Yellow
    Write-Host "   ✓ Accept login for u1@ensia.dz" -ForegroundColor Green
    Write-Host "   ✓ Redirect to /dashboard/user (not /dashboard/admin)" -ForegroundColor Green
    Write-Host "   ✓ Store user info with departments" -ForegroundColor Green
    
} catch {
    Write-Host "   ✗ Login failed: $_" -ForegroundColor Red
}

Write-Host "`n3. Frontend container status:" -ForegroundColor Yellow
$container = docker ps --filter "name=dms-ui" --format "{{.Status}}"
if ($container) {
    Write-Host "   ✓ Frontend running: $container" -ForegroundColor Green
} else {
    Write-Host "   ✗ Frontend not running!" -ForegroundColor Red
}

Write-Host "`n=== Ready to Test in Browser ===" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000" -ForegroundColor White
Write-Host "2. Login with:" -ForegroundColor White
Write-Host "   Email: u1@ensia.dz" -ForegroundColor Cyan
Write-Host "   Password: 123" -ForegroundColor Cyan
Write-Host "3. You should be redirected to the user dashboard" -ForegroundColor White
Write-Host "4. You should NOT see 'redirected to home' anymore" -ForegroundColor White
