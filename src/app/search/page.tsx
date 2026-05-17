"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SongCard from "@/components/SongCard";
import { Song } from "@/types";
import { HiMagnifyingGlass, HiXMark, HiUser, HiMusicalNote, HiArrowLeft } from "react-icons/hi2";
import axios from "axios";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"songs" | "authors">("songs");
  const [results, setResults] = useState<Song[]>([]);
  const [authorResults, setAuthorResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Author Profile State
  const [selectedAuthor, setSelectedAuthor] = useState<any | null>(null);
  const [authorTracks, setAuthorTracks] = useState<Song[]>([]);
  const [loadingAuthor, setLoadingAuthor] = useState(false);

  // Fetch Author Tracks when selected via Audius
  useEffect(() => {
    if (!selectedAuthor) return;
    const fetchAuthorTracks = async () => {
      setLoadingAuthor(true);
      try {
        const hostRes = await axios.get("https://api.audius.co");
        const host = hostRes.data.data[0];
        const res = await axios.get(`${host}/v1/users/${selectedAuthor.id}/tracks?app_name=sonicwave`);
        
        let audiusSongs: Song[] = res.data.data.map((track: any) => ({
          _id: track.id,
          title: track.title,
          artistName: track.user.name,
          artist: "audius",
          duration: track.duration,
          plays: track.play_count || 0,
          coverImage: track.artwork?.["480x480"] || track.artwork?.["150x150"] || selectedAuthor.profile_picture?.["480x480"] || "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&q=80&w=600",
          audioUrl: `${host}/v1/tracks/${track.id}/stream?app_name=sonicwave`,
          genre: track.genre,
          tags: [track.genre?.toLowerCase()].filter(Boolean),
          likes: [],
          isExplicit: false,
          license: "audius"
        }));
        
        // Sort by plays
        audiusSongs.sort((a, b) => (b.plays || 0) - (a.plays || 0));
        setAuthorTracks(audiusSongs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAuthor(false);
      }
    };
    fetchAuthorTracks();
  }, [selectedAuthor]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim() === "") {
        setResults([]);
        setAuthorResults([]);
        return;
      }

      setLoading(true);
      try {
        // Audius API for full-length 4-5 minute tracks
        const hostRes = await axios.get("https://api.audius.co");
        const host = hostRes.data.data[0];

        if (activeTab === "authors") {
          const res = await axios.get(`${host}/v1/users/search?query=${encodeURIComponent(query)}&app_name=sonicwave`);
          setAuthorResults(res.data.data || []);
        } else {
          const res = await axios.get(`${host}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=sonicwave`);
          let audiusSongs: Song[] = res.data.data.map((track: any) => ({
            _id: track.id,
            title: track.title,
            artistName: track.user.name,
            artist: "audius",
            duration: track.duration,
            plays: track.play_count || 0,
            coverImage: track.artwork?.["480x480"] || track.artwork?.["150x150"] || "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&q=80&w=600",
            audioUrl: `${host}/v1/tracks/${track.id}/stream?app_name=sonicwave`,
            genre: track.genre,
            tags: [track.genre?.toLowerCase()].filter(Boolean),
            likes: [],
            isExplicit: false,
            license: "audius"
          }));

          // Sort originals first
          audiusSongs.sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();
            const aIsRemix = aTitle.includes("remix") || aTitle.includes("bootleg");
            const bIsRemix = bTitle.includes("remix") || bTitle.includes("bootleg");
            if (aIsRemix && !bIsRemix) return 1;
            if (!aIsRemix && bIsRemix) return -1;
            return (b.plays || 0) - (a.plays || 0);
          });
          setResults(audiusSongs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, activeTab]);

  // If viewing an author's profile
  if (selectedAuthor) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <motion.button 
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => setSelectedAuthor(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold mb-6 transition-colors"
        >
          <HiArrowLeft /> Back to Search
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-10 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 ring-4 ring-indigo-50 shadow-md flex-shrink-0 flex items-center justify-center">
            {selectedAuthor.profile_picture ? (
              <img src={selectedAuthor.profile_picture?.["480x480"] || selectedAuthor.profile_picture?.["150x150"]} alt={selectedAuthor.name} className="w-full h-full object-cover" />
            ) : (
              <HiUser className="text-5xl text-slate-300" />
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">{selectedAuthor.name}</h1>
            <p className="text-slate-500 mt-1">{selectedAuthor.follower_count?.toLocaleString()} followers</p>
          </div>
        </motion.div>

        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <HiMusicalNote className="text-indigo-500" /> Top Tracks by {selectedAuthor.name}
        </h2>
        
        {loadingAuthor ? (
          <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" /></div>
        ) : authorTracks.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {authorTracks.map((song, i) => (
              <motion.div key={song._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SongCard song={song} queue={authorTracks} index={i} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100"><p className="text-slate-500">No tracks found for this artist.</p></div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Global Search</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 max-w-2xl">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search official music & artists globally..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent shadow-sm text-sm font-medium"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <HiXMark className="text-lg" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-100 pb-4">
          <button
            onClick={() => setActiveTab("songs")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "songs" ? "bg-indigo-500 text-white shadow-md shadow-indigo-100" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            }`}
          >
            <HiMusicalNote className="text-lg" /> Songs
          </button>
          <button
            onClick={() => setActiveTab("authors")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "authors" ? "bg-indigo-500 text-white shadow-md shadow-indigo-100" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
            }`}
          >
            <HiUser className="text-lg" /> Artists
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          </motion.div>
        ) : activeTab === "authors" && authorResults.length > 0 ? (
          <motion.div key="authors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {authorResults.map((author, i) => (
              <motion.div 
                key={author.id} 
                onClick={() => setSelectedAuthor(author)}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-100 to-violet-200 mx-auto mb-3 ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all flex items-center justify-center shadow-inner">
                  {author.profile_picture ? (
                    <img src={author.profile_picture?.["150x150"] || author.profile_picture?.["480x480"]} alt={author.name} className="w-full h-full object-cover" />
                  ) : (
                    <HiUser className="text-4xl text-indigo-400" />
                  )}
                </div>
                <p className="font-bold text-slate-800 text-sm truncate">{author.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{author.follower_count?.toLocaleString() || 0} followers</p>
              </motion.div>
            ))}
          </motion.div>
        ) : activeTab === "songs" && results.length > 0 ? (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.map((song, i) => (
              <motion.div key={song._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SongCard song={song} queue={results} index={i} />
              </motion.div>
            ))}
          </motion.div>
        ) : query ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto p-8">
            <HiMagnifyingGlass className="text-5xl text-slate-300 mx-auto mb-4" />
            <p className="text-slate-700 font-bold text-lg">No {activeTab} found</p>
          </motion.div>
        ) : (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto p-10">
            <HiMagnifyingGlass className="text-6xl text-indigo-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-slate-800 font-bold text-xl">Search Global Music</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              Search for official top artists and tracks.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
