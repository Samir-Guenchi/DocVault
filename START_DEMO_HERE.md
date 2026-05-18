# 🚀 START YOUR DEMO HERE

## ✅ Everything is Ready!

All backend setup is complete. You can now perform the entire workflow through the UI.

---

## 🎯 Quick Start

### 1. Open the Application
Navigate to: **http://localhost:3000**

### 2. Sample PDF Files Ready
Two PDF files have been created in this directory:
- `IT-Infrastructure-Report.pdf` - For u1 (IT Department)
- `Q1-2026-Budget-Report.pdf` - For u2 (Finance Department)

---

## 📋 Complete Workflow (Follow in Order)

### ✅ Step 1: Admin Setup (Already Done!)
- ✓ Departments created: **Finance** and **IT**
- ✓ Categories created: **General**, **Administrative**, **Training**
- ✓ Users created:
  - u1@ensia.dz → IT Department
  - u2@ensia.dz → Finance Department
  - u3@ensia.dz → Both IT and Finance

---

### 🔵 Step 2: User u1 - Create IT Document

**Login:**
- Email: `u1@ensia.dz`
- Password: `123`

**Create Document:**
1. Click "Create Document" button
2. Fill in:
   - Title: `IT Infrastructure Report`
   - Description: `Quarterly IT infrastructure assessment and recommendations`
   - Category: **Technical**
   - Department: **IT**
   - File: Upload `IT-Infrastructure-Report.pdf`
3. Submit

**Add Comment:**
1. Click on your newly created document
2. Add comment: `This report highlights critical infrastructure upgrades needed for Q2 2026.`
3. Submit comment

**Expected Result:**
- ✓ Document appears in IT department
- ✓ Comment is visible below the document

---

### 🟢 Step 3: User u2 - Finance Department Only

**Logout** from u1's account

**Login:**
- Email: `u2@ensia.dz`
- Password: `123`

**Verify Department Filtering:**
- ✓ You should see **ONLY** Finance documents
- ✓ The IT Infrastructure Report should **NOT** be visible

**Create Finance Document:**
1. Click "Create Document"
2. Fill in:
   - Title: `Q1 2026 Budget Report`
   - Description: `Comprehensive financial analysis and budget allocation for Q1 2026`
   - Category: **Financial**
   - Department: **Finance**
   - File: Upload `Q1-2026-Budget-Report.pdf`
3. Submit

**Expected Result:**
- ✓ Finance document is created
- ✓ You still cannot see IT documents

---

### 🟣 Step 4: User u3 - Multi-Department Access

**Logout** from u2's account

**Login:**
- Email: `u3@ensia.dz`
- Password: `123`

**Verify Multi-Department Access:**
- ✓ You should see **BOTH** documents:
  - IT Infrastructure Report (from IT)
  - Q1 2026 Budget Report (from Finance)

**Download Documents:**
1. Click on "IT Infrastructure Report"
2. Click "Download" button
3. Verify PDF downloads
4. Go back and click on "Q1 2026 Budget Report"
5. Click "Download" button
6. Verify PDF downloads

**Expected Result:**
- ✓ Both documents are visible
- ✓ Both PDFs can be downloaded

---

### 🟡 Step 5: User u1 - Check Translation

**Logout** from u3's account

**Login back as u1:**
- Email: `u1@ensia.dz`
- Password: `123`

**Check Translation:**
1. Navigate to your document "IT Infrastructure Report"
2. Look for translated title field
3. The translation happens asynchronously via Kafka + AI

**Expected Result:**
- ✓ Document title may have a translated version
- ✓ Translation appears in French or Arabic (depending on system config)

---

## 🎯 Success Checklist

Mark each item as you complete it:

- [ ] u1 logged in successfully
- [ ] u1 created IT document with PDF
- [ ] u1 added comment to document
- [ ] u2 logged in successfully
- [ ] u2 sees ONLY Finance documents (IT document hidden)
- [ ] u2 created Finance document with PDF
- [ ] u3 logged in successfully
- [ ] u3 sees BOTH IT and Finance documents
- [ ] u3 downloaded IT document PDF
- [ ] u3 downloaded Finance document PDF
- [ ] u1 logged back in
- [ ] Translation visible (may take a few seconds)

---

## 🔍 What to Look For

### Department-Based Access Control
- **u1** (IT only) → Sees only IT documents
- **u2** (Finance only) → Sees only Finance documents
- **u3** (IT + Finance) → Sees documents from both departments

### Document Features
- File upload (PDF)
- Metadata (title, description, category, department)
- Comments system
- Download functionality
- Async translation (Kafka + AI)

### Architecture in Action
- **Frontend**: React SPA with routing and state management
- **Auth Service**: JWT-based authentication
- **Documents Service**: CRUD operations with PostgreSQL
- **Comments Service**: H2 in-memory database
- **Gateway**: API routing and CORS
- **MinIO**: S3-compatible file storage
- **Kafka**: Event-driven translation pipeline
- **AI Translator**: Google Gemini for translations

---

## 🐛 Troubleshooting

### Can't Login?
```powershell
# Check auth service
docker logs dms-auth-service --tail 20
```

### Documents Not Showing?
```powershell
# Check documents service
docker logs dms-documents-service --tail 20

# Check gateway
docker logs dms-gateway --tail 20
```

### File Upload Fails?
```powershell
# Check MinIO
docker logs dms-minio --tail 20
```

### Translation Not Working?
```powershell
# Check Kafka
docker logs dms-kafka --tail 20

# Check translator
docker logs dms-translator-service --tail 20
```

---

## 📊 Verify Backend Data

Run this script anytime to verify the setup:
```powershell
./verify-setup.ps1
```

---

## 🎉 You're All Set!

Everything is configured and ready. Just open **http://localhost:3000** and follow the steps above.

**Have fun with your demo! 🚀**

---

**Setup Date**: May 16, 2026  
**Status**: ✅ All services running  
**Users**: 3 created and assigned to departments  
**Departments**: Finance, IT  
**Categories**: General, Administrative, Training, Financial, Technical  
**Sample PDFs**: Ready in current directory
