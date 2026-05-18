# 🏢 Multi-Department Assignment Guide

## ✅ Feature Already Implemented!

The admin panel already supports assigning multiple departments to a single user. This guide shows you how to use this feature.

---

## 🎯 How to Assign Multiple Departments

### Via Admin UI

1. **Login as Admin**
   - URL: http://localhost:3000/login
   - Email: `admin@dms.com`
   - Password: `123`

2. **Navigate to Users Page**
   - Click "Users" in the top navigation menu
   - Or go to: http://localhost:3000/dashboard/admin/users

3. **Open Department Assignment Modal**
   - Find the user you want to assign departments to
   - Click the three-dot menu (⋮) in the Actions column
   - Click "Assign Departments"

4. **Assign Multiple Departments**
   - The modal shows two sections:
     - **Current Departments**: Departments already assigned
     - **Add Department**: Available departments to assign
   
   - To add a department:
     - Click on any department in the "Add Department" section
     - It will immediately be assigned and move to "Current Departments"
   
   - To add another department:
     - Click on another department in the "Add Department" section
     - It will also be assigned
   
   - Repeat for as many departments as needed

5. **Remove a Department**
   - In the "Current Departments" section
   - Click the "Remove" button next to any department
   - Confirm the removal
   - The department will be unassigned

6. **Close the Modal**
   - Click "Done" when finished
   - The user table will update to show all assigned departments

---

## 📋 Example Workflow

### Scenario: Assign u3 to both IT and Finance

1. **Open Assignment Modal**
   - Find `u3@ensia.dz` in the users table
   - Click ⋮ → "Assign Departments"

2. **Assign IT Department**
   - Under "Add Department", click on "IT"
   - ✓ IT moves to "Current Departments"

3. **Assign Finance Department**
   - Under "Add Department", click on "Finance"
   - ✓ Finance moves to "Current Departments"

4. **Verify**
   - Current Departments now shows: IT, Finance
   - Click "Done"
   - User table shows: "IT, Finance" in Department column

---

## 🔧 API Usage

### Assign Department
```bash
POST /auth/admin/assign-department
Content-Type: application/json

{
  "userId": 8,
  "departmentId": 5,
  "departmentName": "IT"
}
```

**Response:**
```json
{
  "id": 8,
  "email": "u2@ensia.dz",
  "name": "User Two",
  "status": "active",
  "departments": [
    {
      "id": 5,
      "departmentId": 5,
      "departmentName": "IT"
    }
  ]
}
```

### Assign Multiple Departments
Call the endpoint multiple times with different `departmentId`:

```bash
# Assign IT
POST /auth/admin/assign-department
{"userId": 8, "departmentId": 5, "departmentName": "IT"}

# Assign Finance
POST /auth/admin/assign-department
{"userId": 8, "departmentId": 2, "departmentName": "Finance"}

# Assign HR
POST /auth/admin/assign-department
{"userId": 8, "departmentId": 3, "departmentName": "HR"}
```

### Remove Department
```bash
DELETE /auth/admin/remove-department?userId=8&departmentId=5
```

---

## 💡 Use Cases

### 1. Cross-Functional Team Member
**User**: Project Manager  
**Departments**: IT, Finance, HR  
**Access**: Can view documents from all three departments

### 2. Department Head
**User**: Director of Operations  
**Departments**: Finance, HR  
**Access**: Can view documents from Finance and HR

### 3. Consultant
**User**: External Consultant  
**Departments**: IT, Engineering  
**Access**: Can view documents from IT and Engineering

### 4. Single Department User
**User**: IT Specialist  
**Departments**: IT  
**Access**: Can only view IT documents

---

## 🎨 UI Features

### Department Assignment Modal

**Current Departments Section:**
- Shows all departments currently assigned to the user
- Each department has a "Remove" button
- Departments are displayed with icons and names
- Empty state: "No departments assigned"

**Add Department Section:**
- Shows all available departments not yet assigned
- Click any department to assign it instantly
- Departments disappear from this list once assigned
- Empty state: "All departments assigned"

**Visual Feedback:**
- Departments use color-coded icons
- Hover effects on clickable items
- Smooth animations when adding/removing
- Confirmation dialogs for removals

---

## ✅ Verification

### Test Multi-Department Assignment

1. **Create Test User**
   - Go to Users page
   - Create user: test@ensia.dz

2. **Assign Multiple Departments**
   - Click ⋮ → "Assign Departments"
   - Add IT
   - Add Finance
   - Add HR

3. **Verify in Table**
   - Department column should show: "IT, Finance, HR"

4. **Test Document Access**
   - Logout from admin
   - Login as test@ensia.dz
   - Navigate to dashboard
   - Should see documents from all three departments

5. **Remove a Department**
   - Login back as admin
   - Open assignment modal for test@ensia.dz
   - Remove HR
   - Verify only IT and Finance remain

---

## 🔍 Current Setup

Based on the demo setup, here are the current assignments:

| User | Email | Departments |
|------|-------|-------------|
| User One | u1@ensia.dz | IT |
| User Two | u2@ensia.dz | IT, Finance, HR |
| Admin | admin@dms.com | All (implicit) |

---

## 📊 Benefits

### For Users
- ✅ Access documents from multiple departments
- ✅ Collaborate across teams
- ✅ No need for multiple accounts

### For Admins
- ✅ Flexible access control
- ✅ Easy to manage cross-functional teams
- ✅ Quick department reassignment
- ✅ Visual interface for management

### For Organization
- ✅ Better collaboration
- ✅ Reduced access barriers
- ✅ Improved document visibility
- ✅ Audit trail of assignments

---

## 🚀 Advanced Usage

### Bulk Department Assignment
While the UI supports one user at a time, you can use the API to bulk assign:

```powershell
# PowerShell script to assign IT to multiple users
$userIds = @(7, 8, 9)
$deptId = 5
$deptName = "IT"

foreach ($userId in $userIds) {
    $body = @{
        userId = $userId
        departmentId = $deptId
        departmentName = $deptName
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "http://localhost:8083/auth/admin/assign-department" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
}
```

### Department-Based Document Filtering
When a user logs in, they see documents from ALL their assigned departments:

```javascript
// Frontend logic (automatic)
const userDepartments = user.departments.map(d => d.departmentId);
const visibleDocuments = documents.filter(doc => 
    userDepartments.includes(doc.departmentId)
);
```

---

## ✅ Status

**Feature**: ✅ Fully Implemented  
**UI**: ✅ Working  
**API**: ✅ Working  
**Multi-Assignment**: ✅ Supported  
**Remove Assignment**: ✅ Supported  
**Real-time Updates**: ✅ Working  

---

**Last Updated**: May 17, 2026  
**Status**: ✅ Production Ready  
**Documentation**: Complete
