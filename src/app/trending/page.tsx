"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SongRow from "@/components/SongRow";
import { Song } from "@/types";
import { HiFire } from "react-icons/hi2";
import axios from "axios";

export default function TrendingPage() {
  const [sorted, setSorted] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const hostRes = await axios.get("https://api.audius.co");
        const host = hostRes.data.data[0];
        const res = await axios.get(`${host}/v1/tracks/trending?app_name=sonicwave&limit=50`);
        
        const tracks: Song[] = res.data.data.map((track: any) => ({
          _id: track.id,
          title: track.title,
          artistName: track.user.name,
          artist: "audius",
          duration: track.duration,
          plays: track.play_count || 0,
          coverImage: track.artwork?.["480x480"] || track.artwork?.["150x150"] || "https://images.unsplash.com/photo-1614149162883-504ce4d13909?auto=format&fit=crop&q=80&w=600",
          audioUrl: `${host}/v1/tracks/${track.id}/stream?app_name=sonicwave`,
          genre: track.genre,
          tags: [],
          likes: [],
          isExplicit: false,
          license: "audius"
        }));
        setSorted(tracks);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
            <HiFire className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Trending</h1>
            <p className="text-slate-500 text-sm">Most played songs right now globally</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Top 3 Highlight */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            {sorted.slice(0, 3).map((song, i) => (
              <motion.div key={song._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all"
              >
                <img src={song.coverImage} alt={song.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">#{i + 1}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold truncate">{song.title}</p>
                  <p className="text-white/70 text-sm">{song.artistName}</p>
                  <p className="text-white/50 text-xs mt-1">{song.plays.toLocaleString()} plays</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Full list */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <span className="w-8 text-center">#</span>
              <span className="w-10"></span>
              <span className="flex-1">Title</span>
              <span className="hidden sm:block w-20 text-right">Plays</span>
              <span className="w-16 text-right">Duration</span>
              <span className="w-8"></span>
            </div>
            {sorted.map((song, i) => (
              <SongRow key={song._id} song={song} queue={sorted} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
