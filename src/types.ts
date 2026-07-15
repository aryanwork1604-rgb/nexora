export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo: string;
  createdAt: string;
  ownerId: string;
  inviteCode: string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Guest';
  joinedAt: string;
  userEmail: string;
  userName: string;
  userAvatar: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  progress: number; // 0 to 100
  dueDate: string;
  createdAt: string;
  ownerId: string;
}

export interface Task {
  id: string;
  projectId: string;
  workspaceId: string;
  title: string;
  description: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assigneeId: string | null;
  dueDate: string;
  createdAt: string;
  aiSummary?: string | null;
}

export interface ChatMessage {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  isAISuggestion?: boolean;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface WorkspaceFile {
  id: string;
  workspaceId: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  version: number;
}
