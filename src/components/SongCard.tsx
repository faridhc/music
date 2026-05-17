"use client";
import { motion } from "framer-motion";
import { Song } from "@/types";
import { useAudio } from "@/context/AudioContext";
import { useLibrary } from "@/hooks/useLibrary";
import { HiPlay, HiHeart } from "react-icons/hi2";

export default function SongCard({ song, queue, index }: { song: Song; queue?: Song[]; index?: number }) {
  const { playSong, currentSong, isPlaying } = useAudio();
  const { toggleLike, isLiked } = useLibrary();
  const isActive = currentSong?._id === song._id;
  const liked = isLiked(song._id);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isActive ? "ring-2 ring-indigo-400 shadow-lg shadow-indigo-100" : "shadow-sm hover:shadow-xl"
      }`}
    >
      {/* Cover */}
      <div className="aspect-square relative overflow-hidden bg-slate-100" onClick={() => playSong(song, queue)}>
        <img src={song.coverImage} alt={song.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div
          initial={{ scale: 0 }} whileHover={{ scale: 1.1 }}
          className="absolute bottom-3 right-3 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
        >
          <HiPlay className="text-white text-lg ml-0.5" />
        </motion.div>
        {isActive && isPlaying && (
          <div className="absolute bottom-3 right-3 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="flex gap-0.5 items-end h-4">
              {[1,2,3].map(i => (
                <motion.div key={i} className="w-1 bg-white rounded-full"
                  animate={{ height: ["30%","100%","30%"] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3 bg-[var(--color-surface)] dark:bg-slate-800/90 flex items-start justify-between gap-2 transition-colors duration-300">
        <div className="flex-1 min-w-0" onClick={() => playSong(song, queue)}>
          <p className="text-sm font-semibold text-[var(--color-text-main)] truncate">{song.title}</p>
          <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">{song.artistName}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400 dark:text-slate-500">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{song.plays?.toLocaleString()} plays</span>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
          className={`p-1.5 rounded-full transition-all ${liked ? 'text-rose-500' : 'text-slate-350 dark:text-slate-500 hover:text-rose-500'}`}
        >
          <HiHeart className="text-lg" />
        </button>
      </div>
    </motion.div>
  );
}
