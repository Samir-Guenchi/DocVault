import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, FolderOpen, Building2, TrendingUp, Activity, Shield, Clock } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useAppContext } from '../context/AppContext';

export default function AdminDashboardBeginner() {
  const { state } = useAppContext();

  const stats = useMemo(() => {
    const totalDocs = state.documents.length;
    const totalUsers = state.users.length;
    const activeUsers = state.users.filter(u => u.status === 'active').length;
    const totalCategories = state.categories.length;
    const totalDepartments = state.departments.length;

    return {
      documents: { total: totalDocs, change: '+12%' },
      users: { total: totalUsers, active: activeUsers, change: '+8%' },
      categories: { total: totalCategories, change: '+3%' },
      departments: { total: totalDepartments, change: '0%' },
    };
  }, [state.documents, state.users, state.categories, state.departments]);

  const recentDocs = useMemo(() => 
    [...state.documents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [state.documents]
  );

  const recentUsers = useMemo(() => 
    [...state.users].sort((a, b) => b.id - a.id).slice(0, 5),
    [state.users]
  );

  const categoryMap = useMemo(() => 
    Object.fromEntries(state.categories.map(c => [c.id, c.name])),
    [state.categories]
  );

  const departmentMap = useMemo(() => 
    Object.fromEntries(state.departments.map(d => [d.id, d.name])),
    [state.departments]
  );

  const statCards = [
    { icon: FileText, label: 'Total Documents', value: stats.documents.total, change: stats.documents.change, color: '#0066cc', bg: 'rgba(0,102,204,.08)', link: '/dashboard/admin' },
    { icon: Users, label: 'Total Users', value: stats.users.total, sub: `${stats.users.active} active`, change: stats.users.change, color: '#10b981', bg: 'rgba(16,185,129,.08)', link: '/dashboard/admin/users' },
    { icon: FolderOpen, label: 'Categories', value: stats.categories.total, change: stats.categories.change, color: '#f59e0b', bg: 'rgba(245,158,11,.08)', link: '/dashboard/admin/categories' },
    { icon: Building2, label: 'Departments', value: stats.departments.total, change: stats.departments.change, color: '#8b5cf6', bg: 'rgba(139,92,246,.08)', link: '/dashboard/admin' },
  ];

  return (
    <div className="admin-dash">
      <NavigationMenu userRole="admin" />
      
      <main className="admin-main">
        <div className="container">
          {/* Header */}
          <div className="admin-header">
            <div className="admin-header__bg" />
            <div className="admin-header__content">
              <div>
                <div className="admin-badge">
                  <Shield size={14} />
                  <span>Administrator</span>
                </div>
                <h1>System Overview</h1>
                <p>Monitor and manage your document management system</p>
              </div>
              <div className="admin-header__time">
                <Clock size={16} />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="admin-stats">
            {statCards.map((stat, i) => (
              <Link key={i} to={stat.link} className="admin-stat">
                <div className="admin-stat__icon" style={{ background: stat.bg, color: stat.color }}>
                  <stat.icon size={24} />
                </div>
                <div className="admin-stat__body">
                  <div className="admin-stat__label">{stat.label}</div>
                  <div className="admin-stat__value">{stat.value}</div>
                  {stat.sub && <div className="admin-stat__sub">{stat.sub}</div>}
                  <div className="admin-stat__change">
                    <TrendingUp size={12} />
                    <span>{stat.change} this month</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="admin-grid">
            {/* Recent Documents */}
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Recent Documents</h2>
                  <p>Latest uploads to the system</p>
                </div>
                <Link to="/dashboard/admin" className="admin-link">View All</Link>
              </div>
              
              {recentDocs.length === 0 ? (
                <div className="admin-empty">
                  <FileText size={40} />
                  <p>No documents yet</p>
                </div>
              ) : (
                <div className="admin-list">
                  {recentDocs.map(doc => (
                    <div key={doc.id} className="admin-list-item">
                      <div className="admin-list-icon" style={{ background: 'rgba(0,102,204,.08)', color: '#0066cc' }}>
                        <FileText size={18} />
                      </div>
                      <div className="admin-list-body">
                        <div className="admin-list-title">{doc.title}</div>
                        <div className="admin-list-meta">
                          <span>{categoryMap[doc.categoryId] || 'Unknown'}</span>
                          <span>•</span>
                          <span>{departmentMap[doc.departmentId] || 'Unknown'}</span>
                          <span>•</span>
                          <span>{doc.owner}</span>
                        </div>
                      </div>
                      <div className="admin-list-date">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Users */}
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2>Recent Users</h2>
                  <p>Newest registered accounts</p>
                </div>
                <Link to="/dashboard/admin/users" className="admin-link">View All</Link>
              </div>
              
              {recentUsers.length === 0 ? (
                <div className="admin-empty">
                  <Users size={40} />
                  <p>No users yet</p>
                </div>
              ) : (
                <div className="admin-list">
                  {recentUsers.map(user => (
                    <div key={user.id} className="admin-list-item">
                      <div className="admin-list-avatar">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="admin-list-body">
                        <div className="admin-list-title">{user.name}</div>
                        <div className="admin-list-meta">{user.email}</div>
                      </div>
                      <div className="admin-list-badges">
                        <span className={`badge badge-${user.role === 'admin' ? 'error' : 'primary'}`}>
                          {user.role}
                        </span>
                        <span className={`badge badge-${user.status === 'active' ? 'success' : 'warning'}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="admin-card">
            <div className="admin-card__header">
              <div>
                <h2>System Health</h2>
                <p>Real-time system status and performance</p>
              </div>
              <div className="admin-status">
                <Activity size={14} />
                <span>All Systems Operational</span>
              </div>
            </div>
            
            <div className="admin-health">
              <div className="admin-health-item">
                <div className="admin-health-label">
                  <span>API Gateway</span>
                  <span className="admin-health-value">Healthy</span>
                </div>
                <div className="admin-health-bar">
                  <div className="admin-health-fill" style={{ width: '100%', background: '#10b981' }} />
                </div>
              </div>
              
              <div className="admin-health-item">
                <div className="admin-health-label">
                  <span>Database</span>
                  <span className="admin-health-value">Healthy</span>
                </div>
                <div className="admin-health-bar">
                  <div className="admin-health-fill" style={{ width: '98%', background: '#10b981' }} />
                </div>
              </div>
              
              <div className="admin-health-item">
                <div className="admin-health-label">
                  <span>Storage (S3)</span>
                  <span className="admin-health-value">Healthy</span>
                </div>
                <div className="admin-health-bar">
                  <div className="admin-health-fill" style={{ width: '95%', background: '#10b981' }} />
                </div>
              </div>
              
              <div className="admin-health-item">
                <div className="admin-health-label">
                  <span>Message Queue</span>
                  <span className="admin-health-value">Healthy</span>
                </div>
                <div className="admin-health-bar">
                  <div className="admin-health-fill" style={{ width: '100%', background: '#10b981' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .admin-dash {
          min-height: 100vh;
          background: #f9fafb;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .admin-main {
          padding: 28px 0 48px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .admin-header {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 28px;
        }

        .admin-header__bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
        }

        .admin-header__content {
          position: relative;
          padding: 32px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-header h1 {
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .admin-header p {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.85);
        }

        .admin-header__time {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: white;
          font-size: 13px;
          font-weight: 500;
        }

        /* Stats */
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .admin-stat {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
        }

        .admin-stat:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
          border-color: #d1d5db;
        }

        .admin-stat__icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .admin-stat__body {
          flex: 1;
        }

        .admin-stat__label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .admin-stat__value {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .admin-stat__sub {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 6px;
        }

        .admin-stat__change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #10b981;
          font-weight: 500;
        }

        /* Grid */
        .admin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 28px;
        }

        /* Card */
        .admin-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .admin-card__header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .admin-card__header h2 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2px;
        }

        .admin-card__header p {
          font-size: 12px;
          color: #6b7280;
        }

        .admin-link {
          font-size: 13px;
          font-weight: 600;
          color: #0066cc;
          text-decoration: none;
          transition: color 0.2s;
        }

        .admin-link:hover {
          color: #0052a3;
        }

        .admin-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 100px;
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
        }

        /* List */
        .admin-list {
          padding: 12px;
        }

        .admin-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          transition: background 0.15s;
        }

        .admin-list-item:hover {
          background: #f9fafb;
        }

        .admin-list-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .admin-list-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066cc, #0052a3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }

        .admin-list-body {
          flex: 1;
          min-width: 0;
        }

        .admin-list-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-list-meta {
          font-size: 12px;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .admin-list-date {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
          flex-shrink: 0;
        }

        .admin-list-badges {
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }

        /* Empty */
        .admin-empty {
          text-align: center;
          padding: 48px 24px;
        }

        .admin-empty svg {
          color: #d1d5db;
          margin-bottom: 12px;
        }

        .admin-empty p {
          font-size: 14px;
          color: #6b7280;
        }

        /* Health */
        .admin-health {
          padding: 24px;
          display: grid;
          gap: 20px;
        }

        .admin-health-item {
          display: grid;
          gap: 8px;
        }

        .admin-health-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .admin-health-label > span:first-child {
          font-weight: 600;
          color: #1a1a1a;
        }

        .admin-health-value {
          font-size: 12px;
          color: #10b981;
          font-weight: 600;
        }

        .admin-health-bar {
          height: 8px;
          background: #f3f4f6;
          border-radius: 100px;
          overflow: hidden;
        }

        .admin-health-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.3s ease;
        }

        /* Badges */
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .badge-primary {
          background: rgba(0, 102, 204, 0.08);
          color: #0066cc;
        }

        .badge-success {
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
        }

        .badge-warning {
          background: rgba(245, 158, 11, 0.08);
          color: #f59e0b;
        }

        .badge-error {
          background: rgba(220, 38, 38, 0.08);
          color: #dc2626;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .admin-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .admin-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .admin-stats {
            grid-template-columns: 1fr;
          }

          .admin-header__content {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-header__time {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
