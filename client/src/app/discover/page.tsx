"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SongCard from "@/components/SongCard";
import { Song } from "@/types";
import { HiSparkles, HiMusicalNote } from "react-icons/hi2";
import axios from "axios";
import { demoPlaylists } from "@/lib/demoData";

const categories = [
  { name: "Electronic", color: "from-violet-500 to-indigo-500", img: "https://images.unsplash.com/photo-1571974599782-87624638275e?auto=format&fit=crop&q=80&w=300" },
  { name: "Lo-Fi",      color: "from-emerald-500 to-teal-500",  img: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&q=80&w=300" },
  { name: "Hip-Hop",    color: "from-orange-500 to-red-500",     img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=300" },
  { name: "Ambient",    color: "from-sky-500 to-blue-500",       img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=300" },
  { name: "Jazz",       color: "from-amber-500 to-yellow-500",   img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=300" },
  { name: "Classical",  color: "from-rose-500 to-pink-500",      img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=300" },
];

export default function DiscoverPage() {
  const [shuffled, setShuffled] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscover = async () => {
      try {
        const hostRes = await axios.get("https://api.audius.co");
        const host = hostRes.data.data[0];
        // Fetch some trending/underground tracks
        const res = await axios.get(`${host}/v1/tracks/trending/underground?app_name=sonicwave&limit=12`);
        
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
        setShuffled(tracks);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscover();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <HiSparkles className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Discover</h1>
            <p className="text-slate-500 text-sm">Explore genres & find your next favorite</p>
          </div>
        </div>
      </motion.div>

      {/* Genre Cards */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <motion.div key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`relative h-28 rounded-2xl overflow-hidden cursor-pointer shadow-md bg-gradient-to-br ${cat.color}`}
            >
              <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" />
              <div className="absolute inset-0 flex items-end p-3">
                <span className="text-white font-bold text-sm">{cat.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Discover Songs */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <HiMusicalNote className="text-indigo-500" /> Discover Something New
        </h2>
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shuffled.map((song, i) => (
              <motion.div key={song._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SongCard song={song} queue={shuffled} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Playlists */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {demoPlaylists.map((pl, i) => (
            <motion.div key={pl._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white">
              <div className="aspect-square relative overflow-hidden">
                <img src={pl.coverImage} alt={pl.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-bold text-white truncate">{pl.name}</p>
                  <p className="text-xs text-white/70">{pl.songCount} songs</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
