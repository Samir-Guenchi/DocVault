import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Upload, Eye, FileText, Building2, FolderOpen,
  User, X, TrendingUp, Filter, Calendar, Tag, AlertCircle, Info, Download
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useAppContext } from '../context/AppContext';

export default function UserDashboardBeginner() {
  const { state, uploadDocument } = useAppContext();
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', categoryId: '', departmentId: '', fileType: 'pdf', sizeKb: '100', sensitivity: 'internal' });

  const catMap = useMemo(() => Object.fromEntries(state.categories.map(c => [c.id, c.name])), [state.categories]);
  const deptMap = useMemo(() => Object.fromEntries(state.departments.map(d => [d.id, d.name])), [state.departments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.documents.filter(d => {
      const mq = !q || (d.title || '').toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q);
      const mc = catFilter === 'all' || Number(catFilter) === Number(d.categoryId);
      const md = deptFilter === 'all' || Number(deptFilter) === Number(d.departmentId);
      return mq && mc && md;
    });
  }, [state.documents, query, catFilter, deptFilter]);

  const myDocs = useMemo(() => state.documents.filter(d => d.owner === state.user?.email), [state.documents, state.user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    await uploadDocument(form, uploadFile);
    setShowUpload(false);
    setUploadFile(null);
    setForm({ title: '', description: '', categoryId: '', departmentId: '', fileType: 'pdf', sizeKb: '100', sensitivity: 'internal' });
  };

  const sensColor = (s) => s === 'public' ? 'success' : s === 'restricted' ? 'error' : 'warning';
  const isFiltered = query || catFilter !== 'all' || deptFilter !== 'all';

  const stats = [
    { icon: FileText, value: state.documents.length, label: 'Total Documents', sub: 'All available', color: '#06b6d4', bg: 'rgba(6,182,212,.08)' },
    { icon: User, value: myDocs.length, label: 'My Documents', sub: 'Uploaded by you', color: '#10b981', bg: 'rgba(16,185,129,.08)' },
    { icon: FolderOpen, value: state.categories.length, label: 'Categories', sub: 'Document types', color: '#f59e0b', bg: 'rgba(245,158,11,.08)' },
    { icon: Building2, value: state.departments.length, label: 'Departments', sub: 'Org. units', color: '#8b5cf6', bg: 'rgba(139,92,246,.08)' },
  ];

  return (
    <div className="dash">
      <NavigationMenu userRole="user" />
      <main className="dash-main">
        <div className="container">
          {/* Welcome */}
          <div className="dash-welcome">
            <div className="dash-welcome__bg" />
            <div className="dash-welcome__content">
              <div>
                <h1>Welcome back, {state.user?.name || 'User'}</h1>
                <p>Manage your documents efficiently and securely</p>
              </div>
              <button className="dash-upload-btn" onClick={() => setShowUpload(true)}>
                <Upload size={18} /> Upload Document
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="dash-stats">
            {stats.map((s, i) => (
              <div key={i} className="dash-stat">
                <div className="dash-stat__icon" style={{ background: s.bg, color: s.color }}>
                  <s.icon size={22} />
                </div>
                <div className="dash-stat__body">
                  <div className="dash-stat__value">{s.value}</div>
                  <div className="dash-stat__label">{s.label}</div>
                  <div className="dash-stat__sub"><TrendingUp size={12} /> {s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="dash-toolbar">
            <div className="dash-search">
              <Search size={18} className="dash-search__icon" />
              <input type="text" placeholder="Search documents by title or description…" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="dash-toolbar__actions">
              <button className={`dash-filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                <Filter size={16} /> Filters
              </button>
              <Link to="/dashboard/user/export" className="dash-export-btn">
                <Download size={16} /> Export
              </Link>
            </div>
          </div>

          {showFilters && (
            <div className="dash-filters">
              <div className="dash-filter-group">
                <label><FolderOpen size={14} /> Category</label>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  <option value="all">All Categories</option>
                  {state.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="dash-filter-group">
                <label><Building2 size={14} /> Department</label>
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                  <option value="all">All Departments</option>
                  {state.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <button className="dash-clear-btn" onClick={() => { setQuery(''); setCatFilter('all'); setDeptFilter('all'); }}>
                <X size={14} /> Clear
              </button>
            </div>
          )}

          {isFiltered && (
            <div className="dash-results-info">
              <Info size={16} />
              <span>Found <strong>{filtered.length}</strong> document{filtered.length !== 1 ? 's' : ''}
                {query && ` matching "${query}"`}
                {catFilter !== 'all' && ` in ${catMap[catFilter]}`}
                {deptFilter !== 'all' && ` from ${deptMap[deptFilter]}`}
              </span>
            </div>
          )}

          {/* Documents */}
          <div className="dash-section-head">
            <h2>{isFiltered ? 'Search Results' : 'All Documents'}</h2>
            <span>{filtered.length} of {state.documents.length}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="dash-empty">
              <FileText size={56} />
              <h3>No Documents Found</h3>
              <p>{isFiltered ? 'Try adjusting your search or filters' : 'Upload your first document to get started'}</p>
              {!isFiltered && (
                <button className="dash-upload-btn" onClick={() => setShowUpload(true)}>
                  <Upload size={18} /> Upload Document
                </button>
              )}
            </div>
          ) : (
            <div className="dash-grid">
              {filtered.map(doc => (
                <div key={doc.id} className="dash-doc">
                  <div className="dash-doc__top">
                    <div className="dash-doc__icon"><FileText size={20} /></div>
                    <div className="dash-doc__badges">
                      <span className="badge badge-primary">{(doc.metadata?.fileType || doc.fileType || 'pdf').toUpperCase()}</span>
                      <span className={`badge badge-${sensColor(doc.metadata?.sensitivity || doc.sensitivity)}`}>
                        {doc.metadata?.sensitivity || doc.sensitivity || 'internal'}
                      </span>
                    </div>
                  </div>
                  <h3 className="dash-doc__title">{doc.title}</h3>
                  <p className="dash-doc__desc">{doc.description}</p>
                  <div className="dash-doc__meta">
                    <span><FolderOpen size={13} /> {catMap[doc.categoryId] || 'Unknown'}</span>
                    <span><Building2 size={13} /> {deptMap[doc.departmentId] || 'Unknown'}</span>
                    <span><User size={13} /> {doc.owner}</span>
                    <span><Calendar size={13} /> {new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link to={`/dashboard/user/documents/${doc.id}`} className="dash-doc__view">
                    <Eye size={16} /> View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Upload New Document</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowUpload(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label form-label-required"><FileText size={15} /> Title</label>
                  <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter document title" required />
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required"><FileText size={15} /> Description</label>
                  <textarea className="form-textarea" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description" required />
                </div>
                <div className="form-group">
                  <label className="form-label"><Upload size={15} /> Attach File (uploaded to S3)</label>
                  <div style={{ border: '2px dashed var(--g300)', borderRadius: 'var(--r-lg)', padding: '16px', textAlign: 'center', background: 'var(--g50)', cursor: 'pointer', transition: 'border-color .2s' }}
                       onClick={() => document.getElementById('file-upload-input').click()}>
                    <input id="file-upload-input" type="file" style={{ display: 'none' }}
                           accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                           onChange={e => { setUploadFile(e.target.files[0]); if (e.target.files[0]) { const name = e.target.files[0].name; const ext = name.includes('.') ? name.split('.').pop() : 'pdf'; setForm(f => ({...f, fileType: ext, sizeKb: Math.round(e.target.files[0].size / 1024).toString() })); } }} />
                    {uploadFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <FileText size={20} style={{ color: 'var(--cyan)' }} />
                        <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{uploadFile.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--g500)' }}>({(uploadFile.size / 1024).toFixed(0)} KB)</span>
                      </div>
                    ) : (
                      <div>
                        <Upload size={28} style={{ color: 'var(--g400)', marginBottom: 6 }} />
                        <p style={{ fontSize: 13, color: 'var(--g500)', margin: 0 }}>Click to select a file (PDF, Word, Excel, etc.)</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required"><FolderOpen size={15} /> Category</label>
                  <select className="form-select" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                    <option value="">Select category</option>
                    {state.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required"><Building2 size={15} /> Department</label>
                  <select className="form-select" value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })} required>
                    <option value="">Select department</option>
                    {state.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label"><Tag size={15} /> File Type</label>
                    <select className="form-select" value={form.fileType} onChange={e => setForm({ ...form, fileType: e.target.value })}>
                      <option value="pdf">PDF</option><option value="docx">Word</option><option value="xlsx">Excel</option><option value="pptx">PowerPoint</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><AlertCircle size={15} /> Sensitivity</label>
                    <select className="form-select" value={form.sensitivity} onChange={e => setForm({ ...form, sensitivity: e.target.value })}>
                      <option value="public">Public</option><option value="internal">Internal</option><option value="restricted">Restricted</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Upload size={16} /> Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
.dash{min-height:100vh;background:var(--g50)}
.dash-main{padding:28px 0 48px}

/* Welcome */
.dash-welcome{position:relative;border-radius:var(--r-xl);overflow:hidden;margin-bottom:28px}
.dash-welcome__bg{position:absolute;inset:0;background:linear-gradient(135deg,#0c1929 0%,#0ba5c3 100%)}
.dash-welcome__content{position:relative;padding:32px 36px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}
.dash-welcome h1{font-size:clamp(20px,2.5vw,28px);font-weight:700;color:#fff;margin-bottom:4px;letter-spacing:-.02em}
.dash-welcome p{font-size:15px;color:rgba(255,255,255,.6)}
.dash-upload-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;background:#fff;color:#0c1929;font-size:14px;font-weight:600;border:none;border-radius:10px;cursor:pointer;font-family:inherit;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.dash-upload-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.2)}

/* Stats */
.dash-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.dash-stat{background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg);padding:20px;display:flex;align-items:flex-start;gap:14px;transition:all .2s}
.dash-stat:hover{box-shadow:var(--sh-md);transform:translateY(-2px)}
.dash-stat__icon{width:44px;height:44px;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.dash-stat__value{font-size:28px;font-weight:700;color:var(--navy);line-height:1;letter-spacing:-.02em}
.dash-stat__label{font-size:13px;font-weight:600;color:var(--g700);margin-top:2px}
.dash-stat__sub{font-size:11px;color:var(--g400);display:flex;align-items:center;gap:4px;margin-top:4px}

/* Toolbar */
.dash-toolbar{display:flex;gap:12px;margin-bottom:16px;align-items:center}
.dash-search{position:relative;flex:1}
.dash-search__icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--g400);pointer-events:none}
.dash-search input{width:100%;padding:10px 14px 10px 42px;background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg);font-size:14px;font-family:inherit;color:var(--g800);transition:all .15s;outline:none}
.dash-search input:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(6,182,212,.08)}
.dash-search input::placeholder{color:var(--g400)}
.dash-toolbar__actions{display:flex;gap:8px}
.dash-filter-btn,.dash-export-btn{display:flex;align-items:center;gap:6px;padding:10px 16px;background:#fff;border:1px solid var(--g200);border-radius:var(--r-md);font-size:13px;font-weight:500;color:var(--g600);cursor:pointer;font-family:inherit;text-decoration:none;transition:all .15s;white-space:nowrap}
.dash-filter-btn:hover,.dash-export-btn:hover{border-color:var(--g300);color:var(--g800)}
.dash-filter-btn.active{background:var(--cyan-lt);border-color:var(--cyan);color:var(--cyan)}

/* Filters */
.dash-filters{display:flex;gap:12px;align-items:flex-end;margin-bottom:16px;padding:16px;background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg)}
.dash-filter-group{flex:1}
.dash-filter-group label{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--g600);margin-bottom:6px}
.dash-filter-group select{width:100%;padding:8px 12px;border:1px solid var(--g200);border-radius:var(--r-md);font-size:13px;font-family:inherit;color:var(--g800);background:#fff;outline:none;transition:border-color .15s}
.dash-filter-group select:focus{border-color:var(--cyan)}
.dash-clear-btn{display:flex;align-items:center;gap:4px;padding:8px 14px;background:var(--g100);border:none;border-radius:var(--r-md);font-size:12px;font-weight:500;color:var(--g600);cursor:pointer;font-family:inherit;white-space:nowrap}

.dash-results-info{display:flex;align-items:center;gap:8px;padding:10px 16px;background:rgba(37,99,235,.05);border:1px solid rgba(37,99,235,.12);border-radius:var(--r-md);font-size:13px;color:#1e40af;margin-bottom:16px}

/* Section Head */
.dash-section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.dash-section-head h2{font-size:18px;font-weight:600;color:var(--navy)}
.dash-section-head span{font-size:13px;color:var(--g500)}

/* Document Grid */
.dash-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.dash-doc{background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg);padding:20px;transition:all .25s;position:relative}
.dash-doc::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:var(--r-lg) 0 0 var(--r-lg);background:linear-gradient(180deg,var(--cyan),#0d9488);opacity:0;transition:opacity .2s}
.dash-doc:hover{box-shadow:var(--sh-lg);transform:translateY(-3px);border-color:var(--cyan)}
.dash-doc:hover::before{opacity:1}
.dash-doc__top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.dash-doc__icon{width:40px;height:40px;border-radius:var(--r-md);background:linear-gradient(135deg,#0c1929,#0ba5c3);color:#fff;display:flex;align-items:center;justify-content:center}
.dash-doc__badges{display:flex;gap:4px}
.dash-doc__title{font-size:15px;font-weight:600;color:var(--navy);margin-bottom:6px;line-height:1.4}
.dash-doc__desc{font-size:13px;color:var(--g500);line-height:1.6;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dash-doc__meta{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding-top:12px;border-top:1px solid var(--g100);margin-bottom:14px}
.dash-doc__meta span{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--g500)}
.dash-doc__meta span svg{color:var(--g400);flex-shrink:0}
.dash-doc__view{display:flex;align-items:center;justify-content:center;gap:6px;padding:8px;background:linear-gradient(135deg,var(--cyan),#088da7);color:#fff;border-radius:var(--r-md);font-size:13px;font-weight:600;text-decoration:none;transition:all .2s}
.dash-doc__view:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(6,182,212,.3);color:#fff}

/* Empty */
.dash-empty{text-align:center;padding:64px 24px;background:#fff;border:1px solid var(--g200);border-radius:var(--r-lg)}
.dash-empty svg{color:var(--g300);margin-bottom:16px}
.dash-empty h3{font-size:18px;font-weight:600;color:var(--navy);margin-bottom:8px}
.dash-empty p{font-size:14px;color:var(--g500);margin-bottom:20px}

@media(max-width:1024px){.dash-stats{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){
  .dash-stats{grid-template-columns:1fr 1fr}
  .dash-toolbar{flex-direction:column}
  .dash-toolbar__actions{width:100%}
  .dash-filters{flex-direction:column}
  .dash-grid{grid-template-columns:1fr}
}
@media(max-width:480px){.dash-stats{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
