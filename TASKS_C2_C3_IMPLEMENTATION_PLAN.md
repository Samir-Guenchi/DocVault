# Tasks C2 & C3 Implementation Plan and Testing Guide

## Current State Analysis

### Existing Authentication
- **Location**: Documents Service (`UserController.java`)
- **Method**: Simple email/password matching (no hashing, no JWT)
- **Database**: PostgreSQL (shared with documents)
- **Endpoint**: `POST /api/users/login`
- **Issues**:
  - Passwords stored in plaintext
  - No JWT tokens
  - No session management
  - No separate Auth service

## Task C2: Adding a Real User Store (Auth Service)

### Requirements
1. Create dedicated Auth microservice
2. Use PostgreSQL as user store (separate database)
3. Store: email, password, salt, last_login, last_logout, roles
4. Implement password hashing (BCrypt)
5. Add `/auth/register` endpoint
6. Update `/auth/login` to use database and JWT

### Implementation Steps

#### Step 1: Create Auth Service Structure

```
services/auth/
├── src/
│   ├── main/
│   │   ├── java/com/example/auth/
│   │   │   ├── AuthApplication.java
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── JwtConfig.java
│   │   │   ├── controller/
│   │   │   │   └── AuthController.java
│   │   │   ├── entity/
│   │   │   │   ├── User.java
│   │   │   │   └── UserRole.java
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── UserRoleRepository.java
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   └── JwtService.java
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── LoginResponse.java
│   │   │   │   └── RegisterRequest.java
│   │   │   └── security/
│   │   │       └── JwtTokenProvider.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── schema.sql
│   └── test/
├── pom.xml
└── Dockerfile
```

#### Step 2: Database Schema Design

**Option A: Single Table (Simpler)**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    roles VARCHAR(255) NOT NULL, -- comma-separated: "user,admin"
    last_login TIMESTAMP,
    last_logout TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);
```

**Option B: Separate Tables (Normalized - RECOMMENDED)**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    last_login TIMESTAMP,
    last_logout TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    UNIQUE(user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

**Justification for Option B**:
- Normalized design (3NF)
- Easy to add/remove roles
- Supports multiple roles per user
- Better for querying users by role
- Follows best practices

#### Step 3: Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

#### Step 4: Configuration (application.yml)

```yaml
server:
  port: 8083

spring:
  application:
    name: auth-service
  datasource:
    url: jdbc:postgresql://dms-auth-postgres:5432/authdb
    username: authuser
    password: authpass
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

jwt:
  secret: your-256-bit-secret-key-change-this-in-production
  expiration: 86400000 # 24 hours in milliseconds
```

#### Step 5: Docker Compose Update

Add to `infra/docker/docker-compose.full.yml`:

```yaml
  # Auth Service PostgreSQL
  dms-auth-postgres:
    image: postgres:15-alpine
    container_name: dms-auth-postgres
    environment:
      POSTGRES_DB: authdb
      POSTGRES_USER: authuser
      POSTGRES_PASSWORD: authpass
    ports:
      - "5433:5432"
    volumes:
      - auth-postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U authuser -d authdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Auth Service
  auth-service:
    build:
      context: ../../services/auth
      dockerfile: Dockerfile
    container_name: dms-auth-service
    ports:
      - "8083:8083"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://dms-auth-postgres:5432/authdb
      SPRING_DATASOURCE_USERNAME: authuser
      SPRING_DATASOURCE_PASSWORD: authpass
    depends_on:
      dms-auth-postgres:
        condition: service_healthy

volumes:
  auth-postgres-data:
```

#### Step 6: Key Implementation Files

**User Entity**:
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(nullable = false)
    private String salt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "last_logout")
    private LocalDateTime lastLogout;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private String status = "active";
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<UserRole> roles = new HashSet<>();
}
```

**AuthController Endpoints**:
```java
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // 1. Find user by email
        // 2. Verify password with BCrypt
        // 3. Update last_login timestamp
        // 4. Generate JWT token
        // 5. Return token + user info
    }
    
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        // 1. Validate email not exists
        // 2. Generate salt
        // 3. Hash password with BCrypt
        // 4. Create user with roles
        // 5. Save to database
        // 6. Return created user (without password)
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        // 1. Extract user from JWT
        // 2. Update last_logout timestamp
        // 3. Optionally: Add token to blacklist
    }
    
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token) {
        // 1. Validate JWT signature
        // 2. Check expiration
        // 3. Return user info from token
    }
}
```

**Password Hashing with BCrypt**:
```java
@Service
public class AuthService {
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    
    public String hashPassword(String password, String salt) {
        return passwordEncoder.encode(salt + password);
    }
    
    public boolean verifyPassword(String rawPassword, String salt, String hashedPassword) {
        return passwordEncoder.matches(salt + rawPassword, hashedPassword);
    }
    
    public String generateSalt() {
        return UUID.randomUUID().toString();
    }
}
```

**JWT Token Provider**:
```java
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("roles", user.getRoles().stream()
            .map(UserRole::getRole)
            .collect(Collectors.toList()));
        
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(user.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(SignatureAlgorithm.HS256, jwtSecret)
            .compact();
    }
    
    public Claims extractClaims(String token) {
        return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

### Testing Task C2

#### Test 1: Register New User
```bash
curl -X POST http://localhost:8083/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!",
    "roles": ["user"]
  }'

# Expected: 201 Created with user object (no password in response)
```

#### Test 2: Login with Registered User
```bash
curl -X POST http://localhost:8083/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123!"
  }'

# Expected: 200 OK with JWT token
# Response: {"token": "eyJhbGc...", "user": {...}}
```

#### Test 3: Verify Password Hashing
```bash
# Check database directly
docker exec -it dms-auth-postgres psql -U authuser -d authdb -c "SELECT email, password_hash, salt FROM users;"

# Expected: password_hash should be BCrypt hash (starts with $2a$ or $2b$)
# Expected: salt should be UUID
```

#### Test 4: Verify Last Login Timestamp
```bash
# Login again and check timestamp updated
curl -X POST http://localhost:8083/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "SecurePass123!"}'

# Check database
docker exec -it dms-auth-postgres psql -U authuser -d authdb -c "SELECT email, last_login FROM users WHERE email='alice@example.com';"

# Expected: last_login should be recent timestamp
```

---

## Task C3 Part 1: Protecting Documents Service

### Requirements
1. All Documents endpoints require valid JWT
2. Requests without token return 401
3. Expired/tampered tokens return 401
4. User identity available in Documents service
5. New documents record owner_id from JWT

### Architectural Decisions

#### Decision 1: Where does JWT validation happen?

**Option A: Gateway Only**
- **Pros**: Single point of validation, services trust gateway
- **Cons**: Services vulnerable if accessed directly, no defense in depth

**Option B: Documents Service Only**
- **Pros**: Service is self-contained, can be deployed independently
- **Cons**: Duplicate validation logic across services

**Option C: Both Gateway and Documents (RECOMMENDED)**
- **Pros**: Defense in depth, gateway filters bad requests, service validates for security
- **Cons**: Slight performance overhead

**Chosen**: Option C - Both
**Justification**: 
- Gateway validates and rejects invalid tokens early (performance)
- Documents service validates again (security - zero trust)
- If gateway is bypassed, service still protected
- Follows microservices security best practices

#### Decision 2: Does Documents service call Auth service on every request?

**Option A: Call Auth service every time**
- **Pros**: Real-time validation, can revoke tokens immediately
- **Cons**: High latency, Auth service becomes bottleneck, single point of failure

**Option B: Trust JWT signature only**
- **Pros**: Fast, no network calls, Auth service can be down
- **Cons**: Cannot revoke tokens before expiration

**Option C: Hybrid - JWT + Redis cache (RECOMMENDED)**
- **Pros**: Fast validation, can revoke tokens (blacklist in Redis)
- **Cons**: Requires Redis, slightly more complex

**Chosen**: Option B for now (Option C for production)
**Justification**:
- JWT signature validation is cryptographically secure
- Expiration time limits damage of compromised tokens
- Auth service downtime doesn't affect document access
- For production: Add Redis blacklist for revoked tokens

#### Decision 3: How does user identity arrive in Documents service?

**Option A: Header injected by Gateway**
- **Pros**: Simple, Documents service doesn't need JWT library
- **Cons**: Must trust gateway completely, vulnerable if bypassed

**Option B: Re-parse JWT in Documents service**
- **Pros**: Zero trust, service validates independently
- **Cons**: Duplicate JWT parsing logic

**Option C: Both - Gateway adds header, Documents validates JWT (RECOMMENDED)**
- **Pros**: Convenience + security, can use either
- **Cons**: Slight redundancy

**Chosen**: Option C
**Justification**:
- Gateway adds `X-User-Id` and `X-User-Email` headers for convenience
- Documents service validates JWT and extracts claims for security
- If headers are tampered, JWT validation catches it
- Defense in depth principle

### Implementation Steps

#### Step 1: Add JWT Validation to Documents Service

**Add Dependencies** (pom.xml):
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

**JWT Filter**:
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Missing or invalid Authorization header\"}");
            return;
        }
        
        String token = authHeader.substring(7);
        
        try {
            Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
            
            // Add user info to request attributes
            request.setAttribute("userId", claims.get("userId", Long.class));
            request.setAttribute("userEmail", claims.getSubject());
            request.setAttribute("userRoles", claims.get("roles", List.class));
            
            filterChain.doFilter(request, response);
            
        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Token expired\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid token\"}");
        }
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Allow health check endpoint without auth
        return request.getRequestURI().equals("/actuator/health");
    }
}
```

**Security Configuration**:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

#### Step 2: Update Document Entity

```java
@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    
    @Column(name = "owner_id", nullable = false)
    private Long ownerId; // From JWT, not request body
    
    @Column(name = "owner_email")
    private String ownerEmail;
    
    // ... other fields
}
```

#### Step 3: Update DocumentController

```java
@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    
    @PostMapping
    public ResponseEntity<Document> create(@RequestBody Document doc, HttpServletRequest request) {
        // CRITICAL: Owner comes from JWT, never from request body
        Long userId = (Long) request.getAttribute("userId");
        String userEmail = (String) request.getAttribute("userEmail");
        
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Ignore any owner_id in request body
        doc.setOwnerId(userId);
        doc.setOwnerEmail(userEmail);
        doc.setCreatedAt(LocalDateTime.now());
        
        Document saved = documentRepository.save(doc);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping
    public List<Document> getAll(HttpServletRequest request) {
        // User identity available for future authorization logic
        Long userId = (Long) request.getAttribute("userId");
        return documentRepository.findAll();
    }
}
```

#### Step 4: Update Gateway to Forward JWT

**Gateway Configuration**:
```java
@Component
public class JwtForwardingFilter implements GlobalFilter, Ordered {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody();
                
                // Add user info headers for convenience
                ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("X-User-Id", claims.get("userId").toString())
                    .header("X-User-Email", claims.getSubject())
                    .build();
                
                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            } catch (Exception e) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        }
        
        return chain.filter(exchange);
    }
    
    @Override
    public int getOrder() {
        return -100; // Run before routing
    }
}
```

### Security Analysis

#### Attack Prevention: Owner Spoofing

**Scenario**:
- Alice (user_id=1) is a legitimate user
- Mallory (user_id=2) is a malicious user
- Mallory tries to create a document claiming Alice is the owner

**Without JWT-based owner**:
```bash
# Mallory sends:
POST /api/documents
{
  "title": "Malicious Doc",
  "owner_id": 1,  # Mallory claims to be Alice!
  "content": "..."
}

# Result: Document created with Alice as owner
# Mallory can frame Alice or access Alice's documents
```

**With JWT-based owner (SECURE)**:
```bash
# Mallory sends:
POST /api/documents
Authorization: Bearer <mallory_token>  # JWT contains user_id=2
{
  "title": "Malicious Doc",
  "owner_id": 1,  # Trying to spoof
  "content": "..."
}

# Server extracts user_id from JWT (2, not 1)
# Server IGNORES owner_id from request body
# Document created with owner_id=2 (Mallory)
# Attack prevented!
```

**Key Principle**: Never trust client-provided identity. Always extract from cryptographically signed JWT.

#### Resilience: Auth Service Down

**Question**: If Auth service goes down, can users still read documents?

**Answer**: YES (with Option B/C)

**Justification**:
1. **JWT is self-contained**: Contains all user info + signature
2. **Documents service validates signature**: No need to call Auth service
3. **Expiration limits risk**: Tokens expire after 24 hours
4. **Trade-off accepted**: 
   - Pro: System remains available during Auth outage
   - Con: Cannot revoke tokens immediately (wait for expiration)
   - Mitigation: Short expiration time (1-4 hours) for sensitive systems

**Alternative (Option A)**: If we called Auth service every time:
- Auth down = entire system down
- Single point of failure
- Not acceptable for production

### Testing Task C3 Part 1

#### Test 1: Access Without Token (Should Fail)
```bash
curl -X GET http://localhost:8080/api/documents

# Expected: 401 Unauthorized
# Response: {"error": "Missing or invalid Authorization header"}
```

#### Test 2: Access With Valid Token (Should Succeed)
```bash
# First, get a token
TOKEN=$(curl -X POST http://localhost:8083/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "SecurePass123!"}' \
  | jq -r '.token')

# Use token to access documents
curl -X GET http://localhost:8080/api/documents \
  -H "Authorization: Bearer $TOKEN"

# Expected: 200 OK with documents list
```

#### Test 3: Access With Expired Token (Should Fail)
```bash
# Use an old/expired token
curl -X GET http://localhost:8080/api/documents \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.token"

# Expected: 401 Unauthorized
# Response: {"error": "Token expired"}
```

#### Test 4: Access With Tampered Token (Should Fail)
```bash
# Modify a valid token (change one character)
TAMPERED_TOKEN="${TOKEN:0:-5}XXXXX"

curl -X GET http://localhost:8080/api/documents \
  -H "Authorization: Bearer $TAMPERED_TOKEN"

# Expected: 401 Unauthorized
# Response: {"error": "Invalid token"}
```

#### Test 5: Create Document - Owner from JWT
```bash
# Alice creates a document
curl -X POST http://localhost:8080/api/documents \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Alice Document",
    "description": "Created by Alice",
    "owner_id": 999
  }'

# Check database
docker exec -it dms-postgres psql -U postgres -d dmsdb -c "SELECT id, title, owner_id, owner_email FROM documents ORDER BY id DESC LIMIT 1;"

# Expected: owner_id should be Alice's ID (from JWT), NOT 999
# Expected: owner_email should be alice@example.com
```

#### Test 6: Mallory Tries to Spoof Alice
```bash
# Mallory gets her own token
MALLORY_TOKEN=$(curl -X POST http://localhost:8083/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "mallory@example.com", "password": "MalloryPass123!"}' \
  | jq -r '.token')

# Mallory tries to create document as Alice
curl -X POST http://localhost:8080/api/documents \
  -H "Authorization: Bearer $MALLORY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fake Alice Document",
    "owner_id": 1,
    "owner_email": "alice@example.com"
  }'

# Check database
docker exec -it dms-postgres psql -U postgres -d dmsdb -c "SELECT id, title, owner_id, owner_email FROM documents ORDER BY id DESC LIMIT 1;"

# Expected: owner_id should be Mallory's ID (from JWT), NOT Alice's
# Expected: owner_email should be mallory@example.com
# Attack prevented!
```

#### Test 7: Auth Service Down - Documents Still Accessible
```bash
# Stop Auth service
docker stop dms-auth-service

# Try to access documents with valid token (not expired)
curl -X GET http://localhost:8080/api/documents \
  -H "Authorization: Bearer $TOKEN"

# Expected: 200 OK - Documents still accessible
# Justification: JWT signature validation doesn't require Auth service

# Try to login (should fail)
curl -X POST http://localhost:8083/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "password": "SecurePass123!"}'

# Expected: Connection refused - Cannot get new tokens
# But existing valid tokens still work!

# Restart Auth service
docker start dms-auth-service
```

---

## Summary of Architectural Decisions

### Task C2 Decisions

1. **Database Schema**: Separate `users` and `user_roles` tables (normalized)
   - Justification: Flexibility, scalability, follows best practices

2. **Password Hashing**: BCrypt with salt
   - Justification: Industry standard, resistant to rainbow tables, adaptive cost

3. **Separate Database**: Auth service has its own PostgreSQL instance
   - Justification: Service independence, security isolation, scalability

### Task C3 Part 1 Decisions

1. **JWT Validation Location**: Both Gateway and Documents service
   - Justification: Defense in depth, performance + security

2. **Auth Service Calls**: Trust JWT signature, no calls per request
   - Justification: Performance, availability, acceptable security trade-off

3. **User Identity**: JWT validation + convenience headers
   - Justification: Security (zero trust) + convenience

4. **Owner Assignment**: Always from JWT, never from request body
   - Justification: Prevents spoofing attacks, ensures authenticity

---

## Next Steps

1. Implement Auth service with all files
2. Update docker-compose.yml
3. Update Documents service with JWT validation
4. Update Gateway with JWT forwarding
5. Run all tests
6. Document results

## Production Considerations

1. **JWT Secret**: Use environment variable, rotate regularly
2. **Token Expiration**: Shorter for sensitive systems (1-4 hours)
3. **Refresh Tokens**: Implement for better UX
4. **Token Blacklist**: Use Redis for revoked tokens
5. **Rate Limiting**: Prevent brute force on login
6. **Audit Logging**: Log all authentication events
7. **HTTPS Only**: Never send tokens over HTTP
8. **CORS**: Configure properly for frontend
