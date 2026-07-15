import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, FastForward, RotateCcw, X, History, Sparkles, Check, CheckSquare, RefreshCw, Folder } from "lucide-react";

interface TimeMachineOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function TimeMachineOverlay({ isVisible, onClose }: TimeMachineOverlayProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const steps = [
    {
      time: "Monday, 9:00 AM",
      event: "Workspace initialized",
      details: "Aryan created the organization. Integrated Nexora engine.",
      icon: <Folder className="w-4 h-4 text-[#0057FF]" />,
      completionRate: 5
    },
    {
      time: "Tuesday, 2:15 PM",
      event: "Sarah Chen joined workspace",
      details: "Configured Google Workspace APIs & calendars.",
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
      completionRate: 15
    },
    {
      time: "Wednesday, 11:30 AM",
      event: "Sprint board established",
      details: "Populated backlog with 12 engineering task sets.",
      icon: <CheckSquare className="w-4 h-4 text-[#F59E0B]" />,
      completionRate: 35
    },
    {
      time: "Thursday, 4:00 PM",
      event: "DB Refactoring Resolved",
      details: "Marcus completed the critical database migration.",
      icon: <RefreshCw className="w-4 h-4 text-emerald-500" />,
      completionRate: 65
    },
    {
      time: "Friday, 5:00 PM",
      event: "Major client milestone shipped",
      details: "Sprint ended. Delivered full platform demo to stakeholders.",
      icon: <Check className="w-4 h-4 text-[#0057FF]" />,
      completionRate: 100
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      setActiveStep(0);
      setIsPlaying(false);
      setShowConfetti(false);
      return;
    }
  }, [isVisible]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            setShowConfetti(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleRestart = () => {
    setActiveStep(0);
    setIsPlaying(true);
    setShowConfetti(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E0F11]/98 backdrop-blur-xl text-white overflow-hidden"
          id="time-machine-root"
        >
          {/* Close trigger */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2.5 text-neutral-400 hover:text-white hover:bg-neutral-900/50 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Sparkles / Confetti animation when completed */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              {[...Array(24)].map((_, i) => {
                const randomX = (Math.random() - 0.5) * 600;
                const randomY = (Math.random() - 0.5) * 400;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ scale: [0, 1, 0], x: randomX, y: randomY, rotate: 360 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: ["#0057FF", "#0BA95B", "#F59E0B", "#DC2626", "#9333EA"][i % 5]
                    }}
                  />
                );
              })}
            </div>
          )}

          <div className="max-w-3xl w-full px-6 flex flex-col gap-10">
            {/* Header info bar */}
            <div className="flex flex-col gap-2 items-center text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-mono tracking-wider text-neutral-300 font-bold">
                <History className="w-3.5 h-3.5" />
                <span>NEXORA TIME MACHINE</span>
              </div>
              <h2 className="text-3xl font-display font-medium tracking-tight mt-2 text-white">
                Workspace Replay Engine
              </h2>
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                Replay historical workspace logs, milestones, and project completions over the past week.
              </p>
            </div>

            {/* Sandbox Simulation Area */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              {/* Left timeline steps */}
              <div className="md:col-span-2 flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
                {steps.map((s, idx) => {
                  const isActive = activeStep === idx;
                  const isCompleted = activeStep >= idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveStep(idx);
                        setShowConfetti(false);
                      }}
                      className={`p-3.5 rounded-[16px] text-left border cursor-pointer transition-all ${
                        isActive
                          ? "bg-white text-[#0E0F11] border-white"
                          : isCompleted
                          ? "bg-white/[0.04] text-neutral-300 border-white/10"
                          : "opacity-35 text-neutral-500 border-transparent"
                      }`}
                    >
                      <span className="text-[9px] font-mono font-bold block opacity-75">{s.time}</span>
                      <h3 className="text-xs font-semibold mt-1 truncate">{s.event}</h3>
                    </div>
                  );
                })}
              </div>

              {/* Right Active Sandbox Preview card */}
              <div className="md:col-span-3 bg-white/[0.02] border border-white/10 p-6 rounded-[24px] flex flex-col gap-6 relative">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      {steps[activeStep].icon}
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 font-mono font-bold block">ACTIVE EVENT</span>
                      <h4 className="text-sm font-semibold text-white">{steps[activeStep].event}</h4>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">{steps[activeStep].time}</span>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed min-h-[48px]">
                  {steps[activeStep].details}
                </p>

                {/* Progress Visual Bar */}
                <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-500">Workspace Completion</span>
                    <span className="text-white font-bold">{steps[activeStep].completionRate}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${steps[activeStep].completionRate}%` }}
                      transition={{ type: "spring", stiffness: 80 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Simulation completion stamp */}
                {showConfetti && activeStep === steps.length - 1 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute inset-0 bg-[#0E0F11]/90 rounded-[24px] flex flex-col items-center justify-center text-center p-6 border border-emerald-500/20"
                  >
                    <span className="text-emerald-500 font-mono font-bold uppercase tracking-wider text-xs">REPLAY COMPLETE ✓</span>
                    <h5 className="text-base font-semibold text-white mt-1">Platform Shipped successfully!</h5>
                    <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-normal">
                      Historical workspace events were loaded and resolved perfectly.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Control Board */}
            <div className="flex items-center justify-center gap-4.5 border-t border-white/5 pt-6">
              <button
                onClick={handleRestart}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Restart Replay"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="bg-white text-[#0E0F11] font-semibold text-xs px-6 py-3 rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? "Pause" : "Play History"}</span>
              </button>

              <button
                onClick={() => {
                  if (activeStep < steps.length - 1) {
                    setActiveStep((prev) => prev + 1);
                  } else {
                    setShowConfetti(true);
                  }
                }}
                disabled={activeStep === steps.length - 1}
                className="p-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Next Step"
              >
                <FastForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
