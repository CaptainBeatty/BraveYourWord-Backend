// models/Nouvelle.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nouvelleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // Le recueil auquel la nouvelle appartient (à créer ou référencé ailleurs)
  recueil: {
    type: Schema.Types.ObjectId,
    ref: 'Recueil', // Vous pourrez créer ultérieurement un modèle Recueil si besoin
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
  }
});

module.exports = mongoose.model('Nouvelle', nouvelleSchema);
