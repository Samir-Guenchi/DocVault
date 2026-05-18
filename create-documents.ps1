# Create Documents with PDF Files
Write-Host "=== Creating Documents with PDF Files ===" -ForegroundColor Cyan

# Step 1: Login as u1@ensia.dz
Write-Host "`n1. Logging in as u1@ensia.dz..." -ForegroundColor Yellow
$loginU1 = @{
    email = "u1@ensia.dz"
    password = "123"
} | ConvertTo-Json

$u1Token = (Invoke-RestMethod -Uri "http://localhost:8083/auth/login" -Method POST -Body $loginU1 -ContentType "application/json").token
Write-Host "   ✓ Logged in successfully" -ForegroundColor Green

# Step 2: Create a simple PDF file for u1
Write-Host "`n2. Creating PDF file for IT department..." -ForegroundColor Yellow

# Create a simple text file to simulate PDF (for demo purposes)
$pdfContent = "%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(IT Department Document) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000317 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
410
%%EOF"

[System.IO.File]::WriteAllText("$PWD\it-document.pdf", $pdfContent)
Write-Host "   ✓ Created it-document.pdf" -ForegroundColor Green

# Step 3: Upload document for u1 in IT department
Write-Host "`n3. Uploading document for u1 in IT department..." -ForegroundColor Yellow

$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"it-document.pdf`"",
    "Content-Type: application/pdf$LF",
    $pdfContent,
    "--$boundary",
    "Content-Disposition: form-data; name=`"title`"$LF",
    "IT Infrastructure Report",
    "--$boundary",
    "Content-Disposition: form-data; name=`"description`"$LF",
    "Quarterly IT infrastructure assessment and recommendations",
    "--$boundary",
    "Content-Disposition: form-data; name=`"categoryId`"$LF",
    "2",
    "--$boundary",
    "Content-Disposition: form-data; name=`"departmentId`"$LF",
    "5",
    "--$boundary",
    "Content-Disposition: form-data; name=`"ownerId`"$LF",
    "3",
    "--$boundary--$LF"
) -join $LF

try {
    $u1Doc = Invoke-RestMethod -Uri "http://localhost:8080/api/documents/upload" `
        -Method POST `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -Body $bodyLines `
        -Headers @{Authorization = "Bearer $u1Token"}
    
    $u1DocId = $u1Doc.id
    Write-Host "   ✓ Document created (ID: $u1DocId)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Error uploading document: $_" -ForegroundColor Red
    Write-Host "   Trying alternative method..." -ForegroundColor Yellow
    
    # Alternative: Create document without file first
    $docBody = @{
        title = "IT Infrastructure Report"
        description = "Quarterly IT infrastructure assessment and recommendations"
        categoryId = 2
        departmentId = 5
        ownerId = 3
        fileType = "pdf"
        sizeKb = 1
    } | ConvertTo-Json
    
    $u1Doc = Invoke-RestMethod -Uri "http://localhost:8080/api/documents" `
        -Method POST `
        -Body $docBody `
        -ContentType "application/json" `
        -Headers @{Authorization = "Bearer $u1Token"}
    
    $u1DocId = $u1Doc.id
    Write-Host "   ✓ Document created without file (ID: $u1DocId)" -ForegroundColor Green
}

# Step 4: Add comment to u1's document
Write-Host "`n4. Adding comment to u1's document..." -ForegroundColor Yellow

$commentBody = @{
    documentId = $u1DocId
    userName = "u1@ensia.dz"
    text = "This report highlights critical infrastructure upgrades needed for Q2 2026."
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "http://localhost:8082/api/comments" `
        -Method POST `
        -Body $commentBody `
        -ContentType "application/json" | Out-Null
    Write-Host "   ✓ Comment added" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Error adding comment: $_" -ForegroundColor Red
}

# Step 5: Login as u2@ensia.dz
Write-Host "`n5. Logging in as u2@ensia.dz..." -ForegroundColor Yellow
$loginU2 = @{
    email = "u2@ensia.dz"
    password = "123"
} | ConvertTo-Json

$u2Token = (Invoke-RestMethod -Uri "http://localhost:8083/auth/login" -Method POST -Body $loginU2 -ContentType "application/json").token
Write-Host "   ✓ Logged in successfully" -ForegroundColor Green

# Step 6: Create PDF for Finance department
Write-Host "`n6. Creating document for u2 in Finance department..." -ForegroundColor Yellow

$financePdfContent = "%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 50
>>
stream
BT
/F1 12 Tf
100 700 Td
(Finance Department Budget Report) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000317 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
416
%%EOF"

[System.IO.File]::WriteAllText("$PWD\finance-document.pdf", $financePdfContent)

$docBody2 = @{
    title = "Q1 2026 Budget Report"
    description = "Comprehensive financial analysis and budget allocation for Q1 2026"
    categoryId = 1
    departmentId = 2
    ownerId = 4
    fileType = "pdf"
    sizeKb = 1
} | ConvertTo-Json

try {
    $u2Doc = Invoke-RestMethod -Uri "http://localhost:8080/api/documents" `
        -Method POST `
        -Body $docBody2 `
        -ContentType "application/json" `
        -Headers @{Authorization = "Bearer $u2Token"}
    
    $u2DocId = $u2Doc.id
    Write-Host "   ✓ Document created (ID: $u2DocId)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Error creating document: $_" -ForegroundColor Red
}

# Cleanup temp files
Remove-Item "it-document.pdf" -ErrorAction SilentlyContinue
Remove-Item "finance-document.pdf" -ErrorAction SilentlyContinue

Write-Host "`n=== Documents Created Successfully! ===" -ForegroundColor Cyan
Write-Host "`nSummary:" -ForegroundColor Yellow
Write-Host "✓ u1@ensia.dz created document in IT department (ID: $u1DocId)"
Write-Host "✓ u1@ensia.dz added a comment to their document"
Write-Host "✓ u2@ensia.dz created document in Finance department (ID: $u2DocId)"
Write-Host "`nYou can now:" -ForegroundColor Yellow
Write-Host "1. Login as u2@ensia.dz to see only Finance documents"
Write-Host "2. Login as u3@ensia.dz to see both IT and Finance documents"
Write-Host "3. Check translations in the UI"
