import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem('role');

  if (!role) return <Navigate to="/" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
