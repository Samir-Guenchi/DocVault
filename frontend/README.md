# Frontend

Enterprise-grade React SPA for the DocVault Document Management System.

## Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **State:** Context API + useReducer
- **Styling:** Custom CSS Design System (dark glassmorphism)
- **i18n:** i18next (English, French, Arabic)
- **Icons:** Lucide React

## Pages

| Page | Path | Description |
|------|------|-------------|
| Landing | `/` | Marketing page with feature showcase |
| Login | `/login` | Server-side authentication with demo buttons |
| User Dashboard | `/dashboard/user` | Document list, search, filters, upload |
| Admin Dashboard | `/dashboard/admin` | User/category/department management |
| Document Detail | `/dashboard/user/document/:id` | Document metadata, comments, versions |
| Document Tools | `/dashboard/user/tools` | File converter + AI translation |
| Export | `/dashboard/user/export` | CSV/Excel export |
| Admin Export | `/dashboard/admin/export` | Admin data export |

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx             # Marketing landing
│   ├── LoginPageBeginner.jsx       # Authentication
│   ├── UserDashboardBeginner.jsx   # User portal
│   ├── AdminDashboardBeginner.jsx  # Admin portal
│   ├── DocumentDetailPageBeginner.jsx  # Document view
│   ├── DocumentToolsPage.jsx       # File conversion + translation
│   ├── ExportPage.jsx              # User export
│   └── AdminExportPage.jsx         # Admin export
├── components/
│   ├── NavigationMenu.jsx          # Sidebar navigation
│   ├── LanguageSwitcher.jsx        # i18n toggle
│   ├── Pagination.jsx              # Table pagination
│   └── ProtectedRoute.jsx          # Role-based route guard
├── context/
│   └── AppContext.jsx              # Global state + API layer
├── utils/                          # Utility functions
├── i18n.js                         # Internationalization config
├── App.jsx                         # Router + layout
├── main.jsx                        # Entry point
└── styles-professional-erp.css     # Design system tokens
```

## API Configuration

The frontend connects to the backend through the API Gateway.

| Environment | API Base | Configuration |
|-------------|----------|---------------|
| **Development** | `http://localhost:8080` | Direct connection to Gateway |
| **Production (Docker)** | (empty string) | Nginx proxies `/api/*` to Gateway at `http://dms-gateway:8080` |
| **Kubernetes** | (empty string) | Nginx proxies `/api/*` to Gateway service |

Configuration is set via `VITE_API_URL` environment variable:
- `.env.production`: `VITE_API_URL=""`
- Development default: `http://localhost:8080`

### Nginx Proxy Configuration

In production (Docker/K8s), nginx handles API proxying:

```nginx
location /api/ {
    proxy_pass http://dms-gateway:8080/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Connection "";
    proxy_buffering on;
}
```

## Running

```bash
# Development
npm install
npm run dev
# → http://localhost:5175

# Production build
npm run build
# Output: dist/

# Tests
npx playwright test
```

## Docker Deployment

The frontend is containerized using a multi-stage build for optimal size and performance.

### Build and Run

```bash
# Build image
docker build -t dms-ui .

# Run standalone (requires gateway to be accessible)
docker run -p 3000:80 --name dms-ui dms-ui

# Run with docker-compose (recommended)
cd ../infra/docker
docker-compose -f docker-compose.full.yml up dms-ui
```

**Access:** http://localhost:3000

### Docker Image Details

The Dockerfile uses a multi-stage build:
1. **Build stage:** Node 20 Alpine - Runs Vite production build
2. **Serve stage:** Nginx Alpine - Serves static files and proxies API requests

**Image size:** Approximately 50MB (optimized with Alpine base)

### Nginx Configuration

In production, nginx handles both static file serving and API proxying:

```nginx
# Serve React SPA
location / {
    try_files $uri $uri/ /index.html;
}

# Proxy API requests to gateway
location /api/ {
    proxy_pass http://dms-gateway:8080/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Connection "";
    proxy_buffering on;
}
```

This configuration ensures:
- SPA routing works correctly (all routes serve index.html)
- API requests are proxied to the backend gateway
- Proper handling of chunked responses from Spring Boot
- Static assets are cached for performance
