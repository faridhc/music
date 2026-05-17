const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');
const User = require('../models/User');
const { protect, artistOrAdmin, optionalAuth } = require('../middleware/auth');
const { uploadSong } = require('../middleware/upload');

// @route   POST /api/songs
// @desc    Upload a new song (Artist/Admin only)
// @access  Private/Artist
router.post('/', protect, artistOrAdmin, uploadSong.fields([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, genre, tags, lyrics, isExplicit, license } = req.body;

    if (!req.files || !req.files.audio) {
      return res.status(400).json({ success: false, message: 'Audio file is required' });
    }

    const audioFile = req.files.audio[0];
    const coverFile = req.files.cover ? req.files.cover[0] : null;

    const audioUrl = `/uploads/audio/${audioFile.filename}`;
    const coverImage = coverFile ? `/uploads/images/${coverFile.filename}` : '/images/default-cover.jpg';

    // Mock duration for now or calculate with audio probe library
    const song = await Song.create({
      title,
      artist: req.user.id,
      artistName: req.user.username,
      duration: req.body.duration ? parseInt(req.body.duration) : 180, // Default 3 min
      audioUrl,
      coverImage,
      genre: genre || 'Other',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      lyrics: lyrics || '',
      uploadedBy: req.user.id,
      isExplicit: isExplicit === 'true',
      license: license || 'original'
    });

    res.status(201).json({ success: true, data: song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/songs
// @desc    Get all songs with filtering & pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.artist) filter.artist = req.query.artist;

    const sort = req.query.sort === 'popular' ? { plays: -1 } : { createdAt: -1 };

    const songs = await Song.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('artist', 'username avatar');

    const total = await Song.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: songs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: songs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/songs/trending
// @desc    Get top trending songs based on plays
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const songs = await Song.find()
      .sort({ plays: -1 })
      .limit(10)
      .populate('artist', 'username avatar');

    res.status(200).json({ success: true, data: songs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/songs/:id
// @desc    Get single song details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('artist', 'username avatar bio');
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }
    res.status(200).json({ success: true, data: song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/songs/:id/play
// @desc    Increment song play count and record history
// @access  Public/Optional Auth
router.post('/:id/play', optionalAuth, async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, { $inc: { plays: 1 } }, { new: true });
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    if (req.user) {
      // Add to user listening history
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          listeningHistory: { $each: [{ song: song._id, playedAt: new Date() }], $slice: -50 } // keep max 50 recent
        }
      });
    }

    res.status(200).json({ success: true, plays: song.plays });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/songs/:id/like
// @desc    Toggle like song
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    const user = await User.findById(req.user.id);
    const isLiked = song.likes.includes(req.user.id);

    if (isLiked) {
      // Remove like
      song.likes = song.likes.filter(id => id.toString() !== req.user.id.toString());
      user.likedSongs = user.likedSongs.filter(id => id.toString() !== song._id.toString());
    } else {
      // Add like
      song.likes.push(req.user.id);
      user.likedSongs.push(song._id);
    }

    await song.save();
    await user.save();

    res.status(200).json({ success: true, isLiked: !isLiked, likeCount: song.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
