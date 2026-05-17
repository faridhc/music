const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.example') }); // using example or current

const User = require('../models/User');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const connectDB = require('../config/db');

const seedDatabase = async () => {
  await connectDB();

  try {
    console.log('🧹 Clearing existing database...');
    await User.deleteMany();
    await Song.deleteMany();
    await Playlist.deleteMany();

    console.log('👤 Seeding Users (Admin, Artist, User)...');

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      username: 'SonicAdmin',
      email: 'admin@sonicwave.com',
      password: hashedPassword,
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SonicAdmin',
      bio: 'Platform Creator & Admin'
    });

    const artist1 = await User.create({
      username: 'SynthwaveMaster',
      email: 'synth@sonicwave.com',
      password: hashedPassword,
      role: 'artist',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SynthwaveMaster',
      bio: 'Electronic synthwave producer creating futuristic soundscapes.'
    });

    const artist2 = await User.create({
      username: 'LoFiChill',
      email: 'lofi@sonicwave.com',
      password: hashedPassword,
      role: 'artist',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LoFiChill',
      bio: 'Relaxing beats to study and relax to.'
    });

    const regularUser = await User.create({
      username: 'MusicLover99',
      email: 'user@sonicwave.com',
      password: hashedPassword,
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MusicLover99'
    });

    console.log('🎵 Seeding Royalty-Free Demo Songs...');

    // Royalty free audio files from free public sources (Archive.org / Jamendo / FreeMusicArchive)
    const sampleSongs = [
      {
        title: 'Cyberpunk Cityscape',
        artist: artist1._id,
        artistName: artist1.username,
        duration: 214,
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_4f09a812df.mp3',
        genre: 'Electronic',
        tags: ['cyberpunk', 'synthwave', 'future'],
        plays: 1450,
        license: 'royalty-free',
        uploadedBy: artist1._id
      },
      {
        title: 'Midnight Drive',
        artist: artist1._id,
        artistName: artist1.username,
        duration: 185,
        coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf7f4.mp3',
        genre: 'Electronic',
        tags: ['retro', '80s', 'vibe'],
        plays: 2890,
        license: 'royalty-free',
        uploadedBy: artist1._id
      },
      {
        title: 'Late Night Coffee Beats',
        artist: artist2._id,
        artistName: artist2.username,
        duration: 160,
        coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b81cfb51.mp3',
        genre: 'Lo-Fi',
        tags: ['chill', 'study', 'relax'],
        plays: 4200,
        license: 'royalty-free',
        uploadedBy: artist2._id
      },
      {
        title: 'Rainy Day Melancholy',
        artist: artist2._id,
        artistName: artist2.username,
        duration: 195,
        coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_31743c58bb.mp3',
        genre: 'Lo-Fi',
        tags: ['rain', 'peaceful', 'piano'],
        plays: 980,
        license: 'royalty-free',
        uploadedBy: artist2._id
      }
    ];

    const insertedSongs = await Song.insertMany(sampleSongs);

    console.log('💽 Seeding Sample Playlists...');

    await Playlist.create({
      name: 'Futuristic Vibes 2026',
      description: 'The absolute best electronic and synthwave tracks curated for high-tech living.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
      songs: insertedSongs.slice(0, 2).map(s => ({ song: s._id })),
      createdBy: admin._id,
      genre: 'Electronic',
      tags: ['future', 'synth', 'premium']
    });

    await Playlist.create({
      name: 'Chill & Study Focus',
      description: 'Deep concentration sounds for coding and reading.',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
      songs: insertedSongs.slice(2, 4).map(s => ({ song: s._id })),
      createdBy: artist2._id,
      genre: 'Lo-Fi',
      tags: ['study', 'work', 'chill']
    });

    console.log('✅ Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
