import React, { useState, useEffect } from 'react';
import { useAuth } from '../layouts/authContext';
import config from '../config';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faEdit,
    faSave,
    faEye,
    faTrashAlt,
    faPlusCircle,
    faChild,
    faCalendarAlt,
    faIdCard
} from '@fortawesome/free-solid-svg-icons';
import '../styles/profil.css';

const Profil = () => {
    const { getToken } = useAuth();
    const token = getToken();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        dateNaissance: '',
        email: '',
        telephone: '',
    });

    const [profilId, setProfilId] = useState(null);
    const [activeTab, setActiveTab] = useState('informations');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [enfants, setEnfants] = useState([]);
    const [abonnements, setAbonnements] = useState([]);
    const [messages, setMessages] = useState({
        profil: '',
        enfants: '',
        abonnements: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfil = async () => {
            if (!token) return;

            try {
                const response = await fetch(`${config.API_BASE_URL}profil/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Erreur lors du chargement du profil');

                const data = await response.json();
                if (data.results?.length > 0) {
                    const profil = data.results[0];
                    setProfilId(profil.id);
                    setFormData({
                        nom: profil.user?.last_name || '',
                        prenom: profil.user?.first_name || '',
                        email: profil.user?.email || '',
                        telephone: profil.contact || '',
                        dateNaissance: profil.birthday || '',
                    });
                }
            } catch (error) {
                console.error(error);
                setMessages(prev => ({ ...prev, profil: 'Erreur lors du chargement du profil' }));
            }
        };

        const fetchEnfants = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}child/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Erreur lors de la récupération des enfants');

                const data = await response.json();
                setEnfants(data.results?.map(child => ({
                    id: child.id,
                    nomComplet: `${child.last_name} ${child.first_name}`,
                    age: calculerAgeEnMois(child.birthday) + ' mois',
                    dateInscription: new Date(child.joined_date || child.created_at).toLocaleDateString('fr-FR')
                })) || []);
            } catch (error) {
                console.error(error);
                setMessages(prev => ({ ...prev, enfants: 'Erreur lors du chargement des enfants' }));
            }
        };

        const fetchAbonnements = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}mysubscriptions/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Erreur lors de la récupération des abonnements');

                const data = await response.json();

                const activeAbonnements = data.results.filter(abonnement => abonnement.is_active);

                const formattedAbonnements = activeAbonnements.map(abonnement => ({
                    id: abonnement.id,
                    creche: abonnement.plan.nursery.name,
                    type: abonnement.plan.name,
                    statut: 'Actif',
                    dateDebut: new Date(abonnement.start_date).toLocaleDateString('fr-FR'),
                    dateFin: abonnement.end_date ? new Date(abonnement.end_date).toLocaleDateString('fr-FR') : 'En cours',
                    prix: abonnement.price,
                    nursery_id: abonnement.plan.nursery.id,
                    plan_id: abonnement.plan.id,
                    enfants: abonnement.detail_objects.map(detail => ({
                        id: detail.child.id,
                        nomComplet: `${detail.child.last_name} ${detail.child.first_name}`,
                        age: calculerAgeEnMois(detail.child.birthday) + ' mois'
                    }))
                }));

                setAbonnements(formattedAbonnements);
            } catch (error) {
                console.error(error);
                setMessages(prev => ({ ...prev, abonnements: 'Erreur lors du chargement des abonnements' }));
            }
        };

        fetchProfil();
        fetchEnfants();
        fetchAbonnements();
    }, [token]);

    const calculerAgeEnMois = (dateNaissance) => {
        if (!dateNaissance) return 0;
        const naissance = new Date(dateNaissance);
        const aujourdhui = new Date();
        return (aujourdhui.getFullYear() - naissance.getFullYear()) * 12
            + aujourdhui.getMonth() - naissance.getMonth();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!profilId) return;

        setIsLoading(true);
        try {
            const payload = {
                user: {
                    first_name: formData.prenom,
                    last_name: formData.nom,
                    email: formData.email,
                },
                contact: formData.telephone,
                birthday: formData.dateNaissance,
            };

            const response = await fetch(`${config.API_BASE_URL}profil/${profilId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

            const updatedData = await response.json();

            setFormData(prev => ({
                ...prev,
                nom: updatedData.user?.last_name || prev.nom,
                prenom: updatedData.user?.first_name || prev.prenom,
                email: updatedData.user?.email || prev.email,
                telephone: updatedData.contact || prev.telephone,
                dateNaissance: updatedData.birthday || prev.dateNaissance,
            }));

            setMessages({ ...messages, profil: 'Profil mis à jour avec succès' });
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            setMessages({ ...messages, profil: 'Échec de la mise à jour du profil' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteItem = (item, type) => {
        setItemToDelete({ item, type });
        setShowConfirmDialog(true);
    };

    const confirmDelete = async () => {
        try {
            if (itemToDelete.type === 'enfant') {
                const cliddelet = {
                    existe: 0
                };
                const response = await fetch(`${config.API_BASE_URL}child/${itemToDelete.item.id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cliddelet)
                });

                if (response.ok) {
                    setEnfants(prev => prev.filter(e => e.id !== itemToDelete.item.id));
                    setMessages({ ...messages, enfants: 'Enfant supprimé avec succès' });
                } else {
                    throw new Error('Échec de la suppression');
                }
            } else {
                const abndelet = {
                    is_active: false
                };
                const response = await fetch(
                    `${config.API_BASE_URL}nursery/${itemToDelete.item.nursery_id}/plans/${itemToDelete.item.plan_id}/subscriptions/${itemToDelete.item.id}/`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(abndelet)
                    }
                );

                if (response.ok) {
                    setAbonnements(prev => prev.filter(a => a.id !== itemToDelete.item.id));
                    setMessages({ ...messages, abonnements: 'Abonnement annulé avec succès' });
                } else {
                    throw new Error('Échec de l\'annulation');
                }
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => ({
                ...prev,
                [itemToDelete.type === 'enfant' ? 'enfants' : 'abonnements']: 'Erreur lors de la suppression'
            }));
        } finally {
            setShowConfirmDialog(false);
        }
    };

    const viewDetails = (item, type) => {
        if (type === 'enfant') {
            navigate(`/inscrireenfant/${item.id}`);
        } else {
            navigate(`/suivredetails/${item.id}`, {
                state: {
                    abonnement: item,
                    enfants: item.enfants
                }
            });
        }
    };

    return (
        <div className="profile-container">
            {showConfirmDialog && (
                <div className="confirmation-modal">
                    <div className="modal-content">
                        <h3>Confirmer la suppression</h3>
                        <p>
                            Êtes-vous sûr de vouloir supprimer {itemToDelete?.type === 'enfant' ?
                                `l'enfant ${itemToDelete.item.nomComplet}` :
                                'cet abonnement'} ?
                        </p>
                        <div className="modal-actions">
                            <button onClick={() => setShowConfirmDialog(false)} className="btn-cancel">
                                Annuler
                            </button>
                            <button onClick={confirmDelete} className="btn-confirm">
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-header">
                <div className="avatar-section">
                    <div className="avatar">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="user-info">
                        <h2>{formData.prenom} {formData.nom}</h2>
                        <p>{formData.email}</p>
                    </div>
                </div>

                <div className="profile-actions">
                    {activeTab === 'informations' ? (
                        <button
                            type="submit"
                            form="profile-form"
                            className="btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Enregistrement...' : (
                                <>
                                    <FontAwesomeIcon icon={faSave} /> Enregistrer
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveTab('informations')}
                            className="btn-secondary"
                        >
                            <FontAwesomeIcon icon={faEdit} /> Modifier profil
                        </button>
                    )}
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    className={`tab ${activeTab === 'informations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('informations')}
                >
                    <FontAwesomeIcon icon={faIdCard} /> Informations
                </button>
                <button
                    className={`tab ${activeTab === 'enfants' ? 'active' : ''}`}
                    onClick={() => setActiveTab('enfants')}
                >
                    <FontAwesomeIcon icon={faChild} /> Enfants ({enfants.length})
                </button>
                <button
                    className={`tab ${activeTab === 'abonnements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('abonnements')}
                >
                    <FontAwesomeIcon icon={faCalendarAlt} /> Abonnements ({abonnements.length})
                </button>
            </div>

            <div className="profile-content">

                {activeTab === 'informations' && (
                    <form id="profile-form" onSubmit={handleSubmit} className="info-section">
                        <h3>Informations personnelles</h3>

                        {messages.profil && (
                            <div className={`alert ${messages.profil.includes('succès') ? 'success' : 'error'}`}>
                                {messages.profil}
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Date de naissance</label>
                                <input
                                    type="date"
                                    name="dateNaissance"
                                    value={formData.dateNaissance}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Téléphone</label>
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </form>
                )}

                {activeTab === 'enfants' && (
                    <div className="enfants-section">
                        <div className="section-header">
                            <h3>Mes enfants</h3>
                            <Link to="/inscrireenfant/0" className="btn-primary">
                                <FontAwesomeIcon icon={faPlusCircle} /> Ajouter un enfant
                            </Link>
                        </div>

                        {messages.enfants && (
                            <div className={`alert ${messages.enfants.includes('succès') ? 'success' : 'error'}`}>
                                {messages.enfants}
                            </div>
                        )}

                        {enfants.length > 0 ? (
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nom complet</th>
                                            <th>Âge</th>
                                            <th>Inscrit le</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enfants.map(enfant => (
                                            <tr key={enfant.id}>
                                                <td>{enfant.nomComplet}</td>
                                                <td>{enfant.age}</td>
                                                <td>{enfant.dateInscription}</td>
                                                <td className="actions">
                                                    <button
                                                        onClick={() => viewDetails(enfant, 'enfant')}
                                                        className="btn-icon"
                                                        title="Voir détails"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(enfant, 'enfant')}
                                                        className="btn-icon danger"
                                                        title="Supprimer"
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Aucun enfant inscrit pour le moment</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'abonnements' && (
                    <div className="abonnements-section">
                        <h3>Mes abonnements</h3>

                        {messages.abonnements && (
                            <div className={`alert ${messages.abonnements.includes('succès') ? 'success' : 'error'}`}>
                                {messages.abonnements}
                            </div>
                        )}

                        {abonnements.length > 0 ? (
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Crèche</th>
                                            <th>Type</th>
                                            <th>Statut</th>
                                            <th>Début</th>
                                            <th>Fin</th>
                                            <th>Prix</th>
                                            <th>Enfants</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {abonnements.map(abonnement => (
                                            <tr key={abonnement.id}>
                                                <td>{abonnement.creche}</td>
                                                <td>{abonnement.type}</td>
                                                <td>
                                                    <span className="status-badge actif">
                                                        {abonnement.statut}
                                                    </span>
                                                </td>
                                                <td>{abonnement.dateDebut}</td>
                                                <td>{abonnement.dateFin}</td>
                                                <td>{abonnement.prix} FCFA</td>
                                                <td>
                                                    {abonnement.enfants.map(enfant => (
                                                        <div key={enfant.id}>{enfant.nomComplet} ({enfant.age})</div>
                                                    ))}
                                                </td>
                                                <td className="actions">
                                                    <button
                                                        onClick={() => viewDetails(abonnement, 'abonnement')}
                                                        className="btn-icon"
                                                        title="Voir détails"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(abonnement, 'abonnement')}
                                                        className="btn-icon danger"
                                                        title="Annuler"
                                                    >
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Aucun abonnement actif pour le moment</p>
                                <Link to="/creches" className="btn-primary">
                                    Voir les crèches disponibles
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profil;