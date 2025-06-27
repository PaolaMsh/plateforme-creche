import React, { useState } from 'react';
import {
    FaBabyCarriage,
    FaArrowLeft,
    FaArrowRight,
    FaCheck,
    FaCloudUploadAlt,
    FaRegClock,
    FaRegFileAlt,
    FaCheckCircle
} from 'react-icons/fa';
import '../styles/ajoutcreche.css';
import config from '../config';
import { useAuth } from '../layouts/authContext';

const NurseryForm = () => {
    const { getToken } = useAuth();
    const token = getToken();
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        name: 'Crèche ABC',
        address: '123 Rue Exemple',
        contact_number: '0123456789',
        information: 'Informations diverses',
        max_age: 36,
        max_children_per_class: 12,
        legal_status: 'agrée',
        agreement_document: null,
        id_card_document: null,
        photo_exterior: null,
        photo_interior: null
    });

    const [openingHours, setOpeningHours] = useState([
        { day: 0, name: 'Lundi', open: '08:00', close: '18:00', closed: false },
        { day: 1, name: 'Mardi', open: '08:00', close: '18:00', closed: false },
        { day: 2, name: 'Mercredi', open: '08:00', close: '18:00', closed: false },
        { day: 3, name: 'Jeudi', open: '08:00', close: '18:00', closed: false },
        { day: 4, name: 'Vendredi', open: '08:00', close: '18:00', closed: false },
        { day: 5, name: 'Samedi', open: '', close: '', closed: true },
        { day: 6, name: 'Dimanche', open: '', close: '', closed: true }
    ]);

    const [fileNames, setFileNames] = useState({
        agreement_document: 'Aucun fichier sélectionné',
        id_card_document: 'Aucun fichier sélectionné',
        photo_exterior: 'Aucun fichier sélectionné',
        photo_interior: 'Aucun fichier sélectionné'
    });

    const handleInputChange = e => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]:
                id === 'max_age' || id === 'max_children_per_class'
                    ? parseInt(value, 10)
                    : value
        }));
    };

    const handleFileUpload = (field, e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
            setFileNames(prev => ({ ...prev, [field]: file.name }));
        }
    };

    const handleTimeChange = (index, field, value) => {
        const hours = [...openingHours];
        hours[index] = { ...hours[index], [field]: value };
        setOpeningHours(hours);
    };

    const handleDayClosed = (index, isClosed) => {
        const hours = [...openingHours];
        hours[index] = {
            ...hours[index],
            closed: isClosed,
            open: isClosed ? '' : '08:00',
            close: isClosed ? '' : '18:00'
        };
        setOpeningHours(hours);
    };

    const goToStep = step => setCurrentStep(step);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1️⃣ Création de la crèche (multipart/form-data sans opening_hours)
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('address', formData.address);
        fd.append('contact_number', formData.contact_number);
        fd.append('information', formData.information || '');
        fd.append('max_age', String(formData.max_age));
        fd.append('max_children_per_class', String(formData.max_children_per_class));
        fd.append('legal_status', formData.legal_status);

        ['agreement_document', 'id_card_document', 'photo_exterior', 'photo_interior']
            .forEach(key => {
                if (formData[key]) {
                    fd.append(key, formData[key]);
                }
            });

        let res1;
        try {
            res1 = await fetch(`${config.API_BASE_URL}nursery/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: fd
            });
        } catch (err) {
            console.error('Erreur réseau création crèche :', err);
            return alert('Erreur réseau lors de la création de la crèche.');
        }

        if (!res1.ok) {
            const err1 = await res1.json();
            console.error('Erreur API création crèche :', err1);
            return alert('Échec création crèche :\n' + JSON.stringify(err1, null, 2));
        }

        const { id } = await res1.json();

        // 2️⃣ Envoi des horaires (application/json)
        const openingHoursData = openingHours.map(day => {
            const d = parseInt(day.day, 10);
            const open = (day.open || '').trim();
            const close = (day.close || '').trim();
            const closed = day.closed || !open || !close;
            return {
                day: isNaN(d) ? null : d,
                open_time: closed ? null : `${open}:00`,
                close_time: closed ? null : `${close}:00`,
                is_closed: closed
            };
        });

        let res2;
        try {
            res2 = await fetch(
                `${config.API_BASE_URL}nursery/${id}/opening-hours/`,
                {
                    method: 'PUT', // ou 'POST' la première fois
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(openingHoursData)
                }
            );
        } catch (err) {
            console.error('Erreur réseau envoi horaires :', err);
            return alert('Erreur réseau lors de l’envoi des horaires.');
        }

        if (!res2.ok) {
            const err2 = await res2.json();
            console.error('Erreur API envoi horaires :', err2);
            return alert('Échec envoi horaires :\n' + JSON.stringify(err2, null, 2));
        }

        alert('Crèche et horaires enregistrés avec succès !');
    };


    return (
        <>
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <div className="container">
                <div className="form-container">
                    <div className="form-header">
                        <h2>
                            <FaBabyCarriage className="me-2" /> Inscrire ma crèche
                        </h2>
                    </div>
                    <div className="form-steps">
                        {[1, 2, 3, 4].map(step => (
                            <div
                                key={step}
                                className={`step ${currentStep === step
                                    ? 'active'
                                    : currentStep > step
                                        ? 'completed'
                                        : ''
                                    }`}
                                data-step={step}
                            >
                                <div className="step-number">{step}</div>
                                <div className="step-title">
                                    {step === 1 && 'Informations de la crèche'}
                                    {step === 2 && "Horaires d'ouverture"}
                                    {step === 3 && 'Documents'}
                                    {step === 4 && 'Validation'}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} id="nurseryForm" className="form-body" >
                        {/* Étape 1 */}
                        <div
                            className={`form-step ${currentStep === 1 ? 'active' : ''
                                }`}
                        >
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Nom de la crèche
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="address" className="form-label">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        className="form-control"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="contact_number"
                                        className="form-label"
                                    >
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        id="contact_number"
                                        className="form-control"
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="max_age" className="form-label">
                                        Âge max (mois)
                                    </label>
                                    <input
                                        type="number"
                                        id="max_age"
                                        className="form-control"
                                        value={formData.max_age}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="max_children_per_class"
                                        className="form-label"
                                    >
                                        Enfants max/classe
                                    </label>
                                    <input
                                        type="number"
                                        id="max_children_per_class"
                                        className="form-control"
                                        value={formData.max_children_per_class}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label
                                        htmlFor="legal_status"
                                        className="form-label"
                                    >
                                        Statut légal
                                    </label>
                                    <select
                                        id="legal_status"
                                        className="form-select"
                                        value={formData.legal_status}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="agrée">Agréée</option>
                                        <option value="declared">Déclarée</option>
                                        <option value="municipal">Municipale</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="information"
                                    className="form-label"
                                >
                                    Informations complémentaires
                                </label>
                                <textarea
                                    id="information"
                                    className="form-control"
                                    rows="4"
                                    value={formData.information}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-actions text-end">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => goToStep(2)}
                                >
                                    Suivant <FaArrowRight className="ms-1" />
                                </button>
                            </div>
                        </div>

                        {/* Étape 2 */}
                        <div
                            className={`form-step ${currentStep === 2 ? 'active' : ''
                                }`}
                        >
                            <h4 className="mb-4">
                                <FaRegClock className="me-2" />
                                Horaires d'ouverture
                            </h4>
                            {openingHours.map((day, idx) => (
                                <div
                                    key={day.day}
                                    className="d-flex align-items-center mb-3"
                                >
                                    <span className="me-3" style={{ width: '80px' }}>
                                        {day.name}
                                    </span>
                                    <input
                                        type="time"
                                        className="form-control me-2"
                                        value={day.open}
                                        onChange={e =>
                                            handleTimeChange(idx, 'open', e.target.value)
                                        }
                                        disabled={day.closed}
                                    />
                                    <input
                                        type="time"
                                        className="form-control me-2"
                                        value={day.close}
                                        onChange={e =>
                                            handleTimeChange(idx, 'close', e.target.value)
                                        }
                                        disabled={day.closed}
                                    />
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`closed-${day.day}`}
                                            checked={day.closed}
                                            onChange={e =>
                                                handleDayClosed(idx, e.target.checked)
                                            }
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`closed-${day.day}`}
                                        >
                                            Fermé
                                        </label>
                                    </div>
                                </div>
                            ))}
                            <div className="form-actions d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => goToStep(1)}
                                >
                                    <FaArrowLeft className="me-1" /> Précédent
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => goToStep(3)}
                                >
                                    Suivant <FaArrowRight className="ms-1" />
                                </button>
                            </div>
                        </div>

                        {/* Étape 3 */}
                        <div
                            className={`form-step ${currentStep === 3 ? 'active' : ''
                                }`}
                        >
                            <h4 className="mb-4">
                                <FaRegFileAlt className="me-2" />
                                Documents requis
                            </h4>
                            <div className="row g-3">
                                {[
                                    { id: 'agreement_document', label: "Document d'agrément" },
                                    { id: 'id_card_document', label: "Carte d'identité" },
                                    { id: 'photo_exterior', label: 'Photo extérieure' },
                                    { id: 'photo_interior', label: 'Photo intérieure' }
                                ].map(field => (
                                    <div key={field.id} className="col-md-6">
                                        <label className="form-label">
                                            {field.label}
                                        </label>
                                        <div className="file-upload">
                                            <input
                                                type="file"
                                                id={field.id}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                className="file-upload-input"
                                                onChange={e =>
                                                    handleFileUpload(field.id, e)
                                                }
                                            />
                                            <label
                                                htmlFor={field.id}
                                                className="file-upload-label"
                                            >
                                                <FaCloudUploadAlt />
                                                <span className="ms-2">
                                                    Cliquez pour téléverser
                                                </span>
                                                <div className="file-name">
                                                    {fileNames[field.id]}
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="form-actions d-flex justify-content-between mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => goToStep(2)}
                                >
                                    <FaArrowLeft className="me-1" /> Précédent
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => goToStep(4)}
                                >
                                    Suivant <FaArrowRight className="ms-1" />
                                </button>
                            </div>
                        </div>

                        {/* Étape 4 */}
                        <div
                            className={`form-step ${currentStep === 4 ? 'active' : ''
                                }`}
                        >
                            <div className="text-center mb-4">
                                <FaCheckCircle
                                    className="text-success"
                                    style={{ fontSize: '4rem' }}
                                />
                                <h3 className="mt-3">
                                    Vérification des informations
                                </h3>
                                <p className="text-muted">
                                    Veuillez vérifier que toutes les informations
                                    sont correctes avant de soumettre.
                                </p>
                            </div>

                            <div className="card mb-4">
                                <div className="card-header bg-light">
                                    <h5 className="mb-0">Récapitulatif</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>
                                                <strong>Nom :</strong> {formData.name}
                                            </p>
                                            <p>
                                                <strong>Adresse :</strong>{' '}
                                                {formData.address}
                                            </p>
                                            <p>
                                                <strong>Téléphone :</strong>{' '}
                                                {formData.contact_number}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p>
                                                <strong>Âge max :</strong>{' '}
                                                {formData.max_age} mois
                                            </p>
                                            <p>
                                                <strong>Enfants/classe :</strong>{' '}
                                                {formData.max_children_per_class}
                                            </p>
                                            <p>
                                                <strong>Statut légal :</strong>{' '}
                                                {formData.legal_status === 'agrée'
                                                    ? 'Agréée'
                                                    : formData.legal_status === 'declared'
                                                        ? 'Déclarée'
                                                        : formData.legal_status === 'municipal'
                                                            ? 'Municipale'
                                                            : 'Autre'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card mb-4">
                                <div className="card-header bg-light">
                                    <h5 className="mb-0">Horaires d'ouverture</h5>
                                </div>
                                <div className="card-body">
                                    {openingHours.map(day => (
                                        <div key={day.day} className="mb-2">
                                            <strong>{day.name} :</strong>{' '}
                                            {day.closed
                                                ? 'Fermé'
                                                : `${day.open} - ${day.close}`}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-actions d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => goToStep(3)}
                                >
                                    <FaArrowLeft className="me-1" /> Précédent
                                </button>
                                <button type="submit" className="btn btn-success">
                                    <FaCheck className="me-1" /> Soumettre
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default NurseryForm;
