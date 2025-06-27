const express = require('express');
const path = require('path');
const app = express();

// Sert les fichiers statiques depuis le dossier build
app.use(express.static(path.join(__dirname, 'build')));

// Redirection de la racine vers /accueil
app.get('/', (req, res) => {
  res.redirect(301, '/accueil');
});

// Toutes les autres routes renvoient index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
