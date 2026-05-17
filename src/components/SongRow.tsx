"use client";
import { motion } from "framer-motion";
import { Song } from "@/types";
import { useAudio } from "@/context/AudioContext";
import { useLibrary } from "@/hooks/useLibrary";
import { HiPlay, HiPause, HiHeart } from "react-icons/hi2";

export default function SongRow({ song, queue, index }: { song: Song; queue?: Song[]; index?: number }) {
  const { playSong, currentSong, isPlaying, togglePlayPause } = useAudio();
  const { toggleLike, isLiked } = useLibrary();
  const isActive = currentSong?._id === song._id;
  const liked = isLiked(song._id);
  const num = (index ?? 0) + 1;

  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(241,245,249,1)" }}
      className={`flex items-center gap-4 px-4 py-2.5 rounded-xl cursor-pointer group transition-colors ${
        isActive ? "bg-indigo-50" : ""
      }`}
      onClick={() => isActive ? togglePlayPause() : playSong(song, queue)}
    >
      {/* Number / Play */}
      <div className="w-8 text-center flex-shrink-0">
        {isActive && isPlaying ? (
          <div className="flex gap-0.5 items-end h-4 mx-auto w-fit">
            {[1,2,3].map(i => (
              <motion.div key={i} className="w-1 bg-indigo-500 rounded-full"
                animate={{ height: ["30%","100%","30%"] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        ) : (
          <>
            <span className="text-sm text-slate-400 group-hover:hidden">{num}</span>
            <HiPlay className="text-slate-600 hidden group-hover:block mx-auto" />
          </>
        )}
      </div>
      {/* Cover + Info */}
      <img src={song.coverImage} alt={song.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? "text-indigo-600" : "text-slate-800"}`}>{song.title}</p>
        <p className="text-xs text-slate-500 truncate">{song.artistName}</p>
      </div>
      <span className="text-xs text-slate-400 hidden sm:block">{song.plays?.toLocaleString() || 0} plays</span>
      <span className="text-xs text-slate-400 tabular-nums">{Math.floor(song.duration/60)}:{(song.duration%60).toString().padStart(2,'0')}</span>
      <button 
        onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
        className={`p-1.5 rounded-full transition-all ${liked ? 'text-rose-500 opacity-100' : 'text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100'}`}
      >
        <HiHeart className="text-base" />
      </button>
    </motion.div>
  );
}
