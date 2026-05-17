"use client";
import { motion } from "framer-motion";
import SongCard from "@/components/SongCard";
import { demoSongs, demoPlaylists } from "@/lib/demoData";
import { HiFire, HiSparkles, HiMusicalNote, HiArrowRight } from "react-icons/hi2";
import Link from "next/link";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function HomePage() {
  const trending = [...demoSongs].sort((a, b) => b.plays - a.plays).slice(0, 4);
  const recent = demoSongs.slice(0, 4);
  const forYou = [...demoSongs].reverse().slice(0, 4);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl mb-10 h-64 md:h-80"
      >
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1400"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-indigo-500/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-indigo-200 text-sm font-medium tracking-wider uppercase">Welcome to SonicWave</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-2 leading-tight">
              Feel the Music.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-violet-300">
                Live the Sound.
              </span>
            </h1>
            <p className="text-indigo-100 mt-3 max-w-md text-sm md:text-base">
              Stream royalty-free music, create playlists, and discover amazing artists — all legally and beautifully.
            </p>
            <Link href="/discover">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-5 px-6 py-2.5 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
              >
                <HiSparkles /> Start Listening
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Trending */}
      <Section title="Trending Now" icon={<HiFire className="text-orange-500" />} href="/trending">
        <motion.div variants={container} initial="hidden" animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trending.map((song, i) => (
            <motion.div key={song._id} variants={item}>
              <SongCard song={song} queue={trending} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Playlists */}
      <Section title="Featured Playlists" icon={<HiMusicalNote className="text-indigo-500" />} href="/discover">
        <motion.div variants={container} initial="hidden" animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {demoPlaylists.map((pl) => (
            <motion.div key={pl._id} variants={item}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img src={pl.coverImage} alt={pl.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-bold text-white truncate">{pl.name}</p>
                    <p className="text-xs text-white/70 mt-0.5">{pl.songCount} songs · {pl.genre}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Made For You */}
      <Section title="Made For You" icon={<HiSparkles className="text-violet-500" />}>
        <motion.div variants={container} initial="hidden" animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {forYou.map((song, i) => (
            <motion.div key={song._id} variants={item}>
              <SongCard song={song} queue={forYou} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Recently Added */}
      <Section title="Recently Added" icon={<HiMusicalNote className="text-sky-500" />}>
        <motion.div variants={container} initial="hidden" animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recent.map((song, i) => (
            <motion.div key={song._id} variants={item}>
              <SongCard song={song} queue={recent} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </div>
  );
}

function Section({ title, icon, href, children }: { title: string; icon: React.ReactNode; href?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        {href && (
          <Link href={href}
            className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
            See All <HiArrowRight className="text-xs" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
