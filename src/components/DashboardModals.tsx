"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Settings, 
  FolderPlus, 
  BookOpen, 
  Download, 
  Trash2, 
  Cpu, 
  ShieldCheck, 
  Database,
  Plus,
  FolderOpen,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface DashboardModalsProps {
  activeModal: "collections" | "saved_reports" | "exports" | "settings" | null;
  onClose: () => void;
}

export default function DashboardModals({ activeModal, onClose }: DashboardModalsProps) {
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [collections, setCollections] = useState<string[]>([
    "AI Research",
    "Startup Research",
    "Market Intelligence",
    "Finance"
  ]);
  const [newCollection, setNewCollection] = useState("");
  
  // Settings states
  const [aiModel, setAiModel] = useState("gpt-5");
  const [threshold, setThreshold] = useState(0.95);
  const [contextKey, setContextKey] = useState("ctxt_secret_bfa7e96897ec4f74990a59108e3b69a5");
  const [openaiKey, setOpenaiKey] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"engine" | "profile">("engine");

  // Profile states
  const [fullName, setFullName] = useState("Guest Analyst");
  const [greetingName, setGreetingName] = useState("Analyst");
  const [initials, setInitials] = useState("GA");
  const [analystRole, setAnalystRole] = useState("Premium Analyst");
  const [briefingsCount, setBriefingsCount] = useState(0);

  // Load settings and profile data from localStorage on mount/activeModal change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedModel = localStorage.getItem("researchx_settings_model");
      if (savedModel) setAiModel(savedModel);
      
      const savedThreshold = localStorage.getItem("researchx_settings_threshold");
      if (savedThreshold) setThreshold(parseFloat(savedThreshold));
      
      const savedContextKey = localStorage.getItem("researchx_settings_context_key");
      if (savedContextKey) setContextKey(savedContextKey);
      
      const savedOpenaiKey = localStorage.getItem("researchx_settings_openai_key");
      if (savedOpenaiKey) setOpenaiKey(savedOpenaiKey);

      // Load Profile
      const savedFullName = localStorage.getItem("researchx_profile_name_full");
      if (savedFullName) setFullName(savedFullName);
      
      const savedGreetingName = localStorage.getItem("researchx_profile_name");
      if (savedGreetingName) setGreetingName(savedGreetingName);

      const savedInitials = localStorage.getItem("researchx_profile_initials");
      if (savedInitials) setInitials(savedInitials);

      const savedRole = localStorage.getItem("researchx_profile_role");
      if (savedRole) setAnalystRole(savedRole);

      // Load briefings count
      const savedReports = localStorage.getItem("researchx_reports");
      if (savedReports) {
        try {
          const parsed = JSON.parse(savedReports);
          if (Array.isArray(parsed)) setBriefingsCount(parsed.length);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [activeModal]);

  // Load saved reports from LocalStorage
  useEffect(() => {
    if (activeModal === "saved_reports") {
      const saved = localStorage.getItem("researchx_reports");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setReports(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [activeModal]);

  const handleDeleteReport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem("researchx_reports", JSON.stringify(updated));
  };

  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollection.trim() && !collections.includes(newCollection.trim())) {
      setCollections([...collections, newCollection.trim()]);
      setNewCollection("");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("researchx_settings_model", aiModel);
    localStorage.setItem("researchx_settings_threshold", threshold.toString());
    localStorage.setItem("researchx_settings_context_key", contextKey);
    localStorage.setItem("researchx_settings_openai_key", openaiKey);

    // Save Profile
    localStorage.setItem("researchx_profile_name_full", fullName);
    localStorage.setItem("researchx_profile_name", greetingName);
    localStorage.setItem("researchx_profile_initials", initials);
    localStorage.setItem("researchx_profile_role", analystRole);

    setSettingsSaved(true);
    setTimeout(() => {
      setSettingsSaved(false);
      onClose();
      // Dispatch storage event locally to notify React page hooks
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    }, 1200);
  };

  const handleExportJSON = () => {
    const saved = localStorage.getItem("researchx_reports");
    const blob = new Blob([saved || "[]"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ResearchX_Telemetry_Database.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md h-full bg-[#050816]/95 border-l border-white/10 glass-panel shadow-2xl z-10 p-6 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2.5">
                  {activeModal === "settings" && <Settings className="w-5 h-5 text-accent-purple" />}
                  {activeModal === "collections" && <FolderOpen className="w-5 h-5 text-accent-purple" />}
                  {activeModal === "saved_reports" && <BookOpen className="w-5 h-5 text-accent-purple" />}
                  {activeModal === "exports" && <Download className="w-5 h-5 text-accent-purple" />}
                  <h2 className="text-base font-semibold text-white capitalize">
                    {activeModal.replace("_", " ")}
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Contents */}
              <div className="flex-1 overflow-y-auto max-h-[75vh] pr-1 py-2">
                
                {/* SETTINGS DRAWER */}
                {activeModal === "settings" && (
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    {/* Tab Switcher */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 mb-6 text-xs select-none">
                      <button
                        type="button"
                        onClick={() => setSettingsTab("engine")}
                        className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all cursor-pointer ${
                          settingsTab === "engine"
                            ? "bg-white/10 text-white border border-white/5 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Engine Config
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettingsTab("profile")}
                        className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all cursor-pointer ${
                          settingsTab === "profile"
                            ? "bg-white/10 text-white border border-white/5 shadow-sm"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        Analyst Profile
                      </button>
                    </div>

                    {settingsTab === "engine" ? (
                      <div className="space-y-6">
                        {/* AI Model selection */}
                        <div className="space-y-2">
                          <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-accent-purple" />
                            Active AI Model
                          </label>
                          <select
                            value={aiModel}
                            onChange={(e) => setAiModel(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-accent-purple"
                          >
                            <option value="gpt-5">GPT-5 (Standard Engine)</option>
                            <option value="gpt-4o">GPT-4o (High Speed)</option>
                            <option value="claude-3-5">Claude 3.5 Sonnet</option>
                          </select>
                        </div>

                        {/* Consensus Threshold */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                            <span className="flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
                              Telemetry Consensus (α-score)
                            </span>
                            <span className="font-mono text-cyan-400">α = {threshold.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min="0.50"
                            max="0.99"
                            step="0.01"
                            value={threshold}
                            onChange={(e) => setThreshold(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                          <span className="text-[10px] text-zinc-500 block leading-normal font-light">
                            Configures the mathematical overlap threshold required for multi-source evidence synthesis verification.
                          </span>
                        </div>

                        {/* API Keys */}
                        <div className="space-y-4 pt-2 border-t border-white/5">
                          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">API Credentials</span>
                          
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-zinc-400">Context.dev API Key</label>
                            <input
                              type="password"
                              value={contextKey}
                              onChange={(e) => setContextKey(e.target.value)}
                              placeholder="ctxt_secret_..."
                              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-accent-purple font-mono"
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-zinc-400">OpenAI API Key (Optional)</label>
                            <input
                              type="password"
                              value={openaiKey}
                              onChange={(e) => setOpenaiKey(e.target.value)}
                              placeholder="sk-or-..."
                              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-accent-purple font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Profile form fields */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] text-zinc-400 pl-0.5">Analyst Full Name</label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Saira P."
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-accent-purple"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] text-zinc-400 pl-0.5">Console Greeting Name</label>
                          <input
                            type="text"
                            value={greetingName}
                            onChange={(e) => setGreetingName(e.target.value)}
                            placeholder="Saira"
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-accent-purple"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-1 space-y-1.5">
                            <label className="text-[11px] text-zinc-400 pl-0.5">Initials</label>
                            <input
                              type="text"
                              value={initials}
                              maxLength={2}
                              onChange={(e) => setInitials(e.target.value.toUpperCase())}
                              placeholder="SP"
                              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-center text-zinc-200 focus:outline-none focus:border-accent-purple font-mono"
                            />
                          </div>
                          <div className="col-span-2 space-y-1.5">
                            <label className="text-[11px] text-zinc-400 pl-0.5">Analyst Role</label>
                            <select
                              value={analystRole}
                              onChange={(e) => setAnalystRole(e.target.value)}
                              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-accent-purple"
                            >
                              <option value="Premium Analyst">Premium Analyst</option>
                              <option value="Lead Researcher">Lead Researcher</option>
                              <option value="Principal Investigator">Principal Investigator</option>
                              <option value="System Architect">System Architect</option>
                            </select>
                          </div>
                        </div>

                        {/* Usage Metrics Card */}
                        <div className="pt-4 border-t border-white/5 space-y-3">
                          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block pl-0.5">Session Statistics</span>
                          <div className="p-3.5 rounded-xl bg-white/[0.015] border border-white/[0.04] grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Briefings Compiled</span>
                              <span className="text-lg font-bold text-white font-mono">{briefingsCount}</span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] text-zinc-500 uppercase tracking-wider block">Trust Score</span>
                              <span className="text-lg font-bold text-cyan-400 font-mono">98.2%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-600/10 cursor-pointer"
                    >
                      {settingsSaved ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          SETTINGS SAVED
                        </>
                      ) : (
                        "SAVE CONFIGURATION"
                      )}
                    </button>
                  </form>
                )}

                {/* COLLECTIONS DRAWER */}
                {activeModal === "collections" && (
                  <div className="space-y-6">
                    {/* Create input */}
                    <form onSubmit={handleAddCollection} className="flex gap-2">
                      <input
                        type="text"
                        value={newCollection}
                        onChange={(e) => setNewCollection(e.target.value)}
                        placeholder="New collection name..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-accent-purple"
                      />
                      <button
                        type="submit"
                        className="bg-white/5 border border-white/10 hover:bg-white/10 p-2.5 rounded-xl text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>

                    {/* List */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block px-1">Active Collections</span>
                      {collections.map((col) => (
                        <div
                          key={col}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.015] border border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                        >
                          <span className="text-xs text-zinc-300 font-medium">{col}</span>
                          <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">0 briefs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SAVED REPORTS DRAWER */}
                {activeModal === "saved_reports" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block px-1">saved research briefing briefs</span>
                    
                    {reports.length === 0 ? (
                      <div className="p-8 text-center text-zinc-500 text-xs font-light">
                        No saved briefings compiled yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {reports.map((r) => (
                          <div
                            key={r.id}
                            onClick={() => {
                              onClose();
                              router.push(`/report/${r.id}`);
                            }}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.015] border border-white/[0.03] hover:bg-white/[0.03] transition-colors cursor-pointer group"
                          >
                            <div className="flex flex-col truncate pr-2">
                              <span className="text-xs font-medium text-zinc-200 truncate group-hover:text-white transition-colors">{r.query}</span>
                              <span className="text-[9px] text-zinc-500 mt-0.5">{r.createdAt}</span>
                            </div>
                            <button
                              onClick={(e) => handleDeleteReport(r.id, e)}
                              className="p-1.5 rounded bg-white/0 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* EXPORTS DRAWER */}
                {activeModal === "exports" && (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block px-1">Platform Datasets</span>
                      
                      {/* Database JSON */}
                      <div className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.03] flex items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 max-w-[70%]">
                          <span className="text-xs font-medium text-zinc-200">Consensus Database (JSON)</span>
                          <span className="text-[10px] text-zinc-500 leading-normal font-light">
                            Full historical dump containing all compiled briefs, sources metadata, and telemetry logs.
                          </span>
                        </div>
                        <button
                          onClick={handleExportJSON}
                          className="bg-white/5 border border-white/10 hover:bg-white/10 p-2.5 rounded-xl text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <Database className="w-4 h-4 text-cyan-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Footer Info */}
            <div className="border-t border-white/5 pt-4 text-center mono text-[10px] text-slate-600 flex justify-between select-none">
              <span>CORE TELEMETRY v2.4</span>
              <span>STATUS: ACTIVE</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
