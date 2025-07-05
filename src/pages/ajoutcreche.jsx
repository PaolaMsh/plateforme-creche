import React, { useState, useEffect } from 'react';
import {
    FaBabyCarriage,
    FaArrowLeft,
    FaArrowRight,
    FaCheck,
    FaCloudUploadAlt,
    FaRegClock,
    FaRegFileAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaSpinner
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ajoutcreche.css';
import config from '../config';
import { useAuth } from '../layouts/authContext';

const NurseryForm = () => {
    const { getToken } = useAuth();
    const token = getToken();
    const [currentStep, setCurrentStep] = useState(1);
    const [validationErrors, setValidationErrors] = useState({});
    const [canSubmit, setCanSubmit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact_number: '',
        information: '',
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

    const [fileErrors, setFileErrors] = useState({
        agreement_document: '',
        id_card_document: '',
        photo_exterior: '',
        photo_interior: ''
    });

    useEffect(() => {
        const requiredFields = [
            formData.name,
            formData.address,
            formData.contact_number,
            formData.max_age,
            formData.max_children_per_class,
            formData.legal_status
        ];

        const requiredFiles = [
            formData.agreement_document,
            formData.id_card_document,
            formData.photo_exterior,
            formData.photo_interior
        ];

        const allRequiredFieldsFilled = requiredFields.every(field => field !== '');
        const allRequiredFilesUploaded = requiredFiles.every(file => file !== null);
        const noFileErrors = Object.values(fileErrors).every(error => error === '');

        setCanSubmit(allRequiredFieldsFilled && allRequiredFilesUploaded && noFileErrors);
    }, [formData, fileErrors]);

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

    const validateFile = (field, file) => {
        const errors = { ...fileErrors };
        
        if (field === 'agreement_document' || field === 'id_card_document') {
            if (!file.name.toLowerCase().endsWith('.pdf')) {
                errors[field] = 'Le fichier doit être au format PDF';
            } else {
                errors[field] = '';
            }
        } else if (field === 'photo_exterior' || field === 'photo_interior') {
            const validExtensions = ['.jpg', '.jpeg', '.png'];
            const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            
            if (!validExtensions.includes(extension)) {
                errors[field] = 'Le fichier doit être une image (JPG, JPEG, PNG)';
            } else {
                errors[field] = '';
            }
        }
        
        setFileErrors(errors);
        return errors[field] === '';
    };

    const handleFileUpload = (field, e) => {
        const file = e.target.files[0];
        if (file) {
            if (validateFile(field, file)) {
                setFormData(prev => ({ ...prev, [field]: file }));
                setFileNames(prev => ({ ...prev, [field]: file.name }));
            } else {
                e.target.value = '';
                setFileNames(prev => ({ ...prev, [field]: 'Aucun fichier sélectionné' }));
            }
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

    const goToStep = step => {
        if (step > currentStep) {
            let isValid = true;
            const errors = {};
            
            if (step === 2) {
                if (!formData.name) errors.name = 'Le nom est requis';
                if (!formData.address) errors.address = 'L\'adresse est requise';
                if (!formData.contact_number) errors.contact_number = 'Le téléphone est requis';
                if (!formData.max_age) errors.max_age = 'L\'âge maximum est requis';
                if (!formData.max_children_per_class) errors.max_children_per_class = 'Le nombre maximum d\'enfants est requis';
            }
            
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                isValid = false;
            }
            
            if (!isValid) return;
        }
        
        setCurrentStep(step);
        setValidationErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!canSubmit) {
            toast.error('Veuillez remplir tous les champs obligatoires et corriger les erreurs avant de soumettre.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Création de la crèche
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

            const res1 = await fetch(`${config.API_BASE_URL}nursery/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: fd
            });

            if (!res1.ok) {
                const err1 = await res1.json();
                throw new Error(err1.message || 'Erreur lors de la création de la crèche');
            }

            const responseData = await res1.json();
            console.log("Fichiers reçus par le serveur:", {
            agreement: !!responseData.agreement_document,
            id_card: !!responseData.id_card_document,
            photos: {
                exterior: !!responseData.photo_exterior,
                interior: !!responseData.photo_interior
            }
            });

            toast.success(`Crèche créée avec documents: 
            ${responseData.agreement_document ? '✅' : '❌'} Accord, 
            ${responseData.id_card_document ? '✅' : '❌'} Carte ID,
            ${responseData.photo_exterior ? '✅' : '❌'} Photo extérieure,
            ${responseData.photo_interior ? '✅' : '❌'} Photo intérieure`);


            const { id } = await res1.json();

            // Envoi des horaires
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

            const res2 = await fetch(
                `${config.API_BASE_URL}nursery/${id}/opening-hours/`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(openingHoursData)
                }
            );

            if (!res2.ok) {
                const err2 = await res2.json();
                throw new Error(err2.message || 'Erreur lors de l\'enregistrement des horaires');
            }

            setSubmitSuccess(true);
            toast.success('Crèche enregistrée avec succès !');
            
            // Réinitialisation du formulaire après succès
            setTimeout(() => {
                setFormData({
                    name: '',
                    address: '',
                    contact_number: '',
                    information: '',
                    max_age: 36,
                    max_children_per_class: 12,
                    legal_status: 'agrée',
                    agreement_document: null,
                    id_card_document: null,
                    photo_exterior: null,
                    photo_interior: null
                });
                setFileNames({
                    agreement_document: 'Aucun fichier sélectionné',
                    id_card_document: 'Aucun fichier sélectionné',
                    photo_exterior: 'Aucun fichier sélectionné',
                    photo_interior: 'Aucun fichier sélectionné'
                });
                setCurrentStep(1);
            }, 2000);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(`Échec de l'enregistrement: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFileStatus = (field) => {
        if (formData[field]) {
            return (
                <span className="text-success">
                    <FaCheckCircle className="me-1" />
                    {fileNames[field]}
                </span>
            );
        } else {
            return (
                <span className="text-danger">
                    <FaTimesCircle className="me-1" />
                    {fileNames[field]}
                </span>
            );
        }
    };

    return (
        <>
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
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

                    <form onSubmit={handleSubmit} id="nurseryForm" className="form-body">
                        {/* Étape 1 */}
                        <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Nom de la crèche*
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {validationErrors.name && (
                                        <div className="invalid-feedback">{validationErrors.name}</div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="address" className="form-label">
                                        Adresse*
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`}
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {validationErrors.address && (
                                        <div className="invalid-feedback">{validationErrors.address}</div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="contact_number" className="form-label">
                                        Téléphone*
                                    </label>
                                    <input
                                        type="tel"
                                        id="contact_number"
                                        className={`form-control ${validationErrors.contact_number ? 'is-invalid' : ''}`}
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {validationErrors.contact_number && (
                                        <div className="invalid-feedback">{validationErrors.contact_number}</div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="max_age" className="form-label">
                                        Âge max (mois)*
                                    </label>
                                    <input
                                        type="number"
                                        id="max_age"
                                        className={`form-control ${validationErrors.max_age ? 'is-invalid' : ''}`}
                                        value={formData.max_age}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {validationErrors.max_age && (
                                        <div className="invalid-feedback">{validationErrors.max_age}</div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="max_children_per_class" className="form-label">
                                        Enfants max/classe*
                                    </label>
                                    <input
                                        type="number"
                                        id="max_children_per_class"
                                        className={`form-control ${validationErrors.max_children_per_class ? 'is-invalid' : ''}`}
                                        value={formData.max_children_per_class}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {validationErrors.max_children_per_class && (
                                        <div className="invalid-feedback">{validationErrors.max_children_per_class}</div>
                                    )}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="legal_status" className="form-label">
                                        Statut légal*
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
                                <label htmlFor="information" className="form-label">
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
                        <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                            <h4 className="mb-4">
                                <FaRegClock className="me-2" />
                                Horaires d'ouverture
                            </h4>
                            {openingHours.map((day, idx) => (
                                <div key={day.day} className="d-flex align-items-center mb-3">
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
                        <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                            <h4 className="mb-4">
                                <FaRegFileAlt className="me-2" />
                                Documents requis*
                            </h4>
                            <div className="row g-3">
                                {[
                                    { 
                                        id: 'agreement_document', 
                                        label: "Document d'agrément*",
                                        description: "Format PDF requis"
                                    },
                                    { 
                                        id: 'id_card_document', 
                                        label: "Carte d'identité*",
                                        description: "Format PDF requis"
                                    },
                                    { 
                                        id: 'photo_exterior', 
                                        label: 'Photo extérieure*',
                                        description: "Format JPG, JPEG ou PNG requis"
                                    },
                                    { 
                                        id: 'photo_interior', 
                                        label: 'Photo intérieure*',
                                        description: "Format JPG, JPEG ou PNG requis"
                                    }
                                ].map(field => (
                                    <div key={field.id} className="col-md-6">
                                        <label className="form-label">
                                            {field.label}
                                        </label>
                                        <p className="small text-muted">{field.description}</p>
                                        <div className="file-upload">
                                            <input
                                                type="file"
                                                id={field.id}
                                                accept={field.id.includes('photo') ? '.jpg,.jpeg,.png' : '.pdf'}
                                                className="file-upload-input"
                                                onChange={e => handleFileUpload(field.id, e)}
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
                                                    {renderFileStatus(field.id)}
                                                </div>
                                            </label>
                                            {fileErrors[field.id] && (
                                                <div className="text-danger small mt-1">
                                                    {fileErrors[field.id]}
                                                </div>
                                            )}
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
                                    disabled={!Object.values(formData).slice(6, 10).every(file => file !== null)}
                                >
                                    Suivant <FaArrowRight className="ms-1" />
                                </button>
                            </div>
                        </div>

                        {/* Étape 4 */}
                        <div className={`form-step ${currentStep === 4 ? 'active' : ''}`}>
                            <div className="text-center mb-4">
                                {submitSuccess ? (
                                    <>
                                        <FaCheckCircle
                                            className="text-success"
                                            style={{ fontSize: '4rem' }}
                                        />
                                        <h3 className="mt-3 text-success">
                                            Crèche enregistrée avec succès !
                                        </h3>
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle
                                            className="text-primary"
                                            style={{ fontSize: '4rem' }}
                                        />
                                        <h3 className="mt-3">
                                            Vérification des informations
                                        </h3>
                                    </>
                                )}
                                <p className="text-muted">
                                    {submitSuccess 
                                        ? 'Votre crèche a été enregistrée avec succès.'
                                        : 'Veuillez vérifier que toutes les informations sont correctes avant de soumettre.'}
                                </p>
                            </div>

                            {!submitSuccess && (
                                <>
                                    <div className="card mb-4">
                                        <div className="card-header bg-light">
                                            <h5 className="mb-0">Récapitulatif</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>
                                                        <strong>Nom :</strong> {formData.name || <span className="text-danger">Non renseigné</span>}
                                                    </p>
                                                    <p>
                                                        <strong>Adresse :</strong> {formData.address || <span className="text-danger">Non renseigné</span>}
                                                    </p>
                                                    <p>
                                                        <strong>Téléphone :</strong> {formData.contact_number || <span className="text-danger">Non renseigné</span>}
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>
                                                        <strong>Âge max :</strong> {formData.max_age ? `${formData.max_age} mois` : <span className="text-danger">Non renseigné</span>}
                                                    </p>
                                                    <p>
                                                        <strong>Enfants/classe :</strong> {formData.max_children_per_class || <span className="text-danger">Non renseigné</span>}
                                                    </p>
                                                    <p>
                                                        <strong>Statut légal :</strong> {formData.legal_status ? 
                                                            formData.legal_status === 'agrée' ? 'Agréée' :
                                                            formData.legal_status === 'declared' ? 'Déclarée' :
                                                            formData.legal_status === 'municipal' ? 'Municipale' : 'Autre'
                                                            : <span className="text-danger">Non renseigné</span>}
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
                                                        : `${day.open || 'Non renseigné'} - ${day.close || 'Non renseigné'}`}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="card mb-4">
                                        <div className="card-header bg-light">
                                            <h5 className="mb-0">Documents</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p>
                                                        <strong>Document d'agrément :</strong> {formData.agreement_document ? 
                                                            <span className="text-success">{fileNames.agreement_document}</span> : 
                                                            <span className="text-danger">Non fourni</span>}
                                                    </p>
                                                    <p>
                                                        <strong>Carte d'identité :</strong> {formData.id_card_document ? 
                                                            <span className="text-success">{fileNames.id_card_document}</span> : 
                                                            <span className="text-danger">Non fourni</span>}
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>
                                                        <strong>Photo extérieure :</strong> {formData.photo_exterior ? 
                                                            <span className="text-success">{fileNames.photo_exterior}</span> : 
                                                            <span className="text-danger">Non fourni</span>}
                                                    </p>
                                                    <p>
                                                        <strong>Photo intérieure :</strong> {formData.photo_interior ? 
                                                            <span className="text-success">{fileNames.photo_interior}</span> : 
                                                            <span className="text-danger">Non fourni</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="form-actions d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => goToStep(3)}
                                    disabled={isSubmitting}
                                >
                                    <FaArrowLeft className="me-1" /> Précédent
                                </button>
                                {!submitSuccess ? (
                                    <button 
                                        type="submit" 
                                        className="btn btn-success"
                                        disabled={!canSubmit || isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="me-1 fa-spin" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck className="me-1" /> Soumettre
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="btn btn-primary"
                                        onClick={() => {
                                            setSubmitSuccess(false);
                                            goToStep(1);
                                        }}
                                    >
                                        Ajouter une autre crèche
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default NurseryForm;