# Create Sample PDF Files for Demo
Write-Host "=== Creating Sample PDF Files ===" -ForegroundColor Cyan

# Create a simple PDF for IT Department
$itPdfContent = @"
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
/Length 200
>>
stream
BT
/F1 18 Tf
50 750 Td
(IT Infrastructure Report) Tj
0 -30 Td
/F1 12 Tf
(Q2 2026) Tj
0 -40 Td
(This document contains the quarterly IT infrastructure) Tj
0 -20 Td
(assessment and recommendations for system upgrades.) Tj
0 -40 Td
(Key Areas:) Tj
0 -20 Td
(- Network Infrastructure) Tj
0 -20 Td
(- Server Capacity) Tj
0 -20 Td
(- Security Updates) Tj
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
566
%%EOF
"@

# Create a simple PDF for Finance Department
$financePdfContent = @"
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
/Length 220
>>
stream
BT
/F1 18 Tf
50 750 Td
(Q1 2026 Budget Report) Tj
0 -30 Td
/F1 12 Tf
(Finance Department) Tj
0 -40 Td
(Comprehensive financial analysis and budget allocation) Tj
0 -20 Td
(for the first quarter of 2026.) Tj
0 -40 Td
(Budget Summary:) Tj
0 -20 Td
(- Total Budget: $2,500,000) Tj
0 -20 Td
(- Allocated: $2,100,000) Tj
0 -20 Td
(- Remaining: $400,000) Tj
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
586
%%EOF
"@

# Save PDF files
[System.IO.File]::WriteAllText("$PWD\IT-Infrastructure-Report.pdf", $itPdfContent)
Write-Host "✓ Created IT-Infrastructure-Report.pdf" -ForegroundColor Green

[System.IO.File]::WriteAllText("$PWD\Q1-2026-Budget-Report.pdf", $financePdfContent)
Write-Host "✓ Created Q1-2026-Budget-Report.pdf" -ForegroundColor Green

Write-Host "`n=== Sample PDFs Created ===" -ForegroundColor Cyan
Write-Host "You can now use these files for uploading in the UI:" -ForegroundColor Yellow
Write-Host "1. IT-Infrastructure-Report.pdf - Use this for u1@ensia.dz (IT Department)" -ForegroundColor White
Write-Host "2. Q1-2026-Budget-Report.pdf - Use this for u2@ensia.dz (Finance Department)" -ForegroundColor White
Write-Host "`nFiles are located in: $PWD" -ForegroundColor Gray
