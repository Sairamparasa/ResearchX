"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  ShieldAlert,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Authentication pipeline simulation steps
  const LOADING_STEPS = [
    "Establishing handshake with Core Cluster...",
    "Decrypting credentials package...",
    "Synchronizing workspace telemetry...",
    "Authentication complete. Launching terminal..."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading && loadingStep < LOADING_STEPS.length - 1) {
      timer = setTimeout(() => {
        setLoadingStep((prev) => prev + 1);
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [isLoading, loadingStep]);

  const computeProfileData = (inputName: string) => {
    const trimmed = inputName.trim();
    if (!trimmed) return { full: "Saira P.", greeting: "Saira", initials: "SP" };

    const parts = trimmed.split(/\s+/);
    const first = parts[0];
    const greeting = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    
    let initials = "SP";
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length > 0) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }

    return {
      full: trimmed,
      greeting,
      initials
    };
  };

  // Handle mock login submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Display Name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    triggerAuthFlow();
  };

  // Handle mock SSO login
  const handleSSO = (provider: string) => {
    setError(null);
    const displayName = name.trim();
    if (!displayName) {
      setError(`Please enter a Display Name above to sign in via ${provider}.`);
      return;
    }
    triggerAuthFlow(displayName);
  };

  const triggerAuthFlow = (customName?: string) => {
    setIsLoading(true);
    setLoadingStep(0);

    const displayName = customName || name.trim() || "Saira P.";
    const profileData = computeProfileData(displayName);

    setTimeout(() => {
      sessionStorage.setItem("researchx_auth_session", "true");
      localStorage.setItem("researchx_profile_name_full", profileData.full);
      localStorage.setItem("researchx_profile_name", profileData.greeting);
      localStorage.setItem("researchx_profile_initials", profileData.initials);
      localStorage.setItem("researchx_profile_role", "Premium Analyst");

      // Notify other tabs/react state
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }

      // Check for saved redirect path
      const redirectUrl = sessionStorage.getItem("researchx_redirect_after_login");
      if (redirectUrl) {
        sessionStorage.removeItem("researchx_redirect_after_login");
        router.push(redirectUrl);
      } else {
        router.push("/dashboard");
      }
    }, 3200); // Allow time to see the simulation steps
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden select-none bg-[#050816] engineering-grid">
      {/* Auroras */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] aurora-purple pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] aurora-cyan pointer-events-none z-0" />

      {/* Main card panel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {!isLoading ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header Logo */}
              <div className="text-center space-y-2">
                <Link href="/" className="inline-flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-purple via-accent-blue to-accent-cyan flex items-center justify-center shadow-lg shadow-accent-purple/20">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-lg tracking-tight text-white">
                    ResearchX
                  </span>
                </Link>
                <h2 className="text-xl font-medium text-zinc-100 tracking-tight pt-2">
                  Welcome to the Intelligence Console
                </h2>
                <p className="text-xs text-zinc-400 font-light">
                  Deploy autonomous agents to inspect & verify global parameters.
                </p>
              </div>

              {/* Shared Error Banner */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Unified Display Name Field at the top */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-medium pl-1">Display Name / Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Saira P."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/20 transition-all font-light"
                  />
                </div>
              </div>

              {/* SSO Buttons */}
              <div className="space-y-2">
                <label className="text-[11px] text-zinc-400 font-medium pl-1 block">Provision via SSO Simulation</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSSO("Google")}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.24 10.285V13.4 h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.743-.08-1.3-.176-1.852H12.24z"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSSO("GitHub")}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-zinc-100" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/[0.05]"></div>
                <span className="flex-shrink mx-3 text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Or credentials</span>
                <div className="flex-grow border-t border-white/[0.05]"></div>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 font-medium pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@researchx.ai"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/20 transition-all font-light"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-[11px] text-zinc-400 font-medium">Security Password</label>
                    <span className="text-[10px] text-accent-purple hover:underline cursor-pointer">Forgot?</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-purple-600 via-accent-purple to-accent-blue hover:from-purple-500 hover:to-accent-blue text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-600/15 cursor-pointer"
                >
                  INITIALIZE SESSION
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Signup Notice */}
              <div className="text-center text-[10px] text-zinc-500 font-light pt-2">
                By entering the console, you authorize sandbox telemetry tracking. 
                <span className="text-zinc-400 hover:text-white pl-1 cursor-pointer">Terms of Service</span>.
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
                  AUTHENTICATING
                </h3>
                <p className="text-xs text-zinc-400 font-mono h-4 min-w-[250px]">
                  {LOADING_STEPS[loadingStep]}
                </p>
              </div>
              
              {/* Progress Indicator */}
              <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
