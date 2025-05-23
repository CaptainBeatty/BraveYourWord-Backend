const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const contactRoutes = require("./routes/contactRoutes");
const storyRoutes = require('./routes/storyRoutes');
const nouvelleRoutes = require('./routes/nouvelleRoutes');

dotenv.config();

const app = express();


// Vérification des variables d'environnement essentielles
if (!process.env.MONGO_URI || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Veuillez configurer les variables d\'environnement nécessaires dans le fichier .env');
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use("/api", contactRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/nouvelles', nouvelleRoutes);



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err);
    process.exit(1);
  });

// Gestion des erreurs pour les routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
