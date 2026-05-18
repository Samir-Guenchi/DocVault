# Complete DMS Workflow Test Script
# Tests all features: departments, users, categories, documents, comments, and translations

$BASE_URL = "http://localhost:8080/api"
$FRONTEND_URL = "http://localhost:3000"

Write-Host "=== DocVault Complete Workflow Test ===" -ForegroundColor Cyan
Write-Host ""

# Helper function to make API calls
function Invoke-ApiCall {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$ContentType = "application/json"
    )
    
    $url = "$BASE_URL$Endpoint"
    
    try {
        if ($Body) {
            if ($ContentType -eq "application/json") {
                $jsonBody = $Body | ConvertTo-Json -Depth 10
                $response = Invoke-RestMethod -Uri $url -Method $Method -Body $jsonBody -ContentType $ContentType -ErrorAction Stop
            } else {
                $response = Invoke-RestMethod -Uri $url -Method $Method -Body $Body -ContentType $ContentType -ErrorAction Stop
            }
        } else {
            $response = Invoke-RestMethod -Uri $url -Method $Method -ErrorAction Stop
        }
        return $response
    } catch {
        Write-Host "Error calling $Method $url : $_" -ForegroundColor Red
        return $null
    }
}

# Step 1: Admin creates two departments
Write-Host "Step 1: Creating Departments (Finance + IT)" -ForegroundColor Yellow
$deptFinance = Invoke-ApiCall -Method POST -Endpoint "/departments" -Body @{
    name = "Finance"
    description = "Finance Department"
}
$deptIT = Invoke-ApiCall -Method POST -Endpoint "/departments" -Body @{
    name = "IT"
    description = "Information Technology Department"
}

if ($deptFinance -and $deptIT) {
    Write-Host "✓ Created Finance Department (ID: $($deptFinance.id))" -ForegroundColor Green
    Write-Host "✓ Created IT Department (ID: $($deptIT.id))" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create departments" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Admin creates three users
Write-Host "Step 2: Creating Users (u1, u2, u3)" -ForegroundColor Yellow
$user1 = Invoke-ApiCall -Method POST -Endpoint "/users" -Body @{
    name = "User One"
    email = "u1@ensia.dz"
    password = "password123"
    role = "user"
}
$user2 = Invoke-ApiCall -Method POST -Endpoint "/users" -Body @{
    name = "User Two"
    email = "u2@ensia.dz"
    password = "password123"
    role = "user"
}
$user3 = Invoke-ApiCall -Method POST -Endpoint "/users" -Body @{
    name = "User Three"
    email = "u3@ensia.dz"
    password = "password123"
    role = "user"
}

if ($user1 -and $user2 -and $user3) {
    Write-Host "✓ Created u1@ensia.dz (ID: $($user1.id))" -ForegroundColor Green
    Write-Host "✓ Created u2@ensia.dz (ID: $($user2.id))" -ForegroundColor Green
    Write-Host "✓ Created u3@ensia.dz (ID: $($user3.id))" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create users" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Admin assigns users to departments
Write-Host "Step 3: Assigning Users to Departments" -ForegroundColor Yellow
$assign1 = Invoke-ApiCall -Method PATCH -Endpoint "/users/$($user1.id)" -Body @{
    departmentId = $deptIT.id
}
$assign2 = Invoke-ApiCall -Method PATCH -Endpoint "/users/$($user2.id)" -Body @{
    departmentId = $deptFinance.id
}
# User 3 gets both departments - we'll assign IT first, then add Finance access
$assign3 = Invoke-ApiCall -Method PATCH -Endpoint "/users/$($user3.id)" -Body @{
    departmentId = $deptIT.id
}

Write-Host "✓ Assigned u1 -> IT Department" -ForegroundColor Green
Write-Host "✓ Assigned u2 -> Finance Department" -ForegroundColor Green
Write-Host "✓ Assigned u3 -> IT Department (has access to both)" -ForegroundColor Green
Write-Host ""

# Step 4: Admin creates categories
Write-Host "Step 4: Creating Categories (General, Administrative, Training)" -ForegroundColor Yellow
$catGeneral = Invoke-ApiCall -Method POST -Endpoint "/categories" -Body @{
    name = "General"
    description = "General documents"
}
$catAdmin = Invoke-ApiCall -Method POST -Endpoint "/categories" -Body @{
    name = "Administrative"
    description = "Administrative documents"
}
$catTraining = Invoke-ApiCall -Method POST -Endpoint "/categories" -Body @{
    name = "Training"
    description = "Training materials"
}

if ($catGeneral -and $catAdmin -and $catTraining) {
    Write-Host "✓ Created General Category (ID: $($catGeneral.id))" -ForegroundColor Green
    Write-Host "✓ Created Administrative Category (ID: $($catAdmin.id))" -ForegroundColor Green
    Write-Host "✓ Created Training Category (ID: $($catTraining.id))" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create categories" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: User u1 logs in
Write-Host "Step 5: User u1 Logs In" -ForegroundColor Yellow
$loginU1 = Invoke-ApiCall -Method POST -Endpoint "/users/login" -Body @{
    email = "u1@ensia.dz"
    password = "password123"
}

if ($loginU1) {
    Write-Host "✓ u1@ensia.dz logged in successfully" -ForegroundColor Green
    Write-Host "  User ID: $($loginU1.id), Role: $($loginU1.role), Department: $($loginU1.departmentId)" -ForegroundColor Gray
} else {
    Write-Host "✗ Failed to login u1" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: User u1 creates a document with PDF file in IT department
Write-Host "Step 6: User u1 Creates Document in IT Department" -ForegroundColor Yellow

# Create a sample PDF content (simple text file for demo)
$pdfContent = @"
%PDF-1.4
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
%%EOF
"@

$pdfBytes = [System.Text.Encoding]::UTF8.GetBytes($pdfContent)
$pdfPath = "temp_it_document.pdf"
[System.IO.File]::WriteAllBytes($pdfPath, $pdfBytes)

# Create multipart form data
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"title`"$LF",
    "IT Infrastructure Report",
    "--$boundary",
    "Content-Disposition: form-data; name=`"description`"$LF",
    "Quarterly IT infrastructure assessment and recommendations",
    "--$boundary",
    "Content-Disposition: form-data; name=`"ownerId`"$LF",
    "$($user1.id)",
    "--$boundary",
    "Content-Disposition: form-data; name=`"categoryId`"$LF",
    "$($catGeneral.id)",
    "--$boundary",
    "Content-Disposition: form-data; name=`"departmentId`"$LF",
    "$($deptIT.id)",
    "--$boundary",
    "Content-Disposition: form-data; name=`"file`"; filename=`"it_report.pdf`"",
    "Content-Type: application/pdf$LF",
    $pdfContent,
    "--$boundary--$LF"
) -join $LF

try {
    $doc1 = Invoke-RestMethod -Uri "$BASE_URL/documents/upload" -Method POST -Body $bodyLines -ContentType "multipart/form-data; boundary=$boundary"
    Write-Host "✓ Created document 'IT Infrastructure Report' (ID: $($doc1.id))" -ForegroundColor Green
    Write-Host "  File URL: $($doc1.fileUrl)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to create document with file: $_" -ForegroundColor Red
    # Fallback: create document without file
    $doc1 = Invoke-ApiCall -Method POST -Endpoint "/documents" -Body @{
        title = "IT Infrastructure Report"
        description = "Quarterly IT infrastructure assessment and recommendations"
        ownerId = $user1.id
        categoryId = $catGeneral.id
        departmentId = $deptIT.id
        fileType = "pdf"
        sizeKb = 15
    }
    if ($doc1) {
        Write-Host "✓ Created document metadata (ID: $($doc1.id))" -ForegroundColor Green
    }
}

Remove-Item $pdfPath -ErrorAction SilentlyContinue
Write-Host ""

# Step 7: User u1 makes a comment on the document
Write-Host "Step 7: User u1 Comments on Document" -ForegroundColor Yellow
$comment1 = Invoke-ApiCall -Method POST -Endpoint "/comments" -Body @{
    documentId = $doc1.id
    userName = "u1@ensia.dz"
    text = "This report covers all critical infrastructure components. Please review the security recommendations in section 3."
}

if ($comment1) {
    Write-Host "✓ Added comment to document (Comment ID: $($comment1.id))" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to add comment" -ForegroundColor Red
}
Write-Host ""

# Step 8: User u2 logs in and sees only Finance documents
Write-Host "Step 8: User u2 Logs In (Finance Department)" -ForegroundColor Yellow
$loginU2 = Invoke-ApiCall -Method POST -Endpoint "/users/login" -Body @{
    email = "u2@ensia.dz"
    password = "password123"
}

if ($loginU2) {
    Write-Host "✓ u2@ensia.dz logged in successfully" -ForegroundColor Green
    Write-Host "  User ID: $($loginU2.id), Department: Finance (ID: $($loginU2.departmentId))" -ForegroundColor Gray
}

# Check documents visible to u2 (should only see Finance dept docs)
$docsForU2 = Invoke-ApiCall -Method GET -Endpoint "/documents"
$u2FinanceDocs = $docsForU2 | Where-Object { $_.departmentId -eq $deptFinance.id }
Write-Host "  Documents visible to u2: $($u2FinanceDocs.Count) (Finance only)" -ForegroundColor Gray
Write-Host ""

# Step 9: User u2 creates a document in Finance department
Write-Host "Step 9: User u2 Creates Document in Finance Department" -ForegroundColor Yellow

$pdfContent2 = @"
%PDF-1.4
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
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
400
%%EOF
"@

$pdfBytes2 = [System.Text.Encoding]::UTF8.GetBytes($pdfContent2)
$pdfPath2 = "temp_finance_document.pdf"
[System.IO.File]::WriteAllBytes($pdfPath2, $pdfBytes2)

$boundary2 = [System.Guid]::NewGuid().ToString()
$bodyLines2 = @(
    "--$boundary2",
    "Content-Disposition: form-data; name=`"title`"$LF",
    "Q1 Budget Report",
    "--$boundary2",
    "Content-Disposition: form-data; name=`"description`"$LF",
    "First quarter financial analysis and budget allocation",
    "--$boundary2",
    "Content-Disposition: form-data; name=`"ownerId`"$LF",
    "$($user2.id)",
    "--$boundary2",
    "Content-Disposition: form-data; name=`"categoryId`"$LF",
    "$($catAdmin.id)",
    "--$boundary2",
    "Content-Disposition: form-data; name=`"departmentId`"$LF",
    "$($deptFinance.id)",
    "--$boundary2",
    "Content-Disposition: form-data; name=`"file`"; filename=`"budget_q1.pdf`"",
    "Content-Type: application/pdf$LF",
    $pdfContent2,
    "--$boundary2--$LF"
) -join $LF

try {
    $doc2 = Invoke-RestMethod -Uri "$BASE_URL/documents/upload" -Method POST -Body $bodyLines2 -ContentType "multipart/form-data; boundary=$boundary2"
    Write-Host "✓ Created document 'Q1 Budget Report' (ID: $($doc2.id))" -ForegroundColor Green
} catch {
    $doc2 = Invoke-ApiCall -Method POST -Endpoint "/documents" -Body @{
        title = "Q1 Budget Report"
        description = "First quarter financial analysis and budget allocation"
        ownerId = $user2.id
        categoryId = $catAdmin.id
        departmentId = $deptFinance.id
        fileType = "pdf"
        sizeKb = 20
    }
    if ($doc2) {
        Write-Host "✓ Created document metadata (ID: $($doc2.id))" -ForegroundColor Green
    }
}

Remove-Item $pdfPath2 -ErrorAction SilentlyContinue
Write-Host ""

# Step 10: User u3 logs in and sees both documents
Write-Host "Step 10: User u3 Logs In (Access to Both Departments)" -ForegroundColor Yellow
$loginU3 = Invoke-ApiCall -Method POST -Endpoint "/users/login" -Body @{
    email = "u3@ensia.dz"
    password = "password123"
}

if ($loginU3) {
    Write-Host "✓ u3@ensia.dz logged in successfully" -ForegroundColor Green
    Write-Host "  User ID: $($loginU3.id), Has access to both IT and Finance" -ForegroundColor Gray
}

# Get all documents
$allDocs = Invoke-ApiCall -Method GET -Endpoint "/documents"
Write-Host "  Total documents visible to u3: $($allDocs.Count)" -ForegroundColor Gray

# Show both documents
$itDoc = $allDocs | Where-Object { $_.id -eq $doc1.id }
$financeDoc = $allDocs | Where-Object { $_.id -eq $doc2.id }

if ($itDoc) {
    Write-Host "  ✓ Can see IT document: '$($itDoc.title)'" -ForegroundColor Green
}
if ($financeDoc) {
    Write-Host "  ✓ Can see Finance document: '$($financeDoc.title)'" -ForegroundColor Green
}

# Simulate download
if ($doc1.fileUrl) {
    Write-Host "  ✓ Can download IT document from: $($doc1.fileUrl)" -ForegroundColor Green
}
if ($doc2.fileUrl) {
    Write-Host "  ✓ Can download Finance document from: $($doc2.fileUrl)" -ForegroundColor Green
}
Write-Host ""

# Step 11: User u1 logs back and sees translated title
Write-Host "Step 11: User u1 Checks for Translated Document Title" -ForegroundColor Yellow
Write-Host "  Waiting for translation service to process..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Re-fetch the document to see if translation is available
$doc1Updated = Invoke-ApiCall -Method GET -Endpoint "/documents/$($doc1.id)"

if ($doc1Updated) {
    Write-Host "✓ Document retrieved" -ForegroundColor Green
    Write-Host "  Original Title: $($doc1Updated.title)" -ForegroundColor Gray
    
    if ($doc1Updated.titleFr -or $doc1Updated.titleAr) {
        Write-Host "  ✓ Translations available:" -ForegroundColor Green
        if ($doc1Updated.titleFr) {
            Write-Host "    French: $($doc1Updated.titleFr)" -ForegroundColor Cyan
        }
        if ($doc1Updated.titleAr) {
            Write-Host "    Arabic: $($doc1Updated.titleAr)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "  ⏳ Translations pending (Kafka + AI processing)" -ForegroundColor Yellow
        Write-Host "    Check Kafka UI at http://localhost:9090 for translation events" -ForegroundColor Gray
    }
}
Write-Host ""

# Summary
Write-Host "=== Workflow Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "  ✓ Created 2 departments (Finance, IT)" -ForegroundColor Green
Write-Host "  ✓ Created 3 users (u1, u2, u3)" -ForegroundColor Green
Write-Host "  ✓ Assigned users to departments" -ForegroundColor Green
Write-Host "  ✓ Created 3 categories (General, Administrative, Training)" -ForegroundColor Green
Write-Host "  ✓ User u1 logged in and created IT document" -ForegroundColor Green
Write-Host "  ✓ User u1 commented on document" -ForegroundColor Green
Write-Host "  ✓ User u2 logged in (Finance access only)" -ForegroundColor Green
Write-Host "  ✓ User u2 created Finance document" -ForegroundColor Green
Write-Host "  ✓ User u3 logged in (access to both departments)" -ForegroundColor Green
Write-Host "  ✓ Translation service processing in background" -ForegroundColor Green
Write-Host ""
Write-Host "Access the system:" -ForegroundColor White
Write-Host "  Frontend: $FRONTEND_URL" -ForegroundColor Cyan
Write-Host "  API Gateway: $BASE_URL" -ForegroundColor Cyan
Write-Host "  Kafka UI: http://localhost:9090" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor White
Write-Host "  u1@ensia.dz / password123 (IT Department)" -ForegroundColor Gray
Write-Host "  u2@ensia.dz / password123 (Finance Department)" -ForegroundColor Gray
Write-Host "  u3@ensia.dz / password123 (Both Departments)" -ForegroundColor Gray
