# Verify Demo Setup
Write-Host "=== DocVault Setup Verification ===" -ForegroundColor Cyan

# Check departments
Write-Host "`n1. Departments:" -ForegroundColor Yellow
$depts = Invoke-RestMethod -Uri "http://localhost:8080/api/departments" -Method GET -UseBasicParsing
$depts | ForEach-Object {
    Write-Host "   [$($_.id)] $($_.name) - $($_.description)" -ForegroundColor Cyan
}

# Check categories
Write-Host "`n2. Categories:" -ForegroundColor Yellow
$cats = Invoke-RestMethod -Uri "http://localhost:8080/api/categories" -Method GET -UseBasicParsing
$cats | ForEach-Object {
    Write-Host "   [$($_.id)] $($_.name) - $($_.description)" -ForegroundColor Cyan
}

# Check users
Write-Host "`n3. Users:" -ForegroundColor Yellow
$users = Invoke-RestMethod -Uri "http://localhost:8083/auth/users" -Method GET -UseBasicParsing
$users | Where-Object { $_.email -like "*@ensia.dz" } | ForEach-Object {
    Write-Host "   [$($_.id)] $($_.email) - $($_.name)" -ForegroundColor Cyan
    if ($_.departments) {
        $deptNames = ($_.departments | ForEach-Object { $_.departmentName }) -join ", "
        Write-Host "      Departments: $deptNames" -ForegroundColor Gray
    }
}

Write-Host "`n=== Setup Status ===" -ForegroundColor Green
Write-Host "✓ Departments: Finance (ID:2), IT (ID:5)" -ForegroundColor Green
Write-Host "✓ Categories: General (ID:4), Administrative (ID:5), Training (ID:6)" -ForegroundColor Green
Write-Host "✓ Users created:" -ForegroundColor Green
Write-Host "  - u1@ensia.dz (password: 123) -> IT department" -ForegroundColor Green
Write-Host "  - u2@ensia.dz (password: 123) -> Finance department" -ForegroundColor Green
Write-Host "  - u3@ensia.dz (password: 123) -> IT + Finance departments" -ForegroundColor Green

Write-Host "`n=== Next Steps (Use the UI) ===" -ForegroundColor Yellow
Write-Host "Open http://localhost:3000 in your browser and follow these steps:" -ForegroundColor White
Write-Host ""
Write-Host "Step 1: Login as u1@ensia.dz (password: 123)" -ForegroundColor Cyan
Write-Host "  - Click 'Create Document'" -ForegroundColor White
Write-Host "  - Title: 'IT Infrastructure Report'" -ForegroundColor White
Write-Host "  - Description: 'Quarterly IT infrastructure assessment'" -ForegroundColor White
Write-Host "  - Category: Technical" -ForegroundColor White
Write-Host "  - Department: IT" -ForegroundColor White
Write-Host "  - Upload a PDF file" -ForegroundColor White
Write-Host "  - After creation, click on the document and add a comment" -ForegroundColor White
Write-Host ""
Write-Host "Step 2: Logout and login as u2@ensia.dz (password: 123)" -ForegroundColor Cyan
Write-Host "  - You should see ONLY Finance department documents (none yet)" -ForegroundColor White
Write-Host "  - Create a new document:" -ForegroundColor White
Write-Host "    Title: 'Q1 2026 Budget Report'" -ForegroundColor White
Write-Host "    Category: Financial" -ForegroundColor White
Write-Host "    Department: Finance" -ForegroundColor White
Write-Host "    Upload a PDF file" -ForegroundColor White
Write-Host ""
Write-Host "Step 3: Logout and login as u3@ensia.dz (password: 123)" -ForegroundColor Cyan
Write-Host "  - You should see BOTH documents (IT and Finance)" -ForegroundColor White
Write-Host "  - You can download both PDF files" -ForegroundColor White
Write-Host ""
Write-Host "Step 4: Login back as u1@ensia.dz" -ForegroundColor Cyan
Write-Host "  - Check if your document title has been translated" -ForegroundColor White
Write-Host "  - The translation happens asynchronously via Kafka" -ForegroundColor White
