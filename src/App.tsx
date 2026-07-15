import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import LandingPage from "./components/LandingPage";
import CommandPalette from "./components/CommandPalette";
import AIAssistantModal from "./components/AIAssistantModal";

// Sub-views
import DashboardView from "./components/DashboardView";
import ProjectsView from "./components/ProjectsView";
import CalendarView from "./components/CalendarView";
import KanbanView from "./components/KanbanView";
import ChatView from "./components/ChatView";
import FilesView from "./components/FilesView";
import InsightsView from "./components/InsightsView";
import TeamView from "./components/TeamView";
import SettingsView from "./components/SettingsView";

// Custom Premium Overlays & Trays
import WorkspaceSwitchOverlay from "./components/WorkspaceSwitchOverlay";
import FocusModeOverlay from "./components/FocusModeOverlay";
import SmartNotificationTray, { ToastMessage } from "./components/SmartNotificationTray";
import TimeMachineOverlay from "./components/TimeMachineOverlay";

import { 
  Workspace, Project, Task, WorkspaceMember, ChatMessage, WorkspaceFile, ActivityLog 
} from "./types";
import { 
  Sparkles, Layers, CheckSquare, MessageSquare, Files, Users, Settings, 
  Search, Shield, Bot, LogOut, ChevronDown, Plus, PlusCircle, AlertCircle, X, HelpCircle, Key, RefreshCw, Calendar as CalendarIcon, Moon, Sun
} from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<WorkspaceMember | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [availableWorkspaces, setAvailableWorkspaces] = useState<Workspace[]>([]);
  
  // Datasets for active Workspace
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Navigation & triggers
  const [activeModule, setActiveModule] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [visualAccent, setVisualAccent] = useState<string>("indigo");
  const [isDarkMode, setIsDarkMode] = useState(false); // Premium paper-white by default

  // Custom premium operational states
  const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState(false);
  const [switchingToName, setSwitchingToName] = useState("");
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [isTimeMachineActive, setIsTimeMachineActive] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, details?: string, avatar?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, details, avatar }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const handleRemoveToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Modal details
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register" | "join">("login");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regWorkspace, setRegWorkspace] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [authError, setAuthError] = useState("");

  // Sync / fetch active workspace data
  const syncWorkspaceData = async (workspaceId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/data`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
        setTasks(data.tasks);
        setMembers(data.members);
        setChats(data.chats);
        setFiles(data.files);
        setActivityLogs(data.activityLogs);
      }
    } catch (err) {
      console.error("Workspace synchronization failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch workspace
  const handleSwitchWorkspace = async (workspace: Workspace) => {
    setSwitchingToName(workspace.name);
    setIsSwitchingWorkspace(true);
    setCurrentWorkspace(workspace);
    await syncWorkspaceData(workspace.id);
    setActiveModule("dashboard");
    
    // Hold the loading folding panel for a brief beautiful instant to let the user appreciate the craft
    setTimeout(() => {
      setIsSwitchingWorkspace(false);
      addToast(`Workspace Switched`, `Connected safely to ${workspace.name}`);
    }, 1500);
  };

  // Sync available workspaces list
  const syncAvailableWorkspaces = async (userId: string) => {
    try {
      const res = await fetch("/api/workspaces", {
        headers: { "x-user-id": userId }
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableWorkspaces(data);
      }
    } catch (err) {
      console.error("Could not fetch workspaces directory", err);
    }
  };

  // Keyboard shortcuts (Spotlight, Focus Mode, Linear-style navigation)
  useEffect(() => {
    let keyBuffer = "";
    let bufferTimeout: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard commands if user is typing inside input, textarea, select, or contenteditable
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      // 1. Spotlight command palette (Ctrl+K or /)
      if (((e.ctrlKey || e.metaKey) && e.key === "k") || e.key === "/") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // 2. Focus Mode activation (N)
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setIsFocusModeActive(true);
        return;
      }

      // 3. Double-key sequential shortcuts
      const key = e.key.toLowerCase();
      if (key === "g") {
        keyBuffer = "g";
        if (bufferTimeout) clearTimeout(bufferTimeout);
        bufferTimeout = setTimeout(() => {
          keyBuffer = "";
        }, 1000); // 1s sequence window
        return;
      }

      if (keyBuffer === "g") {
        let matched = true;
        if (key === "d") {
          setActiveModule("dashboard");
          addToast("Navigating to Overview Center", "Double shortcut: G D");
        } else if (key === "p") {
          setActiveModule("projects");
          addToast("Navigating to Projects Portfolio", "Double shortcut: G P");
        } else if (key === "c") {
          setActiveModule("calendar");
          addToast("Navigating to Team Calendar", "Double shortcut: G C");
        } else if (key === "t") {
          setActiveModule("kanban");
          addToast("Navigating to Tasks Sprint", "Double shortcut: G T");
        } else if (key === "m") {
          setActiveModule("chat");
          addToast("Navigating to Messages Board", "Double shortcut: G M");
        } else if (key === "f") {
          setActiveModule("files");
          addToast("Navigating to Files Hub", "Double shortcut: G F");
        } else if (key === "i") {
          setActiveModule("insights");
          addToast("Navigating to Metrics Insights", "Double shortcut: G I");
        } else if (key === "s") {
          setActiveModule("settings");
          addToast("Navigating to Settings Platform", "Double shortcut: G S");
        } else {
          matched = false;
        }

        if (matched) {
          e.preventDefault();
          keyBuffer = "";
          if (bufferTimeout) clearTimeout(bufferTimeout);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (bufferTimeout) clearTimeout(bufferTimeout);
    };
  }, []);

  // Quick Demo logins as preseeded member roles
  const handlePreseededLogin = async (id: string) => {
    setIsLoading(true);
    setAuthError("");
    try {
      let name = "Sarah Chen";
      let email = "sarah@nexora.sh";
      let avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150";

      if (id === "marcus") {
        name = "Marcus Vance";
        email = "marcus@nexora.sh";
        avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150";
      } else if (id === "elena") {
        name = "Elena Rostova";
        email = "elena@nexora.sh";
        avatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150";
      }

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, avatar })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("nexora_token", data.token);
        
        await syncWorkspaceData(data.workspace.id);
        const memRes = await fetch(`/api/workspaces/${data.workspace.id}/data`);
        const memData = await memRes.json();
        const activeMember = memData.members.find((m: any) => m.userId === data.user.id);

        setCurrentUser(activeMember || {
          id: `m-${Date.now()}`,
          userId: data.user.id,
          workspaceId: data.workspace.id,
          role: "Member",
          joinedAt: new Date().toISOString(),
          userName: data.user.name,
          userEmail: data.user.email,
          userAvatar: data.user.avatar
        });

        setCurrentWorkspace(data.workspace);
        await syncAvailableWorkspaces(data.user.id);
        setIsAuthenticated(true);
        setShowAuthModal(false);
      } else {
        const errData = await res.json();
        setAuthError(errData.error || "Authentication failed");
      }
    } catch (err) {
      setAuthError("Failed to connect to the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  // Register Custom Brand Workspace
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    setIsLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("nexora_token", data.token);

        if (regWorkspace.trim()) {
          await fetch(`/api/workspaces/${data.workspace.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: regWorkspace.trim() })
          });
          data.workspace.name = regWorkspace.trim();
        }

        await syncWorkspaceData(data.workspace.id);
        
        const memRes = await fetch(`/api/workspaces/${data.workspace.id}/data`);
        const memData = await memRes.json();
        const activeMember = memData.members.find((m: any) => m.userId === data.user.id);

        setCurrentUser(activeMember || {
          id: `m-${Date.now()}`,
          userId: data.user.id,
          workspaceId: data.workspace.id,
          role: "Owner",
          joinedAt: new Date().toISOString(),
          userName: data.user.name,
          userEmail: data.user.email,
          userAvatar: data.user.avatar
        });

        setCurrentWorkspace(data.workspace);
        await syncAvailableWorkspaces(data.user.id);
        setIsAuthenticated(true);
        setShowAuthModal(false);
      } else {
        const errData = await res.json();
        setAuthError(errData.error || "Failed to create tenant organization.");
      }
    } catch (err) {
      setAuthError("Connection error while registering.");
    } finally {
      setIsLoading(false);
    }
  };

  // Join Workspace via Invite Code
  const handleJoinCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !currentUser) return;

    setIsLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/workspaces/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteCode: joinCode.trim(),
          userId: currentUser.userId,
          userName: currentUser.userName,
          userEmail: currentUser.userEmail,
          userAvatar: currentUser.userAvatar
        })
      });

      if (res.ok) {
        const data = await res.json();
        await syncAvailableWorkspaces(currentUser.userId);
        await handleSwitchWorkspace(data.workspace);
        setJoinCode("");
        setAuthType("login");
      } else {
        const errData = await res.json();
        setAuthError(errData.error || "Invite code expired or invalid.");
      }
    } catch (err) {
      setAuthError("Could not connect to join workspace.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mutator triggers
  const handleCreateProject = async (name: string, description: string, dueDate: string, ownerId: string) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          name,
          description,
          dueDate,
          ownerId,
          userName: currentUser.userName
        })
      });
      if (res.ok) {
        addToast("Project Portfolio Added", `Created '${name}' under Nexora organizational nodes.`);
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.userId,
          userName: currentUser.userName
        })
      });
      if (res.ok) {
        addToast("Project Deleted", "Portfolio successfully removed.");
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProject = async (projectId: string, payload: Partial<Project>) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          userId: currentUser.userId,
          userName: currentUser.userName
        })
      });
      if (res.ok) {
        addToast("Project Updated", "Portfolio specifications changed.");
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (
    projectId: string, title: string, description: string, status: string, priority: string, assigneeId: string, dueDate: string
  ) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          workspaceId: currentWorkspace.id,
          title,
          description,
          status,
          priority,
          assigneeId,
          dueDate,
          userId: currentUser.userId,
          userName: currentUser.userName
        })
      });
      if (res.ok) {
        addToast("Task Created", `Scheduled '${title}' in Sprint.`);
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (taskId: string, payload: Partial<Task>) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          userId: currentUser.userId,
          userName: currentUser.userName
        })
      });
      if (res.ok) {
        if (payload.status === "Done") {
          addToast("Milestone Completed! 🎉", `Completed: '${payload.title || "active task"}'`);
        } else if (payload.status) {
          addToast("Task Moved", `Rescheduled to ${payload.status}`);
        } else {
          addToast("Task Specifications Updated", "Modified sprint milestone properties.");
        }
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.userId,
          userName: currentUser.userName
        })
      });
      if (res.ok) {
        addToast("Task Removed", "Slashed from sprint backlog.");
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, role: string) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch(`/api/workspaces/${currentWorkspace.id}/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          userId: currentUser.userId,
          userName: currentUser.userName
        })
      });
      if (res.ok) {
        addToast("Member Role Updated", `Role changed to ${role}.`);
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (content: string, triggersAI: boolean) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch(`/api/chats/${currentWorkspace.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.userId,
          userName: currentUser.userName,
          userAvatar: currentUser.userAvatar,
          content
        })
      });
      if (res.ok) {
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadFile = async (name: string, size: string, type: string) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch(`/api/files/${currentWorkspace.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          size,
          type,
          uploadedBy: currentUser.userName
        })
      });
      if (res.ok) {
        addToast("File Sync Complete", `Uploaded '${name}' to organization files.`);
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!currentWorkspace || !currentUser) return;
    try {
      const res = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.userId,
          userName: currentUser.userName
        })
      });
      if (res.ok) {
        addToast("File Deleted", "Removed from secure assets.");
        await syncWorkspaceData(currentWorkspace.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateWorkspaceName = async (payload: Partial<Workspace>) => {
    if (currentWorkspace && payload.name) {
      setCurrentWorkspace({ ...currentWorkspace, name: payload.name });
    }
  };

  const handleUpdateProfile = async (payload: Partial<WorkspaceMember>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...payload });
    }
  };

  // Nav Items
  const workspaceNavItems = [
    { id: "dashboard", label: "Overview", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "projects", label: "Projects", icon: <PlusCircle className="w-3.5 h-3.5" /> },
    { id: "calendar", label: "Calendar", icon: <CalendarIcon className="w-3.5 h-3.5" /> },
    { id: "kanban", label: "Tasks", icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { id: "chat", label: "Messages", icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: "files", label: "Files", icon: <Files className="w-3.5 h-3.5" /> },
    { id: "insights", label: "Insights", icon: <Sparkles className="w-3.5 h-3.5 text-blue-500" /> }
  ];

  const organizationNavItems = [
    { id: "team", label: "People", icon: <Users className="w-3.5 h-3.5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-3.5 h-3.5" /> }
  ];

  // Render Sub-Views
  const renderModuleView = () => {
    switch (activeModule) {
      case "dashboard":
        return (
          <DashboardView
            workspace={currentWorkspace}
            projects={projects}
            tasks={tasks}
            members={members}
            activityLogs={activityLogs}
            onNavigate={(mod, tid) => {
              setActiveModule(mod);
            }}
            onOpenAICopilot={() => setIsAICopilotOpen(true)}
          />
        );
      case "projects":
        return (
          <ProjectsView
            projects={projects}
            members={members}
            tasks={tasks}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onUpdateProject={handleUpdateProject}
            currentUserId={currentUser?.userId || ""}
          />
        );
      case "calendar":
        return <CalendarView tasks={tasks} />;
      case "kanban":
        return (
          <KanbanView
            tasks={tasks}
            projects={projects}
            members={members}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            currentUserId={currentUser?.userId || ""}
          />
        );
      case "chat":
        return (
          <ChatView
            chats={chats}
            members={members}
            workspace={currentWorkspace}
            currentUserId={currentUser?.userId || ""}
            currentUserName={currentUser?.userName || "Guest"}
            currentUserAvatar={currentUser?.userAvatar || "https://api.dicebear.com/7.x/initials/svg?seed=user"}
            onSendMessage={handleSendMessage}
          />
        );
      case "files":
        return (
          <FilesView
            files={files}
            onUploadFile={handleUploadFile}
            onDeleteFile={handleDeleteFile}
            currentUserName={currentUser?.userName || "Teammate"}
          />
        );
      case "insights":
        return <InsightsView projects={projects} tasks={tasks} members={members} />;
      case "team":
        return (
          <TeamView
            members={members}
            workspace={currentWorkspace}
            onUpdateRole={handleUpdateMemberRole}
            currentUserId={currentUser?.userId || ""}
          />
        );
      case "settings":
        return (
          <SettingsView
            workspace={currentWorkspace}
            onUpdateWorkspace={handleUpdateWorkspaceName}
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            visualAccent={visualAccent}
            onChangeAccent={setVisualAccent}
          />
        );
      default:
        return <div className="text-neutral-400 text-xs">Module not instantiated.</div>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={isDarkMode ? "dark" : ""}>
        <LandingPage 
          onEnterApp={() => {
            setAuthType("login");
            setShowAuthModal(true);
          }}
          onGoogleLogin={() => {
            setAuthType("login");
            setShowAuthModal(true);
          }}
        />

        {/* Auth / Demoport Selection Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#171717]/40 backdrop-blur-md" onClick={() => setShowAuthModal(false)} />

            <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-850 rounded-[22px] p-6 shadow-premium-lg flex flex-col gap-6 text-[#171717] dark:text-neutral-300 font-sans">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-[#171717] dark:bg-white rounded-[2px]" />
                  <span className="font-semibold text-xs uppercase tracking-wider font-mono">Gateway Console</span>
                </div>
                <button onClick={() => setShowAuthModal(false)} className="p-1.5 text-neutral-400 hover:text-[#171717] rounded-[8px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {authError && (
                <div className="bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-[14px] p-3 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-[#F7F7F5] dark:bg-neutral-950 p-1 rounded-[14px] border border-neutral-200/50 dark:border-neutral-850">
                <button 
                  onClick={() => { setAuthType("login"); setAuthError(""); }}
                  className={`flex-1 text-center py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${authType === "login" ? "bg-white dark:bg-neutral-900 text-[#171717] dark:text-white shadow-premium-sm" : "text-neutral-400 hover:text-neutral-600"}`}
                >
                  Preseeded Roles
                </button>
                <button 
                  onClick={() => { setAuthType("register"); setAuthError(""); }}
                  className={`flex-1 text-center py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${authType === "register" ? "bg-white dark:bg-neutral-900 text-[#171717] dark:text-white shadow-premium-sm" : "text-neutral-400 hover:text-neutral-600"}`}
                >
                  Create Workspace
                </button>
                {currentUser && (
                  <button 
                    onClick={() => { setAuthType("join"); setAuthError(""); }}
                    className={`flex-1 text-center py-2 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${authType === "join" ? "bg-white dark:bg-neutral-900 text-[#171717] dark:text-white shadow-premium-sm" : "text-neutral-400 hover:text-neutral-600"}`}
                  >
                    Join with Code
                  </button>
                )}
              </div>

              {/* Roles */}
              {authType === "login" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    {[
                      { id: "sarah", name: "Sarah Chen", role: "Owner / Lead Designer", email: "sarah@nexora.sh", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
                      { id: "marcus", name: "Marcus Vance", role: "Admin / SaaS Architect", email: "marcus@nexora.sh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
                      { id: "elena", name: "Elena Rostova", role: "Member / Auditor", email: "elena@nexora.sh", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" }
                    ].map((demo) => (
                      <div
                        key={demo.id}
                        onClick={() => handlePreseededLogin(demo.id)}
                        className="bg-[#FDFDFB] dark:bg-neutral-950/40 border border-neutral-200/50 hover:border-neutral-300 dark:border-neutral-850 dark:hover:border-neutral-750 p-3 rounded-[16px] flex items-center justify-between cursor-pointer transition-all relative group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={demo.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-neutral-200/30" />
                          <div className="min-w-0">
                            <p className="font-semibold text-[#171717] dark:text-neutral-200 text-xs sm:text-sm group-hover:text-blue-500 transition-colors truncate">{demo.name}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{demo.role}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 text-neutral-500 font-mono px-2 py-0.5 rounded-[6px] group-hover:text-blue-600 transition-all">Open</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Register */}
              {authType === "register" && (
                <form onSubmit={handleRegister} className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-neutral-500 font-medium">Your Name</label>
                    <input
                      type="text"
                      required
                      className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Athena Dev"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-neutral-500 font-medium">Your Email</label>
                    <input
                      type="email"
                      required
                      className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                      placeholder="e.g. athena@ventur.es"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-neutral-500 font-medium">Organization Name</label>
                    <input
                      type="text"
                      className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Athena Labs"
                      value={regWorkspace}
                      onChange={(e) => setRegWorkspace(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#171717] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-semibold py-3.5 rounded-[12px] shadow-premium-sm transition-all mt-2 flex items-center justify-center cursor-pointer"
                  >
                    {isLoading ? "Provisioning..." : "Create Organization"}
                  </button>
                </form>
              )}

              {/* Join */}
              {authType === "join" && (
                <form onSubmit={handleJoinCode} className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-neutral-500 font-medium">Invitation Code</label>
                    <input
                      type="text"
                      required
                      className="bg-[#F7F7F5] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[12px] px-3.5 py-3 text-[#171717] dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500 font-mono text-center uppercase tracking-widest text-sm"
                      placeholder="NEXORA-XX"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !joinCode.trim()}
                    className="w-full bg-[#171717] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-semibold py-3.5 rounded-[12px] shadow-premium-sm transition-all mt-2 flex items-center justify-center cursor-pointer"
                  >
                    Authenticate Code
                  </button>
                </form>
              )}

            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F7F7F5] dark:bg-[#0E0F11] text-[#171717] dark:text-neutral-100 font-sans flex relative p-6 gap-6 ${isDarkMode ? "dark" : ""}`} id="app-workspace-root">
      
      {/* Floating Sidebar Panel */}
      <motion.aside 
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
        className="w-60 bg-white dark:bg-[#15171A] border border-neutral-150/60 dark:border-neutral-850 rounded-[24px] p-5 flex flex-col justify-between shadow-premium-md relative z-10"
      >
        <div className="flex flex-col gap-5">
          {/* Typography Logo */}
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800/60">
            <span className="font-display font-medium text-base tracking-tight text-[#171717] dark:text-white">Nexora</span>
            <span className="inline-block w-2.5 h-2.5 bg-[#0057FF] rounded-[2px]" />
          </div>

          {/* Active Workspace / Switching */}
          <div className="flex flex-col gap-1 bg-[#F7F7F5] dark:bg-neutral-950/40 border border-neutral-200/40 dark:border-neutral-800/50 rounded-[14px] p-2 relative group">
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest font-mono pl-1">Workspace Node</span>
            
            <div className="flex items-center justify-between gap-1 cursor-pointer">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs">{currentWorkspace?.logo}</span>
                <span className="text-xs font-semibold text-[#171717] dark:text-neutral-200 truncate">{currentWorkspace?.name}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </div>

            {/* Dropdown switch */}
            <div className="absolute left-0 top-[105%] w-full bg-white dark:bg-[#15171A] border border-neutral-150 dark:border-neutral-800 p-1.5 rounded-[14px] hidden group-hover:block z-50 shadow-premium-lg">
              <span className="text-[8px] font-bold font-mono text-neutral-400 uppercase tracking-widest block px-2 pb-1.5 border-b border-neutral-100 dark:border-neutral-800">Switch Workspace</span>
              
              <div className="flex flex-col gap-0.5 mt-1 max-h-[140px] overflow-y-auto scrollbar-none">
                {availableWorkspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => handleSwitchWorkspace(ws)}
                    className="w-full text-left px-2 py-1.5 rounded-[8px] text-[11px] font-medium text-neutral-500 hover:text-[#171717] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors flex items-center gap-1.5 truncate cursor-pointer"
                  >
                    <span>{ws.logo}</span>
                    <span className="truncate">{ws.name}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => {
                  setAuthType("register");
                  setShowAuthModal(true);
                }}
                className="w-full text-left px-2 py-1.5 rounded-[8px] text-[10px] text-[#0057FF] font-bold hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors flex items-center gap-1 mt-1.5 border-t border-neutral-100 dark:border-neutral-800 pt-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Create Workspace
              </button>

              <button
                onClick={() => {
                  setAuthType("join");
                  setShowAuthModal(true);
                }}
                className="w-full text-left px-2 py-1.5 rounded-[8px] text-[10px] text-[#0BA95B] font-bold hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Key className="w-3 h-3" /> Join with Code
              </button>
            </div>
          </div>

          {/* Navigation Category 1: Workspace */}
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest pl-3 mb-1 font-mono">Workspace</span>
            <nav className="flex flex-col gap-0.5">
              {workspaceNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs font-semibold transition-all text-left cursor-pointer ${
                    activeModule === item.id 
                      ? "bg-[#F7F7F5] dark:bg-neutral-800 text-[#171717] dark:text-white" 
                      : "text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100/70 dark:border-neutral-800/60 my-0.5" />

          {/* Navigation Category 2: Organization */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest pl-3 mb-1 font-mono">Organization</span>
            <nav className="flex flex-col gap-0.5">
              {organizationNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs font-semibold transition-all text-left cursor-pointer ${
                    activeModule === item.id 
                      ? "bg-[#F7F7F5] dark:bg-neutral-800 text-[#171717] dark:text-white" 
                      : "text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100/70 dark:border-neutral-800/60 my-0.5" />

          {/* Navigation Category 3: Acoustics & Zen */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest pl-3 mb-1 font-mono">Acoustics & Zen</span>
            <nav className="flex flex-col gap-0.5">
              <button
                onClick={() => setIsFocusModeActive(true)}
                className="flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-all text-left text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-blue-500 animate-pulse">⊙</span>
                  <span>Zen Focus Mode</span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-1 rounded">N</span>
              </button>

              <button
                onClick={() => setIsTimeMachineActive(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs font-semibold transition-all text-left text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 cursor-pointer"
              >
                <span className="text-emerald-500 font-bold">↺</span>
                <span>Time Machine</span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Identity + Light/Dark mode */}
        <div className="flex flex-col gap-4 border-t border-neutral-100 dark:border-neutral-800 pt-4 mt-4">
          
          {/* Light/Dark Toggle */}
          <div className="flex items-center justify-between bg-[#F7F7F5] dark:bg-neutral-950 p-1 rounded-[10px]">
            <button 
              onClick={() => setIsDarkMode(false)} 
              className={`flex-1 flex items-center justify-center py-1 rounded-[6px] text-xs transition-all cursor-pointer ${!isDarkMode ? "bg-white dark:bg-neutral-900 text-[#171717] dark:text-white shadow-premium-sm" : "text-neutral-400"}`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setIsDarkMode(true)} 
              className={`flex-1 flex items-center justify-center py-1 rounded-[6px] text-xs transition-all cursor-pointer ${isDarkMode ? "bg-white dark:bg-neutral-900 text-[#171717] dark:text-white shadow-premium-sm" : "text-neutral-400"}`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs gap-1.5">
            <div className="flex items-center gap-2 truncate">
              <img src={currentUser?.userAvatar} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-neutral-200/40" />
              <div className="truncate">
                <p className="font-semibold text-[#171717] dark:text-neutral-200 truncate leading-snug">{currentUser?.userName}</p>
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">{currentUser?.role}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsAuthenticated(false)}
              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-[8px] transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Panel Area */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 17, delay: 0.1 }}
        className="flex-1 flex flex-col bg-white dark:bg-[#15171A] border border-neutral-150/60 dark:border-neutral-850 rounded-[24px] overflow-hidden shadow-premium-md relative"
      >
        
        {/* Header bar */}
        <header className="px-8 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-950/10">
          {/* Spotlight trigger */}
          <div 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2.5 bg-neutral-100/50 hover:bg-neutral-100 dark:bg-neutral-950/40 dark:hover:bg-neutral-950/60 border border-neutral-200/40 hover:border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-[12px] text-neutral-400 text-xs w-72 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 font-sans text-[11px] font-medium text-neutral-400">Search Nexora Spotlight...</span>
            <span className="text-[9px] bg-white dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-750 px-1.5 py-0.5 rounded-[6px] font-mono font-bold">⌘K</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAICopilotOpen(true)}
              className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/50 dark:border-neutral-800 px-3 py-1.5 rounded-full text-[10px] text-neutral-600 dark:text-neutral-300 font-mono font-bold uppercase cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Ask Intelligence</span>
            </button>

            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] text-neutral-400 font-mono hidden md:inline uppercase tracking-wider font-semibold">Isolated Node Synced</span>
          </div>
        </header>

        {/* Dynamic sub-view */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-none">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3.5 text-neutral-400 text-xs font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
              <span>Hydrating Nexora isolated schemas...</span>
            </div>
          ) : (
            renderModuleView()
          )}
        </main>
      </motion.div>

      {/* Global Spotlight Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={projects}
        tasks={tasks}
        members={members}
        onNavigate={(mod, tid) => {
          setActiveModule(mod);
        }}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
      />

      {/* Nexora Intelligence Assistant Drawer */}
      <AIAssistantModal
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
        workspace={currentWorkspace}
      />

      {/* CUSTOM PREMIUM OVERLAYS & NOTIFICATIONS */}
      <WorkspaceSwitchOverlay
        isVisible={isSwitchingWorkspace}
        workspaceName={switchingToName}
      />

      <FocusModeOverlay
        isVisible={isFocusModeActive}
        onClose={() => setIsFocusModeActive(false)}
        tasks={tasks}
        onCompleteTask={async (taskId) => {
          await handleUpdateTask(taskId, { status: "Done" });
        }}
      />

      <SmartNotificationTray
        notifications={toasts}
        onRemove={handleRemoveToast}
      />

      <TimeMachineOverlay
        isVisible={isTimeMachineActive}
        onClose={() => setIsTimeMachineActive(false)}
      />

    </div>
  );
}
