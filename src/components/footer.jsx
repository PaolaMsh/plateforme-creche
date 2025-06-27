import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section logo-section">
                    <Link to="/accueil" className="footer-logo">
                        <img src="/logo.png" alt="Le Coin des P'tits" />
                    </Link>
                    <p className="footer-motto">
                        Votre partenaire de confiance pour l'éveil et l'épanouissement de votre enfant.
                    </p>
                </div>

                <div className="footer-section links-section">
                    <h3 className="section-title">Navigation</h3>
                    <ul className="footer-links">
                        <li><Link to="/accueil">Accueil</Link></li>
                        <li><Link to="/creche-garderie">Crèches & Garderies</Link></li>
                        <li><Link to="/mes-abonnements">Mes abonnements</Link></li>
                        <li><Link to="/profil">Mon profil</Link></li>
                        <li><Link to="/support">Support</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact-section">
                    <h3 className="section-title">Contact</h3>
                    <ul className="contact-info">
                        <li>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>+229 01 24 69 55 14</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>+229 01 25 98 47 56</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>contact@lecoindesptits.com</span>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <span>Cotonou, Bénin</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Le Coin des P'tits. Tous droits réservés.</p>
                <div className="legal-links">
                    <Link to="/mentions-legales">Mentions légales</Link>
                    <Link to="/politique-de-confidentialite">Politique de confidentialité</Link>
                    <Link to="/conditions-generales">CGU</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;