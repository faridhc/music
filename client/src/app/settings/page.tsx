"use client";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { HiCog6Tooth, HiUser, HiBell, HiPaintBrush, HiShieldCheck } from "react-icons/hi2";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <HiCog6Tooth className="text-slate-400" /> Settings
        </h1>
      </motion.div>

      <div className="space-y-4">
        {[
          { icon: HiUser, title: "Account", desc: "Manage your account details, email, and password", color: "bg-indigo-100 text-indigo-600" },
          { icon: HiBell, title: "Notifications", desc: "Configure how you receive alerts and updates", color: "bg-amber-100 text-amber-600" },
          { icon: HiPaintBrush, title: "Appearance", desc: "Customize theme, colors, and display preferences", color: "bg-violet-100 text-violet-600" },
          { icon: HiShieldCheck, title: "Privacy & Security", desc: "Manage your privacy settings and data", color: "bg-emerald-100 text-emerald-600" },
        ].map((item, i) => (
          <motion.div key={item.title}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ x: 4 }}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon className="text-xl" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">{item.title}</p>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Account Info */}
      {user && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Your Account</h3>
          <div className="flex items-center gap-4 mb-4">
            <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-full ring-2 ring-indigo-200" />
            <div>
              <p className="font-semibold text-slate-800">{user.username}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full capitalize font-medium">{user.role}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
