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
            const from = location.state?.from?.pathname || '/accueil';
            navigate(from, { replace: true });
        } else {
            switch (result.status) {
                case 401:
                    setError("Identifiants incorrects. Veuillez réessayer.");
                    break;
                case 400:
                    setError("Requête invalide. Vérifiez les champs.");
                    break;
                default:
                    setError(result.message || "Une erreur s'est produite. Veuillez réessayer.");
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Connexion</h2>

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

                <div className="input-group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <img
                        src={showPassword ? '/eye-off.svg' : '/eye.svg'}
                        className="password-toggle"
                        alt="Toggle password"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    />
                </div>

                <button className="btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="loading-spinner"></span>
                            Connexion...
                        </>
                    ) : "Se connecter"}
                </button>
            </form>

            <div className="auth-links">
                <p>Pas de compte ? <Link to="/auth-register">S'inscrire</Link></p>
                <p><Link to="/auth-reset">Mot de passe oublié ?</Link></p>
            </div>
        </div>
    );
};

export default LoginPage;