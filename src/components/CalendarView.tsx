import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { Task } from "../types";

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 14)); // Seeding to July 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper to get days in month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days array
  const calendarDays = [];
  // Padding for empty days at the start of the week
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Find tasks due on a specific day
  const getTasksForDay = (day: number) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const tDate = new Date(task.dueDate);
      return tDate.getFullYear() === year && tDate.getMonth() === month && tDate.getDate() === day;
    });
  };

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto font-sans" id="calendar-view-root">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono uppercase tracking-widest block mb-2">Team Schedule</span>
          <h1 className="text-4xl font-display font-medium tracking-tight text-neutral-900 dark:text-neutral-50">
            Calendar
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            Stay aligned across milestones and deliverables.
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-900 px-3.5 py-1.5 rounded-[18px] border border-neutral-200/50 dark:border-neutral-800/50 self-start md:self-auto">
          <button 
            onClick={handlePrevMonth} 
            className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 min-w-[100px] text-center">
            {months[month]} {year}
          </span>
          <button 
            onClick={handleNextMonth} 
            className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Calendar Board */}
        <div className="lg:col-span-3 bg-white dark:bg-neutral-900/40 rounded-[22px] border border-neutral-150 dark:border-neutral-850 p-6 shadow-premium-md flex flex-col">
          
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="text-[11px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return (
                  <div key={`empty-${idx}`} className="aspect-square bg-neutral-50/30 dark:bg-neutral-950/10 rounded-[14px]" />
                );
              }

              const dayTasks = getTasksForDay(day);
              const isToday = day === 14 && month === 6 && year === 2026; // Today is preseeded as July 14, 2026

              return (
                <div 
                  key={`day-${day}`} 
                  className={`aspect-square p-2.5 rounded-[18px] border transition-all flex flex-col justify-between group cursor-pointer ${
                    isToday 
                      ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40" 
                      : "bg-neutral-50/50 dark:bg-neutral-900/20 border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${
                      isToday 
                        ? "text-blue-600 dark:text-blue-400" 
                        : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
                    }`}>
                      {day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                    )}
                  </div>

                  {/* Tasks Preview */}
                  <div className="flex flex-col gap-1 overflow-hidden mt-1 max-h-[36px]">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div 
                        key={t.id} 
                        className={`text-[9px] px-1.5 py-0.5 rounded-[6px] truncate font-medium ${
                          t.status === "Done"
                            ? "bg-green-50 text-green-700 border border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
                            : "bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-[8px] text-neutral-400 dark:text-neutral-500 pl-1 font-mono">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Side Panel: Scheduled Task Agenda List */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-neutral-900/40 rounded-[22px] border border-neutral-150 dark:border-neutral-850 p-6 shadow-premium-md flex flex-col gap-4">
            <h3 className="font-display font-medium text-neutral-900 dark:text-neutral-50 text-base">
              Agenda Milestones
            </h3>
            
            <div className="flex flex-col gap-3.5 max-h-[380px] overflow-y-auto scrollbar-none">
              {tasks.filter(t => t.dueDate).map((task) => {
                const dueDateObj = new Date(task.dueDate);
                const isOverdue = dueDateObj < new Date(2026, 6, 14) && task.status !== "Done";
                return (
                  <div 
                    key={task.id}
                    className="p-3.5 bg-neutral-50 dark:bg-neutral-900/50 rounded-[18px] border border-neutral-100 dark:border-neutral-800 flex flex-col gap-2 group transition-all hover:translate-y-[-1px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-[8px] ${
                        task.priority === "Urgent" || task.priority === "High"
                          ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-850 dark:text-neutral-400"
                      }`}>
                        {task.priority}
                      </span>
                      <span className={`text-[10px] font-mono flex items-center gap-1 ${
                        isOverdue 
                          ? "text-red-500 font-bold" 
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}>
                        <Clock className="w-3 h-3" />
                        {dueDateObj.toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-500 transition-colors truncate">
                      {task.title}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-1">
                      {task.status === "Done" ? (
                        <span className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1 font-mono">
                          <CheckCircle className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                          In: {task.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {tasks.filter(t => t.dueDate).length === 0 && (
                <div className="text-center py-10 text-neutral-400 dark:text-neutral-500 flex flex-col items-center gap-2">
                  <CalendarIcon className="w-6 h-6 text-neutral-300" />
                  <span className="text-xs">No scheduled activities</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
