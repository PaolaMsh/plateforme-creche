import Header from "../components/headerParent";
import Footer from "../components/footer";
// MainLayout.js
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';




const DefaultLayout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;