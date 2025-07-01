import '../styles/contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi (remplacer par un vrai appel API)
    setTimeout(() => {
      console.log('Message envoyé:', formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Réinitialiser le message de succès après 5s
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Nous Contacter</h1>
        <p>Une question ? Une demande particulière ? Notre équipe est à votre écoute.</p>
      </header>

      <section className="contact-grid">
        {/* Coordonnées */}
        <div className="contact-card contact-info">
          <h2>Coordonnées</h2>
          
          <div className="contact-item">
            <div className="contact-icon">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div>
              <h3>Adresse</h3>
              <p>Rue 155, Immeuble Les Palmiers<br />Cotonou, Bénin</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <div>
              <h3>Téléphone</h3>
              <p>+229 21 30 45 67</p>
              <p>+229 97 86 75 43 (Urgences)</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <div>
              <h3>Email</h3>
              <p>contact@lecoindesptits.bj</p>
              <p>urgences@lecoindesptits.bj</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div>
              <h3>Horaires</h3>
              <p>Lundi - Vendredi : 7h30 - 18h30<br />Samedi : 8h - 13h</p>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="contact-card contact-form">
          <h2>Envoyez-nous un message</h2>
          
          {isSuccess && (
            <div className="success-message">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>Votre message a bien été envoyé ! Nous vous répondrons dans les 24h.</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nom complet *</label>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input 
                type="tel" 
                id="phone" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Sujet *</label>
              <select 
                id="subject" 
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="inscription">Inscription</option>
                <option value="information">Demande d'information</option>
                <option value="rendezvous">Prise de rendez-vous</option>
                <option value="urgence">Urgence</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea 
                id="message" 
                rows="5" 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </section>

      {/* Carte Google Maps réelle */}
      <section className="contact-map">
        <h2>Nous trouver</h2>
        <div className="map-container">
          <iframe 
            title="Localisation LE COIN DES P'TITS"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.317758964728!2d2.428209415231921!3d6.365326595377574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023553f4f1c8f0f%3A0x1d5e48e0a9a8a8a8!2sCotonou%2C%20B%C3%A9nin!5e0!3m2!1sfr!2sfr!4v1623256789014!5m2!1sfr!2sfr"
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;