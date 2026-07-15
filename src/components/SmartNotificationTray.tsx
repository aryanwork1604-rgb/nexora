import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Bell } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  details?: string;
  avatar?: string;
}

interface SmartNotificationTrayProps {
  notifications: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function SmartNotificationTray({ notifications, onRemove }: SmartNotificationTrayProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none" id="notifications-tray">
      <AnimatePresence>
        {notifications.map((notif, idx) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            className="pointer-events-auto bg-white/95 dark:bg-[#15171A]/95 border border-neutral-150/80 dark:border-neutral-800/80 p-4 rounded-[18px] shadow-premium-md flex items-start gap-3.5 relative overflow-hidden backdrop-blur-sm group cursor-pointer"
            onClick={() => onRemove(notif.id)}
          >
            {/* Ambient side accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0057FF]" />

            {/* Avatar or generic Bell icon */}
            {notif.avatar ? (
              <img src={notif.avatar} alt="Teammate avatar" className="w-9 h-9 rounded-full object-cover border border-neutral-100" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/10 flex items-center justify-center text-[#0057FF]">
                <Bell className="w-4 h-4" />
              </div>
            )}

            {/* Notification content */}
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-xs font-semibold text-neutral-850 dark:text-neutral-100 leading-snug">
                {notif.message}
              </p>
              {notif.details && (
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                  {notif.details}
                </p>
              )}
            </div>

            {/* Close action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(notif.id);
              }}
              className="p-1 text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
