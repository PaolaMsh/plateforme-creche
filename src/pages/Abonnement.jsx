import '../styles/abonnement.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../layouts/authContext';
import { useState, useEffect } from 'react';
import config from '../config';

const Abonnement = () => {
    const { getToken } = useAuth();
    const token = getToken();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState(null);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}mysubscriptions/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des abonnements');
                }

                const data = await response.json();
                setSubscriptions(data.results);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (token) {
            fetchSubscriptions();
        } else {
            setLoading(false);
        }
    }, [token]);

    const handleCancelSubscription = async () => {
        try {
            const response = await fetch(
                `${config.API_BASE_URL}nursery/${currentSubscription.plan.nursery.id}/plans/${currentSubscription.plan.id}/subscriptions/${currentSubscription.id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ is_active: false }),
                }
            );

            if (!response.ok) {
                throw new Error('Erreur lors de l\'annulation de l\'abonnement');
            }

            setSubscriptions(subscriptions.map(sub =>
                sub.id === currentSubscription.id ? { ...sub, is_active: false } : sub
            ));
            setShowCancelConfirm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Non spécifié';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    if (loading) return (
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
        </div>
    );

    if (error) return <div className="subscription-container">Erreur: {error}</div>;

    return (
        <div className='subscription-container'>
            <header className='subscription-header'>
                <h1>Mes abonnements</h1>
            </header>

            {!token ? (
                <div className="no-subscriptions-message">
                    <p>Veuillez vous connecter pour voir vos abonnements</p>
                    <Link to="/login" className="explore-link">
                        <button className="btn btn-primary">
                            Se connecter
                        </button>
                    </Link>
                </div>
            ) : subscriptions.length === 0 ? (
                <div className="no-subscriptions-message">
                    <p>Vous n'avez actuellement aucun abonnement.</p>
                    <Link to="/creche-garderie" className="explore-link">
                        <button className="btn btn-primary">
                            Explorer les crèches disponibles
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="subscription-grid">
                    {subscriptions.map(subscription => (
                        <div key={subscription.id} className={`subscription-card ${subscription.is_active ? 'active' : 'expired'}`}>
                            <div className="card-header">
                                <h3>{subscription.plan.name} - {subscription.plan.nursery.name}</h3>
                                <span className={`badge ${subscription.is_active ? 'active' : 'expired'}`}>
                                    {subscription.is_active ? 'Actif' : 'Annulé'}
                                </span>
                            </div>
                            <div className="card-details">
                                <p><strong>Type:</strong> {subscription.plan.duration === 'month' ? 'Mensuel' : 'Hebdomadaire'}</p>
                                <p><strong>Prix:</strong> {subscription.price} FCFA</p>
                                <p><strong>Date début:</strong> {formatDate(subscription.start_date)}</p>
                                <p><strong>Date fin:</strong> {formatDate(subscription.end_date)}</p>
                                <p><strong>Nombre Enfants:</strong> {subscription.detail_objects.length}</p>
                            </div>
                            <div className="card-actions">
                                <Link to={`/suivredetails/${subscription.id}`} className="action-link">
                                    <button className="btn btn-primary">
                                        Détails
                                    </button>
                                </Link>
                                {subscription.is_active && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setCurrentSubscription(subscription);
                                            setShowCancelConfirm(true);
                                        }}
                                    >
                                        Annuler
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCancelConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            className="close-button"
                            onClick={() => setShowCancelConfirm(false)}
                        >
                            &times;
                        </button>
                        <p>Êtes-vous sûr de vouloir annuler cet abonnement ?</p>
                        <div className="modal-buttons">
                            <button
                                onClick={handleCancelSubscription}
                                className="btn btn-confirm"
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className="btn btn-cancel"
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Abonnement;