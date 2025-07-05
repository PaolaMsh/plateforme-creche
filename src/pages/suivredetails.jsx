import React, { useState, useEffect } from "react";
import '../styles/suivredetails.css';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { FiClock, FiCalendar, FiRefreshCw, FiX, FiCheck, FiInfo } from "react-icons/fi";
import { useAuth } from '../layouts/authContext';
import config from '../config';

const SuivreDetails = () => {
    const { id } = useParams();
    const { getToken } = useAuth();
    const token = getToken();
    const location = useLocation();
    const navigate = useNavigate();

    // États pour les données de l'abonnement
    const [abonnement, setAbonnement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // États pour les modales et actions
    const [showExtensionForm, setShowExtensionForm] = useState(false);
    const [showChangeFormulaForm, setShowChangeFormulaForm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    // États pour la prolongation
    const [duree, setDuree] = useState('');
    const [unite, setUnite] = useState('jours');

    // États pour le changement de formule
    const [newFormula, setNewFormula] = useState('');
    const [availableFormulas, setAvailableFormulas] = useState([]);

    // Charger les données de l'abonnement
    useEffect(() => {
        const fetchAbonnement = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}mysubscriptions/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors du chargement de l\'abonnement');
                }

                const data = await response.json();
                setAbonnement(data);

                // Charger les formules disponibles pour cette crèche
                await fetchAvailableFormulas(data.plan.nursery.id);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        // Si on arrive depuis la page Profil avec les données préchargées
        if (location.state?.abonnement) {
            fetchAbonnement();
        } else {
            fetchAbonnement();
        }
    }, [id, token, location.state]);

    // Fonction pour charger les formules disponibles
    const fetchAvailableFormulas = async (nurseryId) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}nursery/${nurseryId}/plans/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des formules');
            }

            const data = await response.json();
            setAvailableFormulas(data.results);
        } catch (err) {
            console.error(err);
            setAlertType('error');
            setAlertMessage('Erreur lors du chargement des formules disponibles');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };

    // Calculer la date de fin en fonction de la durée et unité
    const calculateEndDate = (startDate, duration, unit) => {
        const date = new Date(startDate);
        switch (unit) {
            case 'heures': date.setHours(date.getHours() + parseInt(duration)); break;
            case 'jours': date.setDate(date.getDate() + parseInt(duration)); break;
            case 'semaines': date.setDate(date.getDate() + (parseInt(duration) * 7)); break;
            case 'mois': date.setMonth(date.getMonth() + parseInt(duration)); break;
            default: break;
        }
        return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    };

    // Gestion de la prolongation
    const handleProlonger = async (e) => {
        e.preventDefault();

        if (!duree || isNaN(duree) || parseInt(duree) <= 0) {
            setAlertType('error');
            setAlertMessage("Veuillez entrer une durée valide");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
            return;
        }

        try {
            // Calculer la nouvelle date de fin
            const currentEndDate = abonnement.end_date || abonnement.start_date;
            const newEndDate = calculateEndDate(currentEndDate, duree, unite);

            // Envoyer la requête PATCH
            const response = await fetch(
                `${config.API_BASE_URL}nursery/${abonnement.plan.nursery.id}/plans/${abonnement.plan.id}/subscriptions/${abonnement.id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        end_date: newEndDate
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Échec de la prolongation');
            }

            // Mettre à jour l'état local
            const updatedAbonnement = { ...abonnement, end_date: newEndDate };
            setAbonnement(updatedAbonnement);

            setAlertType('success');
            setAlertMessage(`Abonnement prolongé jusqu'au ${new Date(newEndDate).toLocaleDateString('fr-FR')}`);
            setShowAlert(true);

            // Réinitialiser le formulaire
            setDuree('');
            setUnite('jours');
            setShowExtensionForm(false);

            setTimeout(() => setShowAlert(false), 6000);
        } catch (error) {
            console.error(error);
            setAlertType('error');
            setAlertMessage("Erreur lors de la prolongation de l'abonnement");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };

    // Gestion du changement de formule
    const handleChangeFormula = async (e) => {
        e.preventDefault();

        if (!newFormula) {
            setAlertType('error');
            setAlertMessage("Veuillez sélectionner une nouvelle formule");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
            return;
        }

        try {
            // Trouver la nouvelle formule sélectionnée
            const selectedFormula = availableFormulas.find(f => f.id.toString() === newFormula);

            if (!selectedFormula) {
                throw new Error('Formule non trouvée');
            }

            // Calculer la nouvelle date de fin en fonction de la durée de la nouvelle formule
            let durationDays;
            switch (selectedFormula.duration) {
                case 'day': durationDays = 1; break;
                case 'week': durationDays = 7; break;
                case 'month': durationDays = 30; break;
                default: durationDays = 1;
            }

            const newEndDate = calculateEndDate(abonnement.start_date, durationDays, 'jours');

            // Envoyer la requête PATCH
            const response = await fetch(
                `${config.API_BASE_URL}nursery/${abonnement.plan.nursery.id}/plans/${abonnement.plan.id}/subscriptions/${abonnement.id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        plan: selectedFormula.id,
                        end_date: newEndDate
                    })
                }
            );

            if (!response.ok) {
                throw new Error('Échec du changement de formule');
            }

            // Mettre à jour l'état local
            const updatedAbonnement = {
                ...abonnement,
                plan: selectedFormula,
                end_date: newEndDate
            };
            setAbonnement(updatedAbonnement);

            setAlertType('success');
            setAlertMessage(`Formule changée à ${selectedFormula.name}`);
            setShowAlert(true);

            // Réinitialiser le formulaire
            setNewFormula('');
            setShowChangeFormulaForm(false);

            setTimeout(() => setShowAlert(false), 6000);
        } catch (error) {
            console.error(error);
            setAlertType('error');
            setAlertMessage("Erreur lors du changement de formule");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    };

    // Formatage de la date
    const formatDate = (dateString) => {
        if (!dateString) return 'Non spécifié';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    // Données des activités (peuvent être récupérées depuis l'API si disponible)
    const activities = [
        {
            time: "7h30-9h00",
            title: "Accueil & Jeux libres",
            items: ["Jeux symboliques", "Jeux de construction", "Lecture autonome"]
        },
        {
            time: "9h-9h30",
            title: "Rituel du matin",
            items: ["Comptines", "Histoires", "Présence et météo"]
        },
        {
            time: "9h30-11h00",
            title: "Ateliers éducatifs",
            items: ["Motricité fine (pâte à modeler)", "Créatif (peinture, collage)", "Sensoriel (jeux d'eau, sable)", "Langagier (marionnettes)"]
        },
        {
            time: "11h00-12h00",
            title: "Repas",
            items: ["Installation", "Repas encadré", "Hygiène post-repas"]
        },
        {
            time: "12h00-15h00",
            title: "Sieste/Temps calme",
            items: ["Coucher personnalisé", "Lecture douce", "Jeux calmes pour les non-dormeurs"]
        },
        {
            time: "15h00-15h30",
            title: "Réveil & Goûter",
            items: ["Réveil échelonné", "Collation", "Hygiène"]
        },
        {
            time: "15h30-16h30",
            title: "Activités de l'après-midi",
            items: ["Jeux extérieurs", "Activité artistique (dessin)", "Jeux symboliques (marchande)"]
        },
        {
            time: "16h30-18h30",
            title: "Jeux libres & Départs",
            items: ["Jeux de société", "Lecture", "Déguisements", "Transmissions aux parents"]
        }
    ];

    if (loading) return <div style={{
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
                borderTop: '5px solid #3f51b5',
                borderRight: '5px solid #3f51b5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
            }} />
            <p style={{
                marginTop: '20px',
                color: '#3f51b5',
                fontFamily: 'Arial, sans-serif',
                fontSize: '1.2rem',
                fontWeight: '500'
            }}>Chargement en cours...</p>
        </div>
    </div>;
    if (error) return <div className="subscription-container main">Erreur: {error}</div>;
    if (!abonnement) return <div className="subscription-container main">Aucun abonnement trouvé</div>;

    const isActive = abonnement.is_active;

    return (
        <div className='subscription-container main'>
            {/* Header Section */}
            <header className="subscription-header">
                <h1>Détails de l'abonnement</h1>
                {!isActive && <p className="inactive-notice" style={{ color: 'red' }}>Cet abonnement n'est plus actif</p>}
                <p className="subtitle">Suivi complet de votre abonnement {isActive ? "et des activités" : ""}</p>
            </header>

            {/* Subscription Info Section */}
            <section className="subscription-info">
                <div className="info-card">
                    <h2>Abonnement #{abonnement.id}</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <FiCalendar className="info-icon" />
                            <div>
                                <h4>Crèche</h4>
                                <p>{abonnement.plan.nursery.name}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <FiClock className="info-icon" />
                            <div>
                                <h4>Période</h4>
                                <p>
                                    Du {formatDate(abonnement.start_date)}<br />
                                    Au {formatDate(abonnement.end_date) || 'Non spécifié'}
                                </p>
                            </div>
                        </div>
                        <div className="info-item">
                            <FiInfo className="info-icon" />
                            <div>
                                <h4>Formule actuelle</h4>
                                <p>{abonnement.plan.name}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <FiInfo className="info-icon" />
                            <div>
                                <h4>Prix</h4>
                                <p>{abonnement.price} FCFA</p>
                            </div>
                        </div>
                        
                        <div className="info-item">
                            <FiInfo className="info-icon" />
                            <div>
                                <h4>Statut</h4>
                                <p>{abonnement.is_active ? 'Actif' : 'Annulé'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Children Section */}
            <section className="children-section">
                <h3>Enfants inscrits</h3>
                <div className="children-list">
                    {abonnement.detail_objects.map((detail, index) => (
                        <div key={index} className="child-card">
                            <div className="child-avatar">
                                {detail.child.first_name[0]}{detail.child.last_name[0]}
                            </div>
                            <div className="child-info">
                                <h4>{detail.child.first_name} {detail.child.last_name}</h4>
                                <p>{calculerAgeEnMois(detail.child.birthday)} mois</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Activities Section - Only shown if subscription is active */}
            {isActive && (
                <section className="activities-section">
                    <h2>Programme de la journée</h2>
                    <div className="timeline">
                        {activities.map((activity, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-time">{activity.time}</div>
                                <div className="timeline-content">
                                    <h3>{activity.title}</h3>
                                    <ul>
                                        {activity.items.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Action Buttons - Only shown if subscription is active */}
            {isActive && (
                <div className="action-buttons">
                    <button
                        className="btn-primary"
                        onClick={() => setShowExtensionForm(true)}
                    >
                        <FiRefreshCw /> Prolonger l'abonnement
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => setShowChangeFormulaForm(true)}
                    >
                        <FiRefreshCw /> Changer de formule
                    </button>
                </div>
            )}

            {/* Extension Form Modal */}
            {showExtensionForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Prolonger l'abonnement</h3>
                            <button className="close-btn" onClick={() => setShowExtensionForm(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleProlonger}>
                                <div className="form-group">
                                    <label>Formule actuelle</label>
                                    <input
                                        type="text"
                                        value={abonnement.plan.name}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date de fin actuelle</label>
                                    <input
                                        type="text"
                                        value={formatDate(abonnement.end_date) || 'Non spécifié'}
                                        readOnly
                                    /></div>
                                <label>Durée de prolongation</label>
                                <div className="duration-input">
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Durée"
                                        value={duree}
                                        onChange={(e) => setDuree(e.target.value)}
                                        required
                                    />
                                    <select value={unite} onChange={(e) => setUnite(e.target.value)}>
                                        <option value="heures">Heures</option>
                                        <option value="jours">Jours</option>
                                        <option value="semaines">Semaines</option>
                                        <option value="mois">Mois</option>
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowExtensionForm(false)}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn-confirm">
                                        Confirmer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Formula Modal */}
            {showChangeFormulaForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Changer de formule</h3>
                            <button className="close-btn" onClick={() => setShowChangeFormulaForm(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleChangeFormula}>
                                <div className="form-group">
                                    <label><strong>Formule actuelle</strong> <br />{abonnement.plan.name}</label>
                                </div>
                                <div className="form-group">
                                    <label><strong>Nouvelle formule</strong></label>
                                    <select
                                        value={newFormula}
                                        onChange={(e) => setNewFormula(e.target.value)}
                                        required
                                    >
                                        <option value="">Sélectionnez une formule</option>
                                        {availableFormulas.map(formula => (
                                            <option key={formula.id} value={formula.id}>
                                                {formula.name} ({formula.price} FCFA)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowChangeFormulaForm(false)}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn-confirm">
                                        Confirmer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Notification */}
            {showAlert && (
                <div className={`alert-notification ${alertType}`}>
                    <div className="alert-content">
                        {alertType === 'success' ? <FiCheck /> : <FiInfo />}
                        <span>{alertMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );

    // Fonction pour calculer l'âge en mois
    function calculerAgeEnMois(dateNaissance) {
        if (!dateNaissance) return 0;
        const naissance = new Date(dateNaissance);
        const aujourdhui = new Date();
        return (aujourdhui.getFullYear() - naissance.getFullYear()) * 12
            + aujourdhui.getMonth() - naissance.getMonth();
    }
};

export default SuivreDetails;