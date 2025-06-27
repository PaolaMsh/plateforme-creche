import '../styles/nounourapide.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const nounourapide = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    age: '',
    adress: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nom, prenom, age, adress ,caractéristiques} = formData;
    if (nom && prenom && age && adress && caractéristiques) {
      setMessage("Réussie");
      setMessageType('success');
    } else {
      setMessage("Veuillez remplir tous les champs.");
      setMessageType('error');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <>
      <h1>Nounou rapide</h1>
      <div className="section">
        <div className="image-section">
          <img src="rapide.jpg" alt="rapide" />
        </div>
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <label>Nom de l'enfant</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} />

            <label>Prénom de l'enfant</label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} />

            <label>Âge de l'enfant</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} />

            <label>Adress</label>
            <input type='text' name="adress" value={formData.adress} onChange={handleChange}/>

            <label>Caractéristiques de la nounou recherchée</label>
            <textarea
              name="Caractéristiques"
              rows="4"
              value={formData.particularite}
              onChange={handleChange}
            />

            <div className="buttons">
              <Link to="/Accueil">
                <button type="button" onClick={handleCancel}>Annuler</button>
              </Link>
              <button type="submit">Contacter</button>
            </div>
          </form>
          {message && (
            <p className={`message ${messageType}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default nounourapide;
