"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  HiHome, HiMagnifyingGlass, HiMusicalNote, HiHeart,
  HiFire, HiGlobeAlt, HiCog6Tooth, HiShieldCheck,
  HiSun, HiMoon,
} from "react-icons/hi2";

const navLinks = [
  { href: "/",         label: "Home",      icon: HiHome },
  { href: "/search",   label: "Search",    icon: HiMagnifyingGlass },
  { href: "/trending", label: "Trending",  icon: HiFire },
  { href: "/discover", label: "Discover",  icon: HiGlobeAlt },
  { href: "/liked",    label: "Liked Songs",icon: HiHeart },
  { href: "/library",  label: "Library",   icon: HiMusicalNote },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col p-4 flex-shrink-0 transition-colors duration-300">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <HiMusicalNote className="text-white text-xl" />
        </div>
        <span className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight">SonicWave</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700/50 font-semibold" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <link.icon className={`text-xl ${isActive ? "text-indigo-500" : ""}`} />
                <span className="text-sm">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-1 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Dark Mode Toggle */}
        {mounted && (
          <div 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <HiSun className="text-xl text-amber-500 animate-pulse" />
              ) : (
                <HiMoon className="text-xl text-indigo-500" />
              )}
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5 transition-colors relative">
              <div className={`w-4 h-4 bg-white dark:bg-indigo-400 rounded-full shadow-md transform duration-250 ${
                theme === "dark" ? "translate-x-4" : "translate-x-0"
              }`} />
            </div>
          </div>
        )}

        <Link href="/admin">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer">
            <HiShieldCheck className="text-xl" />
            <span className="text-sm font-medium">Admin</span>
          </div>
        </Link>
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer">
            <HiCog6Tooth className="text-xl" />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
