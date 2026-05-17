"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Song } from '@/types';
import { Howl, Howler } from 'howler';
import toast from 'react-hot-toast';

interface AudioContextType {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
  
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (value: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'all' | 'one'>('none');
  
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and cleanup Howler
  useEffect(() => {
    Howler.volume(volume);
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const updateProgress = () => {
    if (soundRef.current && isPlaying) {
      setProgress(soundRef.current.seek() as number);
    }
  };

  const startProgressInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateProgress, 500);
  };

  const playSong = (song: Song, newQueue?: Song[]) => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    if (newQueue) {
      setQueue(newQueue);
    }

    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setDuration(song.duration);

    // Provide absolute or proper API URL for audio. Since backend is on 5000:
    const audioSrc = song.audioUrl.startsWith('http') 
      ? song.audioUrl 
      : `http://localhost:5000${song.audioUrl}`;

    soundRef.current = new Howl({
      src: [audioSrc],
      html5: true, // Force HTML5 Audio to stream
      volume: isMuted ? 0 : volume,
      onplay: () => {
        setIsPlaying(true);
        startProgressInterval();
      },
      onpause: () => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      },
      onend: () => {
        handleSongEnd();
      },
      onload: () => {
        setDuration(soundRef.current?.duration() || song.duration);
      },
      onloaderror: () => {
        toast.error("Failed to load audio file");
        setIsPlaying(false);
      }
    });

    soundRef.current.play();
  };

  const handleSongEnd = () => {
    if (repeat === 'one') {
      soundRef.current?.play();
    } else {
      nextSong();
    }
  };

  const togglePlayPause = () => {
    if (!soundRef.current || !currentSong) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const nextSong = () => {
    if (queue.length === 0 || !currentSong) return;
    
    const currentIndex = queue.findIndex(s => s._id === currentSong._id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex < queue.length) {
      playSong(queue[nextIndex]);
    } else if (repeat === 'all') {
      playSong(queue[0]);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const prevSong = () => {
    if (!currentSong || progress > 3) {
      // If played more than 3 seconds, restart current song
      seek(0);
      return;
    }

    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(s => s._id === currentSong._id);
    if (currentIndex > 0) {
      playSong(queue[currentIndex - 1]);
    }
  };

  const seek = (value: number) => {
    if (soundRef.current) {
      soundRef.current.seek(value);
      setProgress(value);
    }
  };

  const setVolume = (value: number) => {
    setVolumeState(value);
    Howler.volume(value);
    if (value > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    Howler.volume(!isMuted ? 0 : volume);
  };

  const toggleShuffle = () => setShuffle(!shuffle);
  
  const toggleRepeat = () => {
    setRepeat(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
    toast.success("Added to queue");
  };

  const clearQueue = () => setQueue([]);

  return (
    <AudioContext.Provider value={{
      currentSong, queue, isPlaying, volume, progress, duration, isMuted, shuffle, repeat,
      playSong, togglePlayPause, nextSong, prevSong, seek, setVolume, toggleMute, toggleShuffle, toggleRepeat, addToQueue, clearQueue
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
