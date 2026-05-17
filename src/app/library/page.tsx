"use client";
import { motion } from "framer-motion";
import SongCard from "@/components/SongCard";
import { useLibrary } from "@/hooks/useLibrary";
import { HiMusicalNote, HiQueueList } from "react-icons/hi2";

export default function LibraryPage() {
  const { likedSongs, playlists, isLoaded } = useLibrary();

  if (!isLoaded) return null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Your Library</h1>
      </motion.div>

      {/* Playlists */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <HiQueueList className="text-indigo-500" /> Your Playlists
        </h2>
        {playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playlists.map((pl, i) => (
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
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 border-dashed text-center">
            <p className="text-slate-500 font-medium">You haven't created any playlists yet.</p>
          </div>
        )}
      </section>

      {/* Recently Played / Liked Songs */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <HiMusicalNote className="text-sky-500" /> Your Liked Songs
        </h2>
        {likedSongs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {likedSongs.slice(0, 4).map((song, i) => (
              <motion.div key={song._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SongCard song={song} queue={likedSongs} index={i} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 border-dashed text-center">
            <p className="text-slate-500 font-medium">Your liked songs will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
