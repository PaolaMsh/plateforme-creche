import '../styles/cgu.css';

export default function CGU() {
  return (
    <div className="terms-container">
      <header className="terms-header">
        <h1>Conditions Générales d'Utilisation</h1>
        <div className="terms-meta">
          <span>Version 2.0</span>
          <span>Applicables au 01/07/2024</span>
        </div>
      </header>

      <section className="terms-toc">
        <h2>Table des Matières</h2>
        <ol>
          <li><a href="#article1">Objet et champ d'application</a></li>
          <li><a href="#article2">Inscription et compte</a></li>
          <li><a href="#article3">Tarifs et paiement</a></li>
          <li><a href="#article4">Obligations des parties</a></li>
          <li><a href="#article5">Annulation et remboursement</a></li>
          <li><a href="#article6">Responsabilités</a></li>
          <li><a href="#article7">Litiges et droit applicable</a></li>
        </ol>
      </section>

      <article id="article1" className="terms-article">
        <h2>Article 1 - Objet et champ d'application</h2>
        <p>Les présentes CGU régissent l'utilisation de la plateforme LE COIN DES P'TITS, service de réservation de garde d'enfants opérant à Cotonou et ses environs.</p>
        <p>Elles s'appliquent à tout utilisateur inscrit ou non sur la plateforme.</p>
      </article>

      <article id="article2" className="terms-article">
        <h2>Article 2 - Inscription et compte</h2>
        <h3>2.1 Création de compte</h3>
        <p>L'inscription nécessite :</p>
        <ul>
          <li>Une adresse email valide</li>
          <li>Un numéro de téléphone béninois valide</li>
          <li>La transmission des documents requis (CNI, acte de naissance de l'enfant)</li>
        </ul>
        
        <h3>2.2 Vérification</h3>
        <p>Nous nous réservons le droit de :</p>
        <ul>
          <li>Vérifier l'authenticité des documents</li>
          <li>Refuser une inscription sans justification</li>
          <li>Suspendre un compte en cas d'activité suspecte</li>
        </ul>
      </article>

      <article id="article3" className="terms-article">
        <h2>Article 3 - Tarifs et paiement</h2>
        <h3>3.1 Tarification</h3>
        <p>Les tarifs sont affichés en FCFA et incluent la TVA selon la réglementation béninoise.</p>
        <p>Ils varient selon :</p>
        <ul>
          <li>La crèche ou nounou sélectionnée</li>
          <li>L'âge de l'enfant</li>
          <li>Le nombre d'heures/jours réservés</li>
        </ul>
        
        <h3>3.2 Modalités de paiement</h3>
        <p>Paiement acceptés :</p>
        <ul>
          <li>Mobile Money (MTN, Moov)</li>
          <li>Virement bancaire (BOA, Ecobank...)</li>
          <li>Espèces (en crèche uniquement)</li>
        </ul>
      </article>

      <article id="article4" className="terms-article">
        <h2>Article 4 - Obligations des parties</h2>
        <h3>4.1 Obligations de LE COIN DES P'TITS</h3>
        <ul>
          <li>Fournir un service conforme à la description</li>
          <li>Assurer la sécurité des enfants</li>
          <li>Respecter les normes sanitaires en vigueur au Bénin</li>
        </ul>
        
        <h3>4.2 Obligations des parents</h3>
        <ul>
          <li>Fournir des informations exactes</li>
          <li>Signaler tout problème de santé de l'enfant</li>
          <li>Respecter les horaires de dépôt/retrait</li>
        </ul>
      </article>

      <article id="article5" className="terms-article">
        <h2>Article 5 - Annulation et remboursement</h2>
        <h3>5.1 Par le parent</h3>
        <p>Toute annellation doit être notifiée 72h à l'avance pour un remboursement à 80%.</p>
        
        <h3>5.2 Par la crèche</h3>
        <p>En cas d'annulation de notre part, le montant est intégralement remboursé.</p>
      </article>

      <article id="article6" className="terms-article">
        <h2>Article 6 - Responsabilités</h2>
        <p>Notre responsabilité est limitée aux obligations légales en vigueur au Bénin.</p>
        <p>Nous déclinons toute responsabilité pour :</p>
        <ul>
          <li>Les objets personnels perdus ou volés</li>
          <li>Les retards non imputables à notre organisation</li>
          <li>Les problèmes de santé non déclarés</li>
        </ul>
      </article>

      <article id="article7" className="terms-article">
        <h2>Article 7 - Litiges et droit applicable</h2>
        <p>Tout litige relève des tribunaux compétents de Cotonou.</p>
        <p>Les présentes CGU sont régies par le droit béninois.</p>
        <p>En cas de contradiction entre les versions française et anglaise, la version française prévaut.</p>
      </article>

      <div className="terms-footer">
        <p>Pour toute question : contact@lecoindesptits.bj - +229 21 30 45 67</p>
      </div>
    </div>
  );
}