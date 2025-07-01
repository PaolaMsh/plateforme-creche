import '../styles/politiqueConfidentialite.css';

export default function PolitiqueConfidentialite() {
  return (
    <div className="privacy-container">
      <header className="privacy-header">
        <h1>Politique de Confidentialité</h1>
        <p className="privacy-subtitle">Dernière mise à jour : 01/07/2024</p>
      </header>

      <section className="privacy-intro">
        <p>Cette politique décrit comment LE COIN DES P'TITS, société immatriculée au RCCM de Cotonou sous le N°2024B1234, collecte, utilise et protège vos informations dans le cadre de nos services de garde d'enfants.</p>
      </section>

      <section className="privacy-section">
        <h2>1. Données Collectées</h2>
        <div className="privacy-grid">
          <div className="privacy-card">
            <h3>Données personnelles</h3>
            <ul>
              <li>Identité des parents/tuteurs (CNI/passeport)</li>
              <li>Coordonnées complètes (adresse physique à Cotonou ou environs)</li>
              <li>Informations sur l'enfant (acte de naissance, carnets de santé)</li>
              <li>Données de paiement (via Flooz ou MTN Mobile Money)</li>
            </ul>
          </div>
          <div className="privacy-card">
            <h3>Données techniques</h3>
            <ul>
              <li>Adresse IP et logs de connexion</li>
              <li>Données de navigation (cookies)</li>
              <li>Historique des réservations</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="privacy-section">
        <h2>2. Finalités du Traitement</h2>
        <div className="privacy-card wide">
          <p>Conformément à la loi béninoise, nous utilisons vos données pour :</p>
          <ul>
            <li>Gérer les inscriptions en crèche et chez les nounous agréées</li>
            <li>Assurer la sécurité et le suivi médical des enfants</li>
            <li>Facturer nos services en conformité avec la réglementation fiscale béninoise</li>
            <li>Vous informer des activités pédagogiques</li>
          </ul>
        </div>
      </section>

      <section className="privacy-section">
        <h2>3. Protection des Données</h2>
        <div className="privacy-card">
          <p>Nous mettons en œuvre des mesures strictes conformes aux standards de l'ARCEP Bénin :</p>
          <ul>
            <li>Serveurs localisés à Cotonou</li>
            <li>Chiffrement des données sensibles</li>
            <li>Accès restreint au personnel autorisé</li>
            <li>Archivage sécurisé des dossiers papier</li>
          </ul>
        </div>
      </section>

      <section className="privacy-section">
        <h2>4. Durée de Conservation</h2>
        <div className="privacy-card">
          <p>Les données sont conservées :</p>
          <ul>
            <li>5 ans pour les données comptables (loi fiscale béninoise)</li>
            <li>3 ans après le départ de l'enfant pour les autres données</li>
            <li>Jusqu'à la majorité de l'enfant pour les dossiers médicaux</li>
          </ul>
        </div>
      </section>

      <section className="privacy-section">
        <h2>5. Vos Droits</h2>
        <div className="privacy-grid">
          <div className="privacy-card">
            <h3>Droits RGPD/Bénin</h3>
            <ul>
              <li>Droit d'accès et de rectification</li>
              <li>Droit à l'effacement sous conditions</li>
              <li>Droit de limitation du traitement</li>
            </ul>
          </div>
          <div className="privacy-card">
            <h3>Exercer vos droits</h3>
            <p>Par courrier : LE COIN DES P'TITS - Service DPD, Rue 155, Cotonou</p>
            <p>Par email : dpd@lecoindesptits.bj</p>
            <p>Avec copie de votre CNI/passeport</p>
          </div>
        </div>
      </section>

      <div className="privacy-footer">
        <p>Cette politique est régie par le droit béninois. Tout litige relève des tribunaux de Cotonou.</p>
      </div>
    </div>
  );
}