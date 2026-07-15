import React, { useState } from "react";
import { Plus, Folder, Calendar, User, Trash2, X } from "lucide-react";
import { Project, WorkspaceMember, Task } from "../types";

interface ProjectsViewProps {
  projects: Project[];
  members: WorkspaceMember[];
  tasks: Task[];
  onCreateProject: (name: string, description: string, dueDate: string, ownerId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onUpdateProject: (projectId: string, payload: Partial<Project>) => void;
  currentUserId: string;
}

export default function ProjectsView({
  projects,
  members,
  tasks,
  onCreateProject,
  onDeleteProject,
  onUpdateProject,
  currentUserId
}: ProjectsViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [ownerId, setOwnerId] = useState(currentUserId || "");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject(name, description, dueDate, ownerId);
    
    // Reset form
    setName("");
    setDescription("");
    setDueDate("");
    setOwnerId(currentUserId);
    setIsModalOpen(false);
  };

  const filtered = projects.filter((p) => filterStatus === "All" || p.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning": return "bg-sky-50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30 text-sky-600 dark:text-sky-400";
      case "Active": return "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400";
      case "On Hold": return "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400";
      case "Completed": return "bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30 text-green-600 dark:text-green-400";
      default: return "bg-neutral-50 dark:bg-neutral-850 border-neutral-100 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400";
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto font-sans text-neutral-800 dark:text-neutral-200" id="projects-view-root">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-3xl font-display font-medium tracking-tight text-[#171717] dark:text-white">Projects</h1>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Organize delivery milestones, workloads, and progress ratios inside this tenant.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white hover:bg-[#FFFFFF]/95 dark:bg-[#15171A] dark:hover:bg-[#15171A]/90 text-[#0057FF] border border-neutral-200/60 dark:border-neutral-800/80 font-semibold text-xs px-5 py-3 rounded-[12px] flex items-center justify-center gap-1.5 shadow-premium-sm hover:shadow-premium-md hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#0057FF]" /> Add Project
        </button>
      </div>

      {/* Filters & Controls */}
      <div className="flex items-center gap-1 bg-neutral-100/50 dark:bg-neutral-950 p-1 rounded-[14px] border border-neutral-200/40 dark:border-neutral-850 w-fit">
        {["All", "Planning", "Active", "On Hold", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`text-xs font-semibold px-4 py-2 rounded-[10px] transition-all cursor-pointer ${
              filterStatus === status 
                ? "bg-white dark:bg-neutral-900 text-[#171717] dark:text-white shadow-premium-sm" 
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[28px] p-16 text-center flex flex-col items-center gap-3 shadow-premium-sm">
          <Folder className="w-12 h-12 text-neutral-300 dark:text-neutral-700 animate-pulse" />
          <h3 className="font-semibold text-neutral-700 dark:text-neutral-300 text-sm">No Projects Found</h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm leading-relaxed">Create your first milestone or alter your status filter to start mapping timelines.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-700 dark:text-white px-4 py-2.5 rounded-[12px] text-xs font-semibold border border-neutral-200/50 dark:border-neutral-750 transition-colors cursor-pointer"
          >
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => {
            const projectTasks = tasks.filter((t) => t.projectId === proj.id);
            const owner = members.find((m) => m.userId === proj.ownerId);

            return (
              <div 
                key={proj.id}
                className="bg-white dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-850 rounded-[22px] p-6 hover:shadow-premium-md transition-all flex flex-col justify-between relative group overflow-hidden shadow-premium-sm"
              >
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-[6px] uppercase tracking-wider border ${getStatusColor(proj.status)}`}>
                      {proj.status}
                    </span>
                    <button 
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-[8px] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-base text-[#171717] dark:text-white group-hover:text-blue-500 transition-colors leading-snug">{proj.name}</h3>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 line-clamp-2 leading-relaxed min-h-[32px]">{proj.description || "No description provided."}</p>
                </div>

                {/* Progress bar and metrics */}
                <div className="mt-6 flex flex-col gap-4 border-t border-neutral-100 dark:border-neutral-800/80 pt-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-400 dark:text-neutral-500 font-medium">Sprint Progress</span>
                      <span className="font-mono text-neutral-700 dark:text-neutral-300 font-bold">{proj.progress}%</span>
                    </div>
                    {/* Interactive slider indicator */}
                    <div className="relative group/progress mt-1">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={proj.progress}
                        onChange={(e) => onUpdateProject(proj.id, { progress: parseInt(e.target.value) })}
                        className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-ew-resize accent-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Date and details panel */}
                  <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{proj.dueDate ? new Date(proj.dueDate).toLocaleDateString([], { month: "short", day: "numeric" }) : "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <img src={owner?.userAvatar} alt="owner" className="w-4 h-4 rounded-full object-cover border border-neutral-200/40" />
                      <span className="truncate max-w-[80px]">{owner?.userName.split(" ")[0] || "Squad"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 font-bold bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800 px-2 py-0.5 rounded-[6px]">
                      <span>{projectTasks.length} tasks</span>
                    </div>
                  </div>
                </div>

                {/* Toggle status selector */}
                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800 p-0.5 rounded-[8px]">
                  {["Planning", "Active", "On Hold", "Completed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateProject(proj.id, { status: st as any })}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] cursor-pointer ${proj.status === st ? "bg-blue-600 text-white" : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"}`}
                    >
                      {st[0]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Slide-Over Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#171717]/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 rounded-[22px] p-6 shadow-premium-lg flex flex-col gap-5 text-[#171717] dark:text-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="font-semibold text-[#171717] dark:text-white flex items-center gap-2 text-sm">
                <Folder className="w-4.5 h-4.5 text-blue-500" /> Assemble New Project
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-neutral-400 hover:text-[#171717] rounded-[8px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 font-medium">Project Name</label>
                <input
                  type="text"
                  required
                  className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Nexora Core API"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 font-medium">Objective Description</label>
                <textarea
                  rows={3}
                  className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[12px] p-3 text-[#171717] dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Describe the primary roadmap criteria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-medium">Target Deadline</label>
                  <input
                    type="date"
                    className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 focus:outline-none focus:border-blue-500 font-mono"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-neutral-500 font-medium">Owner</label>
                  <select
                    className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.userId} className="bg-white dark:bg-neutral-900 text-[#171717] dark:text-neutral-200">
                        {m.userName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#171717] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-semibold py-3.5 rounded-[12px] shadow-premium-sm transition-all mt-3 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Commit Project Milestone
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
