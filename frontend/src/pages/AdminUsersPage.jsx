import { useState, useMemo } from 'react';
import { Users, UserPlus, Search, MoreVertical, Trash2, UserX, Edit2, Shield, Mail, Building2, AlertCircle, X, Plus } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useAppContext } from '../context/AppContext';

export default function AdminUsersPage() {
  const { state, createUser, suspendUsers, deleteUser, loadInitialData } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [selectedUserForDept, setSelectedUserForDept] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '123',
    role: 'user',
    departmentIds: [] // Changed to array for multiple departments
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return state.users;
    const query = searchQuery.toLowerCase();
    return state.users.filter(u => 
      u.name?.toLowerCase().includes(query) || 
      u.email?.toLowerCase().includes(query)
    );
  }, [state.users, searchQuery]);

  const departmentMap = useMemo(() => 
    Object.fromEntries(state.departments.map(d => [d.id, d.name])),
    [state.departments]
  );

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Name and email are required');
      return;
    }

    if (!formData.email.includes('@')) {
      setFormError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create user first
      const newUser = await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password || '123',
        role: formData.role,
        departmentId: null // Don't assign department during creation
      });
      
      // Then assign departments if any selected
      if (formData.departmentIds.length > 0) {
        for (const deptId of formData.departmentIds) {
          const dept = state.departments.find(d => d.id === Number(deptId));
          if (dept) {
            await fetch('/auth/admin/assign-department', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: newUser?.id || (await loadInitialData(), state.users.find(u => u.email === formData.email))?.id,
                departmentId: Number(deptId),
                departmentName: dept.name
              })
            });
          }
        }
      }
      
      setShowCreateModal(false);
      setFormData({ name: '', email: '', password: '123', role: 'user', departmentIds: [] });
      await loadInitialData();
    } catch (error) {
      setFormError('Failed to create user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDepartment = (deptId) => {
    setFormData(prev => ({
      ...prev,
      departmentIds: prev.departmentIds.includes(deptId)
        ? prev.departmentIds.filter(id => id !== deptId)
        : [...prev.departmentIds, deptId]
    }));
  };

  const handleSuspendSelected = async () => {
    if (selectedUsers.length === 0) return;
    if (!confirm(`Suspend ${selectedUsers.length} user(s)?`)) return;
    
    try {
      await suspendUsers(selectedUsers);
      setSelectedUsers([]);
      await loadInitialData();
    } catch (error) {
      alert('Failed to suspend users');
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!confirm('Suspend this user?')) return;
    
    try {
      await suspendUsers([userId]);
      setActiveMenu(null);
      await loadInitialData();
    } catch (error) {
      alert('Failed to suspend user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    
    try {
      await deleteUser(userId);
      setActiveMenu(null);
      await loadInitialData();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleOpenDeptModal = (user) => {
    setSelectedUserForDept(user);
    setShowDeptModal(true);
    setActiveMenu(null);
  };

  const handleAssignDepartment = async (departmentId) => {
    if (!selectedUserForDept) return;
    
    const department = state.departments.find(d => d.id === Number(departmentId));
    if (!department) return;

    try {
      const response = await fetch('/auth/admin/assign-department', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserForDept.id,
          departmentId: Number(departmentId),
          departmentName: department.name
        })
      });

      if (!response.ok) throw new Error('Failed to assign department');
      
      await loadInitialData();
      alert(`Assigned ${selectedUserForDept.name} to ${department.name}`);
    } catch (error) {
      alert('Failed to assign department');
    }
  };

  const handleRemoveDepartment = async (departmentId) => {
    if (!selectedUserForDept) return;
    
    const department = state.departments.find(d => d.id === Number(departmentId));
    if (!confirm(`Remove ${selectedUserForDept.name} from ${department?.name}?`)) return;

    try {
      const response = await fetch(`/auth/admin/remove-department?userId=${selectedUserForDept.id}&departmentId=${departmentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove department');
      
      await loadInitialData();
      // Update the selected user
      const updatedUser = state.users.find(u => u.id === selectedUserForDept.id);
      setSelectedUserForDept(updatedUser);
    } catch (error) {
      alert('Failed to remove department');
    }
  };

  return (
    <div className="admin-users-page">
      <NavigationMenu userRole="admin" />
      
      <main className="admin-main">
        <div className="container">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1>User Management</h1>
              <p>Manage system users, roles, and permissions</p>
            </div>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              <UserPlus size={18} />
              Create User
            </button>
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {selectedUsers.length > 0 && (
              <div className="bulk-actions">
                <span>{selectedUsers.length} selected</span>
                <button className="btn-danger-outline" onClick={handleSuspendSelected}>
                  <UserX size={16} />
                  Suspend
                </button>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="users-card">
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th style={{ width: '60px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        <Users size={40} />
                        <p>No users found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                          />
                        </td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="user-name">{user.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="email-cell">
                            <Mail size={14} />
                            {user.email}
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role === 'admin' && <Shield size={12} />}
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div className="dept-cell">
                            <Building2 size={14} />
                            {user.departments && user.departments.length > 0 
                              ? user.departments.map(d => d.departmentName).join(', ')
                              : user.departmentId 
                                ? (departmentMap[user.departmentId] || 'Unknown')
                                : 'None'}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge status-${user.status}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button 
                              className="action-btn"
                              onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {activeMenu === user.id && (
                              <div className="action-menu">
                                <button onClick={() => handleOpenDeptModal(user)}>
                                  <Building2 size={14} />
                                  Assign Departments
                                </button>
                                <button onClick={() => handleSuspendUser(user.id)}>
                                  <UserX size={14} />
                                  Suspend
                                </button>
                                <button className="danger" onClick={() => handleDeleteUser(user.id)}>
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{state.users.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active</span>
              <span className="stat-value">{state.users.filter(u => u.status === 'active').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Suspended</span>
              <span className="stat-value">{state.users.filter(u => u.status === 'suspended').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Admins</span>
              <span className="stat-value">{state.users.filter(u => u.role === 'admin').length}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Department Assignment Modal */}
      {showDeptModal && selectedUserForDept && (
        <div className="modal-overlay" onClick={() => setShowDeptModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Departments - {selectedUserForDept.name}</h2>
              <button className="modal-close" onClick={() => setShowDeptModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  Current Departments
                </h3>
                {selectedUserForDept.departments && selectedUserForDept.departments.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedUserForDept.departments.map(dept => (
                      <div key={dept.id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building2 size={16} style={{ color: '#8b5cf6' }} />
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                            {dept.departmentName}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveDepartment(dept.departmentId)}
                          style={{
                            padding: '4px 8px',
                            background: 'transparent',
                            border: '1px solid #dc2626',
                            borderRadius: '6px',
                            color: '#dc2626',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#dc2626';
                            e.target.style.color = 'white';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#dc2626';
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                    No departments assigned
                  </p>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  Add Department
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {state.departments
                    .filter(dept => !selectedUserForDept.departments?.some(d => d.departmentId === dept.id))
                    .map(dept => (
                      <button
                        key={dept.id}
                        onClick={() => handleAssignDepartment(dept.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#1a1a1a',
                          textAlign: 'left'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                          e.currentTarget.style.borderColor = '#bfdbfe';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                      >
                        <Plus size={16} style={{ color: '#0066cc' }} />
                        {dept.name}
                        {dept.description && (
                          <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: 'auto' }}>
                            {dept.description}
                          </span>
                        )}
                      </button>
                    ))}
                  {state.departments.filter(dept => !selectedUserForDept.departments?.some(d => d.departmentId === dept.id)).length === 0 && (
                    <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>
                      All departments assigned
                    </p>
                  )}
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button 
                  className="btn-primary"
                  onClick={() => setShowDeptModal(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New User</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            {formError && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}
            
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Default: 123"
                />
                <small>Leave as default or set a custom password</small>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Departments (Select Multiple)</label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '10px',
                  padding: '12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}>
                  {state.departments.map(dept => (
                    <label 
                      key={dept.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#e5e7eb'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input
                        type="checkbox"
                        checked={formData.departmentIds.includes(dept.id)}
                        onChange={() => toggleDepartment(dept.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{dept.name}</span>
                    </label>
                  ))}
                </div>
                <small>Select one or more departments for this user</small>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .admin-users-page {
          min-height: 100vh;
          background: #f9fafb;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .admin-main {
          padding: 28px 0 48px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Header */
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 20px;
          flex-wrap: wrap;
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

        .btn-danger-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          color: #dc2626;
          border: 1px solid #dc2626;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .btn-danger-outline:hover {
          background: #dc2626;
          color: white;
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .search-box svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #1a1a1a;
          font-family: inherit;
        }

        .search-box input::placeholder {
          color: #9ca3af;
        }

        .bulk-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
        }

        .bulk-actions span {
          font-size: 13px;
          font-weight: 600;
          color: #1e40af;
        }

        /* Users Card */
        .users-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .users-table-wrapper {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .users-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .users-table td {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .users-table tbody tr:hover {
          background: #f9fafb;
        }

        .users-table tbody tr:last-child td {
          border-bottom: none;
        }

        .empty-state {
          text-align: center;
          padding: 64px 24px !important;
        }

        .empty-state svg {
          color: #d1d5db;
          margin-bottom: 12px;
        }

        .empty-state p {
          font-size: 14px;
          color: #6b7280;
        }

        /* Table Cells */
        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066cc, #0052a3);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 13px;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .email-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
        }

        .email-cell svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        .dept-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #6b7280;
        }

        .dept-cell svg {
          color: #9ca3af;
          flex-shrink: 0;
        }

        /* Badges */
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .role-admin {
          background: rgba(220, 38, 38, 0.08);
          color: #dc2626;
        }

        .role-user {
          background: rgba(0, 102, 204, 0.08);
          color: #0066cc;
        }

        .status-badge {
          display: inline-flex;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .status-active {
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
        }

        .status-suspended {
          background: rgba(245, 158, 11, 0.08);
          color: #f59e0b;
        }

        /* Actions */
        .actions-cell {
          position: relative;
        }

        .action-btn {
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

        .action-btn:hover {
          background: #f3f4f6;
          color: #1a1a1a;
        }

        .action-menu {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 140px;
          overflow: hidden;
          z-index: 100;
        }

        .action-menu button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: transparent;
          border: none;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background 0.15s;
        }

        .action-menu button:hover {
          background: #f9fafb;
        }

        .action-menu button.danger {
          color: #dc2626;
        }

        .action-menu button.danger:hover {
          background: #fee2e2;
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .stat-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
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
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #1a1a1a;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #0066cc;
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .form-group small {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: #6b7280;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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
        @media (max-width: 1024px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: 100%;
          }

          .stats-row {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
