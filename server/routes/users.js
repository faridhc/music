const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const { protect } = require('../middleware/auth');

// @route   GET /api/users/:id
// @desc    Get user/artist profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('playlists', 'name coverImage songCount')
      .populate('likedSongs', 'title artistName coverImage audioUrl duration plays');
      
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let artistSongs = [];
    if (user.role === 'artist') {
      artistSongs = await Song.find({ artist: user._id }).sort({ plays: -1 });
    }

    res.status(200).json({
      success: true,
      data: { ...user.toObject(), artistSongs }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/users/:id/follow
// @desc    Follow / Unfollow user or artist
// @access  Private
router.post('/:id/follow', protect, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUser._id.toString());
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ success: true, isFollowing: !isFollowing, followersCount: targetUser.followers.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/users/me/recommendations
// @desc    Get personalized recommendations based on listening history & liked songs
// @access  Private
router.get('/me/recommendations', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('likedSongs');
    const likedGenres = user.likedSongs.map(s => s.genre);
    
    // Find most frequent genre or default to Pop
    const topGenre = likedGenres.length > 0 ? likedGenres.sort((a,b) => likedGenres.filter(v => v===a).length - likedGenres.filter(v => v===b).length).pop() : 'Pop';

    const recommendations = await Song.find({
      genre: topGenre,
      _id: { $nin: user.likedSongs.map(s => s._id) } // exclude already liked
    }).limit(10).populate('artist', 'username avatar');

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
