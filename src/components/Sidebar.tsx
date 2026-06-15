"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  PlusCircle, 
  Folder, 
  BookOpen, 
  Download, 
  Settings, 
  Sparkles,
  Command,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  onOpenCommandPalette?: () => void;
  onOpenModal?: (modalType: "collections" | "saved_reports" | "exports" | "settings") => void;
  theme?: "light" | "dark";
  toggleTheme?: () => void;
}

export default function Sidebar({ onOpenCommandPalette, onOpenModal, theme, toggleTheme }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Profile states
  const [profileName, setProfileName] = useState("Guest Analyst");
  const [profileRole, setProfileRole] = useState("Premium Analyst");
  const [profileInitials, setProfileInitials] = useState("GA");

  useEffect(() => {
    const loadProfile = () => {
      if (typeof window !== "undefined") {
        const savedName = localStorage.getItem("researchx_profile_name_full");
        if (savedName) setProfileName(savedName);
        
        const savedRole = localStorage.getItem("researchx_profile_role");
        if (savedRole) setProfileRole(savedRole);

        const savedInitials = localStorage.getItem("researchx_profile_initials");
        if (savedInitials) setProfileInitials(savedInitials);
      }
    };

    loadProfile();
    window.addEventListener("storage", loadProfile);
    return () => window.removeEventListener("storage", loadProfile);
  }, []);

  const menuItems = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "New Research", icon: PlusCircle, path: "/dashboard" },
    { name: "Collections", icon: Folder, path: "#", modal: "collections" as const, badge: "4" },
    { name: "Saved Reports", icon: BookOpen, path: "#", modal: "saved_reports" as const },
    { name: "Exports", icon: Download, path: "#", modal: "exports" as const },
    { name: "Settings", icon: Settings, path: "#", modal: "settings" as const },
  ];

  return (
    <aside className="w-64 h-screen glass-panel flex flex-col justify-between p-6 border-r border-white/5 fixed left-0 top-0 z-30 select-none">
      {/* Brand Logo */}
      <div className="flex flex-col gap-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-purple via-accent-blue to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-purple/20 transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
            ResearchX
          </span>
        </Link>

        {/* Command Search Shortcut Trigger */}
        <button 
          onClick={onOpenCommandPalette}
          className="w-full py-2 px-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 flex items-center justify-between text-zinc-400 hover:text-zinc-200 text-xs transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <Command className="w-3.5 h-3.5" />
            <span>Search reports...</span>
          </div>
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/5">⌘K</span>
        </button>

        {/* Menu Items */}
        <nav className="flex flex-col gap-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path && item.path !== "#";
            const isModalTrigger = item.path === "#";

            const handleClick = (e: React.MouseEvent) => {
              if (isModalTrigger) {
                e.preventDefault();
                if (onOpenModal && item.modal) {
                  onOpenModal(item.modal);
                }
              }
            };

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={handleClick}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group relative cursor-pointer ${
                  isActive 
                    ? "text-white font-medium" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent hover:border-white/[0.04]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-accent-purple/10 to-accent-blue/5 border border-accent-purple/20 rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <div className="flex items-center gap-3 relative z-10">
                  <item.icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? "text-accent-purple" : "text-zinc-400 group-hover:text-zinc-200"}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="relative z-10 text-[10px] bg-accent-purple/20 text-accent-purple px-2 py-0.5 rounded-full font-medium border border-accent-purple/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Info */}
      <div 
        onClick={() => onOpenModal && onOpenModal("settings")}
        className="relative z-10 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between hover:bg-white/[0.04] transition-colors duration-200 group/profile cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-accent-purple flex items-center justify-center text-xs font-semibold text-white">
              {profileInitials}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#09090B]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-200">{profileName}</span>
            <span className="text-[10px] text-zinc-500">{profileRole}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 relative z-20">
          {toggleTheme && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-cyan-500 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sessionStorage.removeItem("researchx_auth_session");
              router.push("/login");
            }}
            title="Sign Out"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer opacity-0 group-hover/profile:opacity-100"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
