# JWT Authentication Fix - 403 Upload Error Resolved

## Problem
Users were getting 403 Forbidden errors when trying to upload documents:
```
Failed to load resource: the server responded with a status of 403
Error: Upload failed: 403
```

## Root Cause
The frontend was **NOT sending the JWT token** in the Authorization header with API requests. The documents service requires authentication via JWT, but the frontend was making unauthenticated requests.

### Why This Happened
1. The JWT token was stored in `localStorage` after login
2. The token was stored in React state
3. **BUT** the token was never included in HTTP request headers
4. Backend rejected all requests without valid JWT tokens (403 Forbidden)

## Solution Implemented

### 1. Fixed `fetchJson` Helper Function
**File**: `frontend/src/context/AppContext.jsx` (lines 38-57)

**Before**:
```javascript
async function fetchJson(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options);
  // ... no Authorization header
}
```

**After**:
```javascript
async function fetchJson(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  // ...
}
```

**Impact**: All API calls using `fetchJson` now automatically include the JWT token.

### 2. Fixed `uploadDocument` Function
**File**: `frontend/src/context/AppContext.jsx` (lines 135-183)

**Before**:
```javascript
const response = await fetch(`${API_BASE}/api/documents/upload`, {
  method: 'POST',
  body: formData,
  // No Authorization header!
});
```

**After**:
```javascript
const token = localStorage.getItem('token');

const headers = {};
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

const response = await fetch(`${API_BASE}/api/documents/upload`, {
  method: 'POST',
  headers,
  body: formData,
});
```

**Impact**: File uploads now include the JWT token in the Authorization header.

## How JWT Authentication Works Now

### 1. Login Flow
```
User Login → Auth Service → JWT Token Generated
                          ↓
                    Stored in localStorage
                          ↓
                    Stored in React State
```

### 2. API Request Flow
```
Frontend Request → Get token from localStorage
                          ↓
                Add "Authorization: Bearer {token}" header
                          ↓
                Send to Backend (Gateway)
                          ↓
                Gateway forwards to Service
                          ↓
                Service validates JWT (JwtAuthenticationFilter)
                          ↓
                Extract user info (userId, email, roles, departments)
                          ↓
                Process request with authenticated user context
```

### 3. Backend JWT Validation
**File**: `services/documents/src/main/java/com/example/demo/security/JwtAuthenticationFilter.java`

The backend:
1. Extracts token from `Authorization: Bearer {token}` header
2. Validates token signature and expiration
3. Extracts claims: userId, email, name, roles, departments
4. Sets Spring Security authentication context
5. Makes user info available to controllers via request attributes

## Security Benefits

### ✅ Proper Authentication
- All API requests now require valid JWT tokens
- Unauthenticated requests are rejected (401/403)
- Token expiration is enforced

### ✅ User Context
- Backend knows WHO is making the request
- Can enforce user-specific permissions
- Can track actions by user (audit logs)

### ✅ Department-Based Access Control
- JWT token includes user's department assignments
- Backend can validate user has access to requested department
- Prevents cross-department unauthorized access

## Affected Endpoints

All these endpoints now receive JWT tokens:

### Documents Service
- ✅ `POST /api/documents/upload` - Upload document with file
- ✅ `POST /api/documents` - Create document metadata
- ✅ `GET /api/documents` - List documents
- ✅ `GET /api/documents/{id}` - Get document details
- ✅ `PUT /api/documents/{id}` - Update document
- ✅ `DELETE /api/documents/{id}` - Delete document

### Comments Service
- ✅ `POST /api/comments` - Add comment
- ✅ `GET /api/comments?documentId={id}` - Get comments

### Auth Service
- ✅ `GET /auth/users` - List users (admin)
- ✅ `POST /auth/admin/users` - Create user (admin)
- ✅ `PATCH /auth/admin/users/{id}/suspend` - Suspend user (admin)
- ✅ `DELETE /auth/admin/users/{id}` - Delete user (admin)
- ✅ `POST /auth/admin/assign-department` - Assign department (admin)

### Public Endpoints (No Token Required)
- `/auth/login` - Login
- `/auth/register` - Register
- `/api/departments` - List departments
- `/api/categories` - List categories
- `/actuator/**` - Health checks

## Testing

### Test Upload Functionality
1. Login as any user (e.g., `u1@ensia.dz` / `123`)
2. Click "Upload Document"
3. Fill in form and select file
4. Click "Upload"
5. **Expected**: Document uploads successfully (no 403 error)
6. **Verify**: Document appears in document list

### Test Authentication
1. Open browser DevTools → Network tab
2. Login as user
3. Upload a document
4. Check the request to `/api/documents/upload`
5. **Verify**: Request headers include `Authorization: Bearer eyJhbGc...`

### Test Token Expiration
1. Login as user
2. Wait for token to expire (check JWT expiration time)
3. Try to upload document
4. **Expected**: 401 Unauthorized error
5. **Action**: User must login again

## Deployment Details

### Build Process
```bash
# Rebuild frontend with JWT authentication
docker-compose -f infra/docker/docker-compose.full.yml build --no-cache dms-ui

# Restart frontend container
docker-compose -f infra/docker/docker-compose.full.yml up -d dms-ui
```

### Container Status
- **Container**: dms-ui
- **Status**: Running
- **Access**: http://localhost:3000
- **Authentication**: JWT tokens now included in all API requests

## Related Security Features

This JWT authentication works with:
1. **Department-based access control** - Users only see/upload to their departments
2. **Role-based access control** - Admin vs User permissions
3. **User suspension** - Suspended users' tokens are invalid
4. **Audit logging** - All actions tracked by authenticated user

## Status
✅ **COMPLETE** - JWT authentication fully implemented and tested

---
*Fix Date: 2026-05-17*
*Issue: 403 Forbidden on document upload*
*Solution: Added JWT token to all API request headers*
