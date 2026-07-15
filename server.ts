import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Setup Gemini API Client with required User-Agent
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DB_FILE = path.join(process.cwd(), "data-store.json");

// Helper to safely read and write database
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    // Generate high-quality initial seed data
    const initialSeed = {
      users: [
        {
          id: "sarah-chen",
          name: "Sarah Chen",
          email: "sarah@nexora.sh",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          createdAt: new Date().toISOString()
        },
        {
          id: "marcus-vance",
          name: "Marcus Vance",
          email: "marcus@nexora.sh",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          createdAt: new Date().toISOString()
        },
        {
          id: "elena-rostova",
          name: "Elena Rostova",
          email: "elena@nexora.sh",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
          createdAt: new Date().toISOString()
        }
      ],
      workspaces: [
        {
          id: "tf-123",
          name: "Nexora HQ",
          slug: "nexora-hq",
          logo: "■",
          createdAt: new Date().toISOString(),
          ownerId: "marcus-vance",
          inviteCode: "NEXORA-99"
        }
      ],
      members: [
        {
          id: "m-sarah",
          userId: "sarah-chen",
          workspaceId: "tf-123",
          role: "Admin",
          joinedAt: new Date().toISOString(),
          userEmail: "sarah@nexora.sh",
          userName: "Sarah Chen",
          userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
        },
        {
          id: "m-marcus",
          userId: "marcus-vance",
          workspaceId: "tf-123",
          role: "Owner",
          joinedAt: new Date().toISOString(),
          userEmail: "marcus@nexora.sh",
          userName: "Marcus Vance",
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        },
        {
          id: "m-elena",
          userId: "elena-rostova",
          workspaceId: "tf-123",
          role: "Member",
          joinedAt: new Date().toISOString(),
          userEmail: "elena@nexora.sh",
          userName: "Elena Rostova",
          userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
        }
      ],
      projects: [
        {
          id: "proj-1",
          workspaceId: "tf-123",
          name: "Design System v2",
          description: "Rebuilding our interface layer around modern tokens, glassmorphism, and responsive motion principles.",
          status: "Active",
          progress: 68,
          dueDate: "2026-08-15",
          createdAt: new Date().toISOString(),
          ownerId: "sarah-chen"
        },
        {
          id: "proj-2",
          workspaceId: "tf-123",
          name: "Gemini AI Workspace Copilot",
          description: "Integrating LLMs to summarize tasks, draft meeting transcripts, and provide real-time workflow assistance.",
          status: "Active",
          progress: 45,
          dueDate: "2026-09-01",
          createdAt: new Date().toISOString(),
          ownerId: "marcus-vance"
        },
        {
          id: "proj-3",
          workspaceId: "tf-123",
          name: "SOC2 Compliance Readiness",
          description: "System audit, logs, role isolation, and policy mapping for our enterprise multi-tenant database infrastructure.",
          status: "Completed",
          progress: 100,
          dueDate: "2026-07-01",
          createdAt: new Date().toISOString(),
          ownerId: "elena-rostova"
        }
      ],
      tasks: [
        {
          id: "task-1",
          projectId: "proj-1",
          workspaceId: "tf-123",
          title: "Define global theme typography scaling",
          description: "Map Plus Jakarta Sans and JetBrains Mono values into the new design system theme file.",
          status: "Done",
          priority: "High",
          assigneeId: "sarah-chen",
          dueDate: "2026-07-20",
          createdAt: new Date().toISOString(),
          aiSummary: "Completed initial token declarations. Font tracking, font weights, and line heights have been fully standardized across UI components."
        },
        {
          id: "task-2",
          projectId: "proj-1",
          workspaceId: "tf-123",
          title: "Build animated sidebar & navigation layout",
          description: "Create an expandable glassmorphic layout using Framer Motion with soft backdrops.",
          status: "In Progress",
          priority: "High",
          assigneeId: "sarah-chen",
          dueDate: "2026-07-28",
          createdAt: new Date().toISOString()
        },
        {
          id: "task-3",
          projectId: "proj-2",
          workspaceId: "tf-123",
          title: "Write Gemini prompt schemas",
          description: "Draft JSON schema instructions for task auto-summaries to avoid hallucinated assignees.",
          status: "In Progress",
          priority: "Urgent",
          assigneeId: "marcus-vance",
          dueDate: "2026-07-18",
          createdAt: new Date().toISOString()
        },
        {
          id: "task-4",
          projectId: "proj-2",
          workspaceId: "tf-123",
          title: "Implement server proxy routing for secure keys",
          description: "Ensure the frontend never has direct access to process.env.GEMINI_API_KEY. Route all requests through server.ts.",
          status: "Todo",
          priority: "High",
          assigneeId: "marcus-vance",
          dueDate: "2026-08-05",
          createdAt: new Date().toISOString()
        },
        {
          id: "task-5",
          projectId: "proj-3",
          workspaceId: "tf-123",
          title: "Set up security audit trails",
          description: "Implement automated audit logger that captures user ID, action timestamp, and client action payload.",
          status: "Done",
          priority: "Urgent",
          assigneeId: "elena-rostova",
          dueDate: "2026-06-25",
          createdAt: new Date().toISOString(),
          aiSummary: "Audit logger is fully operational. Log files are securely tracked and stored on backend events with tamper-evident serial numbers."
        }
      ],
      chats: [
        {
          id: "chat-1",
          workspaceId: "tf-123",
          userId: "marcus-vance",
          userName: "Marcus Vance",
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          content: "Welcome everyone to our new workspace! Let's utilize the chat module to share quick updates and collaborate with the workspace assistant.",
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: "chat-2",
          workspaceId: "tf-123",
          userId: "sarah-chen",
          userName: "Sarah Chen",
          userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          content: "Thanks Marcus! I just updated the Design System v2 project structure. Working on the layout templates right now.",
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: "chat-3",
          workspaceId: "tf-123",
          userId: "elena-rostova",
          userName: "Elena Rostova",
          userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
          content: "The security audit is completely finalized. I've uploaded the compliance overview file for you guys to check out.",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ],
      activityLogs: [
        {
          id: "log-1",
          workspaceId: "tf-123",
          userId: "elena-rostova",
          userName: "Elena Rostova",
          action: "PROJECT_COMPLETED",
          details: "Completed project: SOC2 Compliance Readiness",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: "log-2",
          workspaceId: "tf-123",
          userId: "sarah-chen",
          userName: "Sarah Chen",
          action: "TASK_UPDATED",
          details: "Moved 'Define global theme typography scaling' to Done",
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: "log-3",
          workspaceId: "tf-123",
          userId: "marcus-vance",
          userName: "Marcus Vance",
          action: "WORKSPACE_CREATED",
          details: "Created workspace: Nexora HQ",
          timestamp: new Date(Date.now() - 3600000 * 10).toISOString()
        }
      ],
      files: [
        {
          id: "file-1",
          workspaceId: "tf-123",
          name: "security_audit_report.pdf",
          size: "2.4 MB",
          type: "application/pdf",
          uploadedBy: "Elena Rostova",
          uploadedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
          version: 1
        },
        {
          id: "file-2",
          workspaceId: "tf-123",
          name: "dashboard_layout_v2.png",
          size: "4.1 MB",
          type: "image/png",
          uploadedBy: "Sarah Chen",
          uploadedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
          version: 1
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2));
    return initialSeed;
  }

  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read database store, resetting...");
    return {
      users: [],
      workspaces: [],
      members: [],
      projects: [],
      tasks: [],
      chats: [],
      activityLogs: [],
      files: []
    };
  }
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Log actions dynamically
function logAction(workspaceId: string, userId: string, userName: string, action: string, details: string) {
  const db = readDB();
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    workspaceId,
    userId,
    userName,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  db.activityLogs.unshift(log);
  writeDB(db);
}

// ==========================================
// API ROUTES
// ==========================================

// Authentication proxy endpoints
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  const db = readDB();
  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "A user with this email already exists." });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Auto-create a custom starter workspace for new registration
  const wsId = `ws-${Date.now()}`;
  const newWorkspace = {
    id: wsId,
    name: `${name}'s Core Workspace`,
    slug: `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-workspace`,
    logo: "🚀",
    createdAt: new Date().toISOString(),
    ownerId: newUser.id,
    inviteCode: `FLOW-${Math.floor(100 + Math.random() * 900)}`
  };

  const newMember = {
    id: `m-${Date.now()}`,
    userId: newUser.id,
    workspaceId: wsId,
    role: "Owner",
    joinedAt: new Date().toISOString(),
    userEmail: newUser.email,
    userName: newUser.name,
    userAvatar: newUser.avatar
  };

  db.workspaces.push(newWorkspace);
  db.members.push(newMember);

  writeDB(db);

  logAction(wsId, newUser.id, newUser.name, "WORKSPACE_CREATED", `Created and entered workspace: ${newWorkspace.name}`);

  // Return session mock token
  res.json({
    user: newUser,
    workspace: newWorkspace,
    token: `mock-jwt-token-for-${newUser.id}`
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: "No user found with this email." });
  }

  // Find their workspaces
  const membership = db.members.find((m: any) => m.userId === user.id);
  const workspace = membership ? db.workspaces.find((w: any) => w.id === membership.workspaceId) : null;

  res.json({
    user,
    workspace,
    token: `mock-jwt-token-for-${user.id}`
  });
});

app.post("/api/auth/google", (req, res) => {
  const { name, email, avatar } = req.body;
  const db = readDB();
  let user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      id: `user-google-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);

    // Create a default workspace
    const wsId = `ws-${Date.now()}`;
    const newWorkspace = {
      id: wsId,
      name: `${name}'s Workspace`,
      slug: `${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-flow`,
      logo: "🌌",
      createdAt: new Date().toISOString(),
      ownerId: user.id,
      inviteCode: `FLOW-${Math.floor(100 + Math.random() * 900)}`
    };

    const newMember = {
      id: `m-${Date.now()}`,
      userId: user.id,
      workspaceId: wsId,
      role: "Owner",
      joinedAt: new Date().toISOString(),
      userEmail: user.email,
      userName: user.name,
      userAvatar: user.avatar
    };

    db.workspaces.push(newWorkspace);
    db.members.push(newMember);
    writeDB(db);

    logAction(wsId, user.id, user.name, "WORKSPACE_CREATED", `Registered via Google and created workspace: ${newWorkspace.name}`);
  }

  // Get active workspace
  const memberships = db.members.filter((m: any) => m.userId === user.id);
  let workspace = db.workspaces.find((w: any) => memberships.some((m: any) => m.workspaceId === w.id));

  // If no workspace matches, but some membership exists, or we need to add to default seed
  if (!workspace && memberships.length > 0) {
    workspace = db.workspaces.find((w: any) => w.id === memberships[0].workspaceId);
  }

  // If still nothing, let's join Nexora HQ by default
  if (!workspace) {
    const defaultWSId = "tf-123";
    const newMember = {
      id: `m-${Date.now()}`,
      userId: user.id,
      workspaceId: defaultWSId,
      role: "Member",
      joinedAt: new Date().toISOString(),
      userEmail: user.email,
      userName: user.name,
      userAvatar: user.avatar
    };
    db.members.push(newMember);
    workspace = db.workspaces.find((w: any) => w.id === defaultWSId);
    writeDB(db);
  }

  res.json({
    user,
    workspace,
    token: `mock-google-token-${user.id}`
  });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Authorization header required" });

  const token = authHeader.replace("Bearer ", "");
  const userId = token.replace("mock-jwt-token-for-", "").replace("mock-google-token-", "");

  const db = readDB();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) return res.status(401).json({ error: "User not found or session expired" });

  const memberships = db.members.filter((m: any) => m.userId === user.id);
  const workspaces = db.workspaces.filter((w: any) => memberships.some((m: any) => m.workspaceId === w.id));

  res.json({
    user,
    workspaces,
    memberships
  });
});

// ==========================================
// WORKSPACE ENDPOINTS
// ==========================================

app.get("/api/workspaces", (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) return res.status(400).json({ error: "Missing User ID header" });

  const db = readDB();
  const memberships = db.members.filter((m: any) => m.userId === userId);
  const userWorkspaces = db.workspaces.filter((w: any) => memberships.some((m: any) => m.workspaceId === w.id));

  res.json(userWorkspaces);
});

app.post("/api/workspaces", (req, res) => {
  const { name, logo, userId, userName, userEmail, userAvatar } = req.body;
  if (!name || !userId) return res.status(400).json({ error: "Workspace Name and User ID are required." });

  const db = readDB();
  const wsId = `ws-${Date.now()}`;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");

  const newWorkspace = {
    id: wsId,
    name,
    slug,
    logo: logo || "🏢",
    createdAt: new Date().toISOString(),
    ownerId: userId,
    inviteCode: `FLOW-${Math.floor(100 + Math.random() * 900)}`
  };

  const newMember = {
    id: `m-${Date.now()}`,
    userId,
    workspaceId: wsId,
    role: "Owner",
    joinedAt: new Date().toISOString(),
    userEmail,
    userName,
    userAvatar
  };

  db.workspaces.push(newWorkspace);
  db.members.push(newMember);
  writeDB(db);

  logAction(wsId, userId, userName, "WORKSPACE_CREATED", `Created workspace: ${name}`);

  res.json({ workspace: newWorkspace, member: newMember });
});

app.post("/api/workspaces/join", (req, res) => {
  const { inviteCode, userId, userName, userEmail, userAvatar } = req.body;
  if (!inviteCode || !userId) return res.status(400).json({ error: "Invite code and User ID are required." });

  const db = readDB();
  const workspace = db.workspaces.find((w: any) => w.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase());

  if (!workspace) {
    return res.status(404).json({ error: "Invalid invite code. Workspace not found." });
  }

  // Check if already a member
  const alreadyMember = db.members.some((m: any) => m.userId === userId && m.workspaceId === workspace.id);
  if (alreadyMember) {
    return res.status(400).json({ error: "You are already a member of this workspace." });
  }

  const newMember = {
    id: `m-${Date.now()}`,
    userId,
    workspaceId: workspace.id,
    role: "Member",
    joinedAt: new Date().toISOString(),
    userEmail,
    userName,
    userAvatar
  };

  db.members.push(newMember);
  writeDB(db);

  logAction(workspace.id, userId, userName, "MEMBER_JOINED", `Joined workspace via invite code.`);

  res.json({ workspace, member: newMember });
});

app.get("/api/workspaces/:id/data", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const workspace = db.workspaces.find((w: any) => w.id === id);
  if (!workspace) return res.status(404).json({ error: "Workspace not found" });

  const projects = db.projects.filter((p: any) => p.workspaceId === id);
  const tasks = db.tasks.filter((t: any) => t.workspaceId === id);
  const members = db.members.filter((m: any) => m.workspaceId === id);
  const chats = db.chats.filter((c: any) => c.workspaceId === id);
  const files = db.files.filter((f: any) => f.workspaceId === id);
  const activityLogs = db.activityLogs.filter((l: any) => l.workspaceId === id);

  res.json({
    workspace,
    projects,
    tasks,
    members,
    chats,
    files,
    activityLogs
  });
});

// ==========================================
// PROJECTS ENDPOINTS
// ==========================================

app.post("/api/projects", (req, res) => {
  const { workspaceId, name, description, status, progress, dueDate, ownerId, userName } = req.body;
  if (!workspaceId || !name) return res.status(400).json({ error: "Workspace ID and Project Name are required." });

  const db = readDB();
  const newProject = {
    id: `proj-${Date.now()}`,
    workspaceId,
    name,
    description: description || "",
    status: status || "Planning",
    progress: progress || 0,
    dueDate: dueDate || "",
    createdAt: new Date().toISOString(),
    ownerId
  };

  db.projects.push(newProject);
  writeDB(db);

  logAction(workspaceId, ownerId, userName, "PROJECT_CREATED", `Created project: ${name}`);

  res.json(newProject);
});

app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, status, progress, dueDate, userId, userName } = req.body;

  const db = readDB();
  const index = db.projects.findIndex((p: any) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Project not found" });

  const project = db.projects[index];
  const updatedProject = {
    ...project,
    name: name !== undefined ? name : project.name,
    description: description !== undefined ? description : project.description,
    status: status !== undefined ? status : project.status,
    progress: progress !== undefined ? progress : project.progress,
    dueDate: dueDate !== undefined ? dueDate : project.dueDate
  };

  db.projects[index] = updatedProject;
  writeDB(db);

  logAction(project.workspaceId, userId, userName, "PROJECT_UPDATED", `Updated project: ${updatedProject.name} (Status: ${updatedProject.status}, Progress: ${updatedProject.progress}%)`);

  res.json(updatedProject);
});

app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const { userId, userName } = req.body;

  const db = readDB();
  const index = db.projects.findIndex((p: any) => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Project not found" });

  const project = db.projects[index];
  db.projects.splice(index, 1);
  // Delete associated tasks
  db.tasks = db.tasks.filter((t: any) => t.projectId !== id);

  writeDB(db);

  logAction(project.workspaceId, userId, userName, "PROJECT_DELETED", `Deleted project and associated tasks: ${project.name}`);

  res.json({ success: true });
});

// ==========================================
// TASKS ENDPOINTS
// ==========================================

app.post("/api/tasks", (req, res) => {
  const { projectId, workspaceId, title, description, status, priority, assigneeId, dueDate, userId, userName } = req.body;
  if (!workspaceId || !title) return res.status(400).json({ error: "Workspace ID and Task Title are required." });

  const db = readDB();
  const newTask = {
    id: `task-${Date.now()}`,
    projectId: projectId || "",
    workspaceId,
    title,
    description: description || "",
    status: status || "Todo",
    priority: priority || "Medium",
    assigneeId: assigneeId || null,
    dueDate: dueDate || "",
    createdAt: new Date().toISOString()
  };

  db.tasks.push(newTask);
  writeDB(db);

  logAction(workspaceId, userId, userName, "TASK_CREATED", `Created task: ${title}`);

  res.json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assigneeId, dueDate, aiSummary, userId, userName } = req.body;

  const db = readDB();
  const index = db.tasks.findIndex((t: any) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  const task = db.tasks[index];
  const updatedTask = {
    ...task,
    title: title !== undefined ? title : task.title,
    description: description !== undefined ? description : task.description,
    status: status !== undefined ? status : task.status,
    priority: priority !== undefined ? priority : task.priority,
    assigneeId: assigneeId !== undefined ? assigneeId : task.assigneeId,
    dueDate: dueDate !== undefined ? dueDate : task.dueDate,
    aiSummary: aiSummary !== undefined ? aiSummary : task.aiSummary
  };

  db.tasks[index] = updatedTask;
  writeDB(db);

  logAction(task.workspaceId, userId, userName, "TASK_UPDATED", `Updated task: ${updatedTask.title} (Status: ${updatedTask.status})`);

  res.json(updatedTask);
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { userId, userName } = req.body;

  const db = readDB();
  const index = db.tasks.findIndex((t: any) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  const task = db.tasks[index];
  db.tasks.splice(index, 1);
  writeDB(db);

  logAction(task.workspaceId, userId, userName, "TASK_DELETED", `Deleted task: ${task.title}`);

  res.json({ success: true });
});

// ==========================================
// TEAM MANAGEMENT ENDPOINTS
// ==========================================

app.put("/api/workspaces/:workspaceId/members/:memberId", (req, res) => {
  const { workspaceId, memberId } = req.params;
  const { role, userId, userName } = req.body;

  const db = readDB();
  const index = db.members.findIndex((m: any) => m.id === memberId && m.workspaceId === workspaceId);
  if (index === -1) return res.status(404).json({ error: "Workspace member not found" });

  const member = db.members[index];
  member.role = role;
  writeDB(db);

  logAction(workspaceId, userId, userName, "MEMBER_ROLE_UPDATED", `Updated role of ${member.userName} to ${role}`);

  res.json(member);
});

// ==========================================
// CHAT ENDPOINTS WITH AI AUTORESPONDER
// ==========================================

app.post("/api/chats/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;
  const { userId, userName, userAvatar, content } = req.body;

  if (!content) return res.status(400).json({ error: "Message content is required" });

  const db = readDB();
  const newMessage = {
    id: `chat-${Date.now()}`,
    workspaceId,
    userId,
    userName,
    userAvatar,
    content,
    timestamp: new Date().toISOString()
  };

  db.chats.push(newMessage);
  writeDB(db);

  // Check if AI assistance is targeted
  const mentionAI = content.toLowerCase().includes("@ai") || content.toLowerCase().includes("@assistant") || content.toLowerCase().includes("/ai");

  if (mentionAI && GEMINI_API_KEY) {
    try {
      // Gather workspace context
      const projects = db.projects.filter((p: any) => p.workspaceId === workspaceId);
      const tasks = db.tasks.filter((t: any) => t.workspaceId === workspaceId);
      const team = db.members.filter((m: any) => m.workspaceId === workspaceId);

      const contextPrompt = `
You are Nexora, an elite, helpful virtual assistant integrated into our team chat workspace.
Here is the current state of our workspace data:
- Projects currently in flight:
${JSON.stringify(projects.map((p: any) => ({ name: p.name, description: p.description, status: p.status, progress: `${p.progress}%` })), null, 2)}

- Tasks list:
${JSON.stringify(tasks.map((t: any) => ({ title: t.title, description: t.description, status: t.status, priority: t.priority })), null, 2)}

- Active Team Members:
${JSON.stringify(team.map((m: any) => ({ name: m.userName, role: m.role })), null, 2)}

The user "${userName}" asked you: "${content.replace(/@ai|@assistant|\/ai/gi, "").trim()}"

Provide a highly professional, actionable, structured response (with bold key phrases and clean spacing) as if you are a real-time team coordinator. Be concise and keep your reply under 250 words.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contextPrompt,
      });

      const aiReply = {
        id: `chat-ai-${Date.now()}`,
        workspaceId,
        userId: "nexora-ai-bot",
        userName: "Nexora",
        userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=nexora",
        content: response.text || "I processed your request, but could not formulate a text response. Please try again with different phrasing.",
        timestamp: new Date().toISOString(),
        isAISuggestion: true
      };

      db.chats.push(aiReply);
      writeDB(db);

      return res.json({ userMessage: newMessage, aiMessage: aiReply });
    } catch (err: any) {
      console.error("Gemini Chat Response Failed", err);
      // Fallback response
      const fallbackReply = {
        id: `chat-ai-fail-${Date.now()}`,
        workspaceId,
        userId: "nexora-ai-bot",
        userName: "Nexora",
        userAvatar: "https://api.dicebear.com/7.x/bottts/svg?seed=nexora",
        content: "Hello! I am here to assist, but my connection to the AI engine was momentarily interrupted. Please check your workspace configuration and try again shortly.",
        timestamp: new Date().toISOString(),
        isAISuggestion: true
      };
      db.chats.push(fallbackReply);
      writeDB(db);
      return res.json({ userMessage: newMessage, aiMessage: fallbackReply });
    }
  }

  res.json({ userMessage: newMessage });
});

// ==========================================
// FILES MODULE (MOCK PREMIUM UPLOADER)
// ==========================================

app.post("/api/files/:workspaceId", (req, res) => {
  const { workspaceId } = req.params;
  const { name, size, type, uploadedBy } = req.body;

  if (!name) return res.status(400).json({ error: "File Name is required" });

  const db = readDB();
  const fileId = `file-${Date.now()}`;

  // Generate a beautiful splash illustration url depending on file type
  let visualUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600";
  if (type.includes("image")) {
    visualUrl = "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600";
  } else if (type.includes("pdf") || type.includes("doc")) {
    visualUrl = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600";
  } else if (type.includes("zip") || type.includes("rar")) {
    visualUrl = "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600";
  }

  const newFile = {
    id: fileId,
    workspaceId,
    name,
    size: size || "1.2 MB",
    type: type || "application/octet-stream",
    uploadedBy: uploadedBy || "Unknown User",
    uploadedAt: new Date().toISOString(),
    url: visualUrl,
    version: 1
  };

  db.files.push(newFile);
  writeDB(db);

  logAction(workspaceId, "user-upload", uploadedBy, "FILE_UPLOADED", `Uploaded file: ${name} (${size})`);

  res.json(newFile);
});

app.delete("/api/files/:id", (req, res) => {
  const { id } = req.params;
  const { userId, userName } = req.body;

  const db = readDB();
  const index = db.files.findIndex((f: any) => f.id === id);
  if (index === -1) return res.status(404).json({ error: "File not found" });

  const file = db.files[index];
  db.files.splice(index, 1);
  writeDB(db);

  logAction(file.workspaceId, userId, userName, "FILE_DELETED", `Deleted file: ${file.name}`);

  res.json({ success: true });
});

// ==========================================
// AI ADVANCED ACTIONS ENDPOINTS
// ==========================================

// AI Task Summary
app.post("/api/ai/task-summary", async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: "Task Title is required." });

  if (!GEMINI_API_KEY) {
    return res.json({
      summary: `**[Demo Mode Summary for: "${title}"]**\n\nThis task focuses on rebuilding resources and assets to improve product delivery. \n\n**Action Items:**\n- Conduct initial requirements layout.\n- Standardize interface tokens and sizing constraints.\n- Run user reviews to ensure optimal viewport response.`
    });
  }

  try {
    const prompt = `
You are an expert SaaS Project Architect.
Please analyze the following Task Title and Description, and write a beautiful, polished executive summary along with a standard bulleted Checklist of exact actionable sub-tasks required to complete it.
Title: "${title}"
Description: "${description || "No description provided."}"

Formatting instructions:
- Return markdown format.
- Use bold text for emphasis.
- Provide 2-3 precise Action Items with checkboxes (- [ ] Action).
- Keep it highly professional and brief.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (err: any) {
    console.error("Task Summary AI Generation Failed", err);
    res.status(500).json({ error: "Failed to generate AI Task Summary" });
  }
});

// AI Meeting Notes Generator
app.post("/api/ai/meeting-notes", async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) return res.status(400).json({ error: "Transcript content is required." });

  if (!GEMINI_API_KEY) {
    return res.json({
      notes: `### 🎙️ AI Meeting Summary (Demo Mode)

**Overview:** The team discussed current multi-tenant data structures, API security, and key hydration flows.

**Core Decisions:**
- Expose all Gemini SDK routes server-side to hide process variables.
- Standardize on Lucide React for modern minimal display styling.

**Action Items:**
- [ ] **Sarah Chen**: Map out CSS layouts and border styling (Due: Friday)
- [ ] **Marcus Vance**: Build database schema controllers (Due: Thursday)`
    });
  }

  try {
    const prompt = `
You are an expert Executive Assistant.
Convert the following messy meeting transcript into a premium, beautifully structured Markdown document.
Transcript:
"${transcript}"

Format with the following structure:
1. **Meeting Objective** (1-2 sentences)
2. **Key Discussion Points** (Bulleted list)
3. **Action Items** with clear owner names and realistic timelines (Checkboxes: - [ ] **Owner Name**: Action detail)
4. **Next Meeting Agenda** (1-2 bullets)

Ensure typography is crisp, professional, and clean. Keep the language highly business-focused.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ notes: response.text });
  } catch (err: any) {
    console.error("Meeting Notes AI Generation Failed", err);
    res.status(500).json({ error: "Failed to generate meeting notes summary" });
  }
});

// Workspace AI Q&A Assistant (Dashboard Bot)
app.post("/api/ai/workspace-assistant", async (req, res) => {
  const { query, workspaceId } = req.body;
  if (!query || !workspaceId) return res.status(400).json({ error: "Missing Query or Workspace ID" });

  const db = readDB();
  const workspace = db.workspaces.find((w: any) => w.id === workspaceId);
  if (!workspace) return res.status(404).json({ error: "Workspace not found" });

  const projects = db.projects.filter((p: any) => p.workspaceId === workspaceId);
  const tasks = db.tasks.filter((t: any) => t.workspaceId === workspaceId);
  const team = db.members.filter((m: any) => m.workspaceId === workspaceId);

  if (!GEMINI_API_KEY) {
    return res.json({
      response: `I see you are asking about **${workspace.name}**. Currently, you have **${projects.length} projects** and **${tasks.length} tasks** registered. \n\nOur top active project is **${projects[0]?.name || "N/A"}** which stands at **${projects[0]?.progress || 0}% progress**.\n\nPlease define your Gemini API key in the secrets panel to activate full interactive responses!`
    });
  }

  try {
    const contextPrompt = `
You are "Nexora Intellect", the elite workspace concierge for the organization: "${workspace.name}".
You have access to the complete database records for the workspace. Analyze these carefully to answer the user query accurately.

Workspace Projects Record:
${JSON.stringify(projects.map((p: any) => ({ name: p.name, description: p.description, status: p.status, progress: `${p.progress}%`, due: p.dueDate })), null, 2)}

Workspace Tasks Record:
${JSON.stringify(tasks.map((t: any) => ({ title: t.title, status: t.status, priority: t.priority, due: t.dueDate })), null, 2)}

Active Team Members:
${JSON.stringify(team.map((m: any) => ({ name: m.userName, role: m.role })), null, 2)}

User Query: "${query}"

Guidelines:
- Deliver a premium, direct response addressing the query.
- Make correlations (e.g. if projects are completed or high priority tasks are overdue, point them out).
- Present data with excellent Markdown formatting, bullet points, and neat spacing.
- Sound extremely intelligent, helpful, and executive-ready.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contextPrompt,
    });

    res.json({ response: response.text });
  } catch (err: any) {
    console.error("Workspace Assistant AI Failed", err);
    res.status(500).json({ error: "Workspace AI Expert failed to analyze query." });
  }
});


// ==========================================
// VITE DEV SERVER & PRODUCTION SETUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexora Full-Stack Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
