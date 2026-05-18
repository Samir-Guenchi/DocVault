# Setup Demo Data Script
# This script creates users, assigns departments, and creates documents

Write-Host "=== DocVault Demo Data Setup ===" -ForegroundColor Cyan

# Step 1: Create three users
Write-Host "`n1. Creating users..." -ForegroundColor Yellow

$user1Body = @{
    email = "u1@ensia.dz"
    password = "123"
    name = "User One"
    roles = @("USER")
} | ConvertTo-Json

$user2Body = @{
    email = "u2@ensia.dz"
    password = "123"
    name = "User Two"
    roles = @("USER")
} | ConvertTo-Json

$user3Body = @{
    email = "u3@ensia.dz"
    password = "123"
    name = "User Three"
    roles = @("USER")
} | ConvertTo-Json

try {
    $u1 = Invoke-RestMethod -Uri "http://localhost:8083/auth/register" -Method POST -Body $user1Body -ContentType "application/json"
    Write-Host "   ✓ Created u1@ensia.dz (ID: $($u1.id))" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ u1@ensia.dz may already exist" -ForegroundColor Yellow
}

try {
    $u2 = Invoke-RestMethod -Uri "http://localhost:8083/auth/register" -Method POST -Body $user2Body -ContentType "application/json"
    Write-Host "   ✓ Created u2@ensia.dz (ID: $($u2.id))" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ u2@ensia.dz may already exist" -ForegroundColor Yellow
}

try {
    $u3 = Invoke-RestMethod -Uri "http://localhost:8083/auth/register" -Method POST -Body $user3Body -ContentType "application/json"
    Write-Host "   ✓ Created u3@ensia.dz (ID: $($u3.id))" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ u3@ensia.dz may already exist" -ForegroundColor Yellow
}

# Get all users to find IDs
Write-Host "`n2. Fetching user IDs..." -ForegroundColor Yellow
$allUsers = Invoke-RestMethod -Uri "http://localhost:8083/auth/users" -Method GET
$u1Id = ($allUsers | Where-Object { $_.email -eq "u1@ensia.dz" }).id
$u2Id = ($allUsers | Where-Object { $_.email -eq "u2@ensia.dz" }).id
$u3Id = ($allUsers | Where-Object { $_.email -eq "u3@ensia.dz" }).id

Write-Host "   u1@ensia.dz -> ID: $u1Id" -ForegroundColor Cyan
Write-Host "   u2@ensia.dz -> ID: $u2Id" -ForegroundColor Cyan
Write-Host "   u3@ensia.dz -> ID: $u3Id" -ForegroundColor Cyan

# Step 3: Assign users to departments
Write-Host "`n3. Assigning users to departments..." -ForegroundColor Yellow

# u1 -> IT (department ID: 5)
$assignU1IT = @{
    userId = $u1Id
    departmentId = 5
    departmentName = "IT"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8083/auth/admin/assign-department" -Method POST -Body $assignU1IT -ContentType "application/json" | Out-Null
    Write-Host "   ✓ Assigned u1@ensia.dz to IT" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Error assigning u1 to IT: $_" -ForegroundColor Red
}

# u2 -> Finance (department ID: 2)
$assignU2Finance = @{
    userId = $u2Id
    departmentId = 2
    departmentName = "Finance"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8083/auth/admin/assign-department" -Method POST -Body $assignU2Finance -ContentType "application/json" | Out-Null
    Write-Host "   ✓ Assigned u2@ensia.dz to Finance" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Error assigning u2 to Finance: $_" -ForegroundColor Red
}

# u3 -> IT (department ID: 5)
$assignU3IT = @{
    userId = $u3Id
    departmentId = 5
    departmentName = "IT"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8083/auth/admin/assign-department" -Method POST -Body $assignU3IT -ContentType "application/json" | Out-Null
    Write-Host "   ✓ Assigned u3@ensia.dz to IT" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Error assigning u3 to IT: $_" -ForegroundColor Red
}

# u3 -> Finance (department ID: 2)
$assignU3Finance = @{
    userId = $u3Id
    departmentId = 2
    departmentName = "Finance"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8083/auth/admin/assign-department" -Method POST -Body $assignU3Finance -ContentType "application/json" | Out-Null
    Write-Host "   ✓ Assigned u3@ensia.dz to Finance" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Error assigning u3 to Finance: $_" -ForegroundColor Red
}

Write-Host "`n=== Setup Complete! ===" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Login as u1@ensia.dz (password: 123) at http://localhost:3000"
Write-Host "2. Create a document in IT department"
Write-Host "3. Add a comment to the document"
Write-Host "4. Login as u2@ensia.dz and create a document in Finance"
Write-Host "5. Login as u3@ensia.dz to see both documents"
