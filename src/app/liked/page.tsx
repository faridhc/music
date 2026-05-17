"use client";
import { motion } from "framer-motion";
import SongRow from "@/components/SongRow";
import { useLibrary } from "@/hooks/useLibrary";
import { HiHeart } from "react-icons/hi2";

export default function LikedPage() {
  const { likedSongs, isLoaded } = useLibrary();

  if (!isLoaded) return null;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
          <HiHeart className="text-white text-4xl" />
        </div>
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">Playlist</p>
          <h1 className="text-3xl font-bold text-slate-800">Liked Songs</h1>
          <p className="text-slate-500 text-sm mt-1">{likedSongs.length} songs</p>
        </div>
      </motion.div>

      {/* Song List */}
      {likedSongs.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {likedSongs.map((song, i) => (
            <SongRow key={song._id} song={song} queue={likedSongs} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
          <HiHeart className="text-5xl text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Songs you like will appear here</p>
          <p className="text-slate-400 text-sm mt-1">Save songs by tapping the heart icon.</p>
        </div>
      )}
    </div>
  );
}
