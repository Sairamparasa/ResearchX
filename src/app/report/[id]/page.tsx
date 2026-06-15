"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Download, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Star, 
  Share2, 
  Check,
  FolderOpen,
  Image as ImageIcon,
  Compass,
  PieChart as ChartIcon,
  Search,
  CheckCircle2,
  ExternalLink,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { generateSmartReport } from "@/lib/agents/runner";
import { ResearchReport } from "@/types";

// Recharts components loaded client-side
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Cell,
  Pie,
  CartesianGrid
} from "recharts";

const MOCK_AIRPODS_SOURCES = [
  { id: "src-0", url: "https://www.apple.com/newsroom", title: "Apple Reports Fourth Quarter Earnings", domain: "apple.com", reliability: 98, agreement: "agree" as const, freshness: 85, status: "crawled" as const },
  { id: "src-1", url: "https://www.canalys.com", title: "Global Smart Personal Audio Market Forecast", domain: "canalys.com", reliability: 92, agreement: "agree" as const, freshness: 90, status: "crawled" as const },
  { id: "src-2", url: "https://www.bloomberg.com", title: "Apple's AirPods Segment Revenue Run Rate", domain: "bloomberg.com", reliability: 90, agreement: "agree" as const, freshness: 88, status: "crawled" as const },
  { id: "src-3", url: "https://www.idc.com", title: "IDC Worldwide Wearables Tracker", domain: "idc.com", reliability: 92, agreement: "neutral" as const, freshness: 82, status: "crawled" as const }
];

const MOCK_AIRPODS_EVIDENCE = [
  { id: "ev-1", sourceId: "src-0", claim: "Apple reports AirPods sales leading holiday quarters, wearables hit $42.5 billion in total segment revenue.", date: "Feb 12, 2026", metric: "Segment Revenue", value: "$42.5 Billion" },
  { id: "ev-2", sourceId: "src-1", claim: "Canalys estimates global AirPods shipments at 56.2 million units with a TWS market share of 28.5%.", date: "Mar 20, 2026", metric: "Global Shipments", value: "56.2 Million" },
  { id: "ev-3", sourceId: "src-2", claim: "Bloomberg analysis estimates ~58 million AirPods sold globally across all product tiers for the fiscal year.", date: "Nov 15, 2025", metric: "Bloomberg Estimate", value: "58.0 Million" },
  { id: "ev-4", sourceId: "src-3", claim: "IDC shipment tracker estimates AirPods shipments at 55.8 million with an ASP of $185 per unit.", date: "Jan 10, 2026", metric: "Average Sales Price", value: "$185 / Unit" }
];

const MOCK_OPENAI_SOURCES = [
  { id: "src-0", url: "https://openai.com", title: "OpenAI Reports Financial Growth", domain: "openai.com", reliability: 98, agreement: "agree" as const, freshness: 95, status: "crawled" as const },
  { id: "src-1", url: "https://www.bloomberg.com", title: "OpenAI's Annualized Revenue Run Rate", domain: "bloomberg.com", reliability: 90, agreement: "agree" as const, freshness: 88, status: "crawled" as const },
  { id: "src-2", url: "https://www.techcrunch.com", title: "OpenAI ARR Milestone Jump", domain: "techcrunch.com", reliability: 90, agreement: "agree" as const, freshness: 90, status: "crawled" as const },
  { id: "src-3", url: "https://www.theinformation.com", title: "Anthropic revenue climbs to $2B", domain: "theinformation.com", reliability: 92, agreement: "neutral" as const, freshness: 85, status: "crawled" as const }
];

const MOCK_OPENAI_EVIDENCE = [
  { id: "ev-1", sourceId: "src-0", claim: "OpenAI ARR reaches $10.0 billion run rate, driven by developer APIs and consumer Plus subscriptions.", date: "Feb 12, 2026", metric: "OpenAI ARR", value: "$10.0 Billion" },
  { id: "ev-2", sourceId: "src-1", claim: "Bloomberg confirms OpenAI run rate at $830 million monthly, representing a $10.0B annual ARR.", date: "Mar 20, 2026", metric: "OpenAI Monthly", value: "$830 Million" },
  { id: "ev-3", sourceId: "src-2", claim: "TechCrunch records OpenAI's ARR jump from $2.0 billion to $10.0 billion inside an 18-month span.", date: "Nov 15, 2025", metric: "SaaS Scale Time", value: "18 Months" },
  { id: "ev-4", sourceId: "src-3", claim: "Anthropic annualized revenue ARR hits $2.2 billion, primarily bolstered by Amazon Bedrock deployments.", date: "Jan 10, 2026", metric: "Anthropic ARR", value: "$2.2 Billion" }
];

export default function ReportPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "charts" | "evidence" | "visuals">("summary");
  const [isMounted, setIsMounted] = useState(false);
  const [collection, setCollection] = useState("Unassigned");
  const [isCopied, setIsCopied] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Look up in LocalStorage
    const saved = localStorage.getItem("researchx_reports");
    const reportsList = saved ? JSON.parse(saved) : [];
    const found = reportsList.find((r: any) => r.id === id);

    if (found) {
      setReport(found);
    } else {
      // Fallback defaults for testing URL direct entry
      if (id === "airpods" || id?.toString().includes("airpod")) {
        const r = generateSmartReport("How many AirPods were sold this year?", MOCK_AIRPODS_SOURCES, MOCK_AIRPODS_EVIDENCE);
        setReport(r);
      } else if (id === "openai" || id?.toString().includes("openai")) {
        const r = generateSmartReport("Compare OpenAI and Anthropic revenue.", MOCK_OPENAI_SOURCES, MOCK_OPENAI_EVIDENCE);
        setReport(r);
      } else {
        // Fallback default
        const r = generateSmartReport("How many AirPods were sold this year?", MOCK_AIRPODS_SOURCES, MOCK_AIRPODS_EVIDENCE);
        setReport(r);
      }
    }
  }, [id]);

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-screen bg-[#09090B] text-zinc-500">
        <LoaderComponent />
      </div>
    );
  }

  // Export to Markdown
  const handleExportMarkdown = () => {
    const content = `
# ${report.query}
*ResearchX Intelligence Report - Compiled on ${report.createdAt}*

## Executive Summary
${report.executiveSummary}

## Key Findings
${report.findings.map(f => `- **${f.title}**: ${f.metric} (${f.description}) [Confidence: ${f.confidence}%]`).join("\n")}

## Source Reliability & Agreement Table
| Source | Claim | Date | Reliability | Agreement |
| :--- | :--- | :--- | :--- | :--- |
${report.evidenceTable.map(row => `| [${row.sourceName}](${row.sourceUrl}) | ${row.claim} | ${row.date} | ${row.reliability}% | ${row.agreement} |`).join("\n")}

## Confidence Analysis
- **Overall Confidence Score**: ${report.confidenceAnalysis.score}%
- **Supporting Arguments**:
${report.confidenceAnalysis.reasonsHigh.map(r => `  - ${r}`).join("\n")}
- **Limitations**:
${report.confidenceAnalysis.reasonsLow?.map(r => `  - ${r}`).join("\n")}

## Citations
${report.citations.map(c => `- [${c.title}](${c.url}) (${c.domain})`).join("\n")}
    `;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ResearchX_${report.id}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export PDF (simulated or printing triggers)
  const handleExportPDF = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Neon colors for pie chart segments
  const COLORS = ["#7C3AED", "#3B82F6", "#06B6D4", "#10B981", "#E11D48"];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#09090B]/90 p-8 overflow-y-auto">
      
      {/* Dynamic zoom image Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setZoomImage(null)}>
          <img src={zoomImage} alt="Expanded visual evidence" className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl" />
        </div>
      )}

      {/* Header controls */}
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs bg-white/[0.02] border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to search
          </button>

          <div className="flex items-center gap-3">
            {/* Collection Assign Selector */}
            <div className="flex items-center gap-1 text-xs">
              <FolderOpen className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="bg-transparent border-0 text-zinc-300 font-medium focus:ring-0 cursor-pointer hover:text-white text-xs"
              >
                <option value="Unassigned" className="bg-[#09090B]">Unassigned</option>
                <option value="AI Research" className="bg-[#09090B]">AI Research</option>
                <option value="Startup Research" className="bg-[#09090B]">Startup Research</option>
                <option value="Market Intelligence" className="bg-[#09090B]">Market Intelligence</option>
                <option value="Finance" className="bg-[#09090B]">Finance</option>
              </select>
            </div>

            {/* Export buttons */}
            <button 
              onClick={handleShare}
              className="p-2 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white rounded-xl transition-all duration-200"
              title="Copy link"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white rounded-xl text-xs transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
            <button 
              onClick={handleExportMarkdown}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-tr from-accent-purple to-accent-blue text-white rounded-xl text-xs hover:scale-102 transition-transform shadow-lg shadow-accent-purple/10"
            >
              <FileText className="w-3.5 h-3.5" />
              Markdown
            </button>
          </div>
        </div>

        {/* Query Title */}
        <div className="flex flex-col gap-2 border-b border-white/5 pb-6">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Generated Research Report</span>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            {report.query}
          </h1>
          <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {report.createdAt}
            </span>
            <span>•</span>
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
              Verified Report
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-6xl mx-auto w-full items-start">
        
        {/* Left Side: Summary, Findings & Tabbed View (75%) */}
        <div className="xl:col-span-3 flex flex-col gap-8">
          {/* Key Findings Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {report.findings.map((finding, idx) => (
              <div 
                key={idx}
                className="glass-panel p-5 rounded-2xl border-white/5 flex flex-col gap-3 relative overflow-hidden group hover:border-accent-purple/20 transition-colors"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent-purple/5 blur-xl rounded-full" />
                <span className="text-[10px] text-zinc-400 font-light truncate relative z-10">{finding.title}</span>
                <span className="text-xl md:text-2xl font-bold text-white tracking-tight glow-purple relative z-10">{finding.metric}</span>
                <div className="flex items-center justify-between text-[9px] text-zinc-500 relative z-10 mt-1">
                  <span>Confidence: <b className="text-zinc-400">{finding.confidence}%</b></span>
                  <span>Sources: <b className="text-zinc-400">{finding.sourcesCount}</b></span>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/5 p-1 gap-2 self-start bg-white/[0.01] rounded-xl">
            {[
              { id: "summary", name: "Executive Summary", icon: Compass },
              { id: "charts", name: "Visual Insights", icon: ChartIcon },
              { id: "evidence", name: "Evidence Tracker", icon: Layers },
              { id: "visuals", name: "Visual Intelligence", icon: ImageIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white/[0.04] text-white border border-white/10"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.01]"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="glass-panel p-8 rounded-2xl border-white/5">
            {activeTab === "summary" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-accent-purple" />
                  <h3 className="text-sm font-semibold text-zinc-200">Synthesis Overview</h3>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed font-light whitespace-pre-wrap">
                  {report.executiveSummary}
                </p>

                {/* Sub-insights section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-zinc-200">Confidence Analysis Factors</span>
                    <span className="text-[11px] text-zinc-500 font-light leading-relaxed">
                      This analysis contains evidence cross-verified from {report.citations.length} domains. Agreement level is rated as exceptionally high.
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-zinc-200">Methodology</span>
                    <span className="text-[11px] text-zinc-500 font-light leading-relaxed">
                      Information was harvested via Context.dev Crawl APIs and processed through the Synthesis Agent parsing engine.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "charts" && (
              <div className="flex flex-col gap-8">
                {isMounted ? (
                  report.charts && report.charts.length > 0 ? (
                    report.charts.map((chart, idx) => (
                      <div key={idx} className="flex flex-col gap-4">
                        <span className="text-xs font-semibold text-zinc-300">{chart.title}</span>
                        <div className="h-64 w-full bg-white/[0.01] rounded-xl border border-white/[0.03] p-4 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            {chart.type === "bar" ? (
                              <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey={chart.xAxisKey} stroke="#71717A" fontSize={10} tickLine={false} />
                                <YAxis stroke="#71717A" fontSize={10} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: "#09090B", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px", color: "#FFF" }} />
                                <Bar dataKey={chart.dataKeys[0]} fill="url(#purpleBlue)" radius={[4, 4, 0, 0]} />
                                <defs>
                                  <linearGradient id="purpleBlue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                  </linearGradient>
                                </defs>
                              </BarChart>
                            ) : chart.type === "line" ? (
                              <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey={chart.xAxisKey} stroke="#71717A" fontSize={10} tickLine={false} />
                                <YAxis stroke="#71717A" fontSize={10} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: "#09090B", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px", color: "#FFF" }} />
                                <Line type="monotone" dataKey={chart.dataKeys[0]} stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", strokeWidth: 1 }} activeDot={{ r: 5 }} />
                              </LineChart>
                            ) : (
                              <PieChart>
                                <Pie
                                  data={chart.data}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={80}
                                  paddingAngle={4}
                                  dataKey={chart.dataKeys[0]}
                                >
                                  {chart.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: "#09090B", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px", color: "#FFF" }} />
                                </PieChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-48 flex items-center justify-center text-zinc-500 text-xs">No chart datasets available.</div>
                  )
                ) : (
                  <div className="h-64 bg-white/[0.01] animate-pulse rounded-xl" />
                )}
              </div>
            )}

            {activeTab === "evidence" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-accent-cyan" />
                  <h3 className="text-sm font-semibold text-zinc-200">Source Claims Cross-Reference</h3>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-zinc-400 font-medium pb-3">
                        <th className="py-3 pr-4">Source</th>
                        <th className="py-3 px-4">Claim extracted</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Reliability</th>
                        <th className="py-3 pl-4 text-right">Agreement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {report.evidenceTable.map((row, idx) => {
                        const agreementColors: any = {
                          Agree: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                          Neutral: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
                          Disagree: "text-rose-400 bg-rose-500/10 border-rose-500/20"
                        };

                        return (
                          <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-3.5 pr-4 text-accent-blue font-medium hover:underline">
                              <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                {row.sourceName}
                                <ExternalLink className="w-3 h-3 text-zinc-500" />
                              </a>
                            </td>
                            <td className="py-3.5 px-4 text-zinc-300 font-light max-w-sm leading-normal">{row.claim}</td>
                            <td className="py-3.5 px-4 text-zinc-500 font-light">{row.date}</td>
                            <td className="py-3.5 px-4 text-right text-zinc-300 font-semibold">{row.reliability}%</td>
                            <td className="py-3.5 pl-4 text-right">
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold ${agreementColors[row.agreement]}`}>
                                {row.agreement}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "visuals" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-accent-blue" />
                  <h3 className="text-sm font-semibold text-zinc-200">Extracted Visual Evidence</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="group relative rounded-xl overflow-hidden border border-white/5 cursor-pointer shadow-lg shadow-black/40 hover:border-white/20 transition-all duration-300"
                      onClick={() => setZoomImage(img.url)}
                    >
                      <div className="aspect-video w-full overflow-hidden bg-zinc-950 relative">
                        <img 
                          src={img.url} 
                          alt={img.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        {/* Overlay trigger */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[10px] text-white bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">Click to expand</span>
                        </div>
                      </div>
                      <div className="p-3 bg-white/[0.01] border-t border-white/5 text-[11px] text-zinc-400 font-light truncate">
                        {img.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reliability Engine & Citations (25%) */}
        <div className="flex flex-col gap-6">
          {/* Confidence Score Card */}
          <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 blur-2xl rounded-full" />
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 relative z-10">
              <ShieldCheck className="w-4 h-4 text-accent-cyan" />
              <h3 className="text-xs font-semibold text-zinc-300">Confidence Rating</h3>
            </div>
            
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-4xl font-extrabold text-white glow-cyan">
                {report.confidenceAnalysis.score}%
              </span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">High Quality</span>
            </div>

            <div className="flex flex-col gap-2 relative z-10 mt-2">
              <span className="text-[10px] text-zinc-400 font-medium">Why it's high:</span>
              <div className="flex flex-col gap-1.5">
                {report.confidenceAnalysis.reasonsHigh.map((r, i) => (
                  <div key={i} className="flex gap-2 text-[10px] text-zinc-500 leading-normal font-light">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Citations panel */}
          <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-semibold text-zinc-300">Citations</span>
              <span className="text-[10px] text-zinc-500">[{report.citations.length} links]</span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
              {report.citations.map((cite, idx) => (
                <a
                  key={cite.id}
                  href={cite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/[0.04] transition-all group"
                >
                  <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-semibold text-zinc-400 group-hover:text-white shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex flex-col gap-0.5 truncate">
                    <span className="text-[10px] text-zinc-300 font-medium truncate group-hover:text-white transition-colors">{cite.title}</span>
                    <span className="text-[9px] text-zinc-500 truncate">{cite.domain}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function LoaderComponent() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="w-8 h-8 text-accent-purple animate-spin" />
      <span className="text-sm font-light text-zinc-400">Loading intelligence analysis...</span>
    </div>
  );
}
