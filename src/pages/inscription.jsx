import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import axios from 'axios';
import '../styles/auth.css';

const SignUpForm = () => {
    const initialState = {
        username: '',
        email: '',
        contact: '',
        password1: '',
        password2: '',
    };

    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
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
        setSuccess('');
        setIsLoading(true);

        if (formData.password1 !== formData.password2) {
            setError("Les mots de passe ne correspondent pas.");
            setIsLoading(false);
            return;
        }

        try {
            await axios.post(
                `${config.API_BASE_URL}register/`,
                {
                    'user': {
                        'username': formData.username,
                        'email': formData.email,
                        'password': formData.password1,
                    },
                    'contact': formData.contact,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccess("Inscription réussie ! Redirection en cours...");
            setFormData(initialState);
            setTimeout(() => navigate('/auth-login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l\'inscription. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Créer un compte</h2>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Adresse email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="contact"
                    placeholder="Numéro de contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                />

                <div className="input-group">
                    <input
                        type={showPassword1 ? 'text' : 'password'}
                        name="password1"
                        placeholder="Mot de passe"
                        value={formData.password1}
                        onChange={handleChange}
                        required
                    />
                    <img
                        src={showPassword1 ? '/eye-off.svg' : '/eye.svg'}
                        className="password-toggle"
                        alt="Toggle password"
                        onClick={() => setShowPassword1(!showPassword1)}
                        title={showPassword1 ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    />
                </div>

                <div className="input-group">
                    <input
                        type={showPassword2 ? 'text' : 'password'}
                        name="password2"
                        placeholder="Confirmer le mot de passe"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                    />
                    <img
                        src={showPassword2 ? '/eye-off.svg' : '/eye.svg'}
                        className="password-toggle"
                        alt="Toggle password"
                        onClick={() => setShowPassword2(!showPassword2)}
                        title={showPassword2 ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    />
                </div>

                <button className="btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="loading-spinner"></span>
                            Création en cours...
                        </>
                    ) : "S'inscrire"}
                </button>
            </form>

            <div className="auth-links">
                <p>Déjà un compte ? <Link to="/auth-login">Se connecter</Link></p>
            </div>
        </div>
    );
};

export default SignUpForm;