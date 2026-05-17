const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Album title is required'],
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
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  coverImage: {
    type: String,
    default: '/images/default-album.jpg'
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  genre: {
    type: String,
    default: 'Other'
  },
  description: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

albumSchema.index({ title: 'text', artistName: 'text' });

albumSchema.virtual('songCount').get(function() {
  return this.songs ? this.songs.length : 0;
});

albumSchema.set('toJSON', { virtuals: true });
albumSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Album', albumSchema);
