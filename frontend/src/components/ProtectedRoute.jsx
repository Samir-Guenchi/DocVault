import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { state } = useAppContext();

  if (!state.user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(state.user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
