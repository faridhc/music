const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true,
    maxlength: 200
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
  albumName: {
    type: String,
    default: 'Single'
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  coverImage: {
    type: String,
    default: '/images/default-cover.jpg'
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio file URL is required']
  },
  genre: {
    type: String,
    enum: ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 
           'Country', 'Latin', 'Indie', 'Alternative', 'Metal', 'Folk', 'Blues',
           'Reggae', 'Punk', 'Soul', 'Funk', 'Ambient', 'Lo-Fi', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  plays: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lyrics: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isExplicit: {
    type: Boolean,
    default: false
  },
  license: {
    type: String,
    enum: ['royalty-free', 'creative-commons', 'authorized', 'original'],
    default: 'original'
  },
  releaseDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for search performance
songSchema.index({ title: 'text', artistName: 'text', genre: 'text', tags: 'text' });
songSchema.index({ plays: -1 });
songSchema.index({ createdAt: -1 });
songSchema.index({ genre: 1 });

// Virtual for like count
songSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

songSchema.set('toJSON', { virtuals: true });
songSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Song', songSchema);
