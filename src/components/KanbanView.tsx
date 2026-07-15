import React, { useState } from "react";
import { 
  Plus, Calendar, User, CheckSquare, Sparkles, 
  Trash2, Clock, MessageSquare, AlertCircle, X
} from "lucide-react";
import { Task, Project, WorkspaceMember } from "../types";

interface KanbanViewProps {
  tasks: Task[];
  projects: Project[];
  members: WorkspaceMember[];
  onCreateTask: (projectId: string, title: string, description: string, status: string, priority: string, assigneeId: string, dueDate: string) => void;
  onUpdateTask: (taskId: string, payload: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  currentUserId: string;
}

const COLUMNS = ["Backlog", "Todo", "In Progress", "In Review", "Done"] as const;

export default function KanbanView({
  tasks,
  projects,
  members,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  currentUserId
}: KanbanViewProps) {
  const [filterProject, setFilterProject] = useState<string>("All");
  const [filterAssignee, setFilterAssignee] = useState<string>("All");

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // AI loading states
  const [aiLoading, setAiLoading] = useState(false);
  
  // Task form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [status, setStatus] = useState<string>("Todo");
  const [priority, setPriority] = useState<string>("Medium");
  const [assigneeId, setAssigneeId] = useState<string>(currentUserId || "");
  const [dueDate, setDueDate] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    onCreateTask(projectId, title, description, status, priority, assigneeId, dueDate);
    
    // reset
    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");
    setAssigneeId(currentUserId);
    setDueDate("");
    setIsCreateOpen(false);
  };

  const handleAIOptimize = async (task: Task) => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/task-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title, description: task.description })
      });
      const data = await response.json();
      if (response.ok) {
        onUpdateTask(task.id, { aiSummary: data.summary });
        setActiveTask((prev) => prev ? { ...prev, aiSummary: data.summary } : null);
      } else {
        alert("Nexora Intellect failed to compile details. Please retry.");
      }
    } catch (err) {
      alert("AI Service Connection Interrupted.");
    } finally {
      setAiLoading(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const projMatch = filterProject === "All" || t.projectId === filterProject;
    const assMatch = filterAssignee === "All" || t.assigneeId === filterAssignee;
    return projMatch && assMatch;
  });

  const getPriorityStyle = (pr: string) => {
    switch (pr) {
      case "Urgent": return "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400";
      case "High": return "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400";
      case "Medium": return "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400";
      case "Low": return "bg-neutral-50 dark:bg-neutral-850 border-neutral-100 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400";
      default: return "bg-neutral-50 dark:bg-neutral-850 border-neutral-100 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400";
    }
  };

  const getColIcon = (col: string) => {
    switch (col) {
      case "Backlog": return <Clock className="w-3.5 h-3.5 text-neutral-400" />;
      case "Todo": return <AlertCircle className="w-3.5 h-3.5 text-blue-500" />;
      case "In Progress": return <Clock className="w-3.5 h-3.5 text-blue-500 animate-spin" />;
      case "In Review": return <MessageSquare className="w-3.5 h-3.5 text-[#171717] dark:text-neutral-300" />;
      case "Done": return <CheckSquare className="w-3.5 h-3.5 text-green-500" />;
      default: return <Clock className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto font-sans text-neutral-800 dark:text-neutral-200" id="kanban-view-root">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-3xl font-display font-medium tracking-tight text-[#171717] dark:text-white">Tasks</h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Track task progression, prioritize delivery blocks, and leverage AI workspace generators.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#171717] hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-xs px-5 py-3 rounded-[12px] flex items-center justify-center gap-1.5 shadow-premium-sm transition-all cursor-pointer active:scale-95 duration-150"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-850 rounded-[18px] p-4">
        {/* Project Selector */}
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono">Filter by Project</label>
          <select
            className="bg-[#FDFDFB] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Assignee Selector */}
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono">Filter by Assignee</label>
          <select
            className="bg-[#FDFDFB] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
          >
            <option value="All">All Assignees</option>
            {members.map((m) => (
              <option key={m.id} value={m.userId}>{m.userName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col);

          return (
            <div key={col} className="bg-neutral-100/30 dark:bg-neutral-950/20 border border-neutral-150/60 dark:border-neutral-850 rounded-[18px] p-4 flex flex-col gap-4 min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2.5">
                <div className="flex items-center gap-2 font-semibold text-xs text-neutral-700 dark:text-neutral-200">
                  {getColIcon(col)}
                  <span>{col}</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 font-bold bg-[#FDFDFB] dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards block */}
              <div className="flex flex-col gap-3">
                {colTasks.map((task) => {
                  const assignee = members.find((m) => m.userId === task.assigneeId);
                  const project = projects.find((p) => p.id === task.projectId);

                  return (
                    <div
                      key={task.id}
                      onClick={() => setActiveTask(task)}
                      className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[14px] p-4 cursor-pointer transition-all hover:shadow-premium-sm hover:border-neutral-300 dark:hover:border-neutral-750 flex flex-col gap-3.5 relative group overflow-hidden shadow-premium-sm"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-all" />

                      <div>
                        {/* Tags */}
                        <div className="flex items-center justify-between gap-1.5 mb-2.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] border ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                          {project && (
                            <span className="text-[9px] text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[80px]">
                              {project.name}
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-semibold text-xs text-[#171717] dark:text-neutral-200 line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 line-clamp-2 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* AI Optimization status badge */}
                      {task.aiSummary && (
                        <div className="flex items-center gap-1 text-[9px] bg-blue-50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-[6px] font-semibold w-fit">
                          <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
                          <span>Optimized</span>
                        </div>
                      )}

                      {/* Footer specs */}
                      <div className="flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/80 pt-2.5 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: "short", day: "numeric" }) : "TBD"}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <img src={assignee?.userAvatar || "https://api.dicebear.com/7.x/initials/svg?seed=user"} alt="assignee" className="w-4 h-4 rounded-full object-cover border border-neutral-200/40" />
                          <span className="max-w-[50px] truncate">{assignee?.userName.split(" ")[0] || "Squad"}</span>
                        </div>
                      </div>

                      {/* Delete absolute button */}
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 rounded-[6px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTask(task.id);
                          }}
                          className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details Slide-Over Sidebar Panel */}
      {activeTask && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg bg-white dark:bg-neutral-900 border-l border-neutral-150 dark:border-neutral-850 shadow-premium-lg flex-col justify-between text-neutral-800 dark:text-neutral-200">
          <div className="fixed inset-0 bg-[#171717]/20 backdrop-blur-sm -z-10" onClick={() => setActiveTask(null)} />

          <div className="flex-1 overflow-y-auto p-6 flex flex-col scrollbar-none">
            {/* Top Close bar */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-[6px] uppercase tracking-wider border ${getPriorityStyle(activeTask.priority)}`}>
                  {activeTask.priority}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">ID: {activeTask.id}</span>
              </div>
              <button onClick={() => setActiveTask(null)} className="p-1.5 text-neutral-400 hover:text-[#171717] dark:hover:text-white rounded-[8px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-5 mt-6 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono text-[9px]">Task Title</label>
                <input
                  type="text"
                  className="bg-transparent border-none font-semibold text-lg text-[#171717] dark:text-white focus:outline-none focus:ring-0 p-0"
                  value={activeTask.title}
                  onChange={(e) => onUpdateTask(activeTask.id, { title: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono text-[9px]">Description</label>
                <textarea
                  rows={4}
                  className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] p-3 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
                  placeholder="Enter task criteria..."
                  value={activeTask.description || ""}
                  onChange={(e) => onUpdateTask(activeTask.id, { description: e.target.value })}
                />
              </div>

              {/* Status & Assignee Selector */}
              <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 dark:border-neutral-800/80 py-4 my-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono text-[9px]">Status Path</label>
                  <select
                    className="bg-[#FDFDFB] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3 py-2 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                    value={activeTask.status}
                    onChange={(e) => onUpdateTask(activeTask.id, { status: e.target.value as any })}
                  >
                    {COLUMNS.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono text-[9px]">Assignee</label>
                  <select
                    className="bg-[#FDFDFB] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3 py-2 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                    value={activeTask.assigneeId || ""}
                    onChange={(e) => onUpdateTask(activeTask.id, { assigneeId: e.target.value || null })}
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.userId}>{m.userName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority & Due Date Selector */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono text-[9px]">Priority Level</label>
                  <select
                    className="bg-[#FDFDFB] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3 py-2 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                    value={activeTask.priority}
                    onChange={(e) => onUpdateTask(activeTask.id, { priority: e.target.value as any })}
                  >
                    {["Low", "Medium", "High", "Urgent"].map((pr) => (
                      <option key={pr} value={pr}>{pr}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider font-mono text-[9px]">Due Date</label>
                  <input
                    type="date"
                    className="bg-[#FDFDFB] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3 py-2 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-blue-500 font-mono"
                    value={activeTask.dueDate || ""}
                    onChange={(e) => onUpdateTask(activeTask.id, { dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* AI Optimizer Results */}
            <div className="flex flex-col gap-4 mt-6">
              {activeTask.aiSummary ? (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-[16px] p-4 flex flex-col gap-2 font-sans text-xs shadow-premium-sm">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span>Nexora Intellect Checklist</span>
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed select-text mt-1 max-h-[160px] overflow-y-auto scrollbar-none">
                    {activeTask.aiSummary.split("\n").map((line, lidx) => {
                      let formatted = line;
                      const matchesBold = line.match(/\*\*(.*?)\*\*/g);
                      if (matchesBold) {
                        matchesBold.forEach((m) => {
                          const content = m.replace(/\*\*/g, "");
                          formatted = formatted.replace(m, `<strong class="text-blue-600 dark:text-blue-400 font-bold">${content}</strong>`);
                        });
                      }

                      if (line.startsWith("- [ ]") || line.startsWith("- [x]")) {
                        const checked = line.includes("[x]");
                        return (
                          <div key={lidx} className="flex items-center gap-2 mt-1">
                            <input type="checkbox" checked={checked} onChange={(e) => {
                              const toggleText = checked ? "[ ]" : "[x]";
                              const updatedSummary = activeTask.aiSummary?.replace(checked ? "- [x]" : "- [ ]", toggleText);
                              onUpdateTask(activeTask.id, { aiSummary: updatedSummary });
                              setActiveTask((prev) => prev ? { ...prev, aiSummary: updatedSummary } : null);
                            }} className="rounded border-neutral-200 text-blue-600 w-3.5 h-3.5 cursor-pointer" />
                            <span className={`text-[11px] ${checked ? "line-through text-neutral-400" : ""}`} dangerouslySetInnerHTML={{ __html: formatted.replace(/- \[( |x)\]/g, "") }} />
                          </div>
                        );
                      }

                      return <p key={lidx} className="mt-1" dangerouslySetInnerHTML={{ __html: formatted }} />;
                    })}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleAIOptimize(activeTask)}
                  disabled={aiLoading}
                  className="w-full bg-[#171717] hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 disabled:bg-neutral-50 text-white dark:text-neutral-900 font-semibold text-xs py-3 rounded-[12px] transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 duration-150 shadow-premium-sm"
                >
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>{aiLoading ? "Consulting Nexora Intellect..." : "Generate AI Checklist"}</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-neutral-100 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-950/20 text-[10px] text-neutral-400 flex items-center justify-between font-mono">
            <span>Nexora Task Management Suite</span>
            <span>Live Sync</span>
          </div>
        </div>
      )}

      {/* Creation Slide-Over Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#171717]/40 backdrop-blur-md" onClick={() => setIsCreateOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 rounded-[22px] p-6 shadow-premium-lg flex flex-col gap-5 text-[#171717] dark:text-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="font-semibold text-[#171717] dark:text-white flex items-center gap-2 text-sm">
                <CheckSquare className="w-4.5 h-4.5 text-blue-500" /> Draft New Task
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1.5 text-neutral-400 hover:text-[#171717] rounded-[8px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 font-medium">Task Title</label>
                <input
                  type="text"
                  required
                  className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Optimize SQL indices"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 font-medium">Objective Summary</label>
                <textarea
                  rows={3}
                  className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[12px] p-3 text-[#171717] dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Summarize criteria parameters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-medium">Associated Project</label>
                  <select
                    className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-white dark:bg-neutral-900 text-[#171717] dark:text-neutral-200">
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-medium">Assignee</label>
                  <select
                    className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.userId} className="bg-white dark:bg-neutral-900 text-[#171717] dark:text-neutral-200">
                        {m.userName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-medium">Priority Level</label>
                  <select
                    className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {["Low", "Medium", "High", "Urgent"].map((pr) => (
                      <option key={pr} value={pr} className="bg-white dark:bg-neutral-900 text-[#171717] dark:text-neutral-200">{pr}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-medium">Target Due Date</label>
                  <input
                    type="date"
                    className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 focus:outline-none focus:border-blue-500 font-mono"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#171717] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-semibold py-3.5 rounded-[12px] shadow-premium-sm transition-all mt-3 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Commit Task Milestone
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
