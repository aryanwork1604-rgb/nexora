import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, ShieldCheck, Cpu } from "lucide-react";

interface WorkspaceSwitchOverlayProps {
  isVisible: boolean;
  workspaceName: string;
}

export default function WorkspaceSwitchOverlay({ isVisible, workspaceName }: WorkspaceSwitchOverlayProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setStep(0);
      return;
    }

    const intervals = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 700),
      setTimeout(() => setStep(3), 1100),
    ];

    return () => intervals.forEach(clearTimeout);
  }, [isVisible]);

  const steps = [
    { text: "Securing network boundaries...", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
    { text: "Hydrating isolated schemas...", icon: <Cpu className="w-4 h-4 text-blue-500" /> },
    { text: "Assembling Nexora workspace OS...", icon: <Sparkles className="w-4 h-4 text-[#0057FF] animate-pulse" /> },
    { text: "Workspace fully loaded.", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E0F11] text-white overflow-hidden perspective-1000"
          id="workspace-switch-root"
        >
          {/* FOLDING PANELS BACKDROP ANIMATION */}
          <motion.div
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 bg-gradient-to-tr from-[#0F1012] via-[#15171A] to-[#1F2226] opacity-95 flex flex-col justify-between p-12"
          >
            {/* Top header */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                Secure Isolation Node
              </span>
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                Node_Active // 3000
              </span>
            </div>

            {/* Centered Morphing Logo & Load Sequence */}
            <div className="flex flex-col items-center gap-8 max-w-sm mx-auto text-center">
              {/* Pulsing & Morphing Logo Container */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 0.98, 1.05, 1],
                  borderRadius: ["24px", "40px", "16px", "32px", "24px"],
                  rotate: [0, 5, -5, 2, 0],
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                className="w-16 h-16 bg-white flex items-center justify-center shadow-2xl shadow-blue-500/10 border border-white/10"
              >
                <span className="text-xl font-display font-bold text-[#0E0F11]">N</span>
              </motion.div>

              {/* Title information */}
              <div className="flex flex-col gap-2">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-display font-medium tracking-tight text-white"
                >
                  Switching to {workspaceName}
                </motion.h2>
                <p className="text-xs text-neutral-500 font-sans max-w-xs leading-relaxed">
                  Initializing a perfectly isolated tenant environment for your organization.
                </p>
              </div>

              {/* Micro Step Hydrator indicators */}
              <div className="flex flex-col gap-3.5 w-full bg-white/[0.02] border border-white/[0.04] p-4.5 rounded-[18px] text-left">
                {steps.map((s, idx) => {
                  const isActive = step === idx;
                  const isCompleted = step > idx;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{
                        opacity: isActive || isCompleted ? 1 : 0.25,
                        x: 0,
                      }}
                      className="flex items-center gap-3 text-xs"
                    >
                      {isCompleted ? (
                        <span className="text-emerald-500 font-mono font-bold">✓</span>
                      ) : isActive ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 ml-1.5" />
                      )}
                      <span className={`font-medium ${isActive ? "text-white font-semibold" : "text-neutral-400"}`}>
                        {s.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Minimal footer */}
            <div className="flex items-center justify-between text-[10px] text-neutral-600 font-mono">
              <span>© 2026 NEXORA INC.</span>
              <span>EST. LATENCY 45MS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
