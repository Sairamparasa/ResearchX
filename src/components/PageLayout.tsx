"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import CommandPalette from "@/components/CommandPalette";
import DashboardModals from "@/components/DashboardModals";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"collections" | "saved_reports" | "exports" | "settings" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Load and apply theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("researchx_theme") as "light" | "dark" || "dark";
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("researchx_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const isPublicPath = pathname === "/" || pathname === "/login";

  // Check auth session and handle redirect guards
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("researchx_auth_session") === "true";
      setIsAuthenticated(isAuth);
      
      if (!isAuth && !isPublicPath) {
        const redirectUrl = window.location.pathname + window.location.search;
        sessionStorage.setItem("researchx_redirect_after_login", redirectUrl);
        router.push("/login");
      } else if (isAuth && pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [pathname, router, isPublicPath]);

  // Command + K keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent flashing private contents while loading authentication status
  if (isAuthenticated === null && !isPublicPath) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050816] text-zinc-500 font-mono text-xs select-none">
        <span className="animate-pulse">Accessing Core Console parameters...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 flex font-sans antialiased overflow-x-hidden relative bg-[#050816] engineering-grid">
      {/* Sidebar Navigation Panel - Only visible inside workspace/reports dashboard views */}
      {!isPublicPath && (
        <Sidebar 
          onOpenCommandPalette={() => setIsCommandOpen(true)} 
          onOpenModal={(modal) => setActiveModal(modal)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Main Content Pane */}
      <main className={`flex-1 relative z-10 flex flex-col min-h-screen ${!isPublicPath ? "ml-64" : ""}`}>
        {children}
      </main>

      {/* Global Command Palette search overlay */}
      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)} 
        onOpenModal={(modal) => setActiveModal(modal)}
      />

      {/* Sliding Glass Drawers for Collections, Reports, Exports, Settings */}
      <DashboardModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
