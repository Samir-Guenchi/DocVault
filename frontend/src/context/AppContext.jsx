import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

// In dev: points to Gateway on 8080. In Docker: nginx proxies /api to gateway
// When VITE_API_URL is empty string, use empty base (relative URLs)
const API_BASE = import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '' 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.MODE === 'production' ? '' : 'http://localhost:8080');

const AppContext = createContext(null);

const initialState = {
  user: null,
  users: [],
  documents: [],
  departments: [],
  categories: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_BOOTSTRAP_DATA':
      return {
        ...state,
        users: action.payload.users,
        documents: action.payload.documents,
        departments: action.payload.departments,
        categories: action.payload.categories,
      };
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

async function fetchJson(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isReady, setIsReady] = useState(false);
  const [apiError, setApiError] = useState('');

  const loadInitialData = async () => {
    try {
      const [users, documents, departments, categories] = await Promise.all([
        fetchJson('/api/users'),
        fetchJson('/api/documents'),
        fetchJson('/api/departments'),
        fetchJson('/api/categories'),
      ]);

      dispatch({
        type: 'SET_BOOTSTRAP_DATA',
        payload: { users, documents, departments, categories },
      });
      setApiError('');
    } catch (error) {
      setApiError('Cannot reach API. Start backend: docker-compose -f docker-compose-lab10.yml up');
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Server-side login via POST /api/users/login
  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return { ok: false, message: 'Invalid credentials or suspended account.' };
      }

      const user = await res.json();
      dispatch({ type: 'LOGIN', payload: user });
      return { ok: true, user };
    } catch {
      return { ok: false, message: 'Cannot reach authentication server.' };
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  /**
   * Upload document — supports both metadata-only and file upload to S3
   * If a file is provided, uses multipart/form-data to upload to /api/documents/upload
   * Otherwise, sends JSON metadata to /api/documents
   */
  const uploadDocument = async (payload, file) => {
    if (file) {
      // Multipart upload with file → S3
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', payload.title);
      formData.append('description', payload.description || '');
      formData.append('categoryId', payload.categoryId);
      formData.append('departmentId', payload.departmentId);
      formData.append('owner', state.user?.name || 'Unknown');
      formData.append('sensitivity', payload.sensitivity || 'internal');

      const response = await fetch(`${API_BASE}/api/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
    } else {
      // Metadata-only upload (no file)
      const newDoc = {
        title: payload.title,
        description: payload.description,
        categoryId: Number(payload.categoryId),
        departmentId: Number(payload.departmentId),
        owner: state.user?.name || 'Unknown',
        fileType: payload.fileType,
        sizeKb: Number(payload.sizeKb) || 100,
        sensitivity: payload.sensitivity || 'internal',
      };

      await fetchJson('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc),
      });
    }

    await loadInitialData();
  };

  /**
   * Add a comment to a specific document via the Comments Service
   */
  const addCommentToDocument = async (documentId, text) => {
    await fetchJson('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId: Number(documentId),
        user: state.user?.name || 'Anonymous',
        text,
      }),
    });
  };

  /**
   * Fetch comments for a specific document from the Comments Service
   */
  const fetchCommentsForDocument = async (documentId) => {
    try {
      return await fetchJson(`/api/comments?documentId=${documentId}`);
    } catch {
      return [];
    }
  };

  const addVersionToDocument = async (documentId, version, note) => {
    await fetchJson(`/api/documents/${documentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: `${note} (${version})` }),
    });
    await loadInitialData();
  };

  const createUser = async (payload) => {
    await fetchJson('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password || '123',
        role: payload.role || 'user',
        departmentId: Number(payload.departmentId) || 1,
        status: 'active',
      }),
    });
    await loadInitialData();
  };

  const updateUser = async (userId, updates) => {
    await fetchJson(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    await loadInitialData();
  };

  const suspendUsers = async (userIds) => {
    await Promise.all(
      userIds.map((id) =>
        fetchJson(`/api/users/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'suspended' }),
        })
      )
    );
    await loadInitialData();
  };

  const importUsersFromCsvRows = async (rows) => {
    const validRows = rows
      .filter((row) => row.name && row.email)
      .map((row) => ({
        name: row.name,
        email: row.email,
        password: row.password || '123',
        role: row.role === 'admin' ? 'admin' : 'user',
        departmentId: Number(row.departmentId) || 1,
        status: 'active',
      }));

    await Promise.all(
      validRows.map((row) =>
        fetchJson('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(row),
        })
      )
    );
    await loadInitialData();
  };

  const assignDepartment = async (userId, departmentId) => {
    await updateUser(userId, { departmentId: Number(departmentId) });
  };

  const addCategory = async (name) => {
    await fetchJson('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    await loadInitialData();
  };

  const removeCategory = async (id) => {
    await fetchJson(`/api/categories/${id}`, { method: 'DELETE' });
    await loadInitialData();
  };

  const value = useMemo(
    () => ({
      state,
      isReady,
      apiError,
      loadInitialData,
      login,
      logout,
      uploadDocument,
      addCommentToDocument,
      fetchCommentsForDocument,
      addVersionToDocument,
      createUser,
      updateUser,
      suspendUsers,
      importUsersFromCsvRows,
      assignDepartment,
      addCategory,
      removeCategory,
    }),
    [state, isReady, apiError]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}
