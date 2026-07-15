import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Sparkles, 
  Check, 
  Terminal, 
  Activity, 
  CheckSquare, 
  LineChart, 
  Lock, 
  ShieldCheck, 
  MessageSquare, 
  Zap, 
  Users, 
  Globe, 
  ArrowUpRight 
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
  onGoogleLogin: () => void;
}

export default function LandingPage({ onEnterApp, onGoogleLogin }: LandingPageProps) {
  // Live Simulated Preview State
  const [activeMockTab, setActiveMockTab] = useState<"overview" | "metrics" | "ledger">("overview");
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({
    "task-1": true,
    "task-2": true,
    "task-3": false,
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [demoRequested, setDemoRequested] = useState(false);
  const [demoEmail, setDemoEmail] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Extremely subtle tilt (max 2 degrees)
    setMousePosition({
      x: (x / (box.width / 2)) * 2,
      y: (y / (box.height / 2)) * -2,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedTasks).filter(Boolean).length;
  const progressPct = Math.round((completedCount / 3) * 100);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoEmail.trim()) {
      setDemoRequested(true);
      setTimeout(() => {
        setDemoRequested(false);
        setDemoEmail("");
      }, 4000);
    }
  };

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] dark:bg-[#0A0A0A] text-[#171717] dark:text-[#E5E5E5] font-sans selection:bg-[#0057FF]/10 overflow-x-hidden flex flex-col justify-between" id="landing-root">
      
      {/* Navigation Header */}
      <header className="px-8 sm:px-16 py-4.5 flex items-center justify-between border-b border-neutral-200/40 dark:border-neutral-800/40 bg-[#FBFBFA]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-base font-display font-medium tracking-tight text-[#171717] dark:text-white flex items-center gap-1.5">
              Nexora <span className="inline-block w-2 h-2 bg-[#0057FF] rounded-[2px]" />
            </span>
          </div>
          
          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
            <button onClick={() => scrollToSection("features")} className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection("security")} className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer">Security</button>
            <button onClick={() => scrollToSection("testimonials")} className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer">Enterprise</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer">Pricing</button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors flex items-center gap-1">Docs <ArrowUpRight className="w-3 h-3" /></a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onEnterApp}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={onEnterApp}
            className="bg-white dark:bg-[#15171A] hover:bg-[#FFFFFF]/95 dark:hover:bg-[#1E2024] text-[#0057FF] dark:text-white border border-neutral-200/60 dark:border-neutral-800 text-xs font-semibold px-4 py-2.5 rounded-[12px] shadow-premium-sm hover:shadow-premium-md hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            Launch App <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pt-12 md:pt-20 pb-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Hero text Left */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white dark:bg-[#15171A] border border-neutral-200/50 dark:border-neutral-800 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-medium text-neutral-500 dark:text-neutral-400 shadow-premium-sm self-start"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0057FF]" />
              <span>Workspace Operational OS</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-5.5xl font-display font-medium tracking-tight text-[#171717] dark:text-white leading-[1.08] text-balance"
            >
              Run your organization <br />
              from one intelligent <br />
              workspace.
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed text-balance font-normal"
            >
              Instead of switching between ten different tools, manage projects, teams, documents, analytics and communication from one place. Perfectly isolated, beautifully aligned, powered by Nexora Intelligence.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2"
            >
              <button 
                onClick={onEnterApp}
                className="bg-[#171717] hover:bg-neutral-800 dark:bg-white dark:hover:bg-white/95 text-white dark:text-[#171717] font-semibold text-xs px-6 py-3.5 rounded-[12px] shadow-premium-sm hover:shadow-premium-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Free <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollToSection("demo-section")}
                className="bg-white dark:bg-[#15171A] hover:bg-neutral-50 dark:hover:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-[#171717] dark:text-neutral-200 font-semibold text-xs px-6 py-3.5 rounded-[12px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                Book Demo
              </button>
            </motion.div>

            {/* Google Login Trigger */}
            <motion.div variants={itemVariants} className="pt-2 border-t border-neutral-200/30 dark:border-neutral-800/40">
              <button 
                onClick={onGoogleLogin}
                className="text-[11px] font-mono text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.16-3.16C17.45 1.76 14.93 1 12 1 7.24 1 3.2 3.74 1.25 7.72l3.77 2.92C5.92 7.17 8.71 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.45c-.28 1.47-1.11 2.72-2.36 3.56l3.77 2.92c2.2-2.03 3.63-5.02 3.63-8.59z" />
                  <path fill="#FBBC05" d="M5.02 14.64a7.27 7.27 0 0 1 0-4.57V7.15H1.25a11.97 11.97 0 0 0 0 9.74l3.77-2.92c-.12-.37-.19-.77-.19-1.18z" />
                  <path fill="#34A853" d="M12 18.96c-3.29 0-6.08-2.13-7.08-5.21L1.15 16.67C3.1 20.65 7.14 23.38 12 23.38c3.24 0 5.95-1.08 7.93-2.91l-3.77-2.92c-1.12.75-2.55 1.21-4.16 1.21z" />
                </svg>
                <span>Or authenticate instantly via Workspace Single Sign-On</span>
              </button>
            </motion.div>
          </div>

          {/* Hero interactive animated dashboard on right */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <motion.div 
              variants={itemVariants}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
                transition: mousePosition.x === 0 ? "all 0.5s ease-out" : "none"
              }}
              className="w-full bg-white dark:bg-[#111214] rounded-[24px] border border-neutral-200/60 dark:border-neutral-800 p-3 shadow-premium-lg relative"
            >
              <div className="bg-[#FAF9F6] dark:bg-[#0E1012] rounded-[18px] border border-neutral-150/40 dark:border-neutral-850 overflow-hidden h-[360px] flex flex-col justify-between">
                {/* Window control points */}
                <div className="px-5 py-3.5 border-b border-neutral-200/40 dark:border-neutral-850 flex items-center justify-between bg-white/60 dark:bg-neutral-900/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>nexora.hq_secure_node</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-mono text-neutral-400">98ms</span>
                  </div>
                </div>

                {/* Inner Content Grid representation */}
                <div className="flex-1 grid grid-cols-4 text-left overflow-hidden">
                  {/* Sidebar item mocks */}
                  <div className="col-span-1 flex flex-col gap-5 border-r border-neutral-200/30 dark:border-neutral-850/60 p-4 bg-white/30 dark:bg-[#111214]/20">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-bold">WORKSPACE OS</span>
                    <div className="flex flex-col gap-1.5">
                      <button 
                        onClick={() => setActiveMockTab("overview")}
                        className={`w-full text-left h-7 rounded-[8px] flex items-center gap-2 px-2.5 text-[11px] font-semibold transition-all ${
                          activeMockTab === "overview" 
                            ? "bg-white dark:bg-neutral-800 text-[#171717] dark:text-white shadow-premium-sm border border-neutral-200/40 dark:border-neutral-700" 
                            : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        }`}
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Milestones</span>
                      </button>

                      <button 
                        onClick={() => setActiveMockTab("metrics")}
                        className={`w-full text-left h-7 rounded-[8px] flex items-center gap-2 px-2.5 text-[11px] font-semibold transition-all ${
                          activeMockTab === "metrics" 
                            ? "bg-white dark:bg-neutral-800 text-[#171717] dark:text-white shadow-premium-sm border border-neutral-200/40 dark:border-neutral-700" 
                            : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        }`}
                      >
                        <LineChart className="w-3.5 h-3.5" />
                        <span>Analytics</span>
                      </button>

                      <button 
                        onClick={() => setActiveMockTab("ledger")}
                        className={`w-full text-left h-7 rounded-[8px] flex items-center gap-2 px-2.5 text-[11px] font-semibold transition-all ${
                          activeMockTab === "ledger" 
                            ? "bg-white dark:bg-neutral-800 text-[#171717] dark:text-white shadow-premium-sm border border-neutral-200/40 dark:border-neutral-700" 
                            : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Live Ledger</span>
                      </button>
                    </div>

                    <div className="mt-auto border-t border-neutral-200/40 dark:border-neutral-800 pt-3">
                      <span className="text-[8px] font-mono text-neutral-400 block">CURRENT ROLE</span>
                      <span className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 block mt-0.5">Administrator</span>
                    </div>
                  </div>

                  {/* Main space mock */}
                  <div className="col-span-3 p-5 flex flex-col justify-between overflow-y-auto scrollbar-none bg-white/10 dark:bg-transparent">
                    
                    {activeMockTab === "overview" && (
                      <div className="flex flex-col gap-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Interactive Module</span>
                            <h3 className="text-sm font-semibold text-[#171717] dark:text-white mt-0.5">Core Deployment Checklist</h3>
                          </div>
                          <div className="flex items-center gap-1.5 bg-[#0057FF]/10 text-[#0057FF] px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border border-[#0057FF]/10">
                            <span>{progressPct}% COMPLETED</span>
                          </div>
                        </div>

                        {/* Progress indicator */}
                        <div className="h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#0057FF] transition-all duration-500" style={{ width: `${progressPct}%` }} />
                        </div>

                        {/* Dynamic Task items */}
                        <div className="flex flex-col gap-2 mt-1">
                          {[
                            { id: "task-1", label: "Mute non-tenant sandbox channels" },
                            { id: "task-2", label: "Hydrate isolated schema adapters" },
                            { id: "task-3", label: "Consensus write ledger synchronization" }
                          ].map((item) => (
                            <div 
                              key={item.id}
                              onClick={() => toggleTask(item.id)}
                              className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-neutral-150/40 dark:border-neutral-800/80 rounded-[10px] p-2.5 shadow-premium-sm hover:border-neutral-300 dark:hover:border-neutral-750 transition-colors cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${
                                  checkedTasks[item.id] 
                                    ? "bg-[#0057FF] border-[#0057FF]" 
                                    : "border-neutral-300 dark:border-neutral-700 bg-transparent"
                                }`}>
                                  {checkedTasks[item.id] && <Check className="w-3 h-3 text-white stroke-[3.5px]" />}
                                </div>
                                <span className={`text-[11px] font-medium transition-colors ${
                                  checkedTasks[item.id] ? "text-neutral-400 dark:text-neutral-500 line-through" : "text-neutral-700 dark:text-neutral-300"
                                }`}>{item.label}</span>
                              </div>
                              <span className="text-[9px] font-mono text-neutral-400">01</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeMockTab === "metrics" && (
                      <div className="flex flex-col gap-4 animate-fade-in">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Operational Analytics</span>
                          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mt-0.5">Consensus Transaction Velocity</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800 p-3 rounded-[12px] shadow-premium-sm">
                            <span className="text-[8px] font-mono text-neutral-400 block font-bold uppercase">Requests</span>
                            <span className="text-sm font-bold text-neutral-800 dark:text-white font-mono block mt-1">45.2K / s</span>
                          </div>
                          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800 p-3 rounded-[12px] shadow-premium-sm">
                            <span className="text-[8px] font-mono text-neutral-400 block font-bold uppercase">Consensus</span>
                            <span className="text-sm font-bold text-neutral-800 dark:text-white font-mono block mt-1">99.98%</span>
                          </div>
                          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800 p-3 rounded-[12px] shadow-premium-sm">
                            <span className="text-[8px] font-mono text-neutral-400 block font-bold uppercase">Uptime</span>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400 font-mono block mt-1">100.0%</span>
                          </div>
                        </div>

                        {/* Simple beautiful line path representation */}
                        <div className="h-16 w-full bg-neutral-50 dark:bg-neutral-900/60 rounded-[10px] border border-neutral-200/20 dark:border-neutral-800/40 relative flex items-end p-2 overflow-hidden">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 40">
                            <path 
                              d="M0 35 Q30 5, 60 25 T120 15 T180 5 T240 30 T300 10" 
                              fill="none" 
                              stroke="#0057FF" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                            />
                            <div className="absolute left-2 top-2 flex items-center gap-1">
                              <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                              <span className="text-[8px] font-mono text-neutral-400 uppercase">Live throughput</span>
                            </div>
                          </svg>
                        </div>
                      </div>
                    )}

                    {activeMockTab === "ledger" && (
                      <div className="flex flex-col gap-3 animate-fade-in font-mono text-[9.5px]">
                        <div className="flex flex-col font-sans">
                          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Tamper-evident Logs</span>
                          <h3 className="text-sm font-semibold text-[#171717] dark:text-white mt-0.5">Secure Organizational Ledger</h3>
                        </div>

                        <div className="bg-neutral-950 dark:bg-black text-[#A0A0A0] p-3.5 rounded-[12px] border border-neutral-800 flex flex-col gap-1.5 leading-relaxed overflow-hidden max-h-[160px]">
                          <div className="flex items-center justify-between text-[#0057FF] font-semibold border-b border-neutral-800/80 pb-1.5 mb-1">
                            <span>LEDGE_NODE: CONSENSUS_ACTIVE</span>
                            <span>SH-512</span>
                          </div>
                          <div className="truncate"><span className="text-neutral-600">19:04:12</span> [WRITE] Marcus updated portfolio <span className="text-emerald-500">nexora-hq</span></div>
                          <div className="truncate"><span className="text-neutral-600">19:04:22</span> [SECURE] Cryptographic ledger verified (Consensus rate: 100%)</div>
                          <div className="truncate"><span className="text-neutral-600">19:04:35</span> [SYNC] Fully synced tenant database. Latency <span className="text-blue-500">45ms</span></div>
                        </div>
                      </div>
                    )}

                    {/* Simulated minimal footer */}
                    <div className="border-t border-neutral-200/40 dark:border-neutral-850 pt-2.5 mt-2.5 flex items-center justify-between text-[8.5px] font-mono text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span>TENANT_ISOLATION_CHANNEL: ESTABLISHED</span>
                      </div>
                      <span>EST. LATENCY: 45MS</span>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* TRUSTED BY TEAMS (Logo stripe) */}
        <div className="mt-28 border-t border-neutral-200/30 dark:border-neutral-800/40 pt-10 text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold mb-6">TRUSTED BY TEAMS WORLDWIDE</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-sm font-semibold tracking-tight text-neutral-400/80 dark:text-neutral-500/80 select-none">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
              <span>Vercel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-sm" />
              <span>Linear</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <span>// Stripe</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif italic font-bold">Framer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-neutral-300 dark:bg-neutral-700 rounded-[2px] transform rotate-45" />
              <span>Notion</span>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <section id="features" className="mt-32 pt-12 border-t border-neutral-200/30 dark:border-neutral-800/40">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#0057FF] font-bold">BUILT FOR VELOCITY</span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#171717] dark:text-white mt-2">
              Everything you need, in perfect alignment.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2.5">
              Engineered cleanly to replace disconnected platforms. No useless charts, just the exact features built with 100% precision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-[#111214] border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-[16px] shadow-premium-sm flex flex-col gap-4">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-[#0057FF]">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#171717] dark:text-white">Milestone & Portfolio Trees</h3>
                <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1">
                  Plan complex delivery maps, isolate scopes by workspace, and track real progress with automated liveness check-ins.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-[#111214] border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-[16px] shadow-premium-sm flex flex-col gap-4">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-[#0057FF]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#171717] dark:text-white">Intelligent Context Concierge</h3>
                <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1">
                  Query local workspace history, write-out quick sprint backlogs, and compile meeting summaries using Nexora Intellect.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-[#111214] border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-[16px] shadow-premium-sm flex flex-col gap-4">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-[#0057FF]">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm text-[#171717] dark:text-white">Tamper-evident Metrics</h3>
                <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1">
                  An immutable local ledger of organizational events, deployment status pipelines, and deep telemetry reports.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section id="security" className="mt-32 pt-12 border-t border-neutral-200/30 dark:border-neutral-800/40">
          <div className="bg-neutral-100/50 dark:bg-[#111214]/40 border border-neutral-200/40 dark:border-neutral-850 p-8 md:p-12 rounded-[24px] grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 flex flex-col gap-4 text-left">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Cryptographic Tenancy
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#171717] dark:text-white leading-tight">
                Your data, perfectly isolated.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Nexora enforces isolated tenant database schemas at the database routing layer. No cross-workspace contamination is structurally possible. Every event, document, and chat draft is cryptographically signed and stored in immutable nodes.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono text-neutral-500 mt-2">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>SOC2 Type II Assured</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>SHA-512 Verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Zero Data Leaks Guarantee</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl p-5 shadow-premium-md w-full max-w-sm flex flex-col gap-3 font-mono text-[10px]">
                <div className="flex items-center justify-between border-b border-neutral-150 dark:border-neutral-800 pb-2">
                  <span className="font-bold text-neutral-400">ISOLATION REPORT</span>
                  <span className="text-emerald-500 font-bold">100% SECURE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Active Tenant ID:</span>
                  <span className="text-neutral-700 dark:text-neutral-300">NEX-9800-A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Cryptographic Seal:</span>
                  <span className="text-[#0057FF] truncate max-w-[120px]">ae4890d9f2c73</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Compliance Sync:</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Continuous Realtime</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-950 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-500 w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="testimonials" className="mt-32 pt-12 border-t border-neutral-200/30 dark:border-neutral-800/40">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#0057FF] font-bold">PROVEN TRUST</span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#171717] dark:text-white mt-2">
              Loved by software engineers and staff designers.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-[#111214] border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-[20px] shadow-premium-sm flex flex-col justify-between text-left">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                "Nexora is the first software tool in years that feels genuinely hand-crafted. The team coordination modules, combined with the context assistant, means we've completely ditched our old wiki and task trackers."
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-850">
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs">AM</div>
                <div>
                  <h4 className="font-semibold text-xs text-[#171717] dark:text-white">Alix Mercer</h4>
                  <p className="text-[10px] text-neutral-400">Lead Architect, Globe Scale</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-[#111214] border border-neutral-200/60 dark:border-neutral-800 p-6 rounded-[20px] shadow-premium-sm flex flex-col justify-between text-left">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                "We needed SOC2-compliant scope isolation and absolute data security. Nexora gave us pristine multi-tenant separation on day one, without losing any collaborative power or real-time event indexing."
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-850">
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs">SK</div>
                <div>
                  <h4 className="font-semibold text-xs text-[#171717] dark:text-white">Soren Krog</h4>
                  <p className="text-[10px] text-neutral-400">VP of Platform, Layer Labs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="mt-32 pt-12 border-t border-neutral-200/30 dark:border-neutral-800/40">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#0057FF] font-bold">TRANSPARENT VALUE</span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#171717] dark:text-white mt-2">
              Simple pricing. No hidden seat limits.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white dark:bg-[#111214] border border-neutral-200/60 dark:border-neutral-800 p-8 rounded-[24px] shadow-premium-sm flex flex-col justify-between text-left">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-neutral-400 tracking-wider">STANDARD</span>
                <h3 className="text-lg font-bold text-[#171717] dark:text-white mt-1">Community Sandbox</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono tracking-tight text-[#171717] dark:text-white">$0</span>
                  <span className="text-xs text-neutral-400 font-medium">/ month</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-500 mt-2.5">
                  Great for small teams who want to test the isolation guarantees and play with portfolios.
                </p>
                <div className="flex flex-col gap-2 mt-6 border-t border-neutral-100 dark:border-neutral-850 pt-5 text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> 3 Workspace Portfolio Slots</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> Basic Checklist Automation</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> Shared General Chat</div>
                </div>
              </div>
              <button 
                onClick={onEnterApp}
                className="w-full mt-8 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-neutral-800 dark:text-neutral-200 font-semibold text-xs py-3 rounded-[12px] transition-colors cursor-pointer text-center block"
              >
                Launch Now
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white dark:bg-[#111214] border border-[#0057FF]/30 dark:border-[#0057FF]/50 p-8 rounded-[24px] shadow-premium-md flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute right-4 top-4 bg-[#0057FF]/10 text-[#0057FF] text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full border border-[#0057FF]/10">
                POPULAR
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-[#0057FF] tracking-wider">ENTERPRISE</span>
                <h3 className="text-lg font-bold text-[#171717] dark:text-white mt-1">Unified Suite</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono tracking-tight text-[#171717] dark:text-white">$15</span>
                  <span className="text-xs text-neutral-400 font-medium">/ user / mo</span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-500 mt-2.5">
                  Complete operational power for commercial squads needing high throughput and SOC2 levels of isolation.
                </p>
                <div className="flex flex-col gap-2 mt-6 border-t border-neutral-100 dark:border-neutral-850 pt-5 text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> Infinite Workspace Slots</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> Cryptographic Ledger Audit Log</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> Unlimited Nexora Intellect AI Queries</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-500" /> API Access & Webhook Deliveries</div>
                </div>
              </div>
              <button 
                onClick={onEnterApp}
                className="w-full mt-8 bg-[#0057FF] hover:bg-[#0057FF]/90 text-white font-semibold text-xs py-3 rounded-[12px] transition-colors shadow-premium-sm hover:shadow-premium-md cursor-pointer text-center block"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </section>

        {/* DEMO BOOKING INPUT */}
        <section id="demo-section" className="mt-32 pt-12 border-t border-neutral-200/30 dark:border-neutral-800/40 text-center">
          <div className="max-w-2xl mx-auto bg-neutral-100/30 dark:bg-[#111214]/20 border border-neutral-200/40 dark:border-neutral-850/60 rounded-[28px] p-8 md:p-12 shadow-premium-sm">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">INTEREST IN MODERN DESIGN</span>
            <h3 className="text-xl sm:text-2xl font-display font-medium tracking-tight text-[#171717] dark:text-white mt-1.5">
              Ready to see Nexora in action?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto">
              Provide your professional address and one of our Staff Engineers will reach out for a structured console demo.
            </p>

            {demoRequested ? (
              <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium">
                Demo Booking Logged successfully. We will contact you shortly on: {demoEmail}
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-2 max-w-md mx-auto">
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="flex-1 bg-white dark:bg-[#15171A] border border-neutral-200 dark:border-neutral-800 rounded-[12px] px-3.5 py-2.5 text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0057FF]"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-[#171717] hover:bg-neutral-800 dark:bg-white dark:hover:bg-white/95 text-white dark:text-[#171717] text-xs font-semibold px-5 py-2.5 rounded-[12px] transition-colors cursor-pointer"
                >
                  Book Demo
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      {/* Modern minimal Footer */}
      <footer className="px-8 sm:px-16 py-10 border-t border-neutral-200/40 dark:border-neutral-800/40 bg-[#FBFBFA] dark:bg-[#0A0A0A] text-neutral-400 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-neutral-400 dark:bg-neutral-600 rounded-[2px]" />
            <span className="font-semibold text-[#171717] dark:text-neutral-200 text-xs">Nexora</span>
          </div>
          <div className="text-neutral-400/80 dark:text-neutral-500 text-[11px]">
            &copy; 2026 Nexora Inc. Perfectly isolated enterprise workspace.
          </div>
          <div className="flex items-center gap-6 font-medium text-neutral-400/80 dark:text-neutral-500 text-[11px]">
            <span>Security Isolated</span>
            <span>Real-time Events</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
