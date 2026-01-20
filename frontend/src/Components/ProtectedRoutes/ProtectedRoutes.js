import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem('role');

  if (!role) return <Navigate to="/" />;
  if (allowedRole) {
    if (Array.isArray(allowedRole)) {
      if (!allowedRole.includes(role)) return <Navigate to="/dashboard" />;
    } else {
      if (role !== allowedRole) return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute;
