import '../styles/accueil.css';
import { Link } from 'react-router-dom';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChild,
    faShieldAlt,
    faGraduationCap,
    faCalendarAlt,
    faUsers,
    faHome,
    faStar,
    faMapMarkerAlt,
    faClock
} from '@fortawesome/free-solid-svg-icons';

const Accueil = () => {
    const stats = [
        { value: "120+", label: "Crèches partenaires" },
        { value: "98%", label: "Satisfaction parents" },
        { value: "500+", label: "Professionnels qualifiés" },
        { value: "15", label: "Villes couvertes" }
    ];

    const services = [
        { icon: faChild, title: "Garde d'enfants", description: "Des solutions adaptées pour chaque âge" },
        { icon: faShieldAlt, title: "Sécurité", description: "Environnements sécurisés et contrôlés" },
        { icon: faGraduationCap, title: "Pédagogie", description: "Programmes éducatifs personnalisés" },
        { icon: faCalendarAlt, title: "Flexibilité", description: "Horaires adaptés à vos besoins" }
    ];

    const testimonials = [
        { name: "Marie D.", role: "Maman de Lucas", quote: "Depuis que Lucas va à La Maison des P'tits, il s'épanouit chaque jour davantage." },
        { name: "Thomas K.", role: "Papa de Jade", quote: "Un personnel attentionné et des installations modernes, je recommande vivement !" },
        { name: "Aïcha B.", role: "Maman de Youssef", quote: "La transparence et la qualité des services m'ont tout de suite convaincue." }
    ];

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Bienvenue au <span>Coin des P'tits</span></h1>
                    <p className="hero-subtitle">
                        Votre partenaire de confiance pour l'éveil et l'épanouissement de votre enfant
                    </p>
                    <div className="hero-cta">
                        <Link to="/inscrireenfant/0" className="cta-primary">
                            Inscrire mon enfant
                        </Link>
                        <Link to="/Creche-Garderie" className="cta-secondary">
                            Découvrir nos crèches
                        </Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="/accueil.jpg" alt="Enfants heureux" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-container">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="section-header">
                    <h2>Nos engagements</h2>
                    <p>Découvrez ce qui fait la différence chez nous</p>
                </div>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="service-icon">
                                <FontAwesomeIcon icon={service.icon} />
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section className="process-section">
                <div className="section-header">
                    <h2>Comment ça marche ?</h2>
                    <p>3 étapes simples pour trouver la solution idéale</p>
                </div>
                <div className="process-steps">
                    <div className="process-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Recherchez</h3>
                            <p>Trouvez la crèche ou la nounou qui correspond à vos critères</p>
                        </div>
                    </div>
                    <div className="process-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>Visitez</h3>
                            <p>Rencontrez notre équipe et découvrez nos installations</p>
                        </div>
                    </div>
                    <div className="process-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Inscrivez</h3>
                            <p>Finalisez l'inscription en ligne en quelques minutes</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="section-header">
                    <h2>Ils nous font confiance</h2>
                    <p>Découvrez les témoignages de nos parents</p>
                </div>
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-content">
                                <p>"{testimonial.quote}"</p>
                            </div>
                            <div className="testimonial-author">
                                <strong>{testimonial.name}</strong>
                                <span>{testimonial.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Creches */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Nos crèches à l'honneur</h2>
                    <p>Découvrez nos établissements les plus appréciés</p>
                </div>
                <div className="creches-grid">
                    <div className="creche-card">
                        <div className="creche-image">
                            <img src="/enfant.jpg" alt="Crèche Les Petits Explorateurs" />
                            <div className="creche-badge">⭐ Top choix</div>
                        </div>
                        <div className="creche-info">
                            <h3>Les Petits Explorateurs</h3>
                            <div className="creche-meta">
                                <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Cotonou, Gbeto</span>
                                <span><FontAwesomeIcon icon={faClock} /> 7h30 - 18h30</span>
                            </div>
                            <div className="creche-cta">
                                <Link to="/crechedetails/1" className="btn-visit">
                                    Visiter la crèche
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="creche-card">
                        <div className="creche-image">
                            <img src="/enfant.jpg" alt="Crèche Les Bambins Heureux" />
                            <div className="creche-badge">Nouveau</div>
                        </div>
                        <div className="creche-info">
                            <h3>Les Bambins Heureux</h3>
                            <div className="creche-meta">
                                <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Porto-Novo</span>
                                <span><FontAwesomeIcon icon={faClock} /> 7h00 - 19h00</span>
                            </div>
                            <div className="creche-cta">
                                <Link to="/crechedetails/2" className="btn-visit">
                                    Visiter la crèche
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta">
                <div className="cta-container">
                    <h2>Prêt à rejoindre notre communauté ?</h2>
                    <p>Inscrivez votre enfant dès aujourd'hui et bénéficiez d'une remise de 10% sur le premier mois</p>
                    <div className="cta-buttons">
                        <Link to="/inscrireenfant/0" className="cta-primary">
                            Commencer l'inscription
                        </Link>
                        <Link to="/contact" className="cta-secondary" style={{color:'white'}}>
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Accueil;