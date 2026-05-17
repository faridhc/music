export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  role: 'user' | 'artist' | 'admin';
  avatar: string;
  bio?: string;
  followerCount?: number;
}

export interface Song {
  _id: string;
  id?: string;
  title: string;
  artist: User | string;
  artistName: string;
  album?: string;
  albumName?: string;
  duration: number;
  coverImage: string;
  audioUrl: string;
  genre: string;
  tags: string[];
  plays: number;
  likes: string[];
  lyrics?: string;
  isExplicit: boolean;
  license: string;
  createdAt?: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  createdBy: User | string;
  isPublic: boolean;
  songCount?: number;
  tags?: string[];
  genre?: string;
  songs?: { song: Song | string; addedAt: string }[];
}
