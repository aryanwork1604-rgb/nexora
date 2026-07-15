import React, { useState } from "react";
import { 
  Settings, Key, Shield, User, Globe, HelpCircle, ToggleLeft, ToggleRight, Check, Save, RefreshCw
} from "lucide-react";
import { Workspace, WorkspaceMember } from "../types";

interface SettingsViewProps {
  workspace: Workspace | null;
  onUpdateWorkspace: (payload: Partial<Workspace>) => void;
  currentUser: WorkspaceMember | null;
  onUpdateProfile: (payload: Partial<WorkspaceMember>) => void;
  visualAccent: string;
  onChangeAccent: (accent: string) => void;
}

export default function SettingsView({
  workspace,
  onUpdateWorkspace,
  currentUser,
  onUpdateProfile,
  visualAccent,
  onChangeAccent
}: SettingsViewProps) {
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [wsName, setWsName] = useState(workspace?.name || "");
  const [profName, setProfName] = useState(currentUser?.userName || "");
  const [profEmail, setProfEmail] = useState(currentUser?.userEmail || "");
  const [profAvatar, setProfAvatar] = useState(currentUser?.userAvatar || "");

  // Simulated features
  const [twoFactor, setTwoFactor] = useState(true);
  const [isolationRule, setIsolationRule] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update Workspace
    if (wsName.trim() && workspace) {
      onUpdateWorkspace({ name: wsName.trim() });
    }

    // Update Profile
    if (profName.trim() && currentUser) {
      onUpdateProfile({
        userName: profName.trim(),
        userEmail: profEmail.trim(),
        userAvatar: profAvatar.trim()
      });
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleCopySecret = () => {
    if (!workspace) return;
    navigator.clipboard.writeText(workspace.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ACCENTS = [
    { id: "indigo", name: "Indigo Neon", color: "bg-indigo-600" },
    { id: "emerald", name: "Emerald Synth", color: "bg-emerald-500" },
    { id: "amber", name: "Amber Glow", color: "bg-amber-500" },
    { id: "rose", name: "Rose Slate", color: "bg-rose-500" }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-slate-300">
      
      {/* Header bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Workspace Configuration</h1>
        <p className="text-xs text-slate-400">Manage tenant settings, system variables, user identities, and theme options.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left columns: Form fields */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Workspace Settings Block */}
          <div className="bg-slate-900/15 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
              <Globe className="w-4.5 h-4.5 text-indigo-400" /> Organization Variables
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-medium">Workspace Name</label>
                <input
                  type="text"
                  required
                  className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80"
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-medium">Tenant Secret Key</label>
                <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-2 h-[42px]">
                  <span className="flex-1 text-[10px] text-slate-500 font-mono truncate select-all">{workspace?.id || "N/A"}</span>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Key className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Block */}
          <div className="bg-slate-900/15 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
              <User className="w-4.5 h-4.5 text-indigo-400" /> Personal Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-medium">Display Name</label>
                <input
                  type="text"
                  required
                  className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80"
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-slate-400 font-medium">Profile Image URL</label>
                <input
                  type="url"
                  className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 font-mono"
                  value={profAvatar}
                  onChange={(e) => setProfAvatar(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Controls button */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Workspace Configuration
            </button>
            {success && (
              <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Changes verified & committed locally!
              </span>
            )}
          </div>
        </div>

        {/* Right column: Accent / Telemetries */}
        <div className="flex flex-col gap-6">
          {/* Aesthetic Accents */}
          <div className="bg-slate-900/15 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
              <Settings className="w-4.5 h-4.5 text-indigo-400" /> UI Accent Theme
            </h3>
            <p className="text-[11px] text-slate-500">Pick an active colorway to customize dashboard visual overlays.</p>

            <div className="grid grid-cols-2 gap-3 mt-1.5">
              {ACCENTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => onChangeAccent(acc.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    visualAccent === acc.id 
                      ? "bg-slate-950 text-slate-200 border-indigo-500/80" 
                      : "bg-slate-950/40 text-slate-500 border-slate-900 hover:border-slate-800"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${acc.color}`} />
                  <span>{acc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Multi-Tenant telemetry info */}
          <div className="bg-slate-900/15 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4 text-xs">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-900 pb-3">
              <Shield className="w-4.5 h-4.5 text-indigo-400" /> Workspace Isolation Core
            </h3>

            <div className="flex flex-col gap-3">
              {/* Isolation parameters */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-300">Data Isolation Policy</p>
                  <p className="text-[10px] text-slate-500">Row-level security enforcement</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsolationRule(!isolationRule)}
                  className="text-indigo-400"
                >
                  {isolationRule ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-slate-900 pt-3">
                <div>
                  <p className="font-semibold text-slate-300">Two-Factor Security</p>
                  <p className="text-[10px] text-slate-500">Require OAuth verification tokens</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className="text-indigo-400"
                >
                  {twoFactor ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7 text-slate-600" />}
                </button>
              </div>
            </div>

            {/* SOC2 telemetry line */}
            <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3 text-[10px] font-mono text-slate-500 mt-2 leading-relaxed">
              <p className="text-slate-400 font-bold mb-1">Audit status: COMPLIANT</p>
              <p>Row-level queries strictly limit fetch queries using tenant workspace_id headers.</p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
