// Story.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publicationDate: {
    type: Date,
    default: Date.now // si vous voulez qu’elle soit définie automatiquement
  },
  images: [{
    type: String
  }]
});

module.exports = mongoose.model('Story', storySchema);
