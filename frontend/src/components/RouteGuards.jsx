import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects to /login if not logged in, and remembers where the user was headed
export const ProtectedRoute = () => {
  const { userInfo } = useAuth();
  const location = useLocation();

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
};

// Only allows access if the logged-in user has role "admin"
export const AdminRoute = () => {
  const { userInfo, isAdmin } = useAuth();
  const location = useLocation();

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};