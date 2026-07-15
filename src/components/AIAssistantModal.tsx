import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, HelpCircle, Bot, CornerDownLeft, Loader2 } from "lucide-react";
import { Workspace } from "../types";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace | null;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function AIAssistantModal({ isOpen, onClose, workspace }: AIAssistantModalProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `Welcome to **Nexora Intellect**, your workspace assistant.\n\nI have indexed this organization's projects, status backlogs, files, and memberships. Ask me anything!\n\nFor example:\n- *"What tasks are currently high priority?"*\n- *"List active portfolios"*`
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading || !workspace) return;

    const userText = query.trim();
    setQuery("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    const statuses = [
      "Securing tenant isolation channel...",
      "Parsing task velocity indices...",
      "Querying active milestones...",
      "Formulating context response via Nexora Intellect..."
    ];

    let statusIndex = 0;
    setLoadingStatus(statuses[0]);
    const interval = setInterval(() => {
      statusIndex = (statusIndex + 1) % statuses.length;
      setLoadingStatus(statuses[statusIndex]);
    }, 1000);

    try {
      const response = await fetch("/api/ai/workspace-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, workspaceId: workspace.id })
      });

      const data = await response.json();
      clearInterval(interval);

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: `Error: ${data.error || "Execution failed"}.` }]);
      }
    } catch (err) {
      clearInterval(interval);
      setMessages((prev) => [...prev, { role: "assistant", text: "Oops, a connection error occurred. Please verify your server state." }]);
    } finally {
      setLoading(false);
      setLoadingStatus("");
    }
  };

  const samplePrompts = [
    "What tasks are currently urgent or high priority?",
    "Give me a summary of portfolios",
    "List all team members and roles"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg bg-white dark:bg-neutral-900 border-l border-neutral-150 dark:border-neutral-850 shadow-premium-lg flex-col font-sans">
      {/* Background blur overlay */}
      <div className="fixed inset-0 bg-neutral-950/20 backdrop-blur-sm -z-10" onClick={onClose} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-neutral-900 dark:bg-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white dark:text-neutral-900 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#171717] dark:text-white flex items-center gap-1.5">
              Nexora Intellect
            </h3>
            <p className="text-[10px] text-neutral-400 font-mono">Workspace Concierge: {workspace?.name}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 rounded-[8px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-none">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-[8px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 border border-neutral-200/40 dark:border-neutral-750">
                <Bot className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-[16px] px-4 py-3 text-xs leading-relaxed ${
              msg.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none shadow-premium-sm" 
                : "bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none"
            }`}>
              <div className="whitespace-pre-wrap select-text">
                {msg.text.split("\n").map((line, lidx) => {
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
                        <input type="checkbox" checked={checked} disabled className="rounded border-neutral-200 text-blue-500 w-3.5 h-3.5" />
                        <span className={`text-[11px] ${checked ? "line-through text-neutral-400" : ""}`} dangerouslySetInnerHTML={{ __html: formatted }} />
                      </div>
                    );
                  }

                  if (line.trim().startsWith("- ")) {
                    const cleanLine = line.trim().replace(/^- /, "");
                    return (
                      <li key={lidx} className="ml-4 list-disc text-neutral-700 dark:text-neutral-300 mt-1" dangerouslySetInnerHTML={{ __html: cleanLine.includes("strong") ? formatted.trim().replace(/^- /, "") : cleanLine }} />
                    );
                  }

                  return <p key={lidx} className={`${line.trim() === "" ? "h-2" : "mt-1"}`} dangerouslySetInnerHTML={{ __html: formatted }} />;
                })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded-[8px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 animate-spin border border-neutral-200/40">
              <Loader2 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-850 text-neutral-400 rounded-[16px] rounded-tl-none px-4 py-3 text-[11px] flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span>{loadingStatus}</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested */}
      {messages.length === 1 && !loading && (
        <div className="px-6 py-3 flex flex-col gap-2 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Suggested Questions</span>
          <div className="flex flex-col gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(p)}
                className="text-[11px] text-left bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-150 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 px-3 py-2 rounded-[10px] transition-all cursor-pointer font-medium truncate"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-55/60 flex items-center gap-2.5">
        <input
          type="text"
          className="flex-1 bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/40 dark:border-neutral-800 text-neutral-800 dark:text-neutral-100 text-xs rounded-[12px] px-3.5 py-3 focus:outline-none focus:border-blue-500 focus:ring-0"
          placeholder="Ask Nexora Intellect anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="p-3 bg-[#171717] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:bg-neutral-100 disabled:text-neutral-400 text-white dark:text-neutral-900 rounded-[12px] shadow-premium-sm transition-all flex items-center justify-center active:scale-95 duration-150 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 text-[10px] text-neutral-400 flex items-center justify-between font-mono">
        <span>Nexora Intelligence Suite</span>
        <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> Gemini Core</span>
      </div>
    </div>
  );
}
