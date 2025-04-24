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
    const { title, description, content, genre, recueil, publicationDate } = req.body;

    // Validation simple
    if (genre === 'nouvelle' && !recueil) {
      return res.status(400).json({ error: 'recueil obligatoire pour une nouvelle' });
    }

    const newStory = new Story({
      title,
      description,
      content,
      genre,
      recueil,            // <-- on stocke bien la référence
      author: req.user.id,
      publicationDate
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
// storyRoutes.js, dans router.get('/:id', ...)
router.get('/:id', async (req, res) => {
  try {
    // On peuple le champ recueil (et author) avec seulement le titre (et username)
    const story = await Story.findById(req.params.id)
      .populate('author', 'username')
      .populate('recueil', 'title'); // <-- Ajout d’un populate sur recueil

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
// storyRoutes.js (extrait)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      // Si la requête contient content, description et/ou publicationDate, on les met à jour :
    };
    if (req.body.content !== undefined) {
      updateData.content = req.body.content;
    }
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }
    if (req.body.publicationDate) {
      updateData.publicationDate = req.body.publicationDate;
    }
    // Ajout de la mise à jour du champ recueil, si présent
    if (req.body.recueil !== undefined) {
      updateData.recueil = req.body.recueil;
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
    const recueil = await Story.findById(req.params.id);
    if (!recueil) return res.status(404).json({ error: 'Story not found' });

    // Vérifier l’auteur ici si besoin…

    if (recueil.genre === 'recueil') {
      await Story.deleteMany({ recueil: recueil._id });   // on supprime les nouvelles
    }

    await recueil.deleteOne();
    res.status(200).json({ message: 'Recueil (et ses nouvelles) supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /stories?recueil=<id>
router.delete('/', authenticate, async (req, res) => {
  if (!req.query.recueil) return res.status(400).json({ error: 'recueil id manquant' });
  await Story.deleteMany({ recueil: req.query.recueil, genre: 'nouvelle' });
  res.status(200).json({ message: 'Nouvelles du recueil supprimées' });
});

// Toggle like/dislike générique
async function toggleVote(action, req, res) {
    try {
      const doc = await Story.findById(req.params.id);
      if (!doc) return res.status(404).json({ error: 'Introuvable.' });
      const uid = req.user.id;
      doc.likedBy    = doc.likedBy    || [];
      doc.dislikedBy = doc.dislikedBy || [];
      const liked    = doc.likedBy.includes(uid);
      const disliked = doc.dislikedBy.includes(uid);
      if (action === 'like') {
        if (liked) {
          doc.likes--; doc.likedBy.pull(uid);
        } else {
          if (disliked) { doc.dislikes--; doc.dislikedBy.pull(uid); }
          doc.likes++; doc.likedBy.push(uid);
        }
      } else {
        if (disliked) {
          doc.dislikes--; doc.dislikedBy.pull(uid);
        } else {
          if (liked) { doc.likes--; doc.likedBy.pull(uid); }
          doc.dislikes++; doc.dislikedBy.push(uid);
        }
      }
      await doc.save();
      res.status(200).json({
        message: action==='like' ? (liked?'Like annulé':'Like ajouté') : (disliked?'Dislike annulé':'Dislike ajouté'),
        likes: doc.likes,
        dislikes: doc.dislikes
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  }
  
  // Routes protectées
  router.post('/:id/like',    authenticate, (req, res) => toggleVote('like',    req, res));
  router.post('/:id/dislike', authenticate, (req, res) => toggleVote('dislike', req, res));



module.exports = router;
