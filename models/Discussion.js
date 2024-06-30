const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  hashtags: [{
    type: String,
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  viewCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Discussion', DiscussionSchema);
