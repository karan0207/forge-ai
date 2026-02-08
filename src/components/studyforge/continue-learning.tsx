"use client";

import { cn } from "@/lib/utils";
import { useTamboThreadInput } from "@tambo-ai/react";
import { motion } from "framer-motion";
import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

interface ContinueAction {
  label: string;
  prompt: string;
  icon?: string;
}

interface ContinueLearningProps {
  actions: ContinueAction[];
  className?: string;
}

/**
 * A set of follow-up action buttons that appear after a component finishes.
 * Clicking a button sends the prompt to the AI as the next message.
 */
export function ContinueLearning({ actions, className }: ContinueLearningProps) {
  const { setValue, submit } = useTamboThreadInput();
  const [sent, setSent] = React.useState(false);

  const handleClick = React.useCallback(
    async (prompt: string) => {
      if (sent) return;
      setSent(true);
      setValue(prompt);
      setTimeout(() => {
        submit();
        setTimeout(() => setSent(false), 2000);
      }, 50);
    },
    [setValue, submit, sent]
  );

  if (!actions || actions.length === 0) return null;

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2 pl-0.5">
        <Sparkles className="w-3 h-3 text-orange-500/60" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          Continue Learning
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}
            onClick={() => handleClick(action.prompt)}
            disabled={sent}
            className={cn(
              "group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-250",
              "bg-white/4",
              "border border-white/8 hover:border-orange-500/30",
              "text-zinc-400 hover:text-orange-300",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
          >
            {action.icon && (
              <span className="text-sm leading-none">{action.icon}</span>
            )}
            <span>{action.label}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-1.5 group-hover:opacity-70 group-hover:ml-0 transition-all duration-200" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
