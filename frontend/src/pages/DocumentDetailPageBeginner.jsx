import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FileText, ArrowLeft, FolderOpen, Building2, User, HardDrive,
  Lock, History, MessageSquare, Plus, Calendar, Info
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useAppContext } from '../context/AppContext';

export default function DocumentDetailPageBeginner() {
  const { id } = useParams();
  const { state, addCommentToDocument, addVersionToDocument } = useAppContext();
  const [commentText, setCommentText] = useState('');
  const [version, setVersion] = useState('');
  const [versionNote, setVersionNote] = useState('');

  const categoryMap = useMemo(
    () => Object.fromEntries(state.categories.map(c => [c.id, c.name])),
    [state.categories]
  );
  const departmentMap = useMemo(
    () => Object.fromEntries(state.departments.map(d => [d.id, d.name])),
    [state.departments]
  );

  const doc = state.documents.find(d => d.id === Number(id));

  if (!doc) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--g50)' }}>
        <NavigationMenu userRole={state.user?.role || 'user'} />
        <main className="container" style={{ paddingTop: 'var(--s10)' }}>
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={72} /></div>
            <h1 className="empty-state-title">Document Not Found</h1>
            <p className="empty-state-description">The document you're looking for doesn't exist or has been removed.</p>
            <Link to="/dashboard/user" className="btn btn-primary btn-lg">
              <ArrowLeft size={18} /> Back to Documents
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addCommentToDocument(doc.id, commentText.trim());
    setCommentText('');
  };

  const handleVersion = async (e) => {
    e.preventDefault();
    if (!version.trim() || !versionNote.trim()) return;
    await addVersionToDocument(doc.id, version.trim(), versionNote.trim());
    setVersion('');
    setVersionNote('');
  };

  const sensColor = (s) => s === 'public' ? 'success' : s === 'restricted' ? 'error' : 'warning';

  const metaItems = [
    { icon: FolderOpen, label: 'Category', value: categoryMap[doc.categoryId] || 'Unknown' },
    { icon: Building2, label: 'Department', value: departmentMap[doc.departmentId] || 'Unknown' },
    { icon: User, label: 'Owner', value: doc.owner },
    { icon: Calendar, label: 'Created', value: new Date(doc.createdAt).toLocaleDateString() },
    { icon: HardDrive, label: 'Size', value: `${doc.metadata?.sizeKb || 0} KB` },
    { icon: Lock, label: 'Access', value: doc.metadata?.sensitivity || 'Internal' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--g50)' }}>
      <NavigationMenu userRole={state.user?.role || 'user'} />

      <main className="container" style={{ paddingTop: 'var(--s8)', paddingBottom: 'var(--s10)' }}>
        <div style={{ marginBottom: 'var(--s5)' }}>
          <Link to="/dashboard/user" className="btn btn-outline">
            <ArrowLeft size={16} /> Back to Documents
          </Link>
        </div>

        {/* Document Header */}
        <div className="card" style={{ marginBottom: 'var(--s5)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--s4)', marginBottom: 'var(--s5)' }}>
            <div className="document-icon" style={{ width: 56, height: 56, flexShrink: 0 }}>
              <FileText size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', marginBottom: 'var(--s2)' }}>
                <span className="badge badge-primary">{(doc.metadata?.fileType || 'pdf').toUpperCase()}</span>
                <span className={`badge badge-${sensColor(doc.metadata?.sensitivity)}`}>
                  {doc.metadata?.sensitivity || 'internal'}
                </span>
              </div>
              <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--s2)' }}>{doc.title}</h1>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--g600)', lineHeight: 1.65 }}>{doc.description}</p>
            </div>
          </div>

          <div style={{ padding: 'var(--s5)', background: 'var(--g50)', borderRadius: 'var(--r-lg)', border: '1px solid var(--g200)' }}>
            <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--s4)' }}>Document Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--s4)' }}>
              {metaItems.map((m, i) => (
                <div key={i} className="document-meta-item">
                  <m.icon size={16} />
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--g400)', marginBottom: 1 }}>{m.label}</div>
                    <div style={{ fontWeight: 500, color: 'var(--g800)', fontSize: 'var(--text-sm)', textTransform: m.label === 'Access' ? 'capitalize' : 'none' }}>{m.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 'var(--s5)' }}>
          {/* Versions */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
                <History size={18} /> Version History
              </h2>
            </div>

            {(doc.versions || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--s8) var(--s4)' }}>
                <History size={40} style={{ color: 'var(--g300)', marginBottom: 'var(--s3)' }} />
                <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--s2)' }}>No Versions Yet</h3>
                <p style={{ color: 'var(--g500)', fontSize: 'var(--text-sm)' }}>Add the first version below</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)', marginBottom: 'var(--s4)' }}>
                {(doc.versions || []).map((v, i) => (
                  <div key={`${v.version}-${i}`} style={{ padding: 'var(--s4)', background: 'var(--g50)', borderRadius: 'var(--r-md)', border: '1px solid var(--g200)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--cyan)', fontSize: 'var(--text-sm)' }}>{v.version}</span>
                      <span className="badge badge-gray">{v.date}</span>
                    </div>
                    <p style={{ color: 'var(--g600)', fontSize: 'var(--text-sm)', margin: 0 }}>{v.note}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ padding: 'var(--s5)', background: 'var(--cyan-lt)', borderRadius: 'var(--r-lg)', border: '1.5px dashed rgba(11,165,195,.3)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--s3)', display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
                <Plus size={16} /> Add New Version
              </h4>
              <form onSubmit={handleVersion}>
                <div className="form-group">
                  <label className="form-label">Version Number</label>
                  <input className="form-input" placeholder="e.g., v1.1" value={version} onChange={e => setVersion(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Version Notes</label>
                  <input className="form-input" placeholder="What changed?" value={versionNote} onChange={e => setVersionNote(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Plus size={16} /> Add Version
                </button>
              </form>
            </div>
          </div>

          {/* Comments */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
                <MessageSquare size={18} /> Comments
              </h2>
            </div>

            {(doc.comments || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--s8) var(--s4)' }}>
                <MessageSquare size={40} style={{ color: 'var(--g300)', marginBottom: 'var(--s3)' }} />
                <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--s2)' }}>No Comments Yet</h3>
                <p style={{ color: 'var(--g500)', fontSize: 'var(--text-sm)' }}>Be the first to comment</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s3)', marginBottom: 'var(--s4)' }}>
                {(doc.comments || []).map((c, i) => (
                  <div key={`${c.user}-${i}`} style={{ padding: 'var(--s4)', background: 'var(--g50)', borderRadius: 'var(--r-md)', border: '1px solid var(--g200)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--s2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', fontWeight: 600, color: 'var(--cyan)', fontSize: 'var(--text-sm)' }}>
                        <User size={14} /> {c.user}
                      </div>
                      <span className="badge badge-gray">{c.createdAt}</span>
                    </div>
                    <p style={{ color: 'var(--g600)', fontSize: 'var(--text-sm)', margin: 0 }}>{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ padding: 'var(--s5)', background: 'var(--ok-bg)', borderRadius: 'var(--r-lg)', border: '1.5px dashed rgba(22,163,74,.3)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--s3)', display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
                <MessageSquare size={16} /> Add Comment
              </h4>
              <form onSubmit={handleComment}>
                <div className="form-group">
                  <label className="form-label">Your Comment</label>
                  <textarea className="form-textarea" rows="3" placeholder="Share your thoughts…" value={commentText} onChange={e => setCommentText(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
                  <MessageSquare size={16} /> Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
