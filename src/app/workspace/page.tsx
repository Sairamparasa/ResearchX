"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Globe, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Loader2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Source {
  id: string;
  url: string;
  title: string;
  domain: string;
  reliability: number;
  agreement: 'agree' | 'neutral' | 'disagree';
  freshness: number;
  status: 'discovered' | 'crawled' | 'failed';
  publishedDate?: string;
}

interface Stage {
  id: string;
  name: string;
  status: "idle" | "running" | "completed" | "failed";
}

const STAGE_LABELS: Record<string, string> = {
  planning: "Deconstruct",
  searching: "Broadcast",
  crawling: "Inspect",
  extracting: "Extract",
  verifying: "Validate",
  generating: "Synthesize",
  building: "Compile"
};

function WorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || "";

  const [query, setQuery] = useState(queryParam);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Progress states
  const [stages, setStages] = useState<Stage[]>([
    { id: "planning", name: "Deconstruct", status: "idle" },
    { id: "searching", name: "Broadcast", status: "idle" },
    { id: "crawling", name: "Inspect", status: "idle" },
    { id: "extracting", name: "Extract", status: "idle" },
    { id: "verifying", name: "Validate", status: "idle" },
    { id: "generating", name: "Synthesize", status: "idle" },
    { id: "building", name: "Compile", status: "idle" },
  ]);
  const [sources, setSources] = useState<Source[]>([]);
  const [activeStageId, setActiveStageId] = useState<string>("planning");

  const startResearch = async (targetQuery: string) => {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);
    setSources([]);
    setStages(prev => prev.map(s => ({ ...s, status: "idle" })));
    setActiveStageId("planning");

    try {
      const savedContextKey = localStorage.getItem("researchx_settings_context_key") || "";
      const savedModel = localStorage.getItem("researchx_settings_model") || "gpt-5";
      const savedThreshold = localStorage.getItem("researchx_settings_threshold") || "0.95";

      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: targetQuery,
          apiKey: savedContextKey,
          model: savedModel,
          threshold: parseFloat(savedThreshold)
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize workspace research API: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to initialize stream reader from server");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // keep training incomplete buffer

        for (const line of lines) {
          if (line.trim() === "") continue;
          try {
            const update = JSON.parse(line);
            
            if (update.error) {
              setError(update.error);
              setIsRunning(false);
              return;
            }

            // Sync state from server stream
            if (update.stages) {
              setStages(update.stages);
            }
            if (update.currentStage) {
              setActiveStageId(update.currentStage);
            }
            if (update.sources) {
              setSources(update.sources);
            }

            // If report built, save and redirect
            if (update.report) {
              // Save to LocalStorage for retrieval
              const saved = localStorage.getItem("researchx_reports");
              const reportsList = saved ? JSON.parse(saved) : [];
              reportsList.unshift(update.report);
              localStorage.setItem("researchx_reports", JSON.stringify(reportsList));

              // Trigger success confetti!
              confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 }
              });

              // Navigate to report
              setTimeout(() => {
                router.push(`/report/${update.report.id}`);
              }, 1000);
              
              setIsRunning(false);
              return;
            }

          } catch (e) {
            console.error("Error parsing stream line:", e);
          }
        }
      }

    } catch (err: any) {
      console.error("Research failed:", err);
      setError(err.message || "An unexpected error occurred.");
      setIsRunning(false);
    }
  };

  // Trigger agent run on mount
  useEffect(() => {
    if (queryParam) {
      startResearch(queryParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam]);

  const getStatusIcon = (status: Stage["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-accent-purple animate-spin shrink-0" />;
      case "failed":
        return <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />;
    }
  };

  // Determine label of current running process
  const activeStageObject = stages.find(s => s.id === activeStageId || s.status === "running");
  const stageDescription = activeStageObject 
    ? `Agent working on: ${activeStageObject.name}...` 
    : "Initializing multi-agent planning...";

  return (
    <div className="flex flex-1 p-8 overflow-hidden h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full max-w-7xl mx-auto h-full">
        
        {/* Left/Center Area: Progress Stages Timeline */}
        <div className="xl:col-span-2 flex flex-col gap-6 h-full justify-center">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Research Workspace</span>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>{query || "Workspace Research Query"}</span>
              {isRunning && <Loader2 className="w-4 h-4 text-accent-purple animate-spin" />}
            </h1>
          </div>

          {/* Connected timeline cards */}
          <div className="glass-panel p-8 rounded-2xl border-white/5 relative flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs text-zinc-400 font-light leading-relaxed">
                {error ? "Research plan halted." : stageDescription}
              </span>
              <span className="text-[10px] uppercase bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full text-zinc-400 font-medium">
                {isRunning ? "Running workflow" : error ? "Failed" : "Idle"}
              </span>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Flow Graph Node List */}
            <div className="flex flex-wrap items-center gap-4 justify-between relative py-4">
              {stages.map((stage, index) => {
                const isActive = stage.id === activeStageId || stage.status === "running";
                const isDone = stage.status === "completed";
                
                return (
                  <React.Fragment key={stage.id}>
                    <motion.div 
                      animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                      className={`px-4 py-2 rounded-xl flex items-center gap-2 border text-xs font-medium transition-all duration-300 relative ${
                        isActive 
                          ? "bg-accent-purple/10 border-accent-purple text-white shadow-lg shadow-accent-purple/20"
                          : isDone
                            ? "bg-emerald-500/5 border-emerald-500/30 text-zinc-300"
                            : "bg-white/[0.01] border-white/5 text-zinc-500"
                      }`}
                    >
                      {/* Active glowing ring */}
                      {isActive && (
                        <span className="absolute -inset-0.5 rounded-xl bg-accent-purple/30 blur opacity-70 animate-pulse" />
                      )}
                      <span className="relative z-10">{STAGE_LABELS[stage.id] || stage.name}</span>
                    </motion.div>
                    
                    {index < stages.length - 1 && (
                      <ArrowRight className={`w-3.5 h-3.5 ${isDone ? "text-emerald-500" : isActive ? "text-accent-purple animate-pulse" : "text-zinc-700"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Simulated Animated Progress Bar */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan"
                animate={{
                  width: `${((stages.filter(s => s.status === "completed").length) / stages.length) * 100}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Right Area: Dynamic Discovered Sources Stream */}
        <div className="glass-panel p-6 rounded-2xl border-white/5 w-full flex flex-col gap-5 h-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent-blue" />
              <h3 className="text-sm font-semibold text-zinc-200">Discovered Sources</h3>
            </div>
            <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {sources.length} total
            </span>
          </div>

          {/* Sources List container */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {sources.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-zinc-500 text-xs">
                  <Activity className="w-6 h-6 text-zinc-600 mb-2 animate-pulse" />
                  <span>Waiting for Search Agent outputs...</span>
                </div>
              ) : (
                sources.map((source, index) => {
                  const statusColors: any = {
                    discovered: "bg-white/5 border-white/5 text-zinc-400",
                    crawled: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                    failed: "bg-rose-500/10 border-rose-500/20 text-rose-400",
                  };

                  return (
                    <motion.div
                      key={source.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.015] border border-white/[0.03] hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex flex-col gap-1.5 max-w-[70%]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-zinc-300 truncate">{source.domain}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
                        </div>
                        <span className="text-[10px] text-zinc-400 font-light truncate">{source.title}</span>
                        <div className="flex items-center gap-3 text-[9px] text-zinc-500 font-light">
                          <span>Reliability: <b className="text-zinc-400 font-normal">{source.reliability}%</b></span>
                          <span>Freshness: <b className="text-zinc-400 font-normal">{source.freshness}%</b></span>
                        </div>
                      </div>

                      <span className={`text-[9px] px-2 py-0.5 rounded border font-medium uppercase tracking-wider shrink-0 ${statusColors[source.status]}`}>
                        {source.status === "crawled" ? "Crawled" : "Discovered"}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center flex-1 h-screen bg-[#09090B] text-zinc-500 text-sm">
        <Loader2 className="w-6 h-6 text-accent-purple animate-spin mb-2" />
        <span>Loading research workspace...</span>
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
