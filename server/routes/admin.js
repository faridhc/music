const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [totalUsers, totalSongs, totalPlaylists, topSongs] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Playlist.countDocuments(),
      Song.find().sort({ plays: -1 }).limit(5).select('title plays artistName')
    ]);

    const totalStreams = await Song.aggregate([{ $group: { _id: null, totalPlays: { $sum: '$plays' } } }]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSongs,
        totalPlaylists,
        totalStreams: totalStreams[0] ? totalStreams[0].totalPlays : 0,
        topSongs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for management
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/admin/songs/:id
// @desc    Delete any song (moderation)
// @access  Private/Admin
router.delete('/songs/:id', protect, admin, async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

    await Song.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Song removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
