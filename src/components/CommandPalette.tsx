"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Sparkles, FolderPlus, Download, X, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal?: (modalType: "collections" | "saved_reports" | "exports" | "settings") => void;
}

const SEARCH_SHORTCUTS = [
  { id: "airpods", title: "How many AirPods were sold this year?", category: "Reports" },
  { id: "openai", title: "Compare OpenAI and Anthropic revenue.", category: "Reports" },
  { id: "tesla", title: "What is Tesla's EV market share in Europe?", category: "Reports" },
  { id: "new-research", title: "Start new research query...", category: "Actions", icon: Sparkles },
  { id: "new-collection", title: "Create a new research collection", category: "Actions", icon: FolderPlus },
  { id: "export", title: "Export saved workspace indices", category: "Actions", icon: Download },
  { id: "settings", title: "Configure active engine properties", category: "Actions", icon: Settings },
];

export default function CommandPalette({ isOpen, onClose, onOpenModal }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  const filteredItems = SEARCH_SHORTCUTS.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: typeof SEARCH_SHORTCUTS[0]) => {
    onClose();
    if (item.category === "Reports") {
      // Direct query execution
      router.push(`/workspace?query=${encodeURIComponent(item.title)}`);
    } else if (item.id === "new-research") {
      router.push("/dashboard");
    } else if (item.id === "new-collection") {
      if (onOpenModal) onOpenModal("collections");
    } else if (item.id === "export") {
      if (onOpenModal) onOpenModal("exports");
    } else if (item.id === "settings") {
      if (onOpenModal) onOpenModal("settings");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-xl glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            {/* Search Input Area */}
            <div className="flex items-center border-b border-white/5 px-4 py-3.5 gap-3">
              <Search className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search queries, reports, or trigger actions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 text-white placeholder-zinc-500 focus:outline-none focus:ring-0 text-sm"
              />
              <button 
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List Results */}
            <div className="max-h-[350px] overflow-y-auto p-2">
              {filteredItems.length === 0 ? (
                <div className="p-4 text-center text-zinc-500 text-sm">
                  No matches found for "{search}"
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {/* Categorized List */}
                  {["Reports", "Actions"].map((cat) => {
                    const catItems = filteredItems.filter((i) => i.category === cat);
                    if (catItems.length === 0) return null;

                    return (
                      <div key={cat} className="flex flex-col">
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 py-1.5 mt-1">
                          {cat}
                        </span>
                        {catItems.map((item) => {
                          const Icon = item.icon || Search;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item)}
                              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.04] transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 text-zinc-400 group-hover:text-accent-purple transition-colors" />
                                <span className="text-zinc-200 group-hover:text-white text-sm transition-colors">
                                  {item.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                Select
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white/[0.01] border-t border-white/5 px-4 py-2.5 flex items-center justify-between text-[11px] text-zinc-500">
              <div className="flex items-center gap-4">
                <span><kbd className="bg-white/5 px-1 rounded border border-white/5">↑↓</kbd> Navigate</span>
                <span><kbd className="bg-white/5 px-1 rounded border border-white/5">Enter</kbd> Select</span>
              </div>
              <span>ESC to dismiss</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
