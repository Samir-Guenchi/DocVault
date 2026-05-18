# JWT Token Storage Fix - FINAL SOLUTION

## The Real Problem

The JWT token was **NEVER stored in localStorage**! 

### What Was Happening:
1. ✅ User logs in → JWT token received from backend
2. ✅ Token stored in React state (Redux)
3. ❌ Token **NOT** stored in localStorage
4. ❌ API requests tried to get token from localStorage → **null**
5. ❌ Requests sent without Authorization header → **403 Forbidden**

## Root Cause Analysis

### Previous Fix (Incomplete)
In the first fix, I added code to:
- Read token from `localStorage.getItem('token')` ✅
- Add token to Authorization header ✅

**BUT** the token was never being saved to localStorage in the first place! ❌

### The Missing Piece
The `login` function stored the token in Redux state but never called `localStorage.setItem('token', ...)`.

## Complete Solution

### 1. Store Token on Login
**File**: `frontend/src/context/AppContext.jsx` (line ~138)

**Before**:
```javascript
const login = async ({ email, password }) => {
  // ... fetch login ...
  const user = {
    id: data.user.id,
    email: data.user.email,
    role: userRole,
    name: data.user.name || data.user.email.split('@')[0],
    token: data.token,
    departments: data.user.departments || []
  };
  dispatch({ type: 'LOGIN', payload: user });
  // Token only in Redux state, NOT in localStorage!
  return { ok: true, user };
};
```

**After**:
```javascript
const login = async ({ email, password }) => {
  // ... fetch login ...
  const user = {
    id: data.user.id,
    email: data.user.email,
    role: userRole,
    name: data.user.name || data.user.email.split('@')[0],
    token: data.token,
    departments: data.user.departments || []
  };
  
  // ✅ Store token in localStorage for API requests
  localStorage.setItem('token', data.token);
  
  dispatch({ type: 'LOGIN', payload: user });
  return { ok: true, user };
};
```

### 2. Remove Token on Logout
**File**: `frontend/src/context/AppContext.jsx` (line ~145)

**Before**:
```javascript
const logout = () => dispatch({ type: 'LOGOUT' });
```

**After**:
```javascript
const logout = () => {
  localStorage.removeItem('token');
  dispatch({ type: 'LOGOUT' });
};
```

### 3. Read Token for API Requests (Already Fixed)
**File**: `frontend/src/context/AppContext.jsx` (line ~38)

```javascript
async function fetchJson(path, options = {}) {
  const token = localStorage.getItem('token'); // ✅ Now this works!
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

### 4. Include Token in File Uploads (Already Fixed)
**File**: `frontend/src/context/AppContext.jsx` (line ~150)

```javascript
const uploadDocument = async (payload, file) => {
  const token = localStorage.getItem('token'); // ✅ Now this works!
  
  if (file) {
    const formData = new FormData();
    // ... add form fields ...
    
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}/api/documents/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    // ...
  }
};
```

## Complete Authentication Flow

### Login Flow
```
1. User enters credentials
2. POST /auth/login
3. Backend returns { token, user }
4. Frontend stores token in:
   - localStorage.setItem('token', token) ✅
   - Redux state (user.token) ✅
5. User redirected to dashboard
```

### API Request Flow
```
1. User action (e.g., upload document)
2. Frontend gets token: localStorage.getItem('token') ✅
3. Frontend adds header: Authorization: Bearer {token} ✅
4. Request sent to backend
5. Backend validates JWT ✅
6. Request processed successfully ✅
```

### Logout Flow
```
1. User clicks logout
2. Frontend removes token: localStorage.removeItem('token') ✅
3. Redux state cleared ✅
4. User redirected to login
```

## Why localStorage?

### Advantages:
- ✅ Persists across page refreshes
- ✅ Survives browser tab close/reopen
- ✅ Accessible from any component
- ✅ Simple API (getItem/setItem/removeItem)

### Security Considerations:
- ⚠️ Vulnerable to XSS attacks (but so is any client-side storage)
- ✅ Token has expiration time (JWT exp claim)
- ✅ HTTPS protects token in transit
- ✅ Backend validates token on every request

## Testing Instructions

### IMPORTANT: Clear Browser Cache First!
Before testing, you MUST:
1. Open browser DevTools (F12)
2. Go to Application tab → Storage → Local Storage
3. Delete any existing 'token' entry
4. Refresh the page (Ctrl+F5)

### Test 1: Login and Token Storage
1. Open DevTools → Application → Local Storage → http://localhost:3000
2. Login as `u1@ensia.dz` / `123`
3. **Verify**: You should see `token` key with JWT value in localStorage
4. **Verify**: Token should start with `eyJhbGc...`

### Test 2: Upload Document
1. After login, click "Upload Document"
2. Fill in form and select a file
3. Click "Upload"
4. **Expected**: Document uploads successfully (no 403 error)
5. **Verify**: Document appears in list

### Test 3: Token in Request Headers
1. Open DevTools → Network tab
2. Upload a document
3. Click on the `/api/documents/upload` request
4. Go to Headers tab
5. **Verify**: Request Headers include `Authorization: Bearer eyJhbGc...`

### Test 4: Token Persistence
1. Login as user
2. Upload a document (should work)
3. Refresh the page (F5)
4. **Verify**: Still logged in (token persisted)
5. Upload another document (should still work)

### Test 5: Logout
1. Login as user
2. Check localStorage (token should exist)
3. Click logout
4. **Verify**: Token removed from localStorage
5. Try to access dashboard → redirected to login

## Deployment

### Build and Deploy
```bash
# Rebuild frontend with token storage fix
docker-compose -f infra/docker/docker-compose.full.yml build --no-cache dms-ui

# Restart frontend
docker-compose -f infra/docker/docker-compose.full.yml up -d dms-ui
```

### Verify Deployment
```bash
# Check container is running
docker ps | grep dms-ui

# Check container logs
docker logs dms-ui --tail 20
```

## All Changes Summary

### Files Modified:
1. `frontend/src/context/AppContext.jsx`
   - Line ~38: `fetchJson` - Added Authorization header from localStorage
   - Line ~138: `login` - Added `localStorage.setItem('token', data.token)`
   - Line ~145: `logout` - Added `localStorage.removeItem('token')`
   - Line ~150: `uploadDocument` - Added Authorization header from localStorage

### Total Lines Changed: ~15 lines
### Impact: Complete JWT authentication flow

## Status
✅ **COMPLETE** - JWT token now properly stored and used

## Next Steps for Users

**IMPORTANT**: All users must:
1. Clear browser cache/localStorage
2. Login again (fresh token will be stored)
3. Upload functionality will now work

---
*Final Fix Date: 2026-05-17*
*Issue: JWT token not stored in localStorage*
*Solution: Added localStorage.setItem on login, localStorage.removeItem on logout*
*Result: All API requests now include valid JWT tokens*
