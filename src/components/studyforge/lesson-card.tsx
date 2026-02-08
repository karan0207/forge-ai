"use client";

import { ContinueLearning } from "@/components/studyforge/continue-learning";
import { cn } from "@/lib/utils";
import { BookOpen, Clock, Signal, GraduationCap, CheckCircle2, List } from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { z } from "zod";

export const lessonCardSchema = z.object({
  title: z.string().describe("The lesson title, e.g. 'The French Revolution'"),
  summary: z
    .string()
    .describe("A 2-3 sentence overview of the lesson topic"),
  keyPoints: z
    .array(z.string())
    .describe("An array of 3-6 key bullet points for the lesson"),
  difficulty: z
    .enum(["beginner", "intermediate", "advanced"])
    .describe("The difficulty level of the lesson"),
  estimatedMinutes: z
    .number()
    .describe("Estimated study time in minutes"),
});

export type LessonCardProps = z.infer<typeof lessonCardSchema> &
  React.HTMLAttributes<HTMLDivElement>;

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    color: "text-zinc-300",
    bg: "bg-white/4",
    border: "border-white/8",
    bars: 1,
  },
  intermediate: {
    label: "Intermediate",
    color: "text-orange-300",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    bars: 2,
  },
  advanced: {
    label: "Advanced",
    color: "text-orange-400",
    bg: "bg-orange-500/15",
    border: "border-orange-500/25",
    bars: 3,
  },
};

export const LessonCard = React.forwardRef<HTMLDivElement, LessonCardProps>(
  (
    {
      title = "Lesson",
      summary = "",
      keyPoints = [],
      difficulty = "beginner",
      estimatedMinutes = 0,
      className,
    },
    ref
  ) => {
    const diff = difficultyConfig[difficulty ?? "beginner"];
    const safeKeyPoints = keyPoints ?? [];

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <GraduationCap className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">{title}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.12em] mt-0.5">Lesson</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border",
                  diff.bg, diff.color, diff.border
                )}>
                  <Signal className="w-3 h-3" strokeWidth={2} />
                  {diff.label}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 text-zinc-400 border border-white/6">
                  <Clock className="w-3 h-3 text-zinc-500" strokeWidth={2} />
                  {estimatedMinutes} min
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-5 sm:px-6 py-5 sm:py-6">

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <p className="text-[15px] leading-[1.75] text-zinc-300">
              {summary || "Preparing your lesson content…"}
            </p>
          </motion.div>

          {/* Divider */}
          <div className="h-px w-full bg-white/6 my-6" />

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <List className="w-3.5 h-3.5 text-orange-400" strokeWidth={2} />
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-400">
                What you'll learn
              </h4>
              {safeKeyPoints.length > 0 && (
                <span className="ml-auto text-[10px] text-zinc-600 tabular-nums">{safeKeyPoints.length} items</span>
              )}
            </div>

            <div className="space-y-2.5">
              {safeKeyPoints.length ? (
                safeKeyPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="shrink-0 mt-0.5 w-6 h-6 rounded-lg bg-white/4 border border-white/6 flex items-center justify-center group-hover:border-orange-500/20 group-hover:bg-orange-500/6 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400 transition-colors" strokeWidth={2} />
                    </div>
                    <p className="text-[14px] text-zinc-300 leading-[1.65] pt-0.5">{point}</p>
                  </motion.div>
                ))
              ) : (
                <div className="space-y-2.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 rounded-lg bg-white/3 border border-white/4 animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px w-full bg-white/6 my-6" />

          {/* Continue Learning */}
          <ContinueLearning
            actions={[
              { label: "Quiz me on this", prompt: `Quiz me on ${title}` },
              { label: "Make flashcards", prompt: `Create flashcards for ${title}` },
              { label: "Explain simply", prompt: `Explain ${title} in simpler terms` },
            ]}
          />
        </div>

        {/* Footer */}
        <div className="relative border-t border-white/5 px-5 sm:px-6 py-3">
          <div className="flex items-center justify-end text-[11px] text-zinc-600">
            <span>{diff.label} · {estimatedMinutes} min read</span>
          </div>
        </div>
      </motion.div>
    );
  }
);

LessonCard.displayName = "LessonCard";
