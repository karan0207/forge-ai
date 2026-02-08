"use client";

import { ContinueLearning } from "@/components/studyforge/continue-learning";
import { cn } from "@/lib/utils";
import { Layers, RotateCcw, ThumbsUp, ChevronLeft, ChevronRight, ArrowRightLeft, Sparkles, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { z } from "zod";

export const flashcardDeckSchema = z.object({
  topic: z.string().describe("The flashcard deck topic, e.g. 'Biology Key Terms'"),
  cards: z
    .array(
      z.object({
        front: z.string().describe("The question or term on the front of the card"),
        back: z.string().describe("The answer or definition on the back of the card"),
      })
    )
    .describe("Array of flashcard objects with front and back text"),
});

export type FlashcardDeckProps = z.infer<typeof flashcardDeckSchema> &
  React.HTMLAttributes<HTMLDivElement>;

export const FlashcardDeck = React.forwardRef<HTMLDivElement, FlashcardDeckProps>(
  ({ topic = "", cards = [], className }, ref) => {
    const [currentCard, setCurrentCard] = React.useState(0);
    const [isFlipped, setIsFlipped] = React.useState(false);
    const [finished, setFinished] = React.useState(false);

    const safeCards = cards ?? [];
    const total = safeCards.length;
    const card = safeCards[currentCard];

    React.useEffect(() => {
      if (currentCard >= total && total > 0) setCurrentCard(0);
    }, [currentCard, total]);

    React.useEffect(() => {
      if (!total) return;
      setCurrentCard(0);
      setIsFlipped(false);
      setFinished(false);
    }, [total]);

    const handleNext = () => {
      setIsFlipped(false);
      if (currentCard < total - 1) {
        setTimeout(() => setCurrentCard((c) => c + 1), 180);
      } else {
        setFinished(true);
      }
    };

    const handlePrev = () => {
      if (currentCard > 0) {
        setIsFlipped(false);
        setTimeout(() => setCurrentCard((c) => c - 1), 180);
      }
    };

    /* Loading state */
    if (!safeCards.length) {
      return (
        <div ref={ref} className={cn("relative rounded-2xl border border-white/8 bg-[#0c0c0c] shadow-2xl shadow-black/50 overflow-hidden font-sans", className)}>
          <div className="relative border-b border-white/6">
            <div className="relative px-5 sm:px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <Layers className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">
                    Flashcards{topic ? `: ${topic}` : ""}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.12em] mt-0.5">Generating cards…</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 sm:px-6 py-8">
            <div className="h-52 rounded-xl bg-white/3 border border-white/4 animate-pulse" />
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
                  <Layers className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">{topic || "Flashcards"}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.12em] mt-0.5">
                    {total} Card{total !== 1 ? "s" : ""} · Tap to Flip
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-zinc-300 border border-white/6 tabular-nums">
                <Hash className="w-3 h-3 text-orange-400" />
                {currentCard + 1}/{total}
              </span>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mt-4">
              {safeCards.map((_, i) => {
                const dotClass =
                  i === currentCard
                    ? "bg-orange-400 flex-2"
                    : i < currentCard || finished
                    ? "bg-orange-500/40 flex-1"
                    : "bg-white/8 flex-1";

                return (
                  <div
                    key={i}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      dotClass
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-5 sm:px-6 py-5 sm:py-6">
          {finished ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="text-center py-8"
            >
              <div className="relative inline-flex items-center justify-center mb-5">
                <div className="relative w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <ThumbsUp className="w-9 h-9 text-orange-400" strokeWidth={1.5} />
                </div>
              </div>

              <p className="text-2xl font-bold text-white mb-1.5 tracking-tight">Deck Complete!</p>
              <p className="text-sm text-zinc-400 mb-6 max-w-xs mx-auto leading-relaxed">
                You&apos;ve reviewed all <span className="text-white font-semibold">{total}</span> cards. Restart the deck or continue studying.
              </p>

              <button
                onClick={() => { setFinished(false); setCurrentCard(0); setIsFlipped(false); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-zinc-400 hover:text-white hover:border-white/15 text-sm font-medium transition-all mb-8"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart Deck
              </button>

              <ContinueLearning
                className="justify-center"
                actions={[
                  { label: "Quiz me", prompt: `Quiz me on ${topic}` },
                  { label: "Deep dive", prompt: `Explain ${topic} in detail` },
                ]}
              />
            </motion.div>
          ) : (
            <>
              {/* The card */}
              <div
                className="relative cursor-pointer min-h-[260px] select-none"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentCard + (isFlipped ? "-back" : "-front")}
                    initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90, scale: 0.96 }}
                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                    exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90, scale: 0.96 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className={cn(
                      "flex flex-col items-center justify-center text-center w-full min-h-[260px] p-8 rounded-xl border transition-colors duration-300",
                      isFlipped
                        ? "bg-orange-500/10 border-orange-500/25"
                        : "bg-white/4 border-white/8 hover:border-white/15"
                    )}
                  >
                    {/* Side label */}
                    <span className={cn(
                      "absolute top-4 left-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border",
                      isFlipped
                        ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                        : "text-zinc-500 bg-white/4 border-white/6"
                    )}>
                      {isFlipped ? "Answer" : "Question"}
                    </span>

                    <p className={cn(
                      "text-lg md:text-xl font-medium leading-[1.6] max-w-md",
                      isFlipped ? "text-orange-100" : "text-zinc-200"
                    )}>
                      {isFlipped ? card.back : card.front}
                    </p>

                    <div className="absolute bottom-4 flex items-center gap-1.5 text-[10px] font-medium text-zinc-600">
                      <ArrowRightLeft className="w-3 h-3" />
                      Tap to flip
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  disabled={currentCard === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-400 text-sm font-semibold transition-all"
                >
                  {currentCard < total - 1 ? "Next Card" : "Finish"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!finished && (
          <div className="relative border-t border-white/5 px-5 sm:px-6 py-3">
            <div className="flex items-center justify-end text-[11px] text-zinc-600">
              <span className="tabular-nums">{Math.round(((currentCard + 1) / total) * 100)}% through deck</span>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);

FlashcardDeck.displayName = "FlashcardDeck";
