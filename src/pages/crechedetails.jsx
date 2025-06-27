import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../layouts/authContext';
import config from '../config';
import '../styles/crechedetails.css';

const DAY_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

const CrecheDetails = () => {
    const { id } = useParams();
    const { getToken } = useAuth();
    const token = getToken();

    const [nursery, setNursery] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);

    // États pour le formulaire de souscription
    const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [children, setChildren] = useState([]);
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [startNow, setStartNow] = useState(true);
    const [loadingChildren, setLoadingChildren] = useState(false);

    const addToast = (message, type = 'error') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const resetForm = () => {
        setSelectedPlan(null);
        setSelectedChildren([]);
        setStartDate(new Date().toISOString().split('T')[0]);
        setStartNow(true);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const [nurseryRes, plansRes] = await Promise.all([
                    fetch(`${config.API_BASE_URL}mynursery/${id}/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${config.API_BASE_URL}nursery/${id}/plans/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (!nurseryRes.ok) throw new Error(`Erreur lors du chargement de la crèche`);
                if (!plansRes.ok) throw new Error(`Erreur lors du chargement des plans`);

                const nurseryData = await nurseryRes.json();
                const plansData = await plansRes.json();

                setNursery(nurseryData);
                setPlans(plansData.results || []);
            } catch (err) {
                addToast(err.message || 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id, token]);

    const handleSubscribeClick = async (plan) => {
        setSelectedPlan(plan);
        setLoadingChildren(true);

        try {
            const response = await fetch(`${config.API_BASE_URL}child/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Erreur lors du chargement des enfants');

            const data = await response.json();
            setChildren(data.results || []);
            setShowSubscriptionForm(true);
        } catch (err) {
            addToast(err.message);
        } finally {
            setLoadingChildren(false);
        }
    };

    const handleChildSelection = (childId) => {
        setSelectedChildren(prev =>
            prev.includes(childId)
                ? prev.filter(id => id !== childId)
                : [...prev, childId]
        );
    };

const handleSubmitSubscription = async (e) => {
    e.preventDefault();

    if (selectedChildren.length === 0) {
        addToast('Veuillez sélectionner au moins un enfant', 'warning');
        return;
    }

    try {
        setLoading(true);

        const startDateValue = startNow
            ? new Date().toISOString().split('T')[0]
            : startDate;

        const payload = {
            start_date: startDateValue,
            details: selectedChildren.map(id => ({ child: id }))
        };

        const response = await fetch(`${config.API_BASE_URL}nursery/${id}/plans/${selectedPlan.id}/subscriptions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || "Erreur lors de la souscription");
        }

        addToast('Souscription réussie !', 'success');
        setShowSubscriptionForm(false);
        resetForm();

    } catch (err) {
        addToast(err.message || 'Une erreur est survenue lors de la souscription');
    } finally {
        setLoading(false);
    }
};


    const handleCancelSubscription = () => {
        setShowSubscriptionForm(false);
        resetForm();
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des informations...</p>
        </div>
    );

    if (!nursery) return null;

    const mediaURL = config.MEDIA_BASE_URL || '';
    const exteriorPhoto = nursery.photo_exterior ? `${mediaURL}${nursery.photo_exterior}` : '/blanc.jpg';
    const interiorPhoto = nursery.photo_interior ? `${mediaURL}${nursery.photo_interior}` : '/blanc.jpg';

    return (
        <div className="creche-details-container">
            {/* Zone de notification des toasts */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            <div className="creche-header">
                <h1 className="creche-title">{nursery.name}</h1>
                <div className="creche-meta">
                    <span className="meta-item">
                        <i className="icon location-icon"></i>
                        {nursery.address}
                    </span>
                    <span className="meta-item">
                        <i className="icon phone-icon"></i>
                        {nursery.contact_number}
                    </span>
                </div>
            </div>

            <section className="photo-gallery">
                <div className="gallery-item">
                    <div className="gallery-label">Vue extérieure</div>
                    <img src={exteriorPhoto} alt="Extérieur de la crèche" className="gallery-image" />
                </div>
                <div className="gallery-item">
                    <div className="gallery-label">Vue intérieure</div>
                    <img src={interiorPhoto} alt="Intérieur de la crèche" className="gallery-image" />
                </div>
            </section>

            <section className="info-section">
                <h2 className="section-title">Présentation</h2>
                <div className="info-card">
                    <p className="description-text">{nursery.information || 'Cette crèche ne dispose pas encore de description.'}</p>

                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Statut juridique</span>
                            <span className="info-value">{nursery.legal_status}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Âge maximum</span>
                            <span className="info-value">{nursery.max_age} mois</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Capacité</span>
                            <span className="info-value">{nursery.max_children_per_class} enfants/classe</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="schedule-section">
                <h2 className="section-title">Horaires d'ouverture</h2>
                <div className="schedule-grid">
                    {nursery.opening_hours.map((h, index) => (
                        <div key={index} className="schedule-item">
                            <span className="day">{DAY_LABELS[h.day]}</span>
                            <span className="hours">
                                {h.is_closed ? 'Fermé' : `${h.open_time?.slice(0, 5)} - ${h.close_time?.slice(0, 5)}`}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="plans-section">
                <h2 className="section-title">Nos formules d'abonnement</h2>

                {plans.length === 0 ? (
                    <div className="no-plans">
                        <p>Aucune formule disponible actuellement.</p>
                    </div>
                ) : (
                    <div className="plans-grid">
                        {plans.map(plan => (
                            <div className="plan-card" key={plan.id}>
                                <div className="plan-header">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <div className="plan-price">
                                        {parseFloat(plan.price).toLocaleString()} FCFA
                                    </div>
                                </div>
                                <div className="plan-duration">{plan.duration}</div>
                                <p className="plan-description">{plan.description}</p>
                                <button
                                    onClick={() => handleSubscribeClick(plan)}
                                    className="subscribe-button"
                                >
                                    Souscrire
                                    <i className="arrow-icon"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {showSubscriptionForm && (
                <div className="subscription-overlay">
                    <div className="subscription-form-container">
                        <button
                            className="close-button"
                            onClick={handleCancelSubscription}
                        >
                            &times;
                        </button>

                        <h2>Souscription à la formule {selectedPlan.name}</h2>

                        <form onSubmit={handleSubmitSubscription}>
                            <div className="form-group">
                                <label>Période de validité:</label>
                                <div>{selectedPlan.duration}</div>
                            </div>

                            <div className="form-group">
                                <label>Début de l'abonnement:</label>
                                <div className='radios'>
                                    <div className='radio'>
                                        <input
                                            type="radio"
                                            id="startNow"
                                            checked={startNow}
                                            onChange={() => setStartNow(true)}
                                        />
                                        <label htmlFor="startNow">
                                            Immédiatement
                                        </label>
                                    </div>
                                    <div className='radio'>
                                        <input
                                            type="radio"
                                            id="startLater"
                                            checked={!startNow}
                                            onChange={() => setStartNow(false)}
                                        />
                                        <label htmlFor="startLater">
                                            À une date ultérieure
                                        </label>
                                    </div>
                                </div>

                                {!startNow && (
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                )}
                            </div>

                            <div className="form-group">
                                <label>Sélectionnez les enfants:</label>
                                {loadingChildren ? (
                                    <p>Chargement des enfants...</p>
                                ) : children.length > 0 ? (
                                    <div className="children-checkboxes">
                                        {children.map(child => (
                                            <div key={child.id} className="child-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`child-${child.id}`}
                                                    checked={selectedChildren.includes(child.id)}
                                                    onChange={() => handleChildSelection(child.id)}
                                                />
                                                <label htmlFor={`child-${child.id}`}>
                                                    {child.first_name} {child.last_name} ({child.age} mois)
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-children-message">
                                        Aucun enfant enregistré. <br />
                                        Veuillez <Link to="/inscrireenfant/0">ajouter un enfant</Link> avant de souscrire.
                                    </p>
                                )}
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleCancelSubscription}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="confirm-button"
                                    disabled={selectedChildren.length === 0 || loading}
                                >
                                    {loading ? 'Traitement...' : 'Confirmer la souscription'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrecheDetails;