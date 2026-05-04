import { useState } from 'react';
import { Download, FileText, Users, FolderOpen, Building2, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useAppContext } from '../context/AppContext';
import {
  downloadCSV,
  downloadExcel,
  formatDocumentsForExport,
  formatUsersForExport,
  formatCategoriesForExport,
  formatDepartmentsForExport,
  generateFilename
} from '../utils/exportUtils';

export default function AdminExportPage() {
  const { state } = useAppContext();
  const [exportStatus, setExportStatus] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const handleExport = (type) => {
    try {
      let formattedData;
      let prefix;

      switch (type) {
        case 'documents':
          formattedData = formatDocumentsForExport(state.documents, state.categories, state.departments);
          prefix = 'documents';
          break;
        case 'users':
          formattedData = formatUsersForExport(state.users);
          prefix = 'users';
          break;
        case 'categories':
          formattedData = formatCategoriesForExport(state.categories);
          prefix = 'categories';
          break;
        case 'departments':
          formattedData = formatDepartmentsForExport(state.departments);
          prefix = 'departments';
          break;
        default:
          throw new Error('Invalid export type');
      }

      if (formattedData.length === 0) {
        setExportStatus({ type: 'error', message: `No ${type} to export` });
        return;
      }

      const filename = generateFilename(prefix, selectedFormat);

      if (selectedFormat === 'csv') {
        downloadCSV(formattedData, filename);
      } else {
        downloadExcel(formattedData, filename);
      }

      setExportStatus({ 
        type: 'success', 
        message: `Successfully exported ${formattedData.length} ${type} to ${selectedFormat.toUpperCase()}` 
      });

      setTimeout(() => setExportStatus(null), 5000);
    } catch (error) {
      setExportStatus({ type: 'error', message: `Failed to export ${type}` });
    }
  };

  const exportOptions = [
    {
      type: 'documents',
      icon: <FileText size={32} />,
      title: 'Documents',
      count: state.documents.length,
      description: 'Export all documents with metadata, categories, and departments',
      color: 'blue'
    },
    {
      type: 'users',
      icon: <Users size={32} />,
      title: 'Users',
      count: state.users.length,
      description: 'Export all user accounts with roles and email addresses',
      color: 'green'
    },
    {
      type: 'categories',
      icon: <FolderOpen size={32} />,
      title: 'Categories',
      count: state.categories.length,
      description: 'Export all document categories',
      color: 'orange'
    },
    {
      type: 'departments',
      icon: <Building2 size={32} />,
      title: 'Departments',
      count: state.departments.length,
      description: 'Export all organizational departments',
      color: 'purple'
    }
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: { bg: '#eff6ff', text: '#0066cc' },
      green: { bg: '#f0fdf4', text: '#10b981' },
      orange: { bg: '#fff7ed', text: '#f59e0b' },
      purple: { bg: '#ede9fe', text: '#8b5cf6' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <NavigationMenu userRole="admin" />

      <main className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--space-2)', color: '#1a1a1a', letterSpacing: '-0.5px' }}>
            Admin Data Export
          </h1>
          <p style={{ fontSize: '1.0625rem', color: '#6b7280' }}>
            Export system data in CSV or Excel format for reporting and analysis
          </p>
        </div>

        {/* Status Alert */}
        {exportStatus && (
          <div className={`alert alert-${exportStatus.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: 'var(--space-6)' }}>
            {exportStatus.type === 'success' ? (
              <CheckCircle size={20} className="alert-icon" />
            ) : (
              <AlertCircle size={20} className="alert-icon" />
            )}
            <div className="alert-content">
              <div className="alert-title">
                {exportStatus.type === 'success' ? 'Export Successful' : 'Export Failed'}
              </div>
              <div>{exportStatus.message}</div>
            </div>
          </div>
        )}

        {/* Format Selection */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <h2 className="card-title">Select Export Format</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
            <button
              className={`card ${selectedFormat === 'csv' ? 'document-card' : ''}`}
              onClick={() => setSelectedFormat('csv')}
              style={{
                cursor: 'pointer',
                border: selectedFormat === 'csv' ? '3px solid #0066cc' : '2px solid var(--gray-200)',
                background: selectedFormat === 'csv' ? '#eff6ff' : 'white',
                textAlign: 'center',
                padding: 'var(--space-6)'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto var(--space-4)',
                background: selectedFormat === 'csv' ? '#0066cc' : 'var(--gray-200)',
                color: selectedFormat === 'csv' ? 'white' : 'var(--gray-600)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
                CSV Format
              </h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>
                Universal format for data analysis
              </p>
              {selectedFormat === 'csv' && (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <span className="badge badge-primary">Selected</span>
                </div>
              )}
            </button>

            <button
              className={`card ${selectedFormat === 'xls' ? 'document-card' : ''}`}
              onClick={() => setSelectedFormat('xls')}
              style={{
                cursor: 'pointer',
                border: selectedFormat === 'xls' ? '3px solid #10b981' : '2px solid var(--gray-200)',
                background: selectedFormat === 'xls' ? '#f0fdf4' : 'white',
                textAlign: 'center',
                padding: 'var(--space-6)'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto var(--space-4)',
                background: selectedFormat === 'xls' ? '#10b981' : 'var(--gray-200)',
                color: selectedFormat === 'xls' ? 'white' : 'var(--gray-600)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileSpreadsheet size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--space-2)' }}>
                Excel Format
              </h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem' }}>
                Formatted tables for Excel
              </p>
              {selectedFormat === 'xls' && (
                <div style={{ marginTop: 'var(--space-3)' }}>
                  <span className="badge badge-success">Selected</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {exportOptions.map((option) => {
            const colors = getColorClass(option.color);
            return (
              <div key={option.type} className="card">
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto var(--space-4)',
                  background: colors.bg,
                  color: colors.text,
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {option.icon}
                </div>

                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: 'var(--space-2)', textAlign: 'center' }}>
                  {option.title}
                </h3>
                
                <div style={{ 
                  padding: 'var(--space-4)', 
                  background: 'var(--gray-50)', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-4)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: colors.text, marginBottom: 'var(--space-1)' }}>
                    {option.count}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                    Total {option.title}
                  </div>
                </div>

                <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--space-4)', textAlign: 'center', fontSize: '0.9375rem' }}>
                  {option.description}
                </p>

                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => handleExport(option.type)}
                  style={{ width: '100%' }}
                  disabled={option.count === 0}
                >
                  <Download size={20} />
                  Export {option.title}
                </button>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="card" style={{ marginTop: 'var(--space-8)', background: '#eff6ff', border: '2px solid #0066cc' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--space-4)', color: '#0066cc' }}>
            Admin Export Features
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: 'var(--space-2)', color: 'var(--gray-900)' }}>
                Complete Data Access
              </h4>
              <p style={{ color: 'var(--gray-700)', lineHeight: '1.6' }}>
                As an administrator, you can export all system data including documents, users, categories, and departments.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: 'var(--space-2)', color: 'var(--gray-900)' }}>
                Audit & Compliance
              </h4>
              <p style={{ color: 'var(--gray-700)', lineHeight: '1.6' }}>
                Export data for audit trails, compliance reports, and regulatory requirements.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: 'var(--space-2)', color: 'var(--gray-900)' }}>
                Data Analysis
              </h4>
              <p style={{ color: 'var(--gray-700)', lineHeight: '1.6' }}>
                Use exported data for business intelligence, reporting, and strategic decision-making.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
