"use client";
import { motion } from "framer-motion";
import { HiUsers, HiMusicalNote, HiQueueList, HiChartBar, HiArrowTrendingUp } from "react-icons/hi2";

const stats = [
  { label: "Total Users", value: "1,247", icon: HiUsers, color: "from-indigo-500 to-violet-500" },
  { label: "Total Songs", value: "384", icon: HiMusicalNote, color: "from-sky-500 to-blue-500" },
  { label: "Playlists", value: "92", icon: HiQueueList, color: "from-emerald-500 to-teal-500" },
  { label: "Total Streams", value: "148.5K", icon: HiChartBar, color: "from-orange-500 to-amber-500" },
];

const topSongs = [
  { title: "Late Night Coffee", artist: "LoFiChill", plays: "42,000" },
  { title: "Midnight Drive", artist: "SynthwaveMaster", plays: "28,900" },
  { title: "Urban Groove", artist: "BeatFactory", plays: "21,700" },
  { title: "Neon Dreams", artist: "SynthwaveMaster", plays: "18,300" },
  { title: "Cyberpunk Cityscape", artist: "SynthwaveMaster", plays: "14,502" },
];

export default function AdminPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mb-8">Platform overview and management</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="text-white text-lg" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Top Songs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <HiArrowTrendingUp className="text-emerald-500" /> Top Songs
        </h2>
        <div className="space-y-3">
          {topSongs.map((song, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
              <span className="w-6 text-center text-sm font-bold text-slate-400">#{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{song.title}</p>
                <p className="text-xs text-slate-500">{song.artist}</p>
              </div>
              <span className="text-sm text-slate-500 tabular-nums">{song.plays} plays</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
