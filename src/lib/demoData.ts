import { Song, Playlist } from "@/types";

// Demo songs using royalty-free sources (Pixabay audio library)
export const demoSongs: Song[] = [
  {
    _id: "demo1", title: "Cyberpunk Cityscape", artistName: "SynthwaveMaster",
    artist: "artist1", duration: 214, plays: 14502,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600",
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/25/audio_4f09a812df.mp3",
    genre: "Electronic", tags: ["cyberpunk","synthwave"], likes: [], isExplicit: false, license: "royalty-free"
  },
  {
    _id: "demo2", title: "Midnight Drive", artistName: "SynthwaveMaster",
    artist: "artist1", duration: 185, plays: 28900,
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600",
    audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf7f4.mp3",
    genre: "Electronic", tags: ["retro","80s"], likes: [], isExplicit: false, license: "royalty-free"
  },
  {
    _id: "demo3", title: "Late Night Coffee", artistName: "LoFiChill",
    artist: "artist2", duration: 160, plays: 42000,
    coverImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
    audioUrl: "https://cdn.pixabay.com/audio/2022/03/15/audio_c8b81cfb51.mp3",
    genre: "Lo-Fi", tags: ["chill","study"], likes: [], isExplicit: false, license: "royalty-free"
  },
  {
    _id: "demo4", title: "Rainy Day Melancholy", artistName: "LoFiChill",
    artist: "artist2", duration: 195, plays: 9800,
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600",
    audioUrl: "https://cdn.pixabay.com/audio/2022/01/21/audio_31743c58bb.mp3",
    genre: "Lo-Fi", tags: ["rain","peaceful"], likes: [], isExplicit: false, license: "royalty-free"
  },
  {
    _id: "demo5", title: "Neon Dreams", artistName: "SynthwaveMaster",
    artist: "artist1", duration: 240, plays: 18300,
    coverImage: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&q=80&w=600",
    audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3",
    genre: "Electronic", tags: ["neon","ambient"], likes: [], isExplicit: false, license: "royalty-free"
  },
  {
    _id: "demo6", title: "Morning Sunrise", artistName: "LoFiChill",
    artist: "artist2", duration: 175, plays: 33100,
    coverImage: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=600",
    audioUrl: "https://cdn.pixabay.com/audio/2022/02/22/audio_d1718ab41b.mp3",
    genre: "Lo-Fi", tags: ["morning","peaceful"], likes: [], isExplicit: false, license: "royalty-free"
  },
  {
    _id: "demo7", title: "Deep Space Journey", artistName: "SynthwaveMaster",
    artist: "artist1", duration: 265, plays: 7500,
    coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600",
    audioUrl: "https://cdn.pixabay.com/audio/2023/01/16/audio_ea31e89a9c.mp3",
    genre: "Ambient", tags: ["space","cinematic"], likes: [], isExplicit: false, license: "royalty-free"
  },
  {
    _id: "demo8", title: "Urban Groove", artistName: "BeatFactory",
    artist: "artist3", duration: 198, plays: 21700,
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600",
    audioUrl: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3",
    genre: "Hip-Hop", tags: ["urban","beats"], likes: [], isExplicit: false, license: "royalty-free"
  },
];

export const demoPlaylists: Playlist[] = [
  {
    _id: "pl1", name: "Futuristic Vibes 2026", description: "Best electronic & synthwave tracks",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    createdBy: "admin", isPublic: true, genre: "Electronic", songCount: 3
  },
  {
    _id: "pl2", name: "Chill & Study Focus", description: "Deep concentration sounds",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    createdBy: "artist2", isPublic: true, genre: "Lo-Fi", songCount: 3
  },
  {
    _id: "pl3", name: "Late Night Drive", description: "Synthwave for the road",
    coverImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=600",
    createdBy: "admin", isPublic: true, genre: "Electronic", songCount: 2
  },
  {
    _id: "pl4", name: "Morning Energy", description: "Start your day right",
    coverImage: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=600",
    createdBy: "admin", isPublic: true, genre: "Lo-Fi", songCount: 2
  },
];
