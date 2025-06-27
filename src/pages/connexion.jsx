import React, { useState } from 'react';
import { useAuth } from '../layouts/authContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!formData.username || !formData.password) {
            setError('Veuillez remplir tous les champs.');
            setIsLoading(false);
            return;
        }

        const result = await login({
            username: formData.username,
            password: formData.password
        });

        setIsLoading(false);

        if (result.success) {
            const from = location.state?.from?.pathname || '/accueil'; // <- SEULE MODIFICATION
            navigate(from, { replace: true });
        } else {
            switch (result.status) {
                case 401:
                    setError("Nom d'utilisateur ou mot de passe incorrect.");
                    break;
                case 400:
                    setError("Requête invalide. Vérifiez les champs.");
                    break;
                case 500:
                    setError("Erreur serveur. Veuillez réessayer plus tard.");
                    break;
                default:
                    setError(result.message || "Une erreur s'est produite.");
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Connexion</h2>

            {isLoading && <div className="loading-bar"></div>}
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ paddingRight: '40px' }}
                    />

                    {/* Icône œil ouvert */}
                    <img
                        src="/ouvert.png"
                        alt="ouvert"
                        onClick={() => setShowPassword(true)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-15%)',
                            cursor: 'pointer',
                            width: '24px',
                            height: '24px',
                            userSelect: 'none',
                            display: showPassword ? 'none' : 'block'
                        }}
                        title="Afficher le mot de passe"
                    />

                    {/* Icône œil fermé */}
                    <img
                        src="/fermer.jpg"
                        alt="fermer"
                        onClick={() => setShowPassword(false)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            width: '24px',
                            height: '24px',
                            userSelect: 'none',
                            display: showPassword ? 'block' : 'none',
                        }}
                        title="Masquer le mot de passe"
                    />
                </div>

                <button className='btn-primary' type="submit" disabled={isLoading}>
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                Je n'ai pas de compte. <span style={{ marginLeft: '5px' }}><Link to="/auth-register">S'inscrire</Link></span>
            </p>
            <p style={{ textAlign: 'center', marginTop: '-20px' }}>
                <Link to="/auth-reset">Mot de passe oublié</Link>
            </p>
        </div>
    );
};

export default LoginPage;
