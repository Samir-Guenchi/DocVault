import { useState, useMemo } from 'react';
import {
  Users, FileText, FolderOpen, Building2, Plus, Shield,
  Trash2, Search, BarChart3, TrendingUp, X, Info
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useAppContext } from '../context/AppContext';

export default function AdminDashboardBeginner() {
  const { state, createUser, suspendUsers, addCategory, removeCategory } = useAppContext();
  const [tab, setTab] = useState('overview');
  const [searchQ, setSearchQ] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user', departmentId: '1' });
  const [newCat, setNewCat] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();
    await createUser(newUser);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', password: '', role: 'user', departmentId: '1' });
  };

  const handleAddCat = async (e) => {
    e.preventDefault();
    if (newCat.trim()) { await addCategory(newCat.trim()); setShowAddCat(false); setNewCat(''); }
  };

  const filteredUsers = useMemo(() => {
    if (!searchQ) return state.users;
    const q = searchQ.toLowerCase();
    return state.users.filter(u => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
  }, [state.users, searchQ]);

  const s = useMemo(() => ({
    users: state.users.length,
    docs: state.documents.length,
    cats: state.categories.length,
    depts: state.departments.length,
    admins: state.users.filter(u => u.role === 'admin').length,
    regulars: state.users.filter(u => u.role === 'user').length,
  }), [state]);

  const stats = [
    { icon: Users, value: s.users, label: 'Total Users', sub: `${s.admins} admins, ${s.regulars} users`, color: '#06b6d4', bg: 'rgba(6,182,212,.08)' },
    { icon: FileText, value: s.docs, label: 'Documents', sub: 'All documents', color: '#10b981', bg: 'rgba(16,185,129,.08)' },
    { icon: FolderOpen, value: s.cats, label: 'Categories', sub: 'Classifications', color: '#f59e0b', bg: 'rgba(245,158,11,.08)' },
    { icon: Building2, value: s.depts, label: 'Departments', sub: 'Org. units', color: '#8b5cf6', bg: 'rgba(139,92,246,.08)' },
  ];

  const tabs = [
    { id: 'overview', icon: BarChart3, label: 'Overview' },
    { id: 'users', icon: Users, label: `Users (${s.users})` },
    { id: 'categories', icon: FolderOpen, label: `Categories (${s.cats})` },
  ];

  return (
    <div className="dash">
      <NavigationMenu userRole="admin" />
      <main className="dash-main">
        <div className="container">
          {/* Welcome */}
          <div className="adm-welcome">
            <div className="adm-welcome__bg" />
            <div className="adm-welcome__content">
              <div>
                <div className="adm-welcome__title">
                  <h1>Admin Control Panel</h1>
                  <span className="adm-badge">Administrator</span>
                </div>
                <p>Manage users, categories, and monitor system activity</p>
              </div>
              <div className="adm-welcome__actions">
                <button className="adm-action-btn" onClick={() => { setTab('users'); setShowAddUser(true); }}>
                  <Plus size={16} /> Add User
                </button>
                <button className="adm-action-btn adm-action-btn--ghost" onClick={() => { setTab('categories'); setShowAddCat(true); }}>
                  <Plus size={16} /> Add Category
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="dash-stats">
            {stats.map((st, i) => (
              <div key={i} className="dash-stat">
                <div className="dash-stat__icon" style={{ background: st.bg, color: st.color }}>
                  <st.icon size={22} />
                </div>
                <div className="dash-stat__body">
                  <div className="dash-stat__value">{st.value}</div>
                  <div className="dash-stat__label">{st.label}</div>
                  <div className="dash-stat__sub"><TrendingUp size={12} /> {st.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="adm-tabs">
            {tabs.map(t => (
              <button key={t.id} className={`adm-tab ${tab === t.id ? 'adm-tab--active' : ''}`} onClick={() => setTab(t.id)}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {tab === 'overview' && (
            <div>
              <div className="adm-info">
                <Info size={16} />
                <div><strong>System Operational</strong> — {s.users} users managing {s.docs} documents across {s.cats} categories.</div>
              </div>
              <div className="adm-actions-grid">
                <button className="adm-card-action adm-card-action--cyan" onClick={() => { setTab('users'); setShowAddUser(true); }}>
                  <div className="adm-card-action__icon"><Users size={24} /></div>
                  <h3>Add New User</h3>
                  <p>Create a new user account with role assignment</p>
                </button>
                <button className="adm-card-action adm-card-action--green" onClick={() => { setTab('categories'); setShowAddCat(true); }}>
                  <div className="adm-card-action__icon"><FolderOpen size={24} /></div>
                  <h3>Add Category</h3>
                  <p>Create a new document classification</p>
                </button>
                <button className="adm-card-action adm-card-action--outline" onClick={() => setTab('users')}>
                  <div className="adm-card-action__icon"><Users size={24} /></div>
                  <h3>Manage Users</h3>
                  <p>View, edit, and manage user accounts</p>
                </button>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div>
              <div className="adm-toolbar">
                <div className="dash-search">
                  <Search size={18} className="dash-search__icon" />
                  <input type="text" placeholder="Search users…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddUser(true)}>
                  <Plus size={16} /> Add User
                </button>
              </div>

              <div className="adm-panel">
                <div className="adm-panel__head">
                  <h2>All Users</h2>
                  <span>{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} {searchQ && `matching "${searchQ}"`}</span>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="dash-empty">
                    <Users size={48} />
                    <h3>No Users Found</h3>
                    <p>{searchQ ? 'Try a different search' : 'Add your first user'}</p>
                  </div>
                ) : (
                  <div className="adm-user-list">
                    {filteredUsers.map(u => (
                      <div key={u.id} className="adm-user-row">
                        <div className="adm-user-row__left">
                          <div className="user-avatar" style={{ width: 40, height: 40, fontSize: 14 }}>
                            {(u.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="adm-user-name">{u.name}</div>
                            <div className="adm-user-email">{u.email}</div>
                          </div>
                        </div>
                        <div className="adm-user-row__right">
                          <span className={`badge ${u.role === 'admin' ? 'badge-error' : 'badge-primary'}`}>
                            {(u.role || 'user').toUpperCase()}
                          </span>
                          <span className={`badge ${u.status === 'suspended' ? 'badge-warning' : 'badge-success'}`}>
                            {(u.status || 'active').toUpperCase()}
                          </span>
                          {u.status !== 'suspended' && (
                            <button className="btn btn-danger btn-sm" onClick={() => {
                              if (window.confirm(`Suspend ${u.name}?`)) suspendUsers([u.id]);
                            }}>
                              <Trash2 size={14} /> Suspend
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories */}
          {tab === 'categories' && (
            <div>
              <div className="adm-toolbar">
                <div>
                  <h3 className="adm-toolbar__title">Document Categories</h3>
                  <p className="adm-toolbar__sub">{state.categories.length} categories</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddCat(true)}>
                  <Plus size={16} /> Add Category
                </button>
              </div>
              <div className="adm-cat-grid">
                {state.categories.map(c => (
                  <div key={c.id} className="adm-cat-card">
                    <div className="adm-cat-card__top">
                      <div className="adm-cat-card__icon"><FolderOpen size={20} /></div>
                      <button className="adm-cat-card__del" onClick={() => {
                        if (window.confirm(`Delete "${c.name}"?`)) removeCategory(c.id);
                      }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3>{c.name}</h3>
                    <span>ID: {c.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New User</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddUser(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label form-label-required"><Users size={15} /> Full Name</label>
                  <input className="form-input" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Enter full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required"><Users size={15} /> Email</label>
                  <input className="form-input" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="user@company.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required"><Shield size={15} /> Password</label>
                  <input className="form-input" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="Create password" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label"><Shield size={15} /> Role</label>
                    <select className="form-select" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                      <option value="user">User</option><option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Building2 size={15} /> Department</label>
                    <select className="form-select" value={newUser.departmentId} onChange={e => setNewUser({...newUser, departmentId: e.target.value})}>
                      {state.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddUser(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Plus size={16} /> Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCat && (
        <div className="modal-overlay" onClick={() => setShowAddCat(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Category</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddCat(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddCat}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label form-label-required"><FolderOpen size={15} /> Category Name</label>
                  <input className="form-input" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="e.g., Financial Reports" required />
                  <div className="form-help">Choose a clear, descriptive name</div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddCat(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Plus size={16} /> Add Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
.dash{min-height:100vh;background:var(--g50)}
.dash-main{padding:28px 0 48px}

/* Welcome */
.adm-welcome{position:relative;border-radius:var(--r-xl);overflow:hidden;margin-bottom:28px}
.adm-welcome__bg{position:absolute;inset:0;background:linear-gradient(135deg,#0c1929 0%,#1e3d54 50%,#0ba5c3 100%)}
.adm-welcome__content{position:relative;padding:32px 36px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.adm-welcome__title{display:flex;align-items:center;gap:12px;margin-bottom:6px}
.adm-welcome h1{font-size:clamp(20px,2.5vw,28px);font-weight:700;color:#fff;letter-spacing:-.02em}
.adm-welcome p{font-size:15px;color:rgba(255,255,255,.55)}
.adm-badge{padding:4px 10px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:6px;font-size:11px;font-weight:700;color:#fff;letter-spacing:.5px}
.adm-welcome__actions{display:flex;gap:8px}
.adm-action-btn{display:flex;align-items:center;gap:6px;padding:10px 20px;background:#fff;color:#0c1929;font-size:13px;font-weight:600;border:none;border-radius:10px;cursor:pointer;font-family:inherit;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.adm-action-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.2)}
.adm-action-btn--ghost{background:rgba(255,255,255,.12);color:#fff;box-shadow:none;border:1px solid rgba(255,255,255,.2)}
.adm-action-btn--ghost:hover{background:rgba(255,255,255,.2);box-shadow:none}

/* Stats - reuse from user dashboard */
.dash-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.dash-stat{background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg);padding:20px;display:flex;align-items:flex-start;gap:14px;transition:all .2s}
.dash-stat:hover{box-shadow:var(--sh-md);transform:translateY(-2px)}
.dash-stat__icon{width:44px;height:44px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.dash-stat__value{font-size:28px;font-weight:700;color:var(--navy);line-height:1;letter-spacing:-.02em}
.dash-stat__label{font-size:13px;font-weight:600;color:var(--g700);margin-top:2px}
.dash-stat__sub{font-size:11px;color:var(--g400);display:flex;align-items:center;gap:4px;margin-top:4px}

/* Tabs */
.adm-tabs{display:flex;gap:4px;padding:4px;background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg);margin-bottom:24px}
.adm-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 16px;background:transparent;border:none;border-radius:var(--r-md);font-size:13px;font-weight:500;color:var(--g600);cursor:pointer;font-family:inherit;transition:all .15s}
.adm-tab:hover{background:var(--g50);color:var(--g800)}
.adm-tab--active{background:var(--cyan);color:#fff;box-shadow:0 1px 3px rgba(6,182,212,.2)}

/* Info */
.adm-info{display:flex;align-items:center;gap:10px;padding:14px 18px;background:rgba(37,99,235,.05);border:1px solid rgba(37,99,235,.12);border-radius:var(--r-md);font-size:13px;color:#1e40af;margin-bottom:20px}

/* Action Cards */
.adm-actions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.adm-card-action{display:flex;flex-direction:column;align-items:flex-start;padding:24px;background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg);cursor:pointer;font-family:inherit;text-align:left;transition:all .25s}
.adm-card-action:hover{transform:translateY(-3px);box-shadow:var(--sh-lg)}
.adm-card-action__icon{width:48px;height:48px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;margin-bottom:16px}
.adm-card-action--cyan{border-color:rgba(6,182,212,.2)}
.adm-card-action--cyan .adm-card-action__icon{background:rgba(6,182,212,.08);color:#06b6d4}
.adm-card-action--green{border-color:rgba(16,185,129,.2)}
.adm-card-action--green .adm-card-action__icon{background:rgba(16,185,129,.08);color:#10b981}
.adm-card-action--outline .adm-card-action__icon{background:var(--g100);color:var(--g600)}
.adm-card-action h3{font-size:15px;font-weight:600;color:var(--navy);margin-bottom:6px}
.adm-card-action p{font-size:13px;color:var(--g500);line-height:1.5;border:none;background:none}

/* Toolbar */
.adm-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px;flex-wrap:wrap}
.adm-toolbar__title{font-size:18px;font-weight:600;color:var(--navy)}
.adm-toolbar__sub{font-size:13px;color:var(--g500)}

/* Panel */
.adm-panel{background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg);overflow:hidden}
.adm-panel__head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--g200)}
.adm-panel__head h2{font-size:16px;font-weight:600;color:var(--navy)}
.adm-panel__head span{font-size:13px;color:var(--g500)}

/* User List */
.adm-user-list{display:flex;flex-direction:column}
.adm-user-row{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--g100);transition:background .15s}
.adm-user-row:last-child{border-bottom:none}
.adm-user-row:hover{background:var(--g50)}
.adm-user-row__left{display:flex;align-items:center;gap:12px}
.adm-user-name{font-weight:600;font-size:14px;color:var(--g800)}
.adm-user-email{font-size:12px;color:var(--g500)}
.adm-user-row__right{display:flex;align-items:center;gap:8px}

/* Category Grid */
.adm-cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.adm-cat-card{background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg);padding:20px;transition:all .25s}
.adm-cat-card:hover{box-shadow:var(--sh-md);transform:translateY(-2px)}
.adm-cat-card__top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.adm-cat-card__icon{width:40px;height:40px;border-radius:var(--r-md);background:rgba(245,158,11,.08);color:#f59e0b;display:flex;align-items:center;justify-content:center}
.adm-cat-card__del{background:none;border:none;color:var(--g400);cursor:pointer;padding:4px;border-radius:var(--r-sm);transition:all .15s}
.adm-cat-card__del:hover{color:#dc2626;background:rgba(220,38,38,.06)}
.adm-cat-card h3{font-size:16px;font-weight:600;color:var(--navy);margin-bottom:4px}
.adm-cat-card span{font-size:12px;color:var(--g400)}

/* Empty & Search reuse from user dash */
.dash-empty{text-align:center;padding:48px 24px}
.dash-empty svg{color:var(--g300);margin-bottom:12px}
.dash-empty h3{font-size:16px;font-weight:600;color:var(--navy);margin-bottom:6px}
.dash-empty p{font-size:13px;color:var(--g500)}
.dash-search{position:relative;flex:1;min-width:240px}
.dash-search__icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--g400);pointer-events:none}
.dash-search input{width:100%;padding:10px 14px 10px 42px;background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg);font-size:14px;font-family:inherit;color:var(--g800);transition:all .15s;outline:none}
.dash-search input:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(6,182,212,.08)}

@media(max-width:1024px){.dash-stats{grid-template-columns:repeat(2,1fr)}.adm-actions-grid{grid-template-columns:1fr}}
@media(max-width:768px){.dash-stats{grid-template-columns:1fr 1fr}.adm-tabs{flex-direction:column}.adm-toolbar{flex-direction:column;align-items:stretch}}
      `}</style>
    </div>
  );
}
