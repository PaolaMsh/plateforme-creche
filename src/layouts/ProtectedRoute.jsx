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

  if (isValid === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{
            marginTop: '20px',
            color: '#3498db',
            fontFamily: 'Arial, sans-serif'
          }}>Vérification en cours...</p>
        </div>
      </div>
    );
  }

  return isValid ? (
    <Outlet />
  ) : (
    <Navigate to="/auth-login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;