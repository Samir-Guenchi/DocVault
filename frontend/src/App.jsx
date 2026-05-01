import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPageBeginner from './pages/LoginPageBeginner';
import UserDashboardBeginner from './pages/UserDashboardBeginner';
import DocumentDetailPageBeginner from './pages/DocumentDetailPageBeginner';
import AdminDashboardBeginner from './pages/AdminDashboardBeginner';
import ExportPage from './pages/ExportPage';
import AdminExportPage from './pages/AdminExportPage';
import DocumentToolsPage from './pages/DocumentToolsPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPageBeginner />} />
      
      {/* User Routes */}
      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboardBeginner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/search"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboardBeginner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/my-documents"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboardBeginner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/export"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <ExportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/tools"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DocumentToolsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/user/documents/:id"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DocumentDetailPageBeginner />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardBeginner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardBeginner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardBeginner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardBeginner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/export"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminExportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/tools"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DocumentToolsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
