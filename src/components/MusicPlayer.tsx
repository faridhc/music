"use client";
import { motion } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { HiPlay, HiPause, HiForward, HiBackward, HiArrowPath, HiArrowsRightLeft, HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useCallback } from "react";

const fmt = (s: number) => { if (!s||isNaN(s)) return "0:00"; return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`; };

export default function MusicPlayer() {
  const { currentSong, isPlaying, progress, duration, volume, isMuted, shuffle, repeat,
    togglePlayPause, nextSong, prevSong, seek, setVolume, toggleMute, toggleShuffle, toggleRepeat } = useAudio();

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * duration);
  }, [duration, seek]);

  if (!currentSong) return null;

  return (
    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl px-4 py-3">
      {/* Seek Bar */}
      <div className="w-full h-1 bg-slate-200 rounded-full cursor-pointer mb-3 group" onClick={handleSeek}>
        <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full relative" style={{ width: `${pct}%` }}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Song Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <img src={currentSong.coverImage} alt={currentSong.title} className="w-12 h-12 rounded-xl object-cover shadow-md" />
            {isPlaying && (
              <div className="absolute inset-0 rounded-xl bg-black/20 flex items-center justify-center">
                <div className="flex gap-0.5 items-end h-4">
                  {[1,2,3].map(i => (
                    <motion.div key={i} className="w-1 bg-white rounded-full"
                      animate={{ height: ["40%","100%","40%"] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{currentSong.title}</p>
            <p className="text-xs text-slate-500 truncate">{currentSong.artistName}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={toggleShuffle} className={`p-2 rounded-full ${shuffle ? "text-indigo-500" : "text-slate-400 hover:text-slate-700"}`}>
            <HiArrowsRightLeft className="text-base" />
          </button>
          <button onClick={prevSong} className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100">
            <HiBackward className="text-xl" />
          </button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={togglePlayPause}
            className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full flex items-center justify-center shadow-md text-white">
            {isPlaying ? <HiPause className="text-xl" /> : <HiPlay className="text-xl ml-0.5" />}
          </motion.button>
          <button onClick={nextSong} className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100">
            <HiForward className="text-xl" />
          </button>
          <button onClick={toggleRepeat}
            className={`p-2 rounded-full relative ${repeat !== "none" ? "text-indigo-500" : "text-slate-400 hover:text-slate-700"}`}>
            <HiArrowPath className="text-base" />
            {repeat === "one" && <span className="absolute -top-0.5 -right-0.5 text-[9px] font-bold bg-indigo-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">1</span>}
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-xs text-slate-400 hidden sm:block tabular-nums">{fmt(progress)} / {fmt(duration)}</span>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleMute} className="text-slate-400 hover:text-slate-700">
              {isMuted || volume === 0 ? <HiSpeakerXMark className="text-lg" /> : <HiSpeakerWave className="text-lg" />}
            </button>
            <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume}
              onChange={e => setVolume(parseFloat(e.target.value))} className="w-20 h-1 accent-indigo-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
