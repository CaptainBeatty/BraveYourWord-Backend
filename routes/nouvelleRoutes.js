// routes/nouvelleRoutes.js
const express = require('express');
const router = express.Router();
const Nouvelle = require('../models/Nouvelle');
const authenticate = require('../middleware/authenticate');

// Créer une nouvelle
router.post('/', authenticate, async (req, res) => {
  try {
    const newNouvelle = new Nouvelle({
      title: req.body.title,
      content: req.body.content,
      recueil: req.body.recueil,  // L'ID du recueil auquel appartient cette nouvelle
      author: req.user.id
    });
    const savedNouvelle = await newNouvelle.save();
    res.status(201).json(savedNouvelle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Récupérer toutes les nouvelles, avec possibilité de filtrer par recueil grâce à une query string
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.recueil) {
      query.recueil = req.query.recueil;
    }
    const nouvelles = await Nouvelle.find(query).populate('author', 'username');
    res.status(200).json(nouvelles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer une nouvelle par ID
router.get('/:id', async (req, res) => {
  try {
    const nouvelle = await Nouvelle.findById(req.params.id).populate('author', 'username');
    if (!nouvelle) {
      return res.status(404).json({ error: 'Nouvelle non trouvée' });
    }
    res.status(200).json(nouvelle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vous pouvez ajouter des routes PUT et DELETE de la même manière, si nécessaire

module.exports = router;
