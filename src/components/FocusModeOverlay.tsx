import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Play, Pause, RotateCcw, CheckCircle2, ChevronRight, Compass } from "lucide-react";
import { Task } from "../types";

interface FocusModeOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  tasks: Task[];
  onCompleteTask: (taskId: string) => Promise<void>;
}

export default function FocusModeOverlay({ isVisible, onClose, tasks, onCompleteTask }: FocusModeOverlayProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins Pomodoro
  const [timerRunning, setTimerRunning] = useState(false);
  const [breathePhase, setBreathePhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  const focusedTask = tasks.find((t) => t.id === selectedTaskId) || tasks.find(t => t.status !== "Done");

  // Countdown timer core
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // Breathe circle synchronizer cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s)
  useEffect(() => {
    if (!sessionActive || !timerRunning) return;

    const interval = setInterval(() => {
      setBreathePhase((current) => {
        if (current === "inhale") return "hold";
        if (current === "hold") return "exhale";
        return "inhale";
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [sessionActive, timerRunning]);

  const handleStartSession = (taskId: string) => {
    setSelectedTaskId(taskId);
    setSessionActive(true);
    setTimeLeft(25 * 60);
    setTimerRunning(true);
  };

  const handleStopSession = () => {
    setSessionActive(false);
    setTimerRunning(false);
  };

  const handleCompleteActiveTask = async () => {
    if (focusedTask) {
      await onCompleteTask(focusedTask.id);
      handleStopSession();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const activeTodoTasks = tasks.filter(t => t.status !== "Done");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7F7F5]/98 dark:bg-[#0E0F11]/98 backdrop-blur-xl text-[#171717] dark:text-[#E2E8F0] overflow-hidden"
          id="focus-mode-root"
        >
          {/* Close Zen Mode */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!sessionActive ? (
            /* PHASE 1: SELECT TASK TO FOCUS ON */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-xl w-full px-6 flex flex-col gap-8 text-center"
            >
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0057FF]/10 text-[#0057FF] rounded-full text-xs font-mono font-bold self-center">
                  <Compass className="w-3.5 h-3.5 animate-spin" />
                  <span>FOCUS MODE</span>
                </div>
                <h2 className="text-3xl font-display font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mt-2">
                  What requires your focus?
                </h2>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                  Select a single, high-priority milestone. We will mute everything else.
                </p>
              </div>

              {activeTodoTasks.length === 0 ? (
                <div className="bg-white dark:bg-[#15171A] border border-neutral-150/60 dark:border-neutral-850 p-8 rounded-[22px] shadow-premium-md text-center flex flex-col items-center gap-4">
                  <span className="text-emerald-500 font-mono font-bold uppercase tracking-wider text-xs">ALL COMPLETED ✓</span>
                  <p className="text-xs text-neutral-500">Your task list is perfectly clean. Enjoy the calm!</p>
                  <button onClick={onClose} className="bg-white hover:bg-white/95 text-[#0057FF] border border-neutral-200/60 text-xs font-semibold px-5 py-2.5 rounded-[12px] shadow-premium-sm transition-all cursor-pointer">
                    Back to Workspace
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-none">
                  {activeTodoTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.01, x: 2 }}
                      onClick={() => handleStartSession(task.id)}
                      className="bg-white dark:bg-[#15171A] hover:bg-neutral-50 dark:hover:bg-[#1E2024] border border-neutral-150/50 dark:border-neutral-850 p-4.5 rounded-[18px] text-left flex items-center justify-between shadow-premium-sm hover:shadow-premium-md transition-all cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <span className={`text-[8px] font-mono uppercase tracking-widest font-bold ${
                          task.priority === "Urgent" || task.priority === "High" ? "text-red-500" : "text-neutral-400"
                        }`}>
                          {task.priority} Priority
                        </span>
                        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate mt-1">
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#0057FF] font-semibold opacity-0 group-hover:opacity-100 transition-all">
                        <span>Focus</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* PHASE 2: IMMERSIVE FOCUS TIMER & BREATHE WORK */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl w-full px-6 flex flex-col items-center gap-12 text-center"
            >
              {/* Active task representation */}
              <div className="flex flex-col gap-1.5 max-w-md">
                <span className="text-[10px] font-mono tracking-widest text-[#0057FF] uppercase font-bold">
                  In Focus
                </span>
                <h3 className="text-xl font-display font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {focusedTask?.title}
                </h3>
                {focusedTask?.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto truncate">
                    {focusedTask.description}
                  </p>
                )}
              </div>

              {/* Breathe Circle Indicator */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer pulsing ring tied to Breathe cycles */}
                <motion.div
                  animate={{
                    scale: breathePhase === "inhale" ? [1, 1.45] : breathePhase === "hold" ? 1.45 : [1.45, 1],
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full border border-[#0057FF]/10 dark:border-[#0057FF]/20 bg-[#0057FF]/[0.02]"
                />

                {/* Second inner glowing breathe indicator */}
                <motion.div
                  animate={{
                    scale: breathePhase === "inhale" ? [1, 1.25] : breathePhase === "hold" ? 1.25 : [1.25, 1],
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="absolute w-48 h-48 rounded-full bg-gradient-to-tr from-[#0057FF]/5 to-[#0057FF]/15 border border-[#0057FF]/20 flex flex-col items-center justify-center"
                />

                {/* Core countdown stats */}
                <div className="relative flex flex-col items-center">
                  <span className="text-4xl font-mono font-bold text-neutral-850 dark:text-white tracking-tighter">
                    {formatTime(timeLeft)}
                  </span>
                  <motion.span
                    key={breathePhase}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[9px] font-mono text-[#0057FF] uppercase tracking-widest font-bold mt-1"
                  >
                    {breathePhase === "inhale" ? "Inhale..." : breathePhase === "hold" ? "Hold..." : "Exhale..."}
                  </motion.span>
                </div>
              </div>

              {/* Action commands */}
              <div className="flex items-center gap-6 z-10">
                <button
                  onClick={() => setTimerRunning((prev) => !prev)}
                  className="bg-white dark:bg-[#15171A] text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800/80 p-4 rounded-full shadow-premium-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 text-[#0057FF]" />}
                </button>

                <button
                  onClick={handleCompleteActiveTask}
                  className="bg-white hover:bg-[#FFFFFF]/95 text-[#0057FF] border border-neutral-200/60 font-semibold text-sm px-6 py-3.5 rounded-[14px] shadow-premium-sm hover:shadow-premium-md hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0057FF]" />
                  Mark Task Complete
                </button>

                <button
                  onClick={() => setTimeLeft(25 * 60)}
                  className="bg-white dark:bg-[#15171A] text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 border border-neutral-200/60 dark:border-neutral-800/80 p-4 rounded-full shadow-premium-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleStopSession}
                className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 font-semibold font-mono uppercase tracking-widest cursor-pointer"
              >
                Quit Focus Session
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
