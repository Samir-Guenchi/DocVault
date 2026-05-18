# DocVault Demo Workflow - Complete Setup

## ✅ Backend Setup Complete

All backend data has been configured and is ready for the UI demonstration.

### 1. Departments Created ✓
- **Finance** (ID: 2) - Financial planning and accounting
- **IT** (ID: 5) - IT Department

### 2. Categories Created ✓
- **General** (ID: 4) - General documents
- **Administrative** (ID: 5) - Administrative documents  
- **Training** (ID: 6) - Training materials
- **Financial** (ID: 1) - Financial documents and reports
- **Technical** (ID: 2) - Technical documentation

### 3. Users Created ✓
| Email | Password | Name | Departments | User ID |
|-------|----------|------|-------------|---------|
| u1@ensia.dz | 123 | User One | IT | 3 |
| u2@ensia.dz | 123 | User Two | Finance | 4 |
| u3@ensia.dz | 123 | User Three | IT + Finance | 5 |

---

## 🎯 UI Workflow Steps

### Access the Application
Open your browser and navigate to: **http://localhost:3000**

---

### Step 1: User u1 - Create IT Document

1. **Login**
   - Email: `u1@ensia.dz`
   - Password: `123`

2. **Create Document**
   - Click "Create Document" or navigate to document creation page
   - Fill in the form:
     - **Title**: `IT Infrastructure Report`
     - **Description**: `Quarterly IT infrastructure assessment and recommendations`
     - **Category**: Select "Technical" (ID: 2)
     - **Department**: Select "IT" (ID: 5)
     - **File**: Upload any PDF file from your computer
   - Click "Submit" or "Create"

3. **Add Comment**
   - After document is created, click on the document to view details
   - In the comments section, add:
     - **Comment**: `This report highlights critical infrastructure upgrades needed for Q2 2026.`
   - Submit the comment

4. **Verify**
   - You should see your document in the IT department
   - The comment should appear below the document

---

### Step 2: User u2 - View Finance Documents Only

1. **Logout** from u1's account
   - Click logout button in the UI

2. **Login as u2**
   - Email: `u2@ensia.dz`
   - Password: `123`

3. **Verify Department Filtering**
   - You should see **ONLY** Finance department documents
   - Since no Finance documents exist yet, the list should be empty
   - You should **NOT** see the IT Infrastructure Report created by u1

4. **Create Finance Document**
   - Click "Create Document"
   - Fill in the form:
     - **Title**: `Q1 2026 Budget Report`
     - **Description**: `Comprehensive financial analysis and budget allocation for Q1 2026`
     - **Category**: Select "Financial" (ID: 1)
     - **Department**: Select "Finance" (ID: 2)
     - **File**: Upload any PDF file from your computer
   - Click "Submit" or "Create"

5. **Verify**
   - You should now see the Finance document you just created
   - You should still NOT see the IT document

---

### Step 3: User u3 - View Both Departments

1. **Logout** from u2's account

2. **Login as u3**
   - Email: `u3@ensia.dz`
   - Password: `123`

3. **Verify Multi-Department Access**
   - You should see **BOTH** documents:
     - ✓ IT Infrastructure Report (from IT department)
     - ✓ Q1 2026 Budget Report (from Finance department)

4. **Download Documents**
   - Click on each document
   - Click the "Download" button to download the PDF files
   - Verify both PDFs download successfully

---

### Step 4: User u1 - Check Translation

1. **Logout** from u3's account

2. **Login back as u1**
   - Email: `u1@ensia.dz`
   - Password: `123`

3. **Check Document Translation**
   - Navigate to your document "IT Infrastructure Report"
   - Check if there's a translated title field
   - The translation happens asynchronously via:
     - Kafka event when document is created
     - Python translator service using Google Gemini AI
     - Translation consumer writes back to PostgreSQL

4. **Translation Flow**
   - Original Title: `IT Infrastructure Report`
   - Translated Title: Should appear in French or Arabic (depending on configuration)
   - This may take a few seconds to process

---

## 🔍 Verification Checklist

- [ ] u1 can create documents in IT department
- [ ] u1 can add comments to documents
- [ ] u2 sees ONLY Finance department documents
- [ ] u2 cannot see IT department documents
- [ ] u2 can create documents in Finance department
- [ ] u3 sees documents from BOTH IT and Finance departments
- [ ] u3 can download PDF files from both departments
- [ ] Document titles are translated asynchronously
- [ ] Department-based access control is working correctly

---

## 🏗️ Architecture Components Used

### Frontend (React)
- User authentication and session management
- Document creation with file upload
- Comment system
- Department-based filtering
- Multi-language support (i18n)

### Backend Services
- **Auth Service** (Port 8083): User authentication, JWT tokens, department assignments
- **Documents Service** (Port 8081): Document CRUD, file storage (MinIO), PostgreSQL
- **Comments Service** (Port 8082): Comment management, H2 database
- **Gateway** (Port 8080): API routing, CORS handling

### Infrastructure
- **PostgreSQL**: User data, document metadata, translations
- **MinIO**: S3-compatible file storage for PDFs
- **Kafka**: Event-driven architecture for translations
- **Redis**: Caching layer
- **Docker**: Container orchestration

---

## 🐛 Troubleshooting

### If you can't login:
```powershell
# Check if auth service is running
docker ps | Select-String "dms-auth-service"

# Check auth service logs
docker logs dms-auth-service --tail 50
```

### If documents don't appear:
```powershell
# Check documents service
docker logs dms-documents-service --tail 50

# Verify database connection
docker exec -it dms-postgres psql -U postgres -d dms_db -c "SELECT * FROM documents;"
```

### If file upload fails:
```powershell
# Check MinIO service
docker ps | Select-String "dms-minio"

# Check MinIO logs
docker logs dms-minio --tail 50
```

### If translations don't work:
```powershell
# Check Kafka
docker logs dms-kafka --tail 50

# Check translator service
docker logs dms-translator-service --tail 50

# Check translation consumer
docker logs dms-translation-consumer --tail 50
```

---

## 📊 Database Verification

To verify the data in the database:

```powershell
# Connect to PostgreSQL
docker exec -it dms-postgres psql -U postgres -d dms_db

# Check users
SELECT id, email, name FROM users WHERE email LIKE '%@ensia.dz';

# Check user departments
SELECT u.email, d.department_name 
FROM users u 
JOIN user_departments d ON u.id = d.user_id 
WHERE u.email LIKE '%@ensia.dz';

# Check documents
SELECT id, title, department_id, owner_id FROM documents;

# Check comments
docker exec -it dms-comments-service curl http://localhost:8082/api/comments
```

---

## 🎉 Success Criteria

Your demo is successful when:

1. ✅ All three users can login with their credentials
2. ✅ u1 creates a document in IT department with a PDF file
3. ✅ u1 adds a comment to their document
4. ✅ u2 sees ONLY Finance documents (not IT documents)
5. ✅ u2 creates a document in Finance department with a PDF file
6. ✅ u3 sees BOTH IT and Finance documents
7. ✅ u3 can download both PDF files
8. ✅ Document titles are translated (visible in the UI or database)

---

## 📝 Notes

- All passwords are set to `123` for demo purposes
- Department-based access control is enforced at the backend level
- File uploads are stored in MinIO (S3-compatible storage)
- Translations happen asynchronously via Kafka events
- The system uses JWT tokens for authentication
- CORS is enabled for frontend-backend communication

---

**Setup completed on**: May 16, 2026  
**System Status**: ✅ All services running  
**Ready for UI demonstration**: ✅ Yes
