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
  createdAt: {
    type: Date,
    default: Date.now
  },
  images: [{
    type: String
  }]
});

module.exports = mongoose.model('Story', storySchema);
