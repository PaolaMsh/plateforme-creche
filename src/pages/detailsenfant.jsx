import '../styles/detailsenfants.css';
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const detailsenfant = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nom, prenom, age, particularite } = formData;
    if (nom && prenom && age && particularite) {
      setMessage("✅ Modification enregistrée !");
      setMessageType('success');
    } else {
      setMessage("⚠️ Veuillez remplir tous les champs.");
      setMessageType('error');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Modifier les données de l'enfant</h1>
      <div className="section">
        <div className="image-section">
          <img src="/detailsenfant.jpg" alt="detailsenfant" />
        </div>
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <label>Nom</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} />

            <label>Prénom(s)</label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} />

            <label>Âge (mois)</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} />

            <label>Particularité de l'enfant</label>
            <textarea name="particularite" rows="4" value={formData.particularite} onChange={handleChange} />

            <div className="buttons">
              <Link to='/Accueil' style={{ '--clr': '#29d729' }} >

                <button type="button" onClick={handleCancel} className="cancel">Annuler</button>
              </Link>

              <button type="submit" className="submit">Modifier</button>
            </div>
          </form>
          {message && (
            <p className={`message ${messageType}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default detailsenfant;
