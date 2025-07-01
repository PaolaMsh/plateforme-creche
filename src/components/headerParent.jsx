import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../layouts/authContext";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/header.css';

const Header = () => {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const menuRef = useRef();

    const handleLogout = () => {
        logout();
        navigate('/accueil');
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
        setShowLogoutConfirm(false);
    };

    const handleAccessProfile = () => {
        navigate('/profil');
        setShowMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
                setShowLogoutConfirm(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header-container">
            <div className="header-content">
                <Link to="/accueil" className="logo-container">
                    <img src="/logo.png" alt="Le Coin des P'tits" className="logo" />
                </Link>

                <nav className="nav-menu">
                    <Link to="/accueil" className={`nav-link ${location.pathname === '/accueil' ? 'active' : ''}`}>
                        Accueil
                    </Link>
                    <Link to="/creche-garderie" className={`nav-link ${location.pathname === '/creche-garderie' ? 'active' : ''}`}>
                        Crèches & Garderies
                    </Link>
                    <Link to="/support" className={`nav-link ${location.pathname === '/support' ? 'active' : ''}`}>
                        Support
                    </Link>
                </nav>

                <div className="auth-section" ref={menuRef}>
                    {!token ? (
                        <div className="auth-buttons">
                            <Link to="/auth-login" className="login-button">
                                Connexion
                            </Link>
                            <Link to="/auth-register" className="register-button">
                                Inscription
                            </Link>
                        </div>
                    ) : (
                        <div className="user-menu-container">
                            <button className="user-menu-trigger" onClick={toggleMenu}>
                                <div className="user-avatar">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className="default-avatar" />
                                    )}
                                </div>
                                {/* <span className="user-name">{user?.name || 'Mon compte'}</span>
                                <FontAwesomeIcon icon={faChevronDown} className={`dropdown-icon ${showMenu ? 'open' : ''}`} /> */}
                            </button>

                            {showMenu && (
                                <div className="user-menu-dropdown">
                                    {!showLogoutConfirm ? (
                                        <>
                                            {!location.pathname.startsWith('/profil') && (
                                                <button onClick={handleAccessProfile} className="menu-item">
                                                    <FontAwesomeIcon icon={faUser} />
                                                    <span>Mon profil</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setShowLogoutConfirm(true)}
                                                className="menu-item logout-item"
                                            >
                                                <FontAwesomeIcon icon={faSignOutAlt} />
                                                <span>Déconnexion</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="logout-confirmation">
                                            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                                            <div className="confirmation-buttons">
                                                <button onClick={handleLogout} className="confirm-button">
                                                    Confirmer
                                                </button>
                                                <button
                                                    onClick={() => setShowLogoutConfirm(false)}
                                                    className="cancel-button"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;