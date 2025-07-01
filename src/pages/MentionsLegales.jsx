import '../styles/mentionsLegales.css';

export default function MentionsLegales() {
  return (
    <div className="legal-container">
      <header className="legal-header">
        <h1>Mentions Légales</h1>
        <p className="legal-update">En vigueur au 01/07/2024</p>
      </header>

      <section className="legal-section">
        <h2>Éditeur du Site</h2>
        <div className="legal-grid">
          <div className="legal-card">
            <h3>Identité</h3>
            <p><strong>Dénomination sociale :</strong> LE COIN DES P'TITS SARL</p>
            <p><strong>Forme juridique :</strong> Société à Responsabilité Limitée</p>
            <p><strong>Capital social :</strong> 10 000 000 FCFA</p>
            <p><strong>RCCM :</strong> COTONOU N°2024B1234</p>
            <p><strong>IFU :</strong> 1234567890123</p>
          </div>
          <div className="legal-card">
            <h3>Coordonnées</h3>
            <p><strong>Siège social :</strong> Rue 155, Immeuble Les Palmiers, Cotonou, Bénin</p>
            <p><strong>Téléphone :</strong> +229 21 30 45 67</p>
            <p><strong>Email :</strong> contact@lecoindesptits.bj</p>
            <p><strong>Directeur de publication :</strong> M. Koffi Adékambi</p>
          </div>
        </div>
      </section>

      <section className="legal-section">
        <h2>Hébergement</h2>
        <div className="legal-card wide">
          <p><strong>Nom :</strong> Benin Hosting Solutions</p>
          <p><strong>Siège social :</strong> Lot 1234, Godomey, Cotonou</p>
          <p><strong>Téléphone :</strong> +229 21 34 56 78</p>
          <p><strong>Site web :</strong> www.beninhosting.bj</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>Agréments et Autorisations</h2>
        <div className="legal-card">
          <p><strong>Numéro d'agrément :</strong> N°2024/PMI/CDP/001</p>
          <p><strong>Ministère de tutelle :</strong> Ministère des Affaires Sociales et de la Microfinance</p>
          <p><strong>Assurance RC Pro :</strong> NSIA Assurances, police n° NSIA2024RC789</p>
          <p><strong>Agrément sécurité :</strong> Certifié par la Direction de la Protection Civile du Bénin</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>Propriété Intellectuelle</h2>
        <div className="legal-card">
          <p>L'ensemble des éléments constituant le site (textes, images, vidéos, logos, marques) sont la propriété exclusive de LE COIN DES P'TITS ou de ses partenaires, et sont protégés par les dispositions de l'Accord de Bangui et du Code de la propriété intellectuelle du Bénin.</p>
          <p>Toute reproduction ou exploitation non autorisée expose à des poursuites judiciaires.</p>
        </div>
      </section>

      <section className="legal-section">
        <h2>Protection des Données</h2>
        <div className="legal-card">
          <p>Conformément à la loi n°2017-20 du 20 avril 2017 relative à la protection des données personnelles au Bénin, vous disposez d'un droit d'accès, de rectification et d'opposition aux données vous concernant.</p>
          <p>Notre Délégué à la Protection des Données (DPD) est joignable à : dpd@lecoindesptits.bj</p>
        </div>
      </section>

      <div className="legal-footer">
        <p>© 2024 LE COIN DES P'TITS - Tous droits réservés - Conforme à la législation béninoise</p>
      </div>
    </div>
  );
}