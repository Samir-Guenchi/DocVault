import { useState } from 'react';
import { Building2, FolderOpen, Plus, Trash2, X, AlertCircle, Settings } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useAppContext } from '../context/AppContext';

export default function AdminSettingsPage() {
  const { state, loadInitialData } = useAppContext();
  const [activeTab, setActiveTab] = useState('departments');
  
  // Department state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', description: '' });
  const [deptError, setDeptError] = useState('');
  const [deptSubmitting, setDeptSubmitting] = useState(false);
  
  // Category state
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [catError, setCatError] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    setDeptError('');
    
    if (!deptForm.name.trim()) {
      setDeptError('Department name is required');
      return;
    }

    setDeptSubmitting(true);
    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: deptForm.name,
          description: deptForm.description
        })
      });

      if (!response.ok) throw new Error('Failed to create department');
      
      setShowDeptModal(false);
      setDeptForm({ name: '', description: '' });
      await loadInitialData();
    } catch (error) {
      setDeptError('Failed to create department. Please try again.');
    } finally {
      setDeptSubmitting(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!confirm('Delete this department? Users assigned to it will need reassignment.')) return;
    
    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete department');
      await loadInitialData();
    } catch (error) {
      alert('Failed to delete department');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatError('');
    
    if (!catForm.name.trim()) {
      setCatError('Category name is required');
      return;
    }

    setCatSubmitting(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: catForm.name,
          description: catForm.description
        })
      });

      if (!response.ok) throw new Error('Failed to create category');
      
      setShowCatModal(false);
      setCatForm({ name: '', description: '' });
      await loadInitialData();
    } catch (error) {
      setCatError('Failed to create category. Please try again.');
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category? Documents using it will need recategorization.')) return;
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete category');
      await loadInitialData();
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  return (
    <div className="admin-settings-page">
      <NavigationMenu userRole="admin" />
      
      <main className="admin-main">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1>System Settings</h1>
              <p>Manage departments, categories, and system configuration</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'departments' ? 'active' : ''}`}
              onClick={() => setActiveTab('departments')}
            >
              <Building2 size={18} />
              Departments
              <span className="tab-count">{state.departments.length}</span>
            </button>
            <button 
              className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <FolderOpen size={18} />
              Categories
              <span className="tab-count">{state.categories.length}</span>
            </button>
          </div>

          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <div className="tab-content">
              <div className="content-header">
                <div>
                  <h2>Departments</h2>
                  <p>Organize users and documents by department</p>
                </div>
                <button className="btn-primary" onClick={() => setShowDeptModal(true)}>
                  <Plus size={18} />
                  Add Department
                </button>
              </div>

              <div className="items-grid">
                {state.departments.map(dept => (
                  <div key={dept.id} className="item-card">
                    <div className="item-icon" style={{ background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6' }}>
                      <Building2 size={24} />
                    </div>
                    <div className="item-body">
                      <h3>{dept.name}</h3>
                      <p>{dept.description || 'No description'}</p>
                      <div className="item-meta">
                        <span>ID: {dept.id}</span>
                      </div>
                    </div>
                    <button 
                      className="item-delete"
                      onClick={() => handleDeleteDepartment(dept.id)}
                      title="Delete department"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                {state.departments.length === 0 && (
                  <div className="empty-state">
                    <Building2 size={48} />
                    <h3>No departments yet</h3>
                    <p>Create your first department to organize users and documents</p>
                    <button className="btn-primary" onClick={() => setShowDeptModal(true)}>
                      <Plus size={18} />
                      Add Department
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="tab-content">
              <div className="content-header">
                <div>
                  <h2>Categories</h2>
                  <p>Classify documents by type or purpose</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCatModal(true)}>
                  <Plus size={18} />
                  Add Category
                </button>
              </div>

              <div className="items-grid">
                {state.categories.map(cat => (
                  <div key={cat.id} className="item-card">
                    <div className="item-icon" style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' }}>
                      <FolderOpen size={24} />
                    </div>
                    <div className="item-body">
                      <h3>{cat.name}</h3>
                      <p>{cat.description || 'No description'}</p>
                      <div className="item-meta">
                        <span>ID: {cat.id}</span>
                      </div>
                    </div>
                    <button 
                      className="item-delete"
                      onClick={() => handleDeleteCategory(cat.id)}
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                
                {state.categories.length === 0 && (
                  <div className="empty-state">
                    <FolderOpen size={48} />
                    <h3>No categories yet</h3>
                    <p>Create your first category to classify documents</p>
                    <button className="btn-primary" onClick={() => setShowCatModal(true)}>
                      <Plus size={18} />
                      Add Category
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Department Modal */}
      {showDeptModal && (
        <div className="modal-overlay" onClick={() => setShowDeptModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Department</h2>
              <button className="modal-close" onClick={() => setShowDeptModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            {deptError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{deptError}</span>
              </div>
            )}
            
            <form onSubmit={handleCreateDepartment}>
              <div className="form-group">
                <label>Department Name *</label>
                <input
                  type="text"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g., Finance, IT, HR"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  placeholder="Brief description of this department"
                  rows="3"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowDeptModal(false)}
                  disabled={deptSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={deptSubmitting}
                >
                  {deptSubmitting ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCatModal && (
        <div className="modal-overlay" onClick={() => setShowCatModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Category</h2>
              <button className="modal-close" onClick={() => setShowCatModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            {catError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{catError}</span>
              </div>
            )}
            
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g., General, Administrative, Training"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Brief description of this category"
                  rows="3"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCatModal(false)}
                  disabled={catSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={catSubmitting}
                >
                  {catSubmitting ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .admin-settings-page {
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
        .page-header {
          margin-bottom: 24px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .page-header p {
          font-size: 14px;
          color: #6b7280;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          color: #6b7280;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .tab:hover {
          color: #1a1a1a;
          background: #f9fafb;
        }

        .tab.active {
          color: #0066cc;
          border-bottom-color: #0066cc;
        }

        .tab-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          background: rgba(0, 102, 204, 0.08);
          color: #0066cc;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
        }

        .tab.active .tab-count {
          background: #0066cc;
          color: white;
        }

        /* Tab Content */
        .tab-content {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .content-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .content-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2px;
        }

        .content-header p {
          font-size: 13px;
          color: #6b7280;
        }

        /* Items Grid */
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .item-card {
          position: relative;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 16px;
          transition: all 0.2s;
        }

        .item-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #d1d5db;
        }

        .item-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-body {
          flex: 1;
          min-width: 0;
        }

        .item-body h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .item-body p {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .item-meta {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: #9ca3af;
          font-weight: 500;
        }

        .item-delete {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s;
          opacity: 0;
        }

        .item-card:hover .item-delete {
          opacity: 1;
        }

        .item-delete:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        /* Empty State */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 64px 24px;
          background: white;
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
        }

        .empty-state svg {
          color: #d1d5db;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        /* Buttons */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .btn-primary:hover {
          background: #0052a3;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .modal-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f3f4f6;
          color: #1a1a1a;
        }

        .modal form {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #1a1a1a;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0066cc;
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          margin: 20px 24px 0;
          font-size: 13px;
        }

        .alert-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .items-grid {
            grid-template-columns: 1fr;
          }

          .content-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .tabs {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}
