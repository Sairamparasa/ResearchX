"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  Activity, 
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  Terminal,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";

const STAGES = [
  { id: "stage_1", name: "Deconstruct", label: "STAGE_01", desc: "Maps underlying semantic vectors.", border: "border-l-2 border-l-cyan-500" },
  { id: "stage_2", name: "Broadcast", label: "STAGE_02", desc: "Dispatches parallel querying." },
  { id: "stage_3", name: "Inspect", label: "STAGE_03", desc: "Deep parses targeted assets." },
  { id: "stage_4", name: "Validate", label: "STAGE_04", desc: "Cross-checks adversarial truth." },
  { id: "stage_5", name: "Synthesize", label: "STAGE_05", desc: "Computes direction alignment." },
  { id: "stage_6", name: "Compile", label: "STAGE_06", desc: "Generates analyst briefing.", border: "border-r-2 border-r-purple-500" },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [waveform, setWaveform] = useState([20, 40, 70, 95, 65, 35, 80, 50, 25, 10]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("researchx_theme") as "light" | "dark" || "dark";
      setTheme(savedTheme);
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(sessionStorage.getItem("researchx_auth_session") === "true");
    }
  }, []);

  // Interactive Sandbox state hooks
  const [sandboxQuery, setSandboxQuery] = useState("How many AirPods were sold this year?");
  const [sandboxStage, setSandboxStage] = useState<"idle" | "planning" | "searching" | "crawling" | "extracting" | "completed">("idle");
  const [sandboxResult, setSandboxResult] = useState({
    metric: "56.2 Million",
    unit: "Units",
    variance: "+/- 2.4%",
    confidence: "87%",
    reportId: "airpods",
    details: "Cross-validated against 12 institutional filings, balance ledger sheets, and warehouse distribution logs."
  });

  const runSandbox = (targetQuery?: string) => {
    const qStr = targetQuery || sandboxQuery;
    if (targetQuery) {
      setSandboxQuery(targetQuery);
    }
    
    setSandboxStage("planning");
    
    const q = qStr.toLowerCase();
    let result = {
      metric: "56.2 Million",
      unit: "Units",
      variance: "+/- 2.4%",
      confidence: "87%",
      reportId: "airpods",
      details: "Cross-validated against 12 institutional filings, balance ledger sheets, and warehouse distribution logs."
    };

    if (q.includes("openai") || q.includes("revenue") || q.includes("anthropic")) {
      result = {
        metric: "$10.0 Billion",
        unit: "ARR",
        variance: "+/- 1.5%",
        confidence: "93%",
        reportId: "openai",
        details: "Cross-validated against SEC filings, partner disclosure reports, and internal SaaS telemetry logs."
      };
    } else if (q.includes("tesla") || q.includes("ev") || q.includes("market")) {
      result = {
        metric: "18.2%",
        unit: "EV Share",
        variance: "+/- 0.8%",
        confidence: "90%",
        reportId: "tesla",
        details: "Cross-validated against EAFO registries, ACEA trackers, and country registrations."
      };
    }
    
    setSandboxResult(result);

    setTimeout(() => {
      setSandboxStage("searching");
      setTimeout(() => {
        setSandboxStage("crawling");
        setTimeout(() => {
          setSandboxStage("extracting");
          setTimeout(() => {
            setSandboxStage("completed");
          }, 600);
        }, 500);
      }, 500);
    }, 500);
  };

  // Telemetry Waveform oscillation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveform(prev => prev.map(val => {
        const delta = Math.floor(Math.random() * 15) - 7;
        let newVal = val + delta;
        if (newVal < 10) newVal = 10;
        if (newVal > 100) newVal = 100;
        return newVal;
      }));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuery = query.trim() || "Evaluate competitive matrix of multi-modal AI systems...";
    router.push(`/workspace?query=${encodeURIComponent(finalQuery)}`);
  };

  const handleLaunch = () => {
    const isAuth = sessionStorage.getItem("researchx_auth_session") === "true";
    if (isAuth) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="text-slate-200 antialiased overflow-x-hidden min-h-screen relative">
      {/* Ambient Aurora Background Layers */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] aurora-purple pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] aurora-cyan pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[600px] h-[600px] aurora-cyan pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] aurora-purple pointer-events-none z-0"></div>

      {/* Fixed Header Navigation Bar */}
      <nav className="fixed top-6 left-0 right-0 z-50 px-4">
        <div className="max-w-6xl mx-auto glass-pill rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-3 h-3 bg-cyan-400 rounded-sm shadow-[0_0_8px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform duration-200"></div>
            <span className="mono font-bold text-sm tracking-wider text-white group-hover:text-cyan-400 transition-colors duration-200">RESEARCHX</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wide text-slate-400">
            <a href="#pipeline" className="hover:text-white transition-colors">Engine Pipeline</a>
            <a href="#features" className="hover:text-white transition-colors">Architecture</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Console</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
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
            <button 
              onClick={handleLaunch}
              className="mono text-[11px] font-medium tracking-wider bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {isLoggedIn ? "GO TO CONSOLE" : "LAUNCH CONSOLE"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Split Canvas */}
      <header className="relative pt-36 pb-20 px-4 max-w-7xl mx-auto z-10 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-[11px] font-medium tracking-wider text-purple-400 uppercase mono">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
              Autonomous Engine v2.4 Active
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-none">
              Research Anything.<br />
              <span className="text-slate-500">Verify Everything.</span>
            </h1>
            <p className="text-base text-slate-400 max-w-lg leading-relaxed font-light">
              An advanced autonomous intelligence platform that builds deep query-lookup matrices, interrogates global parameters, and synthesizes immutable consensus briefings.
            </p>
            
            {/* Search Core input bar */}
            <form onSubmit={handleSubmit} className="max-w-xl glass-card rounded-xl p-2.5 flex items-center gap-2 border-slate-700/50 focus-within:border-cyan-500/40 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300">
              <span className="mono text-xs text-cyan-400/60 pl-3 select-none">$</span>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Evaluate competitive matrix of multi-modal AI systems..." 
                className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 mono py-2"
              />
              <button 
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                EXECUTE
              </button>
            </form>

            <div className="flex items-center gap-6 pt-2">
              <button 
                onClick={handleLaunch}
                className="text-xs font-medium tracking-wider text-white flex items-center gap-2 border-b border-white/20 pb-1 hover:border-white transition-all cursor-pointer bg-transparent"
              >
                Watch Live Sandbox
              </button>
              <span className="text-slate-600">|</span>
              <span className="text-xs mono text-slate-500">Telemetry status: Operational</span>
            </div>
          </div>

          {/* Right Column: Console Telemetry Dashboard */}
          <div className="lg:col-span-6 w-full">
            <div className="glass-card rounded-xl border-slate-800 overflow-hidden shadow-2xl">
              {/* Console Header */}
              <div className="bg-slate-950/60 px-4 py-3 border-b border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/40"></span>
                  <span className="mono text-[11px] text-slate-500 ml-3">CONSOLE_MONITOR // CORE_SYS</span>
                </div>
                <div className="text-[10px] mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 px-2 py-0.5 rounded">
                  VELOCITY: 4.2G/s
                </div>
              </div>
              
              {/* Console Grid Content */}
              <div className="p-6 space-y-6 bg-slate-950/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-800/60 bg-slate-950/40 p-4 rounded-lg">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500 mono">Data Cluster Scans</span>
                    <span className="block text-2xl font-semibold text-white tracking-tight mt-1">1,409,211</span>
                    <span className="text-[10px] text-emerald-400 mono flex items-center gap-1 mt-1">
                      ↑ 94.2% structural integrity
                    </span>
                  </div>
                  <div className="border border-slate-800/60 bg-slate-950/40 p-4 rounded-lg">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-500 mono">Consensus Threshold</span>
                    <span className="block text-2xl font-semibold text-purple-400 tracking-tight mt-1">α = 0.982</span>
                    <span className="text-[10px] text-slate-500 mono flex items-center gap-1 mt-1">
                      Configured: Mathematical Max
                    </span>
                  </div>
                </div>

                {/* Oscillating Waveform Graphic Block */}
                <div className="border border-slate-800/60 bg-slate-950/40 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between text-[10px] mono text-slate-400">
                    <span>CONSENSUS WAVEFORM METRIC</span>
                    <span className="text-slate-600">890Hz Alpha-band</span>
                  </div>
                  <div className="h-20 flex items-end gap-1.5 pt-4">
                    {waveform.map((height, i) => {
                      const isCenter = i >= 3 && i <= 7;
                      return (
                        <div 
                          key={i} 
                          className={`w-full rounded-sm transition-all duration-150 ${
                            isCenter 
                              ? i % 2 === 0 
                                ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                                : "bg-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.3)]" 
                              : "bg-slate-800"
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Trust Matrix */}
      <section className="border-y border-slate-900 bg-slate-950/30 py-8 text-center px-4 relative z-10">
        <div className="max-w-5xl mx-auto opacity-50 flex flex-wrap items-center justify-between gap-8 text-xs font-semibold tracking-widest text-slate-400 mono">
          <span>DEEPTECH_VENTURES</span>
          <span>OXFORD_LABS_AI</span>
          <span>NEURAL_CAPITAL</span>
          <span>SYNTH_CORPORATE</span>
          <span>QUANT_SYSTEMS</span>
        </div>
      </section>

      {/* The Brain Pipeline Section */}
      <section id="pipeline" className="py-24 max-w-6xl mx-auto px-4 relative z-10 scroll-mt-16">
        <div className="text-center space-y-3 mb-16">
          <span className="mono text-xs text-cyan-400 font-medium tracking-widest uppercase">System Flow</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">The Autonomous Brain Pipeline</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
          {STAGES.map((stage) => (
            <div 
              key={stage.id} 
              className={`glass-card p-4 rounded-xl space-y-3 ${stage.border || ""}`}
            >
              <span className="mono text-[10px] text-cyan-400 block font-medium">{stage.label}</span>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{stage.name}</h3>
              <p className="text-[11px] text-zinc-400 leading-normal">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Specifications Bento Grid */}
      <section id="features" className="py-16 max-w-6xl mx-auto px-4 relative z-10 scroll-mt-16">
        <div className="text-center space-y-3 mb-16">
          <span className="mono text-xs text-purple-400 font-medium tracking-widest uppercase">Structural Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Engine Specifications</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 rounded-2xl md:col-span-2 space-y-4 glow-hover transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mono text-xs">01</div>
            <h3 className="text-lg font-semibold text-white">Deep Research Agent Matrix</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Employs multi-threaded autonomous reasoning loops that recursively rewrite analytical query architecture as intermediate operational contexts materialize.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 glow-hover transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-purple-950/50 border border-purple-800/40 flex items-center justify-center text-purple-400 mono text-xs">02</div>
            <h3 className="text-lg font-semibold text-white">Source Verifier</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Real-time network node reputation appraisal assessing domain structures, cryptographic authority flags, and historical trace vectors.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4 glow-hover transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mono text-xs">03</div>
            <h3 className="text-lg font-semibold text-white">Evidence Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Strips structural syntax noise to cleanly isolate mathematical distributions, hard telemetry parameters, and standard statistical deviation bars.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl md:col-span-2 space-y-4 glow-hover transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mono text-xs">04</div>
            <h3 className="text-lg font-semibold text-white">Dynamic Consensus Threshold Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Engineered to continuously run mathematical convergence scoring across completely conflicting multi-source streams, identifying statistical overlaps.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl md:col-span-3 space-y-4 glow-hover transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-purple-950/50 border border-purple-800/40 flex items-center justify-center text-purple-400 mono text-xs">05</div>
              <span className="mono text-[10px] px-2.5 py-0.5 bg-emerald-950/40 border border-emerald-850/30 rounded text-emerald-400 font-semibold tracking-wide">HIGH INTENSITY ENGINE</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Visual Document Intelligence System</h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-light">
              Directly decodes complex infographics, layout arrays, circuit flow topologies, and multidimensional chart matrices natively without basic linguistic approximation errors.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Live Terminal Sandbox */}
      <section id="demo" className="py-20 bg-slate-950/40 border-y border-slate-900 px-4 relative z-10 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <span className="mono text-xs text-cyan-400 font-medium tracking-widest uppercase">Live Sandbox Simulator</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Interactive Discovery Run</h2>
            <p className="text-xs text-slate-500 font-light max-w-md mx-auto">Select a parameter profile below to witness the active deconstruction and synthesis pipeline in real time.</p>
          </div>

          {/* Selector options */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {[
              { label: "AirPods Sales Track", query: "How many AirPods were sold this year?" },
              { label: "OpenAI vs Anthropic Revenue", query: "Compare OpenAI and Anthropic revenue." },
              { label: "Tesla EV Share Europe", query: "What is Tesla's EV market share in Europe?" }
            ].map((opt) => (
              <button
                key={opt.label}
                disabled={sandboxStage !== "idle" && sandboxStage !== "completed"}
                onClick={() => runSandbox(opt.query)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border mono transition-all ${
                  sandboxQuery === opt.query
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                    : "bg-white/[0.01] border-white/5 text-slate-400 hover:text-zinc-200 hover:border-white/10"
                } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sandbox shell */}
          <div className="glass-card rounded-xl border-slate-800 overflow-hidden shadow-2xl bg-black">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-900 flex items-center justify-between mono text-xs">
              <div className="text-slate-400 flex items-center gap-2">
                <span>RUN_PROMPT:</span>
                <span className="text-cyan-400 font-medium">"{sandboxQuery}"</span>
              </div>
              <div className="text-slate-600 flex items-center gap-3">
                <span>ID: #9082-AX</span>
                {sandboxStage === "idle" && (
                  <button
                    onClick={() => runSandbox()}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-2.5 py-0.5 rounded text-[10px] font-bold transition-all animate-pulse cursor-pointer"
                  >
                    RUN TELEMETRY
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Scan indicators grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className={`p-2.5 rounded border text-[11px] mono flex items-center gap-2 transition-all ${
                  sandboxStage === "idle" 
                    ? "bg-slate-950 border-slate-900 text-slate-600"
                    : sandboxStage === "planning"
                      ? "bg-cyan-950/20 border-cyan-800/30 text-cyan-400"
                      : "bg-slate-950 border-slate-900 text-emerald-400"
                }`}>
                  <span>{sandboxStage !== "idle" && sandboxStage !== "planning" ? "✓" : "●"}</span>
                  <span className={sandboxStage === "planning" ? "animate-pulse" : ""}>Planning Core</span>
                </div>
                
                <div className={`p-2.5 rounded border text-[11px] mono flex items-center gap-2 transition-all ${
                  sandboxStage === "idle" || sandboxStage === "planning"
                    ? "bg-slate-950 border-slate-900 text-slate-600"
                    : sandboxStage === "searching"
                      ? "bg-cyan-950/20 border-cyan-800/30 text-cyan-400"
                      : "bg-slate-950 border-slate-900 text-emerald-400"
                }`}>
                  <span>{sandboxStage !== "idle" && sandboxStage !== "planning" && sandboxStage !== "searching" ? "✓" : "●"}</span>
                  <span className={sandboxStage === "searching" ? "animate-pulse" : ""}>Searching Web</span>
                </div>

                <div className={`p-2.5 rounded border text-[11px] mono flex items-center gap-2 transition-all ${
                  sandboxStage === "idle" || sandboxStage === "planning" || sandboxStage === "searching"
                    ? "bg-slate-950 border-slate-900 text-slate-600"
                    : sandboxStage === "crawling"
                      ? "bg-cyan-950/20 border-cyan-800/30 text-cyan-400"
                      : "bg-slate-950 border-slate-900 text-emerald-400"
                }`}>
                  <span>{sandboxStage === "completed" || sandboxStage === "extracting" ? "✓" : "●"}</span>
                  <span className={sandboxStage === "crawling" ? "animate-pulse" : ""}>Crawling Docs</span>
                </div>

                <div className={`p-2.5 rounded border text-[11px] mono flex items-center gap-2 transition-all ${
                  sandboxStage === "completed"
                    ? "bg-slate-950 border-slate-900 text-emerald-400"
                    : sandboxStage === "extracting"
                      ? "bg-cyan-950/20 border-cyan-800/30 text-cyan-400"
                      : "bg-slate-950 border-slate-900 text-slate-600"
                }`}>
                  <span>{sandboxStage === "completed" ? "✓" : "●"}</span>
                  <span className={sandboxStage === "extracting" ? "animate-pulse" : ""}>Extracting Metrics</span>
                </div>
              </div>

              {/* Discovery blocks split panel */}
              <div className="relative">
                {/* Loader blur while running */}
                {sandboxStage === "idle" && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg border border-slate-900">
                    <button
                      onClick={() => runSandbox()}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg text-xs font-semibold tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      EXECUTE RUN
                    </button>
                  </div>
                )}

                {sandboxStage !== "idle" && sandboxStage !== "completed" && (
                  <div className="absolute inset-0 z-20 bg-black/30 backdrop-blur-[2px] flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-lg text-xs font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>Deconstructing Telemetry Streams...</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
                  {/* Numeric Discovery Block */}
                  <div className="md:col-span-7 bg-slate-950/80 border border-slate-900 rounded-lg p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] tracking-wider text-slate-500 uppercase mono block">Quantified Metric Discovery</span>
                      <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
                        {sandboxResult.metric} <span className="text-lg font-light text-slate-400">{sandboxResult.unit}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-900/60 mono text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Variance Matrix: <span className="text-purple-400">{sandboxResult.variance}</span></span>
                      <span>Confidence Interval: 95%</span>
                    </div>
                  </div>
                  
                  {/* Consensus Panel */}
                  <div className="md:col-span-5 bg-purple-950/10 border border-purple-900/30 rounded-lg p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] tracking-wider text-purple-400 uppercase mono block">Consensus Confidence Score</span>
                      <div className="text-3xl font-semibold text-purple-400 mono">{sandboxResult.confidence}</div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal font-light">
                      {sandboxResult.details}
                    </p>
                  </div>
                </div>

                {/* Final redirection button on completion */}
                {sandboxStage === "completed" && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => router.push(`/report/${sandboxResult.reportId}`)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wider flex items-center gap-1.5 hover:scale-102 transition-transform shadow-lg shadow-purple-600/10 cursor-pointer"
                    >
                      OPEN FULL ANALYST REPORT
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analyst-Grade Report Preview Sheet */}
      <section className="py-24 max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center space-y-3 mb-16">
          <span className="mono text-xs text-slate-500 font-medium tracking-widest uppercase">Verified Output Structure</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Analyst-Grade Research Briefings</h2>
        </div>

        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 select-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
            <div className="mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Document ID: RX-8902-X // Class: Confirmed
            </div>
            <div className="text-[11px] font-medium tracking-wide bg-slate-100 text-slate-700 px-3 py-1 rounded">
              Generated: June 2026
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">Global Micro-Mobility Infrastructure & Unit Volatility Matrix</h3>
            <p className="text-xs text-slate-500">Autonomous analytical study tracking decentralized asset volumes across secondary regional nodes.</p>
          </div>

          <div className="border-l-4 border-purple-600 bg-purple-50/50 p-4 rounded-r-lg">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block mb-1">Synthesized System Directive</span>
            <p className="text-xs text-slate-700 leading-relaxed font-light">
              Aggregated intelligence logs show an intense, positive directional trend in micro-node expansion architectures. The overall variance thresholds remain tightly pinned inside normalized target distributions, confirming structural stability.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Extracted Structural Metrics</span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-medium uppercase tracking-wider">
                    <th className="py-2 font-semibold">Tracked Variable</th>
                    <th className="py-2 font-semibold">Extracted Mean</th>
                    <th className="py-2 font-semibold text-right">Confidence Source Matrix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-light text-slate-700">
                  <tr>
                    <td className="py-3 font-medium text-slate-900">Alpha Node Yield Volatility</td>
                    <td className="py-3 font-mono">14.02 GW/h</td>
                    <td className="py-3 text-right text-slate-500">Regulatory Filings (8)</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-slate-900">Secondary Distribution Spread</td>
                    <td className="py-3 font-mono">0.034%</td>
                    <td className="py-3 text-right text-slate-500">Warehouse Ledger Books (4)</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium text-slate-900">Cross-border Latency Lag</td>
                    <td className="py-3 font-mono">12.4ms</td>
                    <td className="py-3 text-right text-slate-500">Network Telemetry Logs (19)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Matrix */}
      <section id="pricing" className="py-20 bg-slate-950/20 border-t border-slate-900/60 px-4 relative z-10 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="mono text-xs text-cyan-400 font-medium tracking-widest uppercase">Scalable Deployment</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Pricing & Access Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Free Sandbox */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="mono text-[10px] text-slate-400 block uppercase font-semibold">00 // Sandbox Tier</span>
                <div className="text-3xl font-bold text-white">$0<span className="text-xs font-normal text-slate-500"> /free</span></div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">Sandbox operations for testing autonomous validation matrices and viewing telemetry logs.</p>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-2.5 pt-4 border-t border-slate-900/60 font-light">
                <li>• 5 Free Research Runs / mo</li>
                <li>• Core Context.dev Evidence Scoring</li>
                <li>• Basic Web Console Viewer</li>
              </ul>
              <button 
                onClick={handleLaunch}
                className="w-full py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs tracking-wide transition-colors cursor-pointer"
              >
                ACCESS FREE SANDBOX
              </button>
            </div>

            {/* Starter */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="mono text-[10px] text-slate-400 block uppercase font-semibold">01 // Starter Terminal</span>
                <div className="text-3xl font-bold text-white">$40<span className="text-xs font-normal text-slate-500"> /mo</span></div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">Essential system operations for research analysts needing immutable verification protocols.</p>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-2.5 pt-4 border-t border-slate-900/60 font-light">
                <li>• 50 Deep Autonomous Research Runs / mo</li>
                <li>• Standard Trust-Grading Logic Array</li>
                <li>• PDF Executive Briefing Exporters</li>
              </ul>
              <button 
                onClick={handleLaunch}
                className="w-full py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs tracking-wide transition-colors cursor-pointer"
              >
                INITIALIZE ACCESS
              </button>
            </div>

            {/* Pro Engine */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between space-y-8 border-cyan-500/40 relative shadow-[0_0_30px_rgba(6,182,212,0.05)] bg-slate-950/60">
              <div className="absolute top-3 right-3 text-[9px] font-bold tracking-wider uppercase text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">Most Deployed</div>
              <div className="space-y-4">
                <span className="mono text-[10px] text-cyan-400 block uppercase font-semibold">02 // Pro Engine</span>
                <div className="text-3xl font-bold text-white">$120<span className="text-xs font-normal text-slate-500"> /mo</span></div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">Unlocks infinite recursive logic arrays, multi-threaded node hunting, and graphic vector reading.</p>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-2.5 pt-4 border-t border-slate-900/60 font-light">
                <li>• Unlimited Execution Reasoning Loops</li>
                <li>• Visual Intelligence System Decoder</li>
                <li>• Live Telemetry Stream Monitors</li>
                <li>• Dedicated Compute Priority Tier</li>
              </ul>
              <button 
                onClick={handleLaunch}
                className="w-full py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs tracking-wide transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
              >
                PROVISION ENGINE
              </button>
            </div>

            {/* Enterprise Custom */}
            <div className="glass-card p-6 rounded-xl flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="mono text-[10px] text-slate-400 block uppercase font-semibold">03 // Institution Cluster</span>
                <div className="text-3xl font-bold text-white">Custom<span className="text-xs font-normal text-slate-500"> /tier</span></div>
                <p className="text-xs text-slate-400 leading-relaxed font-light">For venture matrix arrays and global desks demanding bespoke deployment parameters.</p>
              </div>
              <ul className="text-[11px] text-slate-400 space-y-2.5 pt-4 border-t border-slate-900/60 font-light">
                <li>• Custom Math α Threshold Control</li>
                <li>• Private Cloud Infrastructure Sandboxing</li>
                <li>• Air-Gapped Internal Database Hooks</li>
                <li>• 24/7 Engine Diagnostics Control</li>
              </ul>
              <button 
                onClick={handleLaunch}
                className="w-full py-2.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs tracking-wide transition-colors cursor-pointer"
              >
                CONTACT CORE OPERATIONS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Exit Call-To-Action Block */}
      <section className="py-32 max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent blur-3xl pointer-events-none"></div>
        <div className="space-y-8 relative">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-xl mx-auto leading-tight">
            Deploy Autonomous Intelligence Architecture.
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-light">
            Stop manual validation processes. Provision a deep ResearchX node cluster and query across total parameter matrices instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={handleLaunch}
              className="w-full sm:w-auto bg-white hover:bg-slate-200 text-black font-semibold text-xs tracking-wider px-6 py-3 rounded-md transition-colors cursor-pointer"
            >
              START RESEARCH NOW
            </button>
            <button 
              onClick={handleLaunch}
              className="w-full sm:w-auto border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-300 font-medium text-xs tracking-wider px-6 py-3 rounded-md transition-colors cursor-pointer"
            >
              REQUEST ARCHITECTURE BRIEFING
            </button>
          </div>
        </div>
      </section>

      {/* Minimal Engineering Footer */}
      <footer className="border-t border-slate-900 py-12 text-center px-4 relative z-10 mono text-[10px] text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 RESEARCHX CORE SYSTEM ENG. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">SYS_STATUS: NOMINAL</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">SECURITY_MANIFEST</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">NODE_LOGS</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
