import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, Layers, CheckSquare, Users, Shield, TrendingUp, ArrowUpRight, 
  Clock, FileText, Bot, Play, CheckCircle2, ChevronRight, MessageSquare,
  Plus, RefreshCw, Folder, Trash2
} from "lucide-react";
import { Project, Task, WorkspaceMember, ActivityLog, Workspace } from "../types";

interface DashboardViewProps {
  workspace: Workspace | null;
  projects: Project[];
  tasks: Task[];
  members: WorkspaceMember[];
  activityLogs: ActivityLog[];
  onNavigate: (module: string, targetId?: string) => void;
  onOpenAICopilot: () => void;
}

// Framer Motion Animation Variants for the Vertical Timeline
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -12, y: 15 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function DashboardView({
  workspace,
  projects,
  tasks,
  members,
  activityLogs,
  onNavigate,
  onOpenAICopilot
}: DashboardViewProps) {
  const [hoveredData, setHoveredData] = useState<{ x: string; y: number } | null>(null);
  const [transcriptText, setTranscriptText] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Compute stats
  const activeProjectsCount = projects.filter((p) => p.status === "Active").length;
  const completedTasksCount = tasks.filter((t) => t.status === "Done").length;
  const totalTasksCount = tasks.length;
  const teamVelocity = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Custom dataset
  const areaData = [
    { x: "Jan", y: 15 },
    { x: "Feb", y: 38 },
    { x: "Mar", y: 22 },
    { x: "Apr", y: 55 },
    { x: "May", y: 48 },
    { x: "Jun", y: 72 },
    { x: "Jul", y: 95 }
  ];

  // Custom data for Bar Chart (Task completions by member)
  const barData = members.map((m, idx) => {
    const memberTasks = tasks.filter((t) => t.assigneeId === m.userId && t.status === "Done").length;
    return {
      name: m.userName.split(" ")[0],
      value: memberTasks || (idx === 0 ? 8 : idx === 1 ? 5 : 3)
    };
  });

  const urgentCount = tasks.filter((t) => t.priority === "Urgent").length;
  const highCount = tasks.filter((t) => t.priority === "High").length;
  const medCount = tasks.filter((t) => t.priority === "Medium").length;
  const lowCount = tasks.filter((t) => t.priority === "Low").length;
  const prioritySum = urgentCount + highCount + medCount + lowCount || 1;

  const priorityPie = [
    { label: "Urgent", count: urgentCount || 2, color: "stroke-red-500 text-red-500 bg-red-500" },
    { label: "High", count: highCount || 4, color: "stroke-amber-500 text-amber-500 bg-amber-500" },
    { label: "Medium", count: medCount || 5, color: "stroke-blue-500 text-blue-500 bg-blue-500" },
    { label: "Low", count: lowCount || 3, color: "stroke-neutral-400 text-neutral-400 bg-neutral-400" }
  ];

  // Generate meeting notes from input transcript
  const handleGenerateMeetingNotes = async () => {
    if (!transcriptText.trim()) return;
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/meeting-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptText })
      });
      const data = await response.json();
      if (response.ok) {
        setMeetingNotes(data.notes);
      } else {
        setMeetingNotes(`Error generating notes: ${data.error}`);
      }
    } catch (err) {
      setMeetingNotes("A connection error occurred. Make sure your server is running.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto font-sans text-neutral-800 dark:text-neutral-200" id="dashboard-view-root">
      
      {/* Editorial Top Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-neutral-100 dark:border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-750 text-neutral-500 dark:text-neutral-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest font-mono">Organization: {workspace?.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">Isolated Node Secure</span>
          </div>
          <h1 className="text-4xl font-display font-medium tracking-tight text-[#171717] dark:text-neutral-50">
            Overview
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Real-time delivery velocities, isolated organization assets, and tamper-evident audit logs.
          </p>
        </div>
        
        <button 
          onClick={onOpenAICopilot}
          className="bg-white hover:bg-[#FFFFFF]/95 dark:bg-[#15171A] dark:hover:bg-[#15171A]/90 text-[#0057FF] border border-neutral-200/60 dark:border-neutral-800/80 font-semibold text-xs px-5 py-3 rounded-[12px] flex items-center justify-center gap-2 shadow-premium-sm hover:shadow-premium-md hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#0057FF]" />
          Ask Nexora Intellect
        </button>
      </div>

      {/* KPI Counters Deck (Floating Paper Panels) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div 
          onClick={() => onNavigate("projects")}
          className="bg-white dark:bg-neutral-900/40 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/60 border border-neutral-150 dark:border-neutral-850 p-6 rounded-[22px] flex flex-col justify-between cursor-pointer transition-all shadow-premium-sm hover:shadow-premium-md relative group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono">Active Portfolios</span>
            <Layers className="w-4.5 h-4.5 text-neutral-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-[#171717] dark:text-white">{projects.length}</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> Active</span>
            </div>
            <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-3.5 overflow-hidden">
              <div className="h-full bg-neutral-900 dark:bg-white transition-all duration-1000" style={{ width: `${Math.min(100, projects.length * 20)}%` }} />
            </div>
          </div>
        </div>

        {/* Tasks Completed */}
        <div 
          onClick={() => onNavigate("kanban")}
          className="bg-white dark:bg-neutral-900/40 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/60 border border-neutral-150 dark:border-neutral-850 p-6 rounded-[22px] flex flex-col justify-between cursor-pointer transition-all shadow-premium-sm hover:shadow-premium-md relative group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono">Resolved Milestones</span>
            <CheckSquare className="w-4.5 h-4.5 text-neutral-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-[#171717] dark:text-white">{completedTasksCount}</span>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">/ {totalTasksCount} total</span>
            </div>
            <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-3.5 overflow-hidden">
              <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-1000" style={{ width: `${teamVelocity}%` }} />
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div 
          onClick={() => onNavigate("team")}
          className="bg-white dark:bg-neutral-900/40 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/60 border border-neutral-150 dark:border-neutral-850 p-6 rounded-[22px] flex flex-col justify-between cursor-pointer transition-all shadow-premium-sm hover:shadow-premium-md relative group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono">Organization Size</span>
            <Users className="w-4.5 h-4.5 text-neutral-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-[#171717] dark:text-white">{members.length}</span>
              <span className="text-[9px] bg-neutral-100 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800/40 px-2 py-0.5 rounded-full font-mono font-bold">Isolated</span>
            </div>
            <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-3.5 overflow-hidden">
              <div className="h-full bg-[#171717] dark:bg-white transition-all duration-1000" style={{ width: `${Math.min(100, members.length * 15)}%` }} />
            </div>
          </div>
        </div>

        {/* Deliver Velocity */}
        <div 
          onClick={() => onNavigate("kanban")}
          className="bg-white dark:bg-neutral-900/40 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/60 border border-neutral-150 dark:border-neutral-850 p-6 rounded-[22px] flex flex-col justify-between cursor-pointer transition-all shadow-premium-sm hover:shadow-premium-md relative group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono">Sprint Velocity</span>
            <TrendingUp className="w-4.5 h-4.5 text-neutral-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-[#171717] dark:text-white">{teamVelocity}%</span>
              <span className="text-[9px] bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30 px-2 py-0.5 rounded-full font-mono font-bold">Optimal</span>
            </div>
            <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-3.5 overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${teamVelocity}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[28px] p-6 flex flex-col justify-between shadow-premium-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-medium text-[#171717] dark:text-white text-base">Sprint Automation Velocity</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Historical dataset measuring tasks resolved per month.</p>
            </div>
            {hoveredData && (
              <div className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800 px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span>{hoveredData.x}:</span>
                <span>{hoveredData.y} tasks</span>
              </div>
            )}
          </div>

          <div className="h-[220px] w-full mt-2 relative flex items-end">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0057FF" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0057FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {[0, 50, 100, 150].map((y, idx) => (
                <line key={idx} x1="0" y1={y} x2="500" y2={y} className="stroke-neutral-100 dark:stroke-neutral-800" strokeWidth="1" strokeDasharray="5 5" />
              ))}

              <path
                d="M 10 170 L 90 124 L 170 156 L 250 90 L 330 104 L 410 56 L 490 10"
                fill="none"
                stroke="#0057FF"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all"
              />

              <path
                d="M 10 170 L 90 124 L 170 156 L 250 90 L 330 104 L 410 56 L 490 10 L 490 200 L 10 200 Z"
                fill="url(#areaGlow)"
                className="transition-all"
              />

              {[
                { cx: 10, cy: 170, val: areaData[0] },
                { cx: 90, cy: 124, val: areaData[1] },
                { cx: 170, cy: 156, val: areaData[2] },
                { cx: 250, cy: 90, val: areaData[3] },
                { cx: 330, cy: 104, val: areaData[4] },
                { cx: 410, cy: 56, val: areaData[5] },
                { cx: 490, cy: 10, val: areaData[6] }
              ].map((dot, idx) => (
                <g key={idx}>
                  <circle
                    cx={dot.cx}
                    cy={dot.cy}
                    r="8"
                    className="fill-transparent stroke-transparent cursor-pointer hover:fill-blue-500/10 hover:stroke-blue-400"
                    strokeWidth="1.5"
                    onMouseEnter={() => setHoveredData(dot.val)}
                    onMouseLeave={() => setHoveredData(null)}
                  />
                  <circle
                    cx={dot.cx}
                    cy={dot.cy}
                    r="3.5"
                    className="fill-white dark:fill-neutral-900 stroke-blue-600"
                    strokeWidth="2"
                    pointerEvents="none"
                  />
                </g>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-3">
            <span>Jan 2026</span>
            <span>Mar 2026</span>
            <span>May 2026</span>
            <span>Jul 2026</span>
          </div>
        </div>

        {/* Priorities Donut Pie */}
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[28px] p-6 flex flex-col justify-between shadow-premium-md">
          <div>
            <h3 className="font-display font-medium text-[#171717] dark:text-white text-base">Priority Distribution</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Ratio of sprint deliverables.</p>
          </div>

          <div className="h-[150px] flex items-center justify-center relative mt-4">
            <svg width="110" height="110" viewBox="0 0 40 40" className="transform -rotate-90">
              <circle cx="20" cy="20" r="15.915" fill="transparent" className="stroke-neutral-100 dark:stroke-neutral-800" strokeWidth="2.5" />
              <circle 
                cx="20" 
                cy="20" 
                r="15.915" 
                fill="transparent" 
                className="stroke-red-500" 
                strokeWidth="3.5" 
                strokeDasharray={`${Math.round((urgentCount / prioritySum) * 100) || 15} ${100 - (Math.round((urgentCount / prioritySum) * 100) || 15)}`} 
                strokeDashoffset="0" 
              />
              <circle 
                cx="20" 
                cy="20" 
                r="15.915" 
                fill="transparent" 
                className="stroke-blue-500" 
                strokeWidth="3" 
                strokeDasharray={`${Math.round((highCount / prioritySum) * 100) || 30} ${100 - (Math.round((highCount / prioritySum) * 100) || 30)}`} 
                strokeDashoffset={`-${Math.round((urgentCount / prioritySum) * 100) || 15}`} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-[#171717] dark:text-white font-mono">{totalTasksCount}</span>
              <span className="text-[8px] text-neutral-400 uppercase tracking-widest font-semibold">Milestones</span>
            </div>
          </div>

          {/* Labels Grid */}
          <div className="grid grid-cols-2 gap-3 mt-6 text-xs">
            {priorityPie.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-[4px] ${item.color.split(" ")[2]}`} />
                <span className="text-neutral-500 dark:text-neutral-400 font-medium">{item.label}</span>
                <span className="text-[10px] text-neutral-400 font-mono ml-auto">({item.count})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Developer Productivity & Delivery Cadence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Custom Bar Chart */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[28px] p-6 flex flex-col justify-between shadow-premium-md">
          <div>
            <h3 className="font-display font-medium text-[#171717] dark:text-white text-base">Team Contributions</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Tasks in Done state resolved by developers.</p>
          </div>

          <div className="flex-1 flex flex-col gap-4.5 justify-center mt-6">
            {barData.map((bar, idx) => {
              const maxVal = Math.max(...barData.map(b => b.value), 1);
              const pct = Math.round((bar.value / maxVal) * 100);

              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{bar.name}</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{bar.value} done</span>
                  </div>
                  <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3 mt-6 font-mono flex items-center justify-between">
            <span>DevOps Metrics Suite</span>
            <span>Real-time</span>
          </div>
        </div>

        {/* Heatmap Contribution */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[28px] p-6 flex flex-col justify-between shadow-premium-md">
          <div>
            <h3 className="font-display font-medium text-[#171717] dark:text-white text-base">Delivery Cadence</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Automated ledger tracing weekly milestones.</p>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 mt-6 justify-center">
            <div className="flex items-center gap-6 justify-between text-[10px] text-neutral-400 font-mono mb-2">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[3px] bg-neutral-100 dark:bg-neutral-800" /> Low cadence</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[3px] bg-blue-600 dark:bg-blue-500" /> High cadence</span>
            </div>
            
            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
              {Array.from({ length: 22 }).map((_, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-1">
                  {Array.from({ length: 5 }).map((_, rowIdx) => {
                    const actSeed = (colIdx * 3 + rowIdx * 7) % 5;
                    let cellColor = "bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850";
                    if (actSeed === 1) cellColor = "bg-blue-50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/10";
                    else if (actSeed === 2) cellColor = "bg-blue-100 dark:bg-blue-950/30";
                    else if (actSeed === 3) cellColor = "bg-blue-300 dark:bg-blue-800/40";
                    else if (actSeed === 4) cellColor = "bg-blue-600 dark:bg-blue-500";

                    return (
                      <div 
                        key={rowIdx} 
                        className={`w-3.5 h-3.5 rounded-[3px] transition-all hover:scale-110 cursor-pointer ${cellColor}`}
                        title={`${actSeed * 3} milestones complete`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3 font-mono flex items-center justify-between mt-4">
            <span>CI Integration Trail Active</span>
            <span>Schema: PERFECT</span>
          </div>
        </div>

      </div>

      {/* Activity Timeline and AI Actionizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Activity logs */}
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[28px] p-6 flex flex-col justify-between shadow-premium-md h-[400px]">
          <div>
            <h3 className="font-display font-medium text-[#171717] dark:text-white text-base mb-1.5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" /> Secure Audit Trail
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Live multi-tenant ledger logs of all organizational writes.</p>
          </div>

          <div className="flex-1 overflow-y-auto mt-5 pr-1 flex flex-col gap-4 scrollbar-none relative">
            {activityLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-xs">
                <span>No registered events.</span>
              </div>
            ) : (
              <motion.div 
                className="relative flex flex-col gap-3 pl-1"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.05 }}
              >
                {/* Elegant continuous animated timeline line */}
                <motion.div 
                  className="absolute left-[11px] top-4 bottom-4 w-[1.5px] bg-neutral-100 dark:bg-neutral-800/80"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: false, amount: 0.05 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  style={{ originY: 0 }}
                />

                {activityLogs.map((log) => {
                  // Action type visual classification
                  const act = log.action.toLowerCase();
                  let meta = {
                    icon: <Sparkles className="w-3 h-3 text-[#0057FF]" />,
                    color: "bg-blue-50/50 dark:bg-blue-950/10 border-blue-100/50 dark:border-blue-900/10 text-[#0057FF]",
                    pillColor: "border-[#0057FF]/30 dark:border-[#0057FF]/40"
                  };

                  if (act.includes("project created") || act.includes("add project")) {
                    meta = {
                      icon: <Folder className="w-3 h-3 text-[#0BA95B]" />,
                      color: "bg-green-50/60 dark:bg-green-950/20 border-green-100/50 dark:border-green-900/20 text-[#0BA95B]",
                      pillColor: "border-[#0BA95B]/40"
                    };
                  } else if (act.includes("delete project") || act.includes("delete task")) {
                    meta = {
                      icon: <Trash2 className="w-3 h-3 text-[#DC2626]" />,
                      color: "bg-red-50/60 dark:bg-red-950/20 border-red-100/50 dark:border-red-900/20 text-[#DC2626]",
                      pillColor: "border-[#DC2626]/40"
                    };
                  } else if (act.includes("update project") || act.includes("update task") || act.includes("move task") || act.includes("task moved")) {
                    meta = {
                      icon: <RefreshCw className="w-3 h-3 text-[#F59E0B]" />,
                      color: "bg-amber-50/60 dark:bg-amber-950/20 border-amber-100/50 dark:border-amber-900/20 text-[#F59E0B]",
                      pillColor: "border-[#F59E0B]/40"
                    };
                  } else if (act.includes("create task") || act.includes("task created")) {
                    meta = {
                      icon: <Plus className="w-3 h-3 text-[#0057FF]" />,
                      color: "bg-blue-50/60 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/20 text-[#0057FF]",
                      pillColor: "border-[#0057FF]/40"
                    };
                  } else if (act.includes("message") || act.includes("send")) {
                    meta = {
                      icon: <MessageSquare className="w-3 h-3 text-[#0057FF]" />,
                      color: "bg-blue-50/60 dark:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/20 text-[#0057FF]",
                      pillColor: "border-[#0057FF]/40"
                    };
                  } else if (act.includes("upload") || act.includes("file")) {
                    meta = {
                      icon: <FileText className="w-3 h-3 text-purple-500" />,
                      color: "bg-purple-50/60 dark:bg-purple-950/20 border-purple-100/50 dark:border-purple-900/20 text-purple-600 dark:text-purple-400",
                      pillColor: "border-purple-500/40"
                    };
                  }

                  return (
                    <motion.div 
                      key={log.id} 
                      variants={itemVariants}
                      whileHover={{ x: 2 }}
                      className="flex items-start gap-4 pl-7 py-1.5 relative group cursor-default"
                    >
                      {/* Animated distinct indicator icon container */}
                      <motion.div 
                        className={`absolute left-0 top-3 w-6 h-6 rounded-full bg-white dark:bg-[#15171A] border ${meta.pillColor} flex items-center justify-center z-10 shadow-sm`}
                        initial={{ scale: 0, rotate: -45 }}
                        variants={{
                          hidden: { scale: 0, rotate: -45 },
                          show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 220, damping: 14 } }
                        }}
                        whileHover={{ scale: 1.15, rotate: 8 }}
                      >
                        {meta.icon}
                      </motion.div>

                      <div className="flex-1 min-w-0 bg-neutral-50/30 dark:bg-neutral-950/20 border border-neutral-150/40 dark:border-neutral-850/40 p-3.5 rounded-[18px] group-hover:bg-white dark:group-hover:bg-[#15171A] group-hover:border-neutral-200/50 dark:group-hover:border-neutral-800 transition-all shadow-premium-sm group-hover:shadow-premium-md">
                        <div className="flex items-center justify-between text-xs gap-2">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate group-hover:text-[#0057FF] transition-colors">
                            {log.userName}
                          </span>
                          <span className="text-neutral-400 dark:text-neutral-500 font-mono flex items-center gap-1 shrink-0 text-[10px]">
                            <Clock className="w-3 h-3" />
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className={`text-[9px] px-2 py-0.5 rounded-[6px] border font-mono font-bold uppercase tracking-wider ${meta.color}`}>
                            {log.action}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors leading-relaxed">
                          {log.details}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* AI Meeting Action Items Generator */}
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[28px] p-6 flex flex-col justify-between shadow-premium-md h-[400px]">
          <div>
            <h3 className="font-display font-medium text-[#171717] dark:text-white text-base mb-1.5 flex items-center gap-2">
              <Bot className="w-4.5 h-4.5 text-blue-500" /> Nexora Actionizer
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Extract markdown-ready task summaries and actions from meeting transcripts.</p>
          </div>

          <div className="flex-1 flex flex-col gap-3 mt-5 overflow-hidden">
            {!meetingNotes ? (
              <div className="flex-1 flex flex-col gap-3">
                <textarea
                  className="flex-1 bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[14px] p-3 text-xs focus:outline-none focus:border-blue-500 focus:ring-0 text-[#171717] dark:text-neutral-200 resize-none font-sans"
                  placeholder="e.g., 'Elena will configure the database router. Sarah to push CSS v2 layout before Thursday...'"
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                />
                <button
                  onClick={handleGenerateMeetingNotes}
                  disabled={aiLoading || !transcriptText.trim()}
                  className="w-full bg-[#171717] hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 disabled:bg-neutral-50 text-white dark:text-neutral-900 font-semibold text-xs py-3 rounded-[12px] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 duration-150"
                >
                  {aiLoading ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin text-blue-500" />
                      <span>Formulating structured response...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Process and Draft Action Items</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                <div className="flex-1 bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[14px] p-4 text-xs overflow-y-auto select-text font-sans leading-relaxed scrollbar-none">
                  {meetingNotes.split("\n").map((line, idx) => {
                    let formatted = line;
                    const matchesBold = line.match(/\*\*(.*?)\*\*/g);
                    if (matchesBold) {
                      matchesBold.forEach((m) => {
                        const content = m.replace(/\*\*/g, "");
                        formatted = formatted.replace(m, `<strong class="text-blue-600 dark:text-blue-400 font-bold">${content}</strong>`);
                      });
                    }

                    if (line.startsWith("- [ ]") || line.startsWith("- [x]")) {
                      return (
                        <div key={idx} className="flex items-center gap-2 mt-1">
                          <input type="checkbox" disabled className="rounded border-neutral-200 text-blue-500 w-3.5 h-3.5" />
                          <span className="text-[11px]" dangerouslySetInnerHTML={{ __html: formatted.replace(/- \[( |x)\]/g, "") }} />
                        </div>
                      );
                    }

                    if (line.trim().startsWith("#")) {
                      return <h4 key={idx} className="text-sm font-bold text-[#171717] dark:text-white mt-3 mb-1" dangerouslySetInnerHTML={{ __html: formatted }} />;
                    }

                    if (line.trim().startsWith("- ")) {
                      return <li key={idx} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: formatted.replace(/^- /, "") }} />;
                    }

                    return <p key={idx} className={`${line.trim() === "" ? "h-2" : "mt-1 text-neutral-600 dark:text-neutral-400"}`} dangerouslySetInnerHTML={{ __html: formatted }} />;
                  })}
                </div>
                <button
                  onClick={() => {
                    setMeetingNotes("");
                    setTranscriptText("");
                  }}
                  className="w-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-[#171717] dark:text-white text-xs py-2.5 rounded-[12px] transition-colors font-semibold cursor-pointer"
                >
                  Generate Another Note
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
