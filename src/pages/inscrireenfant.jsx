import '../styles/inscrireenfant.css';
import React, { useState, useEffect } from 'react';
import config from '../config';
import { useAuth } from '../layouts/authContext';
import { useNavigate, useParams, Link } from 'react-router-dom';

const InscrireEnfant = () => {
    const { getToken } = useAuth();
    const token = getToken();
    const navigate = useNavigate();
    const { id } = useParams();
    const enfantId = parseInt(id || '0', 10);

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        age: '',
        particularite: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculerDateNaissance = (ageMois) => {
        const dateNaissance = new Date();
        dateNaissance.setMonth(dateNaissance.getMonth() - parseInt(ageMois));
        return dateNaissance.toISOString().split('T')[0];
    };

    const calculerAgeDepuisDate = (dateStr) => {
        const naissance = new Date(dateStr);
        const maintenant = new Date();
        const ageMois = (maintenant.getFullYear() - naissance.getFullYear()) * 12 + (maintenant.getMonth() - naissance.getMonth());
        return ageMois.toString();
    };

    const chargerEnfant = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}child/${enfantId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFormData({
                    nom: data.last_name || '',
                    prenom: data.first_name || '',
                    age: calculerAgeDepuisDate(data.birthday),
                    particularite: data.detail || ''
                });
            } else {
                setMessage("Impossible de charger les données de l'enfant.");
                setMessageType('error');
            }
        } catch (error) {
            console.error(error);
            setMessage("Erreur réseau.");
            setMessageType('error');
        }
    };

    useEffect(() => {
        if (enfantId !== 0) {
            chargerEnfant();
        }
    }, [enfantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { nom, prenom, age, particularite } = formData;

        if (nom && prenom && age) {
            const birthday = calculerDateNaissance(age);

            const enfant = {
                last_name: nom,
                first_name: prenom,
                birthday: birthday,
                detail: particularite
            };

            try {
                const url = enfantId === 0
                    ? `${config.API_BASE_URL}child/`
                    : `${config.API_BASE_URL}child/${enfantId}/`;

                const method = enfantId === 0 ? 'POST' : 'PUT';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(enfant)
                });

                if (response.ok) {
                    setMessage(enfantId === 0 ? "Inscription réussie !" : "Modifications enregistrées !");
                    setMessageType('success');
                } else {
                    const errorData = await response.json();
                    setMessage("Une erreur est survenue. " + (errorData.detail || ""));
                    setMessageType('error');
                }
            } catch (error) {
                setMessage("Erreur réseau ou serveur.");
                setMessageType('error');
                console.error("Erreur API:", error);
            }
        } else {
            setMessage("⚠️ Veuillez remplir tous les champs obligatoires.");
            setMessageType('error');
        }
    };

    const handleCancel = () => {
        navigate('/Accueil');
    };

    return (
        <div className="inscription-container">
            <div className="header-decoration"></div>

            <div className="content-wrapper">
                <h1>
                    {enfantId === 0 ? (
                        <>
                            <span className="icon"></span> Inscrire mon enfant
                        </>
                    ) : (
                        <>
                            <span className="icon"></span> Modifier les informations de {formData.prenom || "l'enfant"}
                        </>
                    )}
                </h1>

                <div className="card-container">
                    <div className="illustration-side">
                        <div className="illustration-frame">
                            <img src="/incrirenfant.jpg" alt="Inscription enfant" className="child-illustration" />
                        </div>
                        <div className="decoration-element"></div>
                    </div>

                    <div className="form-side">
                        <form onSubmit={handleSubmit} className="enfant-form">
                            <div className="input-group">
                                <label className="floating-label">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    className="floating-input"
                                    required
                                />
                                <div className="input-underline"></div>
                            </div>

                            <div className="input-group">
                                <label className="floating-label">Prénom(s)</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    className="floating-input"
                                    required
                                />
                                <div className="input-underline"></div>
                            </div>

                            <div className="input-group">
                                <label className="floating-label">Âge (en mois)</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="floating-input"
                                    min="0"
                                    max="120"
                                    required
                                />
                                <div className="input-underline"></div>
                            </div>

                            <div className="input-group">
                                <label className="floating-label">Particularités</label>
                                <textarea
                                    name="particularite"
                                    rows="4"
                                    value={formData.particularite}
                                    onChange={handleChange}
                                    className="floating-textarea"
                                />
                                <div className="input-underline"></div>
                            </div>

                            {message && (
                                <div className={`notification ${messageType}`}>
                                    {message}
                                </div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="cancel-button"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="submit-button"
                                >
                                    {enfantId === 0 ? (
                                        <>
                                            Inscrire
                                        </>
                                    ) : (
                                        <>
                                            Enregistrer
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InscrireEnfant;