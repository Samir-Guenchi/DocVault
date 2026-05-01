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

The frontend connects to the Spring Boot Gateway:

| Environment | API Base | How |
|-------------|----------|-----|
| **Dev** | `http://localhost:8080` | Direct to Gateway |
| **Docker** | (empty) | Nginx proxies `/api/` → Gateway |
| **K8s** | (empty) | Nginx proxies `/api/` → Gateway |

Set via `VITE_API_URL` in `.env.production`.

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

## Docker

```bash
docker build -t dms-ui .
docker run -p 3000:80 dms-ui
# → http://localhost:3000
```

The Dockerfile uses a multi-stage build:
1. **Build stage:** Node 20 → Vite production build
2. **Serve stage:** Nginx Alpine → serves static files + reverse proxy
