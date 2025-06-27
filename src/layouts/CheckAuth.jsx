// MainLayout.js
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const { token, checkAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAndRedirect = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            
            const isAuth = await checkAuth();
            if (!isAuth) {
                navigate('/login');
            }
        };

        verifyAndRedirect();
    }, [token, checkAuth, navigate]);

    if (!token) {
        return null; 
    }

    return (
        <main>{children}</main>
    );
};