"use client";
import { useState, useEffect } from "react";
import { Song, Playlist } from "@/types";

export function useLibrary() {
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLiked = localStorage.getItem("sonicwave_liked");
      const savedPlaylists = localStorage.getItem("sonicwave_playlists");
      
      if (savedLiked) setLikedSongs(JSON.parse(savedLiked));
      if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
    } catch (e) {
      console.error("Failed to load library", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("sonicwave_liked", JSON.stringify(likedSongs));
    localStorage.setItem("sonicwave_playlists", JSON.stringify(playlists));
  }, [likedSongs, playlists, isLoaded]);

  const toggleLike = (song: Song) => {
    setLikedSongs(prev => {
      const exists = prev.some(s => s._id === song._id);
      if (exists) return prev.filter(s => s._id !== song._id);
      return [song, ...prev];
    });
  };

  const isLiked = (songId: string) => likedSongs.some(s => s._id === songId);

  const createPlaylist = (name: string, description: string = "") => {
    const newPlaylist: Playlist = {
      _id: "pl_" + Date.now(),
      name,
      description,
      coverImage: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&q=80&w=600",
      createdBy: "user",
      isPublic: false,
      songs: [],
      songCount: 0
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
  };

  const addToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl._id === playlistId) {
        const exists = pl.songs?.some(s => {
          const sId = typeof s.song === 'string' ? s.song : s.song._id;
          return sId === song._id;
        });
        if (exists) return pl;
        
        const updatedSongs = [...(pl.songs || []), { song, addedAt: new Date().toISOString() }];
        return { ...pl, songs: updatedSongs, songCount: updatedSongs.length };
      }
      return pl;
    }));
  };

  return { likedSongs, playlists, isLoaded, toggleLike, isLiked, createPlaylist, addToPlaylist };
}
