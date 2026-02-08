"use client";

import { ContinueLearning } from "@/components/studyforge/continue-learning";
import { cn } from "@/lib/utils";
import { Lightbulb, Link2, Target, BookOpen, Quote } from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { z } from "zod";

export const explainerCardSchema = z.object({
  title: z
    .string()
    .describe("The concept being explained, e.g. 'Reign of Terror'"),
  simpleExplanation: z
    .string()
    .describe("An ELI5-style simple explanation of the concept in 2-4 sentences"),
  analogy: z
    .string()
    .describe("A real-world analogy to help understand the concept"),
  keyTakeaway: z
    .string()
    .describe("A one-liner summary to remember, like a quote or mnemonic"),
});

export type ExplainerCardProps = z.infer<typeof explainerCardSchema> &
  React.HTMLAttributes<HTMLDivElement>;

export const ExplainerCard = React.forwardRef<HTMLDivElement, ExplainerCardProps>(
  (
    {
      title = "Concept",
      simpleExplanation = "",
      analogy = "",
      keyTakeaway = "",
      className,
    },
    ref
  ) => {
    const normalizeText = (value: string) =>
      value.replace(/[—–-]/g, " ").replace(/\s{2,}/g, " ").trim();

    const safeSimpleExplanation =
      normalizeText(simpleExplanation) ||
      "Working on a clear explanation…";
    const safeAnalogy = normalizeText(analogy) || "Finding the right analogy…";
    const safeKeyTakeaway =
      normalizeText(keyTakeaway) || "Summarizing the core concept…";

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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                <Lightbulb className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">{normalizeText(title)}</h3>
                <p className="text-[12px] text-zinc-400 font-medium mt-0.5">Concept Notes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-5 sm:px-6 py-5 sm:py-6 space-y-0">

          {/* Simple Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <p className="text-[15px] leading-[1.75] text-zinc-300 pl-0.5">
              {safeSimpleExplanation}
            </p>
          </motion.div>

          {/* Divider */}
          <div className="h-px w-full bg-white/6 my-6" />

          {/* Analogy */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 px-5 py-4">
              <p className="text-[15px] leading-[1.7] text-zinc-300 pl-0.5">
                {safeAnalogy}
              </p>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px w-full bg-white/6 my-6" />

          {/* Key Takeaway */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
          >
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-orange-500/60" />
              <div className="flex items-start gap-2">
                <Quote className="w-4 h-4 text-orange-500/40 shrink-0 mt-0.5 rotate-180" />
                <p className="text-[16px] font-medium text-white leading-[1.6]">
                  {safeKeyTakeaway}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px w-full bg-white/6 my-6" />

          {/* Continue */}
          <ContinueLearning
            actions={[
              { label: "Another analogy", prompt: `Give me another example for ${title}` },
              { label: "Quick quiz", prompt: `Quiz me on ${title}` },
              { label: "Go deeper", prompt: `Explain ${title} in more detail` },
            ]}
          />
        </div>

        {/* Footer */}
        <div className="relative border-t border-white/5 px-5 sm:px-6 py-3">
          <div className="flex items-center justify-end text-[11px] text-zinc-600">
            <span>Concept Summary</span>
          </div>
        </div>
      </motion.div>
    );
  }
);

ExplainerCard.displayName = "ExplainerCard";
