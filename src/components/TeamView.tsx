import React, { useState } from "react";
import { 
  Users, Mail, Shield, UserPlus, Key, Copy, Check, Trash2, ArrowRight, X, AlertCircle
} from "lucide-react";
import { WorkspaceMember, Workspace } from "../types";

interface TeamViewProps {
  members: WorkspaceMember[];
  workspace: Workspace | null;
  onUpdateRole: (memberId: string, role: string) => void;
  currentUserId: string;
}

export default function TeamView({
  members,
  workspace,
  onUpdateRole,
  currentUserId
}: TeamViewProps) {
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleCopyInvite = () => {
    if (!workspace) return;
    const inviteLink = `${window.location.origin}?invite=${workspace.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    // Simulate sending invite link
    setSuccessMsg(`Drafted invite dispatched successfully to ${inviteEmail}!`);
    setInviteEmail("");
    setTimeout(() => {
      setSuccessMsg("");
      setIsInviteOpen(false);
    }, 2000);
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "Owner": return "bg-rose-500/10 border-rose-500/20 text-rose-400";
      case "Admin": return "bg-purple-500/10 border-purple-500/20 text-purple-400";
      case "Member": return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
      case "Guest": return "bg-slate-500/10 border-slate-500/20 text-slate-400";
      default: return "bg-slate-500/10 border-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-300">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Team Management</h1>
          <p className="text-xs text-slate-400">Review organization permissions, roles, and invite details inside this tenant.</p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer active:scale-95 duration-150"
        >
          <UserPlus className="w-4 h-4" /> Invite Colleague
        </button>
      </div>

      {/* Invite Code Generator Panel */}
      <div className="bg-gradient-to-r from-indigo-950/20 via-slate-900/10 to-transparent p-6 rounded-2xl border border-indigo-500/15 backdrop-blur-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-1.5 text-xs text-indigo-400 font-bold uppercase tracking-wider font-mono">
            <Key className="w-4 h-4" /> Tenant Invite Mechanism
          </div>
          <h3 className="text-base font-bold text-slate-100">Quick-join organization workspace link</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">Share the URL below with any teammates. When they visit and sign in, they will be auto-authenticated as team members of this tenant.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-850 p-2 rounded-xl">
          <div className="flex-1 truncate text-xs text-slate-500 font-mono px-2 select-all">
            {workspace ? `FLOW-${workspace.inviteCode}` : "N/A"}
          </div>
          <button
            onClick={handleCopyInvite}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer shadow-md shadow-indigo-600/20"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Roster list */}
      <div className="bg-slate-900/15 border border-slate-900 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-slate-900 bg-slate-950/40">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-indigo-400" /> Organization Roster ({members.length})
          </h3>
        </div>

        <div className="divide-y divide-slate-900">
          {members.map((member) => {
            const isSelf = member.userId === currentUserId;

            return (
              <div key={member.id} className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-900/10 transition-colors">
                {/* Roster avatar and details */}
                <div className="flex items-center gap-3.5 flex-1 truncate">
                  <div className="w-10 h-10 rounded-full border border-slate-800 overflow-hidden bg-slate-950 relative flex-shrink-0">
                    <img src={member.userAvatar} alt="avatar" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200 text-xs sm:text-sm">{member.userName}</span>
                      {isSelf && (
                        <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono text-slate-500">You</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5"><Mail className="w-3.5 h-3.5" /> {member.userEmail}</span>
                  </div>
                </div>

                {/* Role Adjusters */}
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-mono ${getRoleStyle(member.role)}`}>
                    {member.role}
                  </span>

                  {/* Option dropdown for role edit (only if not self and user has credentials) */}
                  {!isSelf ? (
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-900 rounded-lg p-1">
                      {["Admin", "Member", "Guest"].map((role) => (
                        <button
                          key={role}
                          onClick={() => onUpdateRole(member.id, role)}
                          className={`text-[9px] font-bold px-2 py-1 rounded-md ${member.role === role ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Workspace Owner</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsInviteOpen(false)} />

          <div className="relative w-full max-w-md bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <UserPlus className="w-4.5 h-4.5 text-indigo-400" /> Dispatch Colleague Invite
              </h3>
              <button onClick={() => setIsInviteOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="py-8 text-center text-xs flex flex-col items-center gap-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <Check className="w-8 h-8 text-emerald-400" />
                <p className="font-bold">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-medium">Teammate Email Address</label>
                  <input
                    type="email"
                    required
                    className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80"
                    placeholder="e.g. colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-medium">Default Workspace Role</label>
                  <select
                    className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-100 focus:outline-none focus:border-indigo-500/80"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="Admin" className="bg-slate-900 text-slate-200">Admin - Manage system nodes</option>
                    <option value="Member" className="bg-slate-900 text-slate-200">Member - Regular delivery permissions</option>
                    <option value="Guest" className="bg-slate-900 text-slate-200">Guest - View portfolios only</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/35 transition-all mt-3 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Send Invitation <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
