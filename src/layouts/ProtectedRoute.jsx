// ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = () => {
  const { token, checkAuth } = useAuth();
  const location = useLocation();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const result = await checkAuth();
      setIsValid(result);
    };
    verify();
  }, [token]);

  if (isValid === null) return <div>Chargement...</div>;

  return isValid ? (
    <Outlet />
  ) : (
    <Navigate to="/auth-login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
