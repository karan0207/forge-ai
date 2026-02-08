"use client";

import { cn } from "@/lib/utils";
import { Scale, ArrowLeftRight, Columns2 } from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { z } from "zod";

export const comparisonTableSchema = z.object({
  title: z
    .string()
    .describe("Title for the comparison, e.g. 'French Revolution vs American Revolution'"),
  subjects: z
    .array(z.string())
    .describe("Array of subject names to compare, e.g. ['French Revolution', 'American Revolution']"),
  criteria: z
    .array(
      z.object({
        label: z.string().describe("The comparison criterion, e.g. 'Start Year'"),
        values: z
          .array(z.string())
          .describe("Values for each subject for this criterion"),
      })
    )
    .describe("Array of comparison criteria with values for each subject"),
});

export type ComparisonTableProps = z.infer<typeof comparisonTableSchema> &
  React.HTMLAttributes<HTMLDivElement>;

/* Cycle through soft subject colors for column headers */
const subjectColors = [
  { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", dot: "bg-orange-500" },
  { text: "text-zinc-200", bg: "bg-white/4", border: "border-white/10", dot: "bg-white/60" },
  { text: "text-zinc-300", bg: "bg-white/3", border: "border-white/8", dot: "bg-white/40" },
  { text: "text-zinc-400", bg: "bg-white/2", border: "border-white/8", dot: "bg-white/30" },
];

export const ComparisonTable = React.forwardRef<HTMLDivElement, ComparisonTableProps>(
  ({ title = "Comparison", subjects = [], criteria = [], className }, ref) => {
    const safeSubjects = Array.isArray(subjects) ? subjects : [];
    const safeCriteria = Array.isArray(criteria) ? criteria : [];

    /* Empty / loading state */
    if (!safeSubjects.length || !safeCriteria.length) {
      return (
        <div ref={ref} className={cn("relative rounded-2xl border border-white/8 bg-[#0c0c0c] shadow-2xl shadow-black/50 overflow-hidden font-sans", className)}>
          <div className="relative border-b border-white/6">
            <div className="relative px-5 sm:px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <Scale className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">{title || "Comparison"}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.12em] mt-0.5">Building table…</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 sm:px-6 py-6">
            <div className="flex flex-col gap-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-white/3 border border-white/4 animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
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
                  <Scale className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">{title}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.12em] mt-0.5">
                    Side by Side · {safeSubjects.length} subjects · {safeCriteria.length} criteria
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/4 text-zinc-400 border border-white/6">
                <Columns2 className="w-3 h-3 text-orange-400" />
                Table
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-5 sm:px-6 py-5 sm:py-6">

          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-white/6">
            <table className="w-full text-[14px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 bg-white/3 border-b border-white/6">
                    <span className="flex items-center gap-1.5">
                      <ArrowLeftRight className="w-3 h-3" />
                      Criteria
                    </span>
                  </th>
                  {safeSubjects.map((subject, i) => {
                    const colorSet = subjectColors[i % subjectColors.length];
                    return (
                      <th
                        key={i}
                        className={cn(
                          "text-left px-4 py-3.5 font-semibold text-[13px] border-l border-b border-white/6",
                          colorSet.bg
                        )}
                      >
                        <span className={cn("flex items-center gap-2", colorSet.text)}>
                          <span className={cn("w-2 h-2 rounded-full", colorSet.dot)} />
                          {subject}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {safeCriteria.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className={cn(
                      "group transition-colors",
                      i % 2 === 0 ? "bg-transparent" : "bg-white/2",
                      i < safeCriteria.length - 1 && "border-b border-white/4"
                    )}
                  >
                    <td className="px-4 py-3.5 font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                      {row.label}
                    </td>
                    {(Array.isArray(row.values) ? row.values : []).map((val, j) => (
                      <td key={j} className="px-4 py-3.5 text-zinc-300 border-l border-white/4 leading-relaxed">
                        {val}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-5">
            {safeCriteria.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
                className="rounded-xl border border-white/6 overflow-hidden"
              >
                <div className="px-4 py-2.5 bg-white/3 border-b border-white/5">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    {row.label}
                  </h4>
                </div>
                <div className="grid grid-cols-2 divide-x divide-white/5">
                  {(Array.isArray(row.values) ? row.values : []).map((val, j) => {
                    const colorSet = subjectColors[j % subjectColors.length];
                    return (
                      <div key={j} className="px-4 py-3 space-y-1">
                        <p className={cn("text-[10px] font-semibold flex items-center gap-1", colorSet.text)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", colorSet.dot)} />
                          {safeSubjects[j]}
                        </p>
                        <p className="text-[13px] text-zinc-300 leading-relaxed">{val}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative border-t border-white/5 px-5 sm:px-6 py-3">
          <div className="flex items-center justify-end text-[11px] text-zinc-600">
            <span>{safeCriteria.length} rows · {safeSubjects.length} columns</span>
          </div>
        </div>
      </motion.div>
    );
  }
);

ComparisonTable.displayName = "ComparisonTable";
