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
    type: String  // Texte complet (mode Ecriture)
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
  }],
  recueil: {
    type: Schema.Types.ObjectId,
    ref: 'Story'  // Référence à un recueil (un Story avec genre "recueil")
  },
  likes: { 
    type: Number, default: 0 
  },
  dislikes: { 
    type: Number, default: 0 
  },
  likedBy: [{ 
    type: Schema.Types.ObjectId, ref: 'User' 
  }],
  dislikedBy: [{
   type: Schema.Types.ObjectId, ref: 'User' 
  }], 
});

module.exports = mongoose.model('Story', storySchema);
