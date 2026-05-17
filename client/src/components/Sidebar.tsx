"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiHome, HiMagnifyingGlass, HiMusicalNote, HiHeart,
  HiFire, HiGlobeAlt, HiCog6Tooth, HiShieldCheck,
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

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 h-screen flex flex-col p-4 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <HiMusicalNote className="text-white text-xl" />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">SonicWave</span>
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
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-100 font-semibold" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
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
      <div className="mt-auto space-y-1 pt-4 border-t border-slate-200">
        <Link href="/admin">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer">
            <HiShieldCheck className="text-xl" />
            <span className="text-sm font-medium">Admin</span>
          </div>
        </Link>
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer">
            <HiCog6Tooth className="text-xl" />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
