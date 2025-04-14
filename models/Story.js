// Story.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  content: {
    type: String  // Nouveau champ pour le texte complet (Ecriture)
  },
  genre: {
    type: String,
    enum: ['roman', 'nouvelle', 'recueil'],
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publicationDate: {
    type: Date,
    default: Date.now
  },
  images: [{
    type: String
  }]
});

module.exports = mongoose.model('Story', storySchema);
