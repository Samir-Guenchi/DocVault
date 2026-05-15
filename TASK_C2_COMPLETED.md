# Task C2: Adding a Real User Store - COMPLETED ✅

## Overview
Successfully extended the Auth microservice to use PostgreSQL as the user store, replacing hardcoded users with database persistence.

## What Was Implemented

### 1. Database Setup
- **PostgreSQL Container**: `dms-auth-postgres` running on port 5433
  - Database: `authdb`
  - User: `authuser`
  - Password: `authpass`
  - Network: `docker_dms-network`

### 2. Database Schema Design

#### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    last_login TIMESTAMP,
    last_logout TIMESTAMP,
    created_at TIMESTAMP,
    status VARCHAR(50),
    name VARCHAR(255)
);
```

#### User Roles Table (Separate table for flexibility)
```sql
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    UNIQUE(user_id, role)
);
```

**Design Decision**: Separated roles into their own table to:
- Support multiple roles per user
- Allow easy role management
- Maintain normalized database structure
- Enable future role-based features

### 3. Dependencies Added (pom.xml)
- ✅ `spring-boot-starter-data-jpa`
- ✅ `postgresql` driver
- ✅ `spring-boot-starter-security`
- ✅ JWT libraries (jjwt-api, jjwt-impl, jjwt-jackson)
- ✅ Lombok for cleaner code

### 4. Entity Classes

#### User Entity
- Proper JPA annotations
- One-to-Many relationship with UserRole
- JSON serialization controls (password hidden)
- Helper methods for role management
- Fixed circular reference issue with `@EqualsAndHashCode(exclude = "userRoles")` and `@ToString(exclude = "userRoles")`

#### UserRole Entity
- Many-to-One relationship with User
- Unique constraint on (user_id, role)
- Fixed circular reference with `@EqualsAndHashCode(exclude = "user")` and `@ToString(exclude = "user")`

### 5. Password Security
- **Salt Generation**: UUID-based unique salt per user
- **Hashing**: BCrypt with strength 12
- **Storage**: Salt and hash stored separately
- **Verification**: Combines salt + password before verification

### 6. Endpoints Implemented

#### POST /auth/register
Creates a new user with:
- Email (unique)
- Password (hashed with salt)
- Name (optional, defaults to email prefix)
- Roles (array, defaults to ["user"])

**Example Request**:
```json
{
  "email": "admin@dms.com",
  "password": "admin123",
  "name": "Admin User",
  "roles": ["admin", "user"]
}
```

**Example Response**:
```json
{
  "id": 1,
  "email": "admin@dms.com",
  "name": "Admin User",
  "status": "active",
  "createdAt": "2026-05-04T13:50:08.814015074",
  "roles": [
    {"id": 1, "role": "admin"},
    {"id": 2, "role": "user"}
  ]
}
```

#### POST /auth/login
Authenticates user and returns JWT:
- Validates credentials against database
- Updates `last_login` timestamp
- Generates JWT token with user info and roles

**Example Request**:
```json
{
  "email": "admin@dms.com",
  "password": "admin123"
}
```

**Example Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "admin@dms.com",
    "name": "Admin User",
    "roles": [...]
  }
}
```

#### POST /auth/logout
Updates `last_logout` timestamp:
- Requires Authorization header
- Extracts user from JWT
- Updates database

#### GET /auth/validate
Validates JWT token:
- Returns user info if valid
- Returns 401 if invalid/expired

**Example Response**:
```json
{
  "valid": true,
  "userId": 1,
  "email": "admin@dms.com",
  "name": "Admin User",
  "roles": ["admin", "user"]
}
```

#### GET /auth/health
Health check endpoint

### 7. Security Configuration
- CSRF disabled (stateless JWT)
- Session management: STATELESS
- Permits all `/auth/**` and `/error` endpoints
- All other endpoints require authentication

### 8. Configuration (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5433}/authdb
    username: ${DB_USER:authuser}
    password: ${DB_PASSWORD:authpass}
  jpa:
    hibernate:
      ddl-auto: update  # Auto-creates tables
    show-sql: true

jwt:
  secret: ${JWT_SECRET:...}
  expiration: 86400000  # 24 hours
```

## Testing Results

### Users Created
1. **Admin User**
   - Email: admin@dms.com
   - Roles: admin, user
   - Status: ✅ Registered and logged in successfully

2. **Regular User**
   - Email: user@dms.com
   - Roles: user
   - Status: ✅ Registered and logged in successfully

### Database Verification
```
 id |     email     |     name     | status |         created_at         |         last_login
----+---------------+--------------+--------+----------------------------+----------------------------
  1 | admin@dms.com | Admin User   | active | 2026-05-04 13:50:08.814015 | 2026-05-04 13:50:22.607012
  2 | user@dms.com  | Regular User | active | 2026-05-04 13:50:31.157882 | 2026-05-04 13:51:15.225006
```

### Roles Verification
```
 id | role  |     email
----+-------+---------------
  1 | admin | admin@dms.com
  2 | user  | admin@dms.com
  3 | user  | user@dms.com
```

## Key Features Implemented

✅ PostgreSQL database integration  
✅ Proper password hashing with salt  
✅ User registration endpoint  
✅ Login with database authentication  
✅ Last login timestamp tracking  
✅ Last logout timestamp tracking  
✅ JWT token generation  
✅ Token validation endpoint  
✅ Multiple roles per user support  
✅ Proper entity relationships  
✅ Security configuration  
✅ Error handling  
✅ CORS support  

## Issues Fixed

1. **Circular Reference in Entities**: Added `@EqualsAndHashCode` and `@ToString` exclusions to prevent StackOverflowError
2. **403 Forbidden on /error**: Added `/error` to permitted endpoints in SecurityConfig
3. **Docker Network**: Correctly identified and used `docker_dms-network`

## Running the Service

```bash
# Database is already running
docker ps --filter "name=dms-auth-postgres"

# Auth service is running
docker ps --filter "name=dms-auth-service"

# Test registration
curl -X POST http://localhost:8083/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@dms.com","password":"test123","roles":["user"]}'

# Test login
curl -X POST http://localhost:8083/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@dms.com","password":"test123"}'
```

## Next Steps (Task C3 - Part 1)

Now that the Auth service is complete with database persistence, the next task is to:

1. **Protect Documents Service**: Make all endpoints require valid JWT
2. **JWT Validation**: Decide where validation happens (Gateway vs Documents)
3. **Owner Tracking**: Add `owner_id` column to documents table
4. **Security Analysis**: Justify architectural decisions

---

**Status**: ✅ TASK C2 COMPLETED SUCCESSFULLY
**Date**: May 4, 2026
**Service**: Auth Service with PostgreSQL
**Endpoints**: /auth/register, /auth/login, /auth/logout, /auth/validate, /auth/health
