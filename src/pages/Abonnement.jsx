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

        fetchSubscriptions();
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

    if (loading) return <div className="subscription-container">Chargement en cours...</div>;
    if (error) return <div className="subscription-container">Erreur: {error}</div>;

    return (
        <div className='subscription-container'>
            <header className='subscription-header'>
                <h1>Mes abonnements</h1>
            </header>

            <div className="subscription-grid">
                {subscriptions.map(subscription => (
                    <div key={subscription.id} className={`subscription-card ${subscription.is_active ? 'active' : 'expired'}`}>
                        <div className="card-header">
                            <h3>{subscription.plan.name} - {subscription.plan.nursery.name}</h3>
                            <span className={`badge ${subscription.is_active ? 'active' : 'expired'}`}>
                                {subscription.is_active ? 'Actif' : 'Expiré'}
                            </span>
                        </div>
                        <div className="card-details">
                            <p><strong>Type:</strong> {subscription.plan.duration === 'month' ? 'Mensuel' : 'Hebdomadaire'}</p>
                            <p><strong>Prix:</strong> {subscription.price} FCFA</p>
                            <p><strong>Date début:</strong> {formatDate(subscription.start_date)}</p>
                            <p><strong>Date fin:</strong> {formatDate(subscription.end_date)}</p>
                            <p><strong>Enfants:</strong> {subscription.detail_objects.length}</p>
                        </div>
                        <div className="card-actions">
                            <Link to={`/suivredetails/${subscription.id}`} className="action-link">
                                <button className="btn btn-primary">
                                    Détails
                                </button>
                            </Link>
                            
                            {subscription.is_active ? (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setCurrentSubscription(subscription);
                                        setShowCancelConfirm(true);
                                    }}
                                >
                                    Annuler
                                </button>
                            ) : (<></>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modale de confirmation d'annulation */}
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
                        <div className="menu-buttons">
                            <button
                                onClick={handleCancelSubscription}
                                className="menu-button confirm"
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className="menu-button cancel"
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
            )}

            
        </div>
    )
};

export default Abonnement;