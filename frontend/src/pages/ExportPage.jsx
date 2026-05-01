import { useState } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useAppContext } from '../context/AppContext';
import { downloadCSV, downloadExcel, formatDocumentsForExport, generateFilename } from '../utils/exportUtils';

export default function ExportPage() {
  const { state } = useAppContext();
  const [exportStatus, setExportStatus] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const myDocuments = state.documents.filter(doc => doc.owner === state.user?.email);

  const doExport = (docs, prefix) => {
    try {
      const data = formatDocumentsForExport(docs, state.categories, state.departments);
      if (!data.length) { setExportStatus({ type: 'error', message: 'No documents to export' }); return; }
      const fn = generateFilename(prefix, selectedFormat);
      selectedFormat === 'csv' ? downloadCSV(data, fn) : downloadExcel(data, fn);
      setExportStatus({ type: 'success', message: `Exported ${data.length} documents to ${selectedFormat.toUpperCase()}` });
      setTimeout(() => setExportStatus(null), 5000);
    } catch { setExportStatus({ type: 'error', message: 'Export failed' }); }
  };

  const formats = [
    { id: 'csv', icon: FileText, label: 'CSV Format', desc: 'Comma-separated values — works with Excel, Sheets, and data tools', color: 'var(--cyan)' },
    { id: 'xls', icon: FileSpreadsheet, label: 'Excel Format', desc: 'Microsoft Excel with formatted tables and styled headers', color: 'var(--ok)' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--g50)' }}>
      <NavigationMenu userRole={state.user?.role || 'user'} />

      <main className="container" style={{ paddingTop: 'var(--s8)', paddingBottom: 'var(--s10)' }}>
        <div style={{ marginBottom: 'var(--s8)' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--s2)' }}>Export Data</h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--g500)' }}>
            Download documents in CSV or Excel format for offline analysis.
          </p>
        </div>

        {exportStatus && (
          <div className={`alert alert-${exportStatus.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 'var(--s5)' }}>
            {exportStatus.type === 'success' ? <CheckCircle size={18} className="alert-icon" /> : <AlertCircle size={18} className="alert-icon" />}
            <div className="alert-content">
              <div className="alert-title">{exportStatus.type === 'success' ? 'Export Complete' : 'Export Failed'}</div>
              <div>{exportStatus.message}</div>
            </div>
          </div>
        )}

        {/* Format Selection */}
        <div className="card" style={{ marginBottom: 'var(--s5)' }}>
          <div className="card-header">
            <h2 className="card-title">Select Format</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--s4)' }}>
            {formats.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFormat(f.id)}
                style={{
                  padding: 'var(--s6)', background: selectedFormat === f.id ? (f.id === 'csv' ? 'var(--cyan-lt)' : 'var(--ok-bg)') : 'var(--white)',
                  border: selectedFormat === f.id ? `2px solid ${f.color}` : '1.5px solid var(--g200)',
                  borderRadius: 'var(--r-lg)', cursor: 'pointer', textAlign: 'center',
                  transition: 'all var(--dur-fast) var(--ease)', fontFamily: 'var(--sans)',
                }}
              >
                <div style={{
                  width: 52, height: 52, margin: '0 auto var(--s4)',
                  background: selectedFormat === f.id ? f.color : 'var(--g100)',
                  color: selectedFormat === f.id ? 'var(--white)' : 'var(--g500)',
                  borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all var(--dur-fast) var(--ease)',
                }}>
                  <f.icon size={26} />
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--s2)' }}>{f.label}</h3>
                <p style={{ color: 'var(--g500)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>{f.desc}</p>
                {selectedFormat === f.id && (
                  <span className={`badge badge-${f.id === 'csv' ? 'primary' : 'success'}`} style={{ marginTop: 'var(--s3)' }}>Selected</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Export Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--s5)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, margin: '0 auto var(--s4)', background: 'var(--cyan-lt)', color: 'var(--cyan)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={26} />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--s3)' }}>All Documents</h3>
            <div style={{ padding: 'var(--s4)', background: 'var(--g50)', borderRadius: 'var(--r-md)', marginBottom: 'var(--s4)', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--s2)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--g500)' }}>Total:</span>
                <span style={{ fontWeight: 600, color: 'var(--g800)' }}>{state.documents.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--s2)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--g500)' }}>Categories:</span>
                <span style={{ fontWeight: 600, color: 'var(--g800)' }}>{state.categories.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--g500)' }}>Departments:</span>
                <span style={{ fontWeight: 600, color: 'var(--g800)' }}>{state.departments.length}</span>
              </div>
            </div>
            <p style={{ color: 'var(--g500)', marginBottom: 'var(--s4)', fontSize: 'var(--text-sm)' }}>
              Export all documents with complete metadata
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => doExport(state.documents, 'documents')} style={{ width: '100%' }} disabled={!state.documents.length}>
              <Download size={18} /> Export All
            </button>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, margin: '0 auto var(--s4)', background: 'var(--ok-bg)', color: 'var(--ok)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={26} />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--s3)' }}>My Documents</h3>
            <div style={{ padding: 'var(--s4)', background: 'var(--g50)', borderRadius: 'var(--r-md)', marginBottom: 'var(--s4)', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--s2)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--g500)' }}>Your docs:</span>
                <span style={{ fontWeight: 600, color: 'var(--g800)' }}>{myDocuments.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: 'var(--g500)' }}>Owner:</span>
                <span style={{ fontWeight: 600, color: 'var(--g800)', fontSize: 'var(--text-xs)' }}>{state.user?.email}</span>
              </div>
            </div>
            <p style={{ color: 'var(--g500)', marginBottom: 'var(--s4)', fontSize: 'var(--text-sm)' }}>
              Export only your uploaded documents
            </p>
            <button className="btn btn-success btn-lg" onClick={() => doExport(myDocuments, 'my_documents')} style={{ width: '100%' }} disabled={!myDocuments.length}>
              <Download size={18} /> Export Mine
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
