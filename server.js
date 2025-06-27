const express = require('express');
const path = require('path');
const app = express();

// Sert les fichiers statiques générés par Vite
app.use(express.static(path.join(__dirname, 'build')));

// Pour toutes les routes restantes, retourne index.html (fallback SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));