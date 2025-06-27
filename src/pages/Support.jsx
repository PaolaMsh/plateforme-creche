import '../styles/support.css';
import { FaSearch, FaQuestionCircle } from 'react-icons/fa';

const Support = () => {
    const faqs = [
        {
            question: "Comment prendre un abonnement?",
            answer: "Pour souscrire à un abonnement, rendez-vous dans la section 'Abonnements' de votre compte et suivez les étapes de paiement."
        },
        {
            question: "Comment inscrire son enfant?",
            answer: "Dans votre espace parent, cliquez sur 'Ajouter un enfant' et remplissez le formulaire avec les informations requises."
        },
        {
            question: "Comment suivre la journée de mon enfant?",
            answer: "Le tableau de bord parent vous permet de voir les activités et le programme quotidien de votre enfant."
        },
        {
            question: "Je n'arrive pas à voir la liste de mes enfants inscrits",
            answer: "Vérifiez que vous êtes connecté avec le bon compte. Si le problème persiste, contactez notre support technique."
        },
        {
            question: "Comment annuler un abonnement?",
            answer: "Dans la section 'Abonnements', sélectionnez l'abonnement concerné et cliquez sur 'Annuler l'abonnement'."
        },
        {
            question: "Comment modifier les détails de mon enfant",
            answer: "Allez dans le profil de l'enfant et cliquez sur 'Modifier les informations' pour mettre à jour les détails."
        }
    ];

    return (
        <div className='support-container'>
            {/* Hero Section with Search */}
            <section className="support-hero">
                <div className="hero-image-container">
                    <img src="/pc.jpg" alt="Support technique" className="hero-image" />
                    <div className="hero-content">
                        <h1 className="hero-title">ASSISTANCE</h1>
                        <div className="search-container">
                            <input 
                                type="search" 
                                placeholder="Je ne parviens pas à inscrire mon enfant..." 
                                className="search-input"
                            />
                            <FaSearch className="search-icon" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="faq-container">
                    <h2 className="section-title">QUESTIONS FRÉQUENTES</h2>
                    
                    <div className="faq-grid">
                        {faqs.map((faq, index) => (
                            <div className="faq-card" key={index}>
                                <div className="faq-header">
                                    <FaQuestionCircle className="faq-icon" />
                                    <h3 className="faq-question">{faq.question}</h3>
                                </div>
                                <p className="faq-answer">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="contact-container">
                    <h2 className="section-title">CONTACTEZ NOTRE ÉQUIPE</h2>
                    <p className="contact-description">
                        Vous ne trouvez pas la réponse à votre question? Notre équipe est disponible pour vous aider.
                    </p>
                    <div className="contact-methods">
                        <div className="contact-method">
                            <h3>Par téléphone</h3>
                            <p>+33 1 23 45 67 89</p>
                            <p>Lundi-Vendredi: 9h-18h</p>
                        </div>
                        <div className="contact-method">
                            <h3>Par email</h3>
                            <p>support@votreservice.com</p>
                            <p>Réponse sous 24h</p>
                        </div>
                        <div className="contact-method">
                            <h3>Chat en direct</h3>
                            <p>Disponible 24/7</p>
                            <button className="chat-button">Ouvrir le chat</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Support;