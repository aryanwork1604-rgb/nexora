import React, { useState, useRef, useEffect } from "react";
import { 
  Hash, MessageSquare, Send, Bot, Sparkles, User, Info, Phone, Video, Search, CheckCircle2, Clock
} from "lucide-react";
import { ChatMessage, WorkspaceMember, Workspace } from "../types";

interface ChatViewProps {
  chats: ChatMessage[];
  members: WorkspaceMember[];
  workspace: Workspace | null;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  onSendMessage: (content: string, isAIAssistance: boolean) => Promise<void>;
}

export default function ChatView({
  chats,
  members,
  workspace,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onSendMessage
}: ChatViewProps) {
  const [activeChannel, setActiveChannel] = useState<string>("#general");
  const [typedMessage, setTypedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const content = typedMessage.trim();
    setTypedMessage("");

    // Trigger typing indicator on AI trigger
    const triggersAI = content.toLowerCase().includes("@ai") || content.toLowerCase().includes("@assistant") || content.toLowerCase().includes("/ai");
    
    if (triggersAI) {
      setIsTyping(true);
    }

    await onSendMessage(content, triggersAI);

    if (triggersAI) {
      setIsTyping(false);
    }
  };

  // Channels lists
  const channels = ["#general", "#engineering", "#marketing"];
  
  // Direct messages lists
  const otherMembers = members.filter((m) => m.userId !== currentUserId);

  // Group messages depending on day
  const formattedChats = chats;

  return (
    <div className="grid grid-cols-4 border border-slate-900 rounded-2xl overflow-hidden bg-slate-950/30 backdrop-blur-sm h-[560px] font-sans text-slate-300">
      
      {/* Channels Sidebar */}
      <div className="col-span-1 border-r border-slate-900 bg-slate-950/50 p-4 flex flex-col justify-between h-full">
        <div className="flex flex-col gap-6">
          {/* Tenant Name */}
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <span className="p-1 rounded bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-bold text-[10px]">✨ Channels</span>
            <span className="text-xs font-bold text-slate-200 truncate">{workspace?.name}</span>
          </div>

          {/* List of Channels */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Channels</span>
            {channels.map((chan) => (
              <button
                key={chan}
                onClick={() => setActiveChannel(chan)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                  activeChannel === chan 
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                <span>{chan.replace("#", "")}</span>
              </button>
            ))}
          </div>

          {/* List of DMs */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Direct Messages</span>
            {otherMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveChannel(m.userName)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                  activeChannel === m.userName
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-800">
                    <img src={m.userAvatar} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <span className="truncate max-w-[80px]">{m.userName.split(" ")[0]}</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            ))}

            {/* AI Assistant Chatbot profile */}
            <button
              onClick={() => setActiveChannel("@ai")}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                activeChannel === "@ai"
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-indigo-400" />
                </div>
                <span>Nexora AI</span>
              </div>
              <span className="text-[8px] bg-indigo-500/15 text-indigo-300 font-mono px-1 rounded">Active</span>
            </button>
          </div>
        </div>

        {/* User Badge Footer */}
        <div className="flex items-center gap-2.5 border-t border-slate-900 pt-3 text-xs">
          <div className="w-8 h-8 rounded-full border border-slate-800 overflow-hidden bg-slate-900">
            <img src={currentUserAvatar} alt="user avatar" className="w-full h-full object-cover" />
          </div>
          <div className="truncate flex-1">
            <p className="font-bold text-slate-200 truncate">{currentUserName}</p>
            <span className="text-[10px] text-slate-500 font-mono">Tenant Member</span>
          </div>
        </div>
      </div>

      {/* Main Chat Stream */}
      <div className="col-span-3 flex flex-col justify-between h-full bg-slate-950/20">
        {/* Header Stream Bar */}
        <div className="px-6 py-4 border-b border-slate-900 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            {activeChannel.startsWith("#") ? (
              <Hash className="w-4 h-4 text-indigo-400" />
            ) : (
              <User className="w-4 h-4 text-cyan-400" />
            )}
            <span className="font-bold text-slate-200 text-sm">{activeChannel}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-2" />
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <Phone className="w-4 h-4 hover:text-slate-300 cursor-pointer" />
            <Video className="w-4 h-4 hover:text-slate-300 cursor-pointer" />
            <Info className="w-4 h-4 hover:text-slate-300 cursor-pointer" />
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-thin">
          {formattedChats.map((msg) => {
            const isSelf = msg.userId === currentUserId;
            const isAI = msg.userId.includes("ai");

            return (
              <div key={msg.id} className={`flex gap-3 ${isSelf ? "justify-end" : "justify-start"}`}>
                {!isSelf && (
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {isAI ? (
                      <Bot className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <img src={msg.userAvatar} alt="avatar" className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[75%]">
                  {!isSelf && (
                    <span className="text-[10px] text-slate-500 font-bold font-sans ml-1">
                      {msg.userName}
                    </span>
                  )}
                  <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed font-sans ${
                    isSelf 
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10" 
                      : isAI
                        ? "bg-indigo-950/20 border border-indigo-500/15 text-slate-300 rounded-tl-none font-sans"
                        : "bg-slate-900/40 border border-slate-900 text-slate-300 rounded-tl-none"
                  }`}>
                    <p className="whitespace-pre-wrap select-text">{msg.content}</p>
                  </div>
                  <span className={`text-[9px] text-slate-600 font-mono ${isSelf ? "text-right mr-1" : "ml-1"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              </div>
              <div className="bg-indigo-950/20 border border-indigo-500/15 text-indigo-300 rounded-2xl rounded-tl-none px-4 py-2 text-[11px] font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span>Nexora AI is analyzing database records & drafting response...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Quick Help Prompts */}
        <div className="px-6 py-2 border-t border-slate-900 bg-slate-950/40 text-[10px] text-slate-500 flex items-center gap-1.5 font-mono select-none">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tip: Tag <strong className="text-indigo-400">@ai</strong> or write <strong className="text-indigo-400">/ai</strong> inside any message to consult the workspace copilot in real time!</span>
        </div>

        {/* Send Input Panel */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-900 bg-slate-950/60 flex items-center gap-3">
          <input
            type="text"
            className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-0"
            placeholder={`Message ${activeChannel}...`}
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!typedMessage.trim() || isTyping}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center active:scale-95 duration-150"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
