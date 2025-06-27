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

            setSuccess("Inscription réussie !");
            setFormData(initialState);
            setTimeout(() => navigate('/auth-login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’inscription.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Créer un compte</h2>

            {isLoading && <div className="loading-bar"></div>}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <p className="alert alert-success">{success}</p>}

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

                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword1 ? 'text' : 'password'}
                        name="password1"
                        placeholder="Mot de passe"
                        value={formData.password1}
                        onChange={handleChange}
                        required
                        style={{ paddingRight: '45px' }}
                    />
                    <img
                        src={showPassword1 ? '/ouvert.png' : '/fermer.jpg'}
                        alt="ouvert/fermer"
                        onClick={() => setShowPassword1(!showPassword1)}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '10px',
                            transform: 'translateY(-15%)',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer'
                        }}
                        title={showPassword1 ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword2 ? 'text' : 'password'}
                        name="password2"
                        placeholder="Confirmer le mot de passe"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                        style={{ paddingRight: '45px' }}
                    />
                    <img
                        src={showPassword2 ? '/ouvert.png' : '/fermer.jpg'}
                        alt="ouvert/fermer"
                        onClick={() => setShowPassword2(!showPassword2)}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '10px',
                            transform: 'translateY(-15%)',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer'
                        }}
                        title={showPassword2 ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    />
                </div>

                <button className='btn-primary' type="submit" disabled={isLoading}>
                    {isLoading ? "Création du compte..." : "S'inscrire"}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '30px' }}>
                J'ai déjà un compte. <Link to="/auth-login">Se connecter</Link>
            </p>
        </div>
    );
};

export default SignUpForm;

