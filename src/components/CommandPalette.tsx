import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Folder, CheckSquare, User, HelpCircle, CornerDownLeft, Sparkles, MessageSquare, FileText, Layers, Calendar as CalendarIcon } from "lucide-react";
import { Project, Task, WorkspaceMember } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  tasks: Task[];
  members: WorkspaceMember[];
  onNavigate: (module: string, targetId?: string) => void;
  onOpenAICopilot: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  projects,
  tasks,
  members,
  onNavigate,
  onOpenAICopilot
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: any) => {
    if (item.type === "action") {
      if (item.id === "ai-copilot") {
        onOpenAICopilot();
      } else {
        onNavigate(item.id);
      }
    } else if (item.type === "project") {
      onNavigate("projects", item.id);
    } else if (item.type === "task") {
      onNavigate("kanban", item.id);
    } else if (item.type === "member") {
      onNavigate("team", item.id);
    }
    onClose();
  };

  const items = [
    { id: "dashboard", name: "Go to Overview Center", category: "Navigation", type: "action", icon: <Layers className="w-4 h-4 text-neutral-400" /> },
    { id: "projects", name: "Go to Project Portfolios", category: "Navigation", type: "action", icon: <Folder className="w-4 h-4 text-neutral-400" /> },
    { id: "kanban", name: "Go to Tasks Kanban Board", category: "Navigation", type: "action", icon: <CheckSquare className="w-4 h-4 text-neutral-400" /> },
    { id: "calendar", name: "Go to Team Calendar", category: "Navigation", type: "action", icon: <CalendarIcon className="w-4 h-4 text-neutral-400" /> },
    { id: "chat", name: "Go to Messages", category: "Navigation", type: "action", icon: <MessageSquare className="w-4 h-4 text-neutral-400" /> },
    { id: "insights", name: "Go to Metrics Insights", category: "Navigation", type: "action", icon: <Sparkles className="w-4 h-4 text-neutral-400" /> },
    { id: "team", name: "Go to People Directory", category: "Navigation", type: "action", icon: <User className="w-4 h-4 text-neutral-400" /> },
    { id: "ai-copilot", name: "Query Nexora Intelligence Assistant (⌘ Ask)", category: "AI Operations", type: "action", icon: <Sparkles className="w-4 h-4 text-[#0057FF]" /> },

    ...projects.map((p) => ({
      id: p.id,
      name: `Project: ${p.name}`,
      category: "Projects",
      type: "project",
      icon: <Folder className="w-4 h-4 text-[#0BA95B]" />
    })),

    ...tasks.map((t) => ({
      id: t.id,
      name: `Task: ${t.title}`,
      category: "Tasks",
      type: "task",
      icon: <CheckSquare className="w-4 h-4 text-[#0057FF]" />
    })),

    ...members.map((m) => ({
      id: m.id,
      name: `Person: ${m.userName} (${m.role})`,
      category: "People",
      type: "member",
      icon: <User className="w-4 h-4 text-purple-500" />
    }))
  ];



  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      const activeElement = listElement.querySelector("[data-active='true']");
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Dark overlay backdrop with blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0E0F11]/45 dark:bg-[#000000]/65 backdrop-blur-md" 
            onClick={onClose} 
          />

          {/* Main Palette Modal (Apple Spotlight style) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#15171A] border border-neutral-150/75 dark:border-neutral-850 rounded-[22px] overflow-hidden shadow-premium-lg flex flex-col"
          >
            
            {/* Search Input Area */}
            <div className="flex items-center gap-3.5 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/20 dark:bg-neutral-950/20">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent border-none text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 focus:outline-none focus:ring-0 text-sm font-medium"
                placeholder="Search files, views, AI triggers... (Ctrl+K or /)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
              />
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-750 px-2 py-0.5 rounded-[8px] font-mono select-none">
                ESC
              </div>
            </div>

            {/* Results Stream */}
            <div ref={listRef} className="max-h-[340px] overflow-y-auto p-2 scrollbar-none">
              {filteredItems.length === 0 ? (
                <div className="py-12 px-4 text-center text-neutral-400 flex flex-col items-center gap-2">
                  <HelpCircle className="w-8 h-8 text-neutral-300 dark:text-neutral-700 animate-pulse" />
                  <p className="text-xs font-semibold">No results matching "{query}"</p>
                  <p className="text-[11px] text-neutral-400">Refine your prompt or query Nexora Intelligence.</p>
                </div>
              ) : (
                <div>
                  {Object.entries(
                    filteredItems.reduce((acc, item) => {
                      if (!acc[item.category]) acc[item.category] = [];
                      acc[item.category].push(item);
                      return acc;
                    }, {} as Record<string, typeof filteredItems>)
                  ).map(([category, catItems]) => (
                    <div key={category} className="mb-2">
                      <div className="px-3.5 py-1.5 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-mono">
                        {category}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {catItems.map((item) => {
                          const absoluteIndex = filteredItems.findIndex((fi) => fi.id === item.id);
                          const isSelected = absoluteIndex === selectedIndex;

                          return (
                            <div
                              key={item.id}
                              data-active={isSelected}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                              className={`flex items-center justify-between px-3.5 py-2.5 rounded-[14px] cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white"
                                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  {item.icon}
                                </div>
                                <span className="text-xs font-medium">{item.name}</span>
                              </div>

                              {isSelected && (
                                <div className="flex items-center gap-1 text-[9px] text-[#0057FF] dark:text-[#0057FF] font-bold font-mono">
                                  <span>Open</span>
                                  <CornerDownLeft className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer info bar */}
            <div className="bg-neutral-50/50 dark:bg-neutral-950/40 px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between font-mono">
              <div className="flex items-center gap-3">
                <span>↑↓ to select</span>
                <span>↵ to open</span>
              </div>
              <div className="flex items-center gap-1 text-[#0057FF] font-bold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Nexora Spotlight Sync</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
