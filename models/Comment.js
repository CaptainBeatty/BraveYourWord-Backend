const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 500 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // Pour les réponses
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model('Comment', commentSchema);
