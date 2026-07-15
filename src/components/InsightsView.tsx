import React from "react";
import { TrendingUp, ArrowUpRight, Shield, RefreshCw, BarChart2, PieChart, Users } from "lucide-react";
import { Project, Task, WorkspaceMember } from "../types";

interface InsightsViewProps {
  projects: Project[];
  tasks: Task[];
  members: WorkspaceMember[];
}

export default function InsightsView({ projects, tasks, members }: InsightsViewProps) {
  // Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "Active").length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "Done").length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Active workload by team member
  const workloads = members.map(m => {
    const assignedTasks = tasks.filter(t => t.assigneeId === m.userId && t.status !== "Done").length;
    const completedVal = tasks.filter(t => t.assigneeId === m.userId && t.status === "Done").length;
    return {
      name: m.userName,
      avatar: m.userAvatar,
      role: m.role,
      activeCount: assignedTasks,
      completedCount: completedVal
    };
  });

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto font-sans" id="insights-view-root">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono uppercase tracking-widest block mb-2">Metrics & Analytics</span>
          <h1 className="text-4xl font-display font-medium tracking-tight text-neutral-900 dark:text-neutral-50">
            Insights
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Real-time delivery velocities, resource distribution, and operational metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-[14px] text-xs font-mono text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800/50">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Syncing Real-time</span>
        </div>
      </div>

      {/* Grid: 3-column deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 p-6 rounded-[22px] shadow-premium-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">Delivery Rate</span>
            <span className="text-[10px] bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-100 dark:border-green-900/30 px-2 py-0.5 rounded-[8px] font-mono">+4.2%</span>
          </div>
          <div>
            <span className="text-4xl font-mono font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {taskCompletionRate}%
            </span>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 font-mono">
              {completedTasks} of {totalTasks} milestones resolved
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 p-6 rounded-[22px] shadow-premium-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">In-flight Projects</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 px-2 py-0.5 rounded-[8px] font-mono">On Schedule</span>
          </div>
          <div>
            <span className="text-4xl font-mono font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {activeProjects}
            </span>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 font-mono">
              {totalProjects} portfolios total in organization
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 p-6 rounded-[22px] shadow-premium-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">Active Workload</span>
            <span className="text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 px-2 py-0.5 rounded-[8px] font-mono">Stable</span>
          </div>
          <div>
            <span className="text-4xl font-mono font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {tasks.filter(t => t.status !== "Done").length}
            </span>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 font-mono">
              Tasks currently assigned to development
            </p>
          </div>
        </div>

      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Custom Curve Area */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[28px] p-6 shadow-premium-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-medium text-neutral-950 dark:text-white text-base">Operational Delivery Trend</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Milestones completed month over month.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-500 font-mono">
              <TrendingUp className="w-4 h-4" />
              <span>Velocity High</span>
            </div>
          </div>

          {/* SVG curve with gradient block under curve */}
          <div className="h-[220px] w-full mt-2 relative flex items-end">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="insightsAreaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0057FF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0057FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 50, 100, 150].map((y, idx) => (
                <line key={idx} x1="0" y1={y} x2="500" y2={y} className="stroke-neutral-100 dark:stroke-neutral-800" strokeWidth="1" strokeDasharray="5 5" />
              ))}

              {/* Main curve path */}
              <path
                d="M 10 170 C 90 120, 170 160, 250 80 C 330 90, 410 40, 490 20"
                fill="none"
                stroke="#0057FF"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Area filled path */}
              <path
                d="M 10 170 C 90 120, 170 160, 250 80 C 330 90, 410 40, 490 20 L 490 200 L 10 200 Z"
                fill="url(#insightsAreaGlow)"
              />

              {/* Hover circles */}
              {[
                { cx: 10, cy: 170 },
                { cx: 90, cy: 138 },
                { cx: 170, cy: 151 },
                { cx: 250, cy: 80 },
                { cx: 330, cy: 86 },
                { cx: 410, cy: 38 },
                { cx: 490, cy: 20 }
              ].map((dot, idx) => (
                <circle
                  key={idx}
                  cx={dot.cx}
                  cy={dot.cy}
                  r="4.5"
                  className="fill-white dark:fill-neutral-900 stroke-blue-600 dark:stroke-blue-400"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-3">
            <span>January</span>
            <span>March</span>
            <span>May</span>
            <span>July 2026</span>
          </div>
        </div>

        {/* Load Distribution bar charts */}
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[28px] p-6 shadow-premium-md flex flex-col justify-between">
          <div>
            <h3 className="font-display font-medium text-neutral-950 dark:text-white text-base">Workload Slices</h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Unresolved sprints assigned to team members.</p>
          </div>

          <div className="flex flex-col gap-4.5 mt-6">
            {workloads.map((wl, idx) => {
              const maxActive = Math.max(...workloads.map(w => w.activeCount), 1);
              const percent = Math.round((wl.activeCount / maxActive) * 100);

              return (
                <div key={idx} className="flex items-center gap-3">
                  <img src={wl.avatar} alt={wl.name} className="w-8 h-8 rounded-full border border-neutral-200/50 dark:border-neutral-800" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{wl.name}</span>
                      <span className="font-mono text-neutral-500 dark:text-neutral-400">{wl.activeCount} active</span>
                    </div>
                    <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 pt-3 mt-6 font-mono flex items-center justify-between">
            <span>Organizational Balancer</span>
            <span className="text-green-600">Optimal</span>
          </div>
        </div>

      </div>
      
    </div>
  );
}
