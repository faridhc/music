const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

// @route   GET /api/search
// @desc    Global instant search across songs, artists, albums, playlists
// @access  Public
router.get('/', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) {
      return res.status(200).json({ success: true, data: { songs: [], artists: [], albums: [], playlists: [] } });
    }

    const regex = new RegExp(q, 'i');

    const [songs, artists, albums, playlists] = await Promise.all([
      Song.find({ $or: [{ title: regex }, { artistName: regex }, { tags: regex }] }).limit(10).populate('artist', 'username avatar'),
      User.find({ role: 'artist', username: regex }).limit(5).select('username avatar bio followerCount'),
      Album.find({ $or: [{ title: regex }, { artistName: regex }] }).limit(5).populate('artist', 'username avatar'),
      Playlist.find({ isPublic: true, $or: [{ name: regex }, { tags: regex }] }).limit(5).populate('createdBy', 'username avatar')
    ]);

    res.status(200).json({
      success: true,
      data: { songs, artists, albums, playlists }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/search/suggestions
// @desc    Instant autocomplete suggestions
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) return res.status(200).json({ success: true, data: [] });

    const regex = new RegExp(q, 'i');
    const songs = await Song.find({ $or: [{ title: regex }, { artistName: regex }] }).limit(6).select('title artistName coverImage');
    
    res.status(200).json({ success: true, data: songs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
