"use client";

import { cn } from "@/lib/utils";
import { Calendar, Clock, ArrowRight, Target, AlertTriangle, Flag } from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { z } from "zod";

export const studyPlanSchema = z.object({
  title: z
    .string()
    .describe("Title for the study plan, e.g. 'History Exam Study Plan'"),
  examDate: z
    .string()
    .describe("The exam or deadline date, e.g. '2026-02-14' or 'Friday, Feb 14'"),
  days: z
    .array(
      z.object({
        day: z.string().describe("The day label, e.g. 'Monday, Feb 9'"),
        topics: z
          .array(z.string())
          .describe("Array of topics to study on this day"),
        hours: z.number().describe("Recommended study hours for this day"),
        priority: z
          .enum(["high", "medium", "low"])
          .describe("Priority level for this day's study session"),
      })
    )
    .describe("Array of daily study plan entries"),
});

export type StudyPlanProps = z.infer<typeof studyPlanSchema> &
  React.HTMLAttributes<HTMLDivElement>;

const priorityConfig = {
  high: {
    label: "High",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    dot: "bg-orange-500",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    color: "text-zinc-300",
    bg: "bg-white/4",
    border: "border-white/8",
    dot: "bg-white/40",
    icon: Flag,
  },
  low: {
    label: "Low",
    color: "text-zinc-400",
    bg: "bg-white/3",
    border: "border-white/6",
    dot: "bg-white/30",
    icon: Target,
  },
};

export const StudyPlan = React.forwardRef<HTMLDivElement, StudyPlanProps>(
  ({ title = "Study Plan", examDate = "", days = [], className }, ref) => {
    const safeDays = days ?? [];
    const totalHours = safeDays.reduce((sum, d) => sum + (d.hours || 0), 0);

    /* Loading state */
    if (!safeDays.length) {
      return (
        <div ref={ref} className={cn("relative rounded-2xl border border-white/8 bg-[#0c0c0c] shadow-2xl shadow-black/50 overflow-hidden font-sans", className)}>
          <div className="relative border-b border-white/6">
            <div className="relative px-5 sm:px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <Calendar className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">{title}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.12em] mt-0.5">Creating plan…</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 sm:px-6 py-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-white/3 border border-white/4 animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "relative rounded-2xl border border-white/8 bg-[#0c0c0c] shadow-2xl shadow-black/50 overflow-hidden font-sans",
          className
        )}
      >
        {/* Header */}
        <div className="relative border-b border-white/6">
          <div className="relative px-5 sm:px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <Calendar className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">{title}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.12em] mt-0.5">
                    {safeDays.length} Day{safeDays.length !== 1 ? "s" : ""} · {totalHours}h Total
                  </p>
                </div>
              </div>
            </div>

            {/* Exam date badge */}
            {examDate && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium">
                <Target className="w-3 h-3" />
                Target: {examDate}
              </div>
            )}
          </div>
        </div>

        {/* Timeline body */}
        <div className="relative px-5 sm:px-6 py-5 sm:py-6">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-white/8" />

            <div className="space-y-4">
              {safeDays.map((day, i) => {
                const prio = priorityConfig[day.priority ?? "medium"];
                const PrioIcon = prio.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.08, duration: 0.35 }}
                    className="relative flex gap-4"
                  >
                    {/* Timeline node */}
                    <div className="z-10 shrink-0 w-10 h-10 rounded-full bg-[#0c0c0c] border border-white/8 flex items-center justify-center">
                      <div className={cn("w-2.5 h-2.5 rounded-full", prio.dot)} />
                    </div>

                    {/* Day card */}
                    <div className="flex-1 rounded-xl border border-white/6 bg-white/3 hover:border-white/10 transition-all duration-200 overflow-hidden">
                      {/* Day header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/5 bg-white/2">
                        <h4 className="font-semibold text-white text-[15px] tracking-tight">{day.day}</h4>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-zinc-400 border border-white/6">
                            <Clock className="w-3 h-3 text-orange-400" />
                            {day.hours}h
                          </span>
                          <span className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wide",
                            prio.bg, prio.color, prio.border
                          )}>
                            <PrioIcon className="w-2.5 h-2.5" />
                            {prio.label}
                          </span>
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="px-4 py-3 space-y-2">
                        {day.topics.map((topic, j) => (
                          <div key={j} className="flex items-start gap-2.5 text-[14px] text-zinc-300">
                            <ArrowRight className="w-3.5 h-3.5 text-orange-400/60 mt-1 shrink-0" />
                            <span className="leading-relaxed">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative border-t border-white/5 px-5 sm:px-6 py-3">
          <div className="flex items-center justify-end text-[11px] text-zinc-600">
            <span>{safeDays.length} sessions planned</span>
          </div>
        </div>
      </motion.div>
    );
  }
);

StudyPlan.displayName = "StudyPlan";
