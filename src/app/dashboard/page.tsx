"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Sparkles,
  Clock,
  ChevronRight,
  Folder
} from "lucide-react";
import { motion } from "framer-motion";

const ROTATING_PLACEHOLDERS = [
  "How many AirPods were sold this year?",
  "Compare OpenAI and Anthropic revenue.",
  "What is India's AI market size?",
  "Latest semiconductor industry trends.",
];

const TRENDING_TOPICS = [
  {
    title: "AirPods Sales Analysis",
    subtitle: "Search volumes are spiking this week",
    query: "How many AirPods were sold this year?",
    tag: "Trend",
    color: "from-purple-500/20 to-blue-500/20"
  },
  {
    title: "OpenAI vs Anthropic Revenue",
    subtitle: "Comparing ARR milestones and growth multipliers",
    query: "Compare OpenAI and Anthropic revenue.",
    tag: "Trending",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Tesla EV Market Share",
    subtitle: "European quarterly BEV registration trackers",
    query: "What is Tesla's EV market share in Europe?",
    tag: "Automotive",
    color: "from-cyan-500/20 to-emerald-500/20"
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [profileName, setProfileName] = useState("Analyst");

  // Load profile name dynamically
  useEffect(() => {
    const loadProfileName = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("researchx_profile_name");
        if (saved) setProfileName(saved);
      }
    };
    loadProfileName();
    window.addEventListener("storage", loadProfileName);
    return () => window.removeEventListener("storage", loadProfileName);
  }, []);

  // Rotating placeholder effect
  useEffect(() => {
    let charIndex = 0;
    let currentText = ROTATING_PLACEHOLDERS[placeholderIndex];
    let isDeleting = false;
    let typingSpeed = 70;

    const type = () => {
      currentText = ROTATING_PLACEHOLDERS[placeholderIndex];
      if (isDeleting) {
        setTypedPlaceholder(currentText.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypedPlaceholder(currentText.substring(0, charIndex + 1));
        charIndex++;
      }

      if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
        typingSpeed = 400;
      } else {
        typingSpeed = isDeleting ? 30 : 60;
      }

      timer = setTimeout(type, typingSpeed);
    };

    let timer = setTimeout(type, 800);
    return () => clearTimeout(timer);
  }, [placeholderIndex]);

  // Load history from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("researchx_reports");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentReports(parsed.slice(0, 4)); // Get top 4 recent
        }
      } catch (e) {
        console.error("Failed to parse saved reports history", e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuery = query.trim() || ROTATING_PLACEHOLDERS[placeholderIndex];
    if (finalQuery) {
      router.push(`/workspace?query=${encodeURIComponent(finalQuery)}`);
    }
  };

  const handleTopicClick = (topicQuery: string) => {
    router.push(`/workspace?query=${encodeURIComponent(topicQuery)}`);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full flex flex-col justify-center min-h-screen relative z-10">
      
      {/* Banner / Welcome Header */}
      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Analyst Console Active</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          What are we researching today, {profileName}?
        </h1>
        <p className="text-zinc-500 text-xs font-light">
          Ask any question to construct structured parameters, extract live sources, and synthesize briefings.
        </p>
      </div>

      {/* Center Search Input */}
      <form onSubmit={handleSubmit} className="w-full relative group mb-12">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan rounded-2xl blur-xl opacity-15 group-focus-within:opacity-30 transition duration-500" />
        
        <div className="relative flex items-center bg-[#050816]/90 border border-white/10 rounded-2xl p-3 transition-all duration-300 group-hover:border-white/20">
          <Search className="w-5 h-5 text-zinc-400 ml-3.5 shrink-0" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={typedPlaceholder || "How many AirPods were sold this year?"}
            className="w-full bg-transparent border-0 text-white placeholder-zinc-500 focus:outline-none focus:ring-0 text-sm md:text-base px-3"
          />

          <button
            type="submit"
            className="bg-gradient-to-tr from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg shadow-purple-600/10 cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <span className="text-[10px] text-zinc-500 mt-2.5 block ml-2">
          Press <kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono text-[9px]">Enter</kbd> to launch autonomous pipeline
        </span>
      </form>

      {/* Grid splits: Trending topics & Recent reports */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Trending Topics (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <h3 className="text-zinc-500 text-[10px] uppercase font-semibold tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-accent-purple" />
            Trending Research Parameters
          </h3>

          <div className="flex flex-col gap-3">
            {TRENDING_TOPICS.map((topic) => (
              <div
                key={topic.title}
                onClick={() => handleTopicClick(topic.query)}
                className="glass-card glass-panel-hover p-4 rounded-xl cursor-pointer flex items-center justify-between border-white/5"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                    {topic.title}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-light truncate max-w-xs">
                    {topic.subtitle}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-white/5 border border-white/5 text-zinc-400 px-2 py-0.5 rounded">
                    {topic.tag}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Recent activity history (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <h3 className="text-zinc-500 text-[10px] uppercase font-semibold tracking-widest flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Recent Research briefings
          </h3>

          <div className="flex flex-col gap-3">
            {recentReports.length === 0 ? (
              <div className="glass-card p-6 rounded-xl border-white/5 text-center text-zinc-500 text-xs font-light">
                <BookOpen className="w-5 h-5 mx-auto mb-2 text-zinc-600" />
                No saved research briefings found.
              </div>
            ) : (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => router.push(`/report/${report.id}`)}
                  className="glass-card glass-panel-hover p-3 rounded-xl cursor-pointer flex items-center justify-between border-white/5"
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="text-xs font-medium text-zinc-300 truncate">{report.query}</span>
                    <span className="text-[9px] text-zinc-500 mt-0.5">{report.createdAt}</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded shrink-0 font-medium">
                    {report.findings?.[0]?.metric || "Verified"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
