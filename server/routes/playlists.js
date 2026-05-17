const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

// @route   POST /api/playlists
// @desc    Create a playlist
// @access  Private
router.post('/', protect, uploadImage.single('cover'), async (req, res) => {
  try {
    const { name, description, isPublic, genre, tags } = req.body;
    const coverImage = req.file ? `/uploads/images/${req.file.filename}` : '/images/default-playlist.jpg';

    const playlist = await Playlist.create({
      name,
      description,
      coverImage,
      createdBy: req.user.id,
      isPublic: isPublic !== 'false',
      genre: genre || 'Mixed',
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });

    await User.findByIdAndUpdate(req.user.id, { $push: { playlists: playlist._id } });

    res.status(201).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/playlists
// @desc    Get all public playlists
// @access  Public
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate('createdBy', 'username avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/playlists/:id
// @desc    Get single playlist with songs
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('createdBy', 'username avatar')
      .populate('songs.song');
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/playlists/:id/songs
// @desc    Add song to playlist
// @access  Private
router.post('/:id/songs', protect, async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });

    if (playlist.createdBy.toString() !== req.user.id && !playlist.collaborators.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this playlist' });
    }

    const songExists = playlist.songs.some(s => s.song.toString() === songId);
    if (songExists) {
      return res.status(400).json({ success: false, message: 'Song already in playlist' });
    }

    playlist.songs.push({ song: songId, addedAt: new Date() });
    await playlist.save();

    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/playlists/:id/songs/:songId
// @desc    Remove song from playlist
// @access  Private
router.delete('/:id/songs/:songId', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });

    if (playlist.createdBy.toString() !== req.user.id && !playlist.collaborators.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    playlist.songs = playlist.songs.filter(s => s.song.toString() !== req.params.songId);
    await playlist.save();

    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
