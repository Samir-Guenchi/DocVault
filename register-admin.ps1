# Register admin user
$body = @{
    email = 'admin@dms.com'
    password = '123'
    name = 'Admin'
    roles = @('admin')
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/auth/register' -Method POST -Body $body -ContentType 'application/json' -UseBasicParsing
    Write-Host "Admin user registered successfully!"
    Write-Host $response.Content
} catch {
    Write-Host "Error: $_"
    Write-Host "Response: $($_.Exception.Response)"
}

# Register regular user
$body2 = @{
    email = 'user@dms.com'
    password = '123'
    name = 'User'
    roles = @('user')
} | ConvertTo-Json

try {
    $response2 = Invoke-WebRequest -Uri 'http://localhost:8080/auth/register' -Method POST -Body $body2 -ContentType 'application/json' -UseBasicParsing
    Write-Host "Regular user registered successfully!"
    Write-Host $response2.Content
} catch {
    Write-Host "Error: $_"
}
