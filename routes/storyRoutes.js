// storyRoutes.js
const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const authenticate = require('../middleware/authenticate'); // Middleware d'authentification

// Créer une story
// Extrait de storyRoutes.js
// Créer une story
router.post('/', authenticate, async (req, res) => {
  try {
    const newStory = new Story({
      title: req.body.title,
      description: req.body.description, // nouvelle zone description
      genre: req.body.genre,             // champ genre
      author: req.user.id,
      publicationDate: req.body.publicationDate
    });
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Récupérer toutes les stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find().populate('author', 'username');
    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer une story par ID
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('author', 'username');
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.status(200).json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mettre à jour une story
// storyRoutes.js (extrait)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      // Mise à jour des champs selon ce qui est envoyé dans la requête
    };
    // Si le champ content est fourni, on le met à jour
    if (req.body.content !== undefined) {
      updateData.content = req.body.content;
    }
    // Vous pouvez également permettre la mise à jour de description et publicationDate
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }
    if (req.body.publicationDate) {
      updateData.publicationDate = req.body.publicationDate;
    }
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedStory) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.status(200).json(updatedStory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Supprimer une story
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    if (!deletedStory) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.status(200).json({ message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
