import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, Home, Search, LogOut, Menu, X, Download, BarChart3,
  Users, FolderOpen, Wrench
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function NavigationMenu({ userRole = 'user' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useAppContext();

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const userMenuItems = [
    { path: '/dashboard/user', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/user/search', icon: Search, label: 'Search' },
    { path: '/dashboard/user/my-documents', icon: FileText, label: 'My Docs' },
    { path: '/dashboard/user/export', icon: Download, label: 'Export' },
    { path: '/dashboard/user/tools', icon: Wrench, label: 'Tools' },
  ];

  const adminMenuItems = [
    { path: '/dashboard/admin', icon: BarChart3, label: 'Overview' },
    { path: '/dashboard/admin/users', icon: Users, label: 'Users' },
    { path: '/dashboard/admin/categories', icon: FolderOpen, label: 'Categories' },
    { path: '/dashboard/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/dashboard/admin/export', icon: Download, label: 'Export' },
    { path: '/dashboard/admin/tools', icon: Wrench, label: 'Tools' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <Link to={userRole === 'admin' ? '/dashboard/admin' : '/dashboard/user'} className="app-logo">
            <div className="nav-brand-text">
              <span className="logo-text">DocVault</span>
              <span className="logo-subtitle">DMS</span>
            </div>
          </Link>

          <nav className="desktop-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-pill ${isActive(item.path) ? 'nav-pill-active' : ''}`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="header-nav">
            <div style={{ position: 'relative' }}>
              <button className="user-menu" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar">
                  {state.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-menu-name">{state.user?.name || 'User'}</span>
                {userRole === 'admin' && <span className="badge badge-error">Admin</span>}
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-name">{state.user?.name}</div>
                    <div className="user-dropdown-email">{state.user?.email}</div>
                    <span className={`badge ${userRole === 'admin' ? 'badge-error' : 'badge-primary'}`} style={{ marginTop: 6 }}>
                      {userRole.toUpperCase()}
                    </span>
                  </div>
                  <div className="user-dropdown-actions">
                    <Link
                      to={userRole === 'admin' ? '/dashboard/admin' : '/dashboard/user'}
                      className="user-dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Home size={16} /> Dashboard
                    </Link>
                    <button className="user-dropdown-item user-dropdown-logout" onClick={handleLogout}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn btn-ghost mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none' }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s1)' }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-pill ${isActive(item.path) ? 'nav-pill-active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      <style>{`
        .nav-brand-text {
          display: flex; align-items: baseline; gap: 6px;
        }
        .logo-text {
          font-size: 20px; font-weight: 700; color: #0066cc;
          line-height: 1; letter-spacing: -0.5px;
        }
        .logo-subtitle {
          font-size: 13px; font-weight: 600; color: #666;
          line-height: 1;
        }

        .nav-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px; font-size: var(--text-sm); font-weight: 500;
          color: var(--g600); text-decoration: none; border-radius: var(--r-md);
          transition: all var(--dur-fast) var(--ease);
          white-space: nowrap;
        }
        .nav-pill:hover { background: var(--g100); color: var(--g800); }
        .nav-pill-active {
          background: var(--cyan); color: var(--white);
          box-shadow: 0 1px 3px rgba(11,165,195,.2);
        }
        .nav-pill-active:hover { background: var(--cyan-dk); color: var(--white); }

        .user-menu-name {
          font-weight: 500; font-size: var(--text-sm); color: var(--g700);
        }

        .user-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: var(--white); border: 1px solid var(--g200);
          border-radius: var(--r-lg); box-shadow: var(--sh-lg);
          min-width: 210px; z-index: 1000; overflow: hidden;
          animation: fadeIn var(--dur) var(--ease);
        }
        .user-dropdown-header {
          padding: var(--s4); border-bottom: 1px solid var(--g100);
        }
        .user-dropdown-name {
          font-weight: 600; font-size: var(--text-sm); color: var(--g800);
        }
        .user-dropdown-email {
          font-size: var(--text-xs); color: var(--g500); margin-top: 2px;
        }
        .user-dropdown-actions { padding: var(--s2); }
        .user-dropdown-item {
          display: flex; align-items: center; gap: var(--s2);
          width: 100%; padding: 8px 12px; border: none; background: none;
          font-family: var(--sans); font-size: var(--text-sm); font-weight: 500;
          color: var(--g700); cursor: pointer; border-radius: var(--r-md);
          text-decoration: none; transition: background var(--dur-fast) var(--ease);
        }
        .user-dropdown-item:hover { background: var(--g50); }
        .user-dropdown-logout { color: var(--err); }
        .user-dropdown-logout:hover { background: var(--err-bg); }

        .mobile-menu {
          background: var(--white); border-bottom: 1px solid var(--g200);
          padding: var(--s3) var(--s4); box-shadow: var(--sh-sm);
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .user-menu-name { display: none; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
