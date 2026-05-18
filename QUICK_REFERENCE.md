# 🎯 Quick Reference Card

## 🔐 Login Credentials

| User | Email | Password | Departments | Purpose |
|------|-------|----------|-------------|---------|
| User 1 | u1@ensia.dz | 123 | IT | Create IT document + comment |
| User 2 | u2@ensia.dz | 123 | Finance | See only Finance docs |
| User 3 | u3@ensia.dz | 123 | IT + Finance | See both departments |

## 📁 Sample Files

- `IT-Infrastructure-Report.pdf` → Use with u1@ensia.dz
- `Q1-2026-Budget-Report.pdf` → Use with u2@ensia.dz

## 🏢 Departments

| ID | Name | Description |
|----|------|-------------|
| 2 | Finance | Financial planning and accounting |
| 5 | IT | IT Department |

## 📂 Categories

| ID | Name | Use For |
|----|------|---------|
| 1 | Financial | Finance documents |
| 2 | Technical | IT documents |
| 4 | General | General documents |
| 5 | Administrative | Admin documents |
| 6 | Training | Training materials |

## 🎬 Workflow Summary

```
1. u1 → Login → Create IT doc → Add comment → Logout
2. u2 → Login → Verify (no IT docs) → Create Finance doc → Logout
3. u3 → Login → See both docs → Download both → Logout
4. u1 → Login → Check translation
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Auth Service**: http://localhost:8083
- **Kafka UI**: http://localhost:9090
- **MinIO Console**: http://localhost:9001

## ✅ Expected Results

### u1 (IT only)
- ✓ Can create documents in IT
- ✓ Can add comments
- ✓ Sees only IT documents

### u2 (Finance only)
- ✓ Cannot see IT documents
- ✓ Can create documents in Finance
- ✓ Sees only Finance documents

### u3 (IT + Finance)
- ✓ Sees documents from both departments
- ✓ Can download all PDFs
- ✓ Has access to both IT and Finance

## 🔧 Troubleshooting Commands

```powershell
# Verify setup
./verify-setup.ps1

# Check all services
docker ps

# Check specific service logs
docker logs dms-auth-service --tail 20
docker logs dms-documents-service --tail 20
docker logs dms-gateway --tail 20

# Restart a service
docker restart dms-documents-service
```

## 📝 Document Creation Template

### For u1 (IT Department)
- **Title**: IT Infrastructure Report
- **Description**: Quarterly IT infrastructure assessment and recommendations
- **Category**: Technical (ID: 2)
- **Department**: IT (ID: 5)
- **File**: IT-Infrastructure-Report.pdf

### For u2 (Finance Department)
- **Title**: Q1 2026 Budget Report
- **Description**: Comprehensive financial analysis and budget allocation for Q1 2026
- **Category**: Financial (ID: 1)
- **Department**: Finance (ID: 2)
- **File**: Q1-2026-Budget-Report.pdf

## 💬 Comment Template

For u1's document:
```
This report highlights critical infrastructure upgrades needed for Q2 2026.
```

## 🎯 Success Criteria

- [x] Backend setup complete
- [x] Users created and assigned
- [x] Sample PDFs generated
- [ ] u1 creates IT document ← **START HERE**
- [ ] u1 adds comment
- [ ] u2 sees only Finance docs
- [ ] u2 creates Finance document
- [ ] u3 sees both documents
- [ ] u3 downloads both PDFs
- [ ] Translation visible

---

**Ready?** Open http://localhost:3000 and start with u1@ensia.dz!
