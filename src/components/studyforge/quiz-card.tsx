"use client";

import { ContinueLearning } from "@/components/studyforge/continue-learning";
import { cn } from "@/lib/utils";
import { trackProgress } from "@/services/study-tools";
import { Brain, Check, X, ChevronRight, Trophy, Zap, RotateCcw, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import { z } from "zod";

export const quizCardSchema = z.object({
  topic: z.string().describe("The quiz topic, e.g. 'The French Revolution'"),
  questions: z
    .array(
      z.object({
        question: z.string().describe("The quiz question text"),
        options: z
          .array(z.string())
          .describe("Array of 4 answer choices"),
        correctIndex: z
          .number()
          .describe("Zero-based index of the correct answer (0-3)"),
        explanation: z
          .string()
          .describe("Explanation shown after the user answers"),
      })
    )
    .describe("Array of quiz questions with options and correct answers"),
});

export type QuizCardProps = z.infer<typeof quizCardSchema> &
  React.HTMLAttributes<HTMLDivElement>;

export const QuizCard = React.forwardRef<HTMLDivElement, QuizCardProps>(
  ({ topic = "", questions = [], className }, ref) => {
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
    const [showResult, setShowResult] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [finished, setFinished] = React.useState(false);
    const [progressTracked, setProgressTracked] = React.useState(false);

    const safeQuestions = questions ?? [];
    const q = safeQuestions[currentQuestion];
    const isCorrect = selectedAnswer === q?.correctIndex;
    const total = safeQuestions.length;

    React.useEffect(() => {
      if (!total) return;
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setFinished(false);
      setScore(0);
      setProgressTracked(false);
    }, [total]);

    React.useEffect(() => {
      if (finished && !progressTracked && total > 0 && topic) {
        setProgressTracked(true);
        const pct = Math.round((score / total) * 100);
        trackProgress({ action: "update", topic, score: pct }).catch(() => {});
      }
    }, [finished, progressTracked, score, total, topic]);

    /* Loading state */
    if (!safeQuestions.length) {
      return (
        <div ref={ref} className={cn("relative rounded-2xl border border-white/8 bg-[#0c0c0c] shadow-2xl shadow-black/50 overflow-hidden font-sans", className)}>
          <div className="relative px-5 sm:px-6 py-5 border-b border-white/6">
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                <Brain className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">Quiz{topic ? `: ${topic}` : ""}</h3>
                <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.12em] mt-0.5">Preparing questions…</p>
              </div>
            </div>
          </div>
          <div className="px-5 sm:px-6 py-6">
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-xl bg-white/3 border border-white/4 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    const handleSelect = (index: number) => {
      if (showResult) return;
      setSelectedAnswer(index);
    };

    const handleCheck = () => {
      if (selectedAnswer === null) return;
      setShowResult(true);
      if (selectedAnswer === q.correctIndex) {
        setScore((s) => s + 1);
      }
    };

    const handleNext = () => {
      if (currentQuestion < total - 1) {
        setCurrentQuestion((c) => c + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setFinished(true);
      }
    };

    const pct = Math.round((score / total) * 100);

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
                  <Brain className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-white leading-tight tracking-tight">{topic}</h3>
                  <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-[0.12em] mt-0.5">
                    Interactive Quiz · {total} question{total !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-zinc-300 border border-white/6 tabular-nums">
                  <Zap className="w-3 h-3 text-orange-400" />
                  {score}/{total}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1 bg-white/6 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + (finished ? 1 : 0)) / total) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative px-5 sm:px-6 py-5 sm:py-6">

          {finished ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center py-8"
            >
              {/* Score visual */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="relative w-24 h-24 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <Trophy className="w-8 h-8 text-orange-400 mx-auto mb-1" strokeWidth={1.5} />
                    <span className="text-xl font-bold text-white tabular-nums">{pct}%</span>
                  </div>
                </div>
              </div>

              <p className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                {score === total ? "Perfect Score!" : score >= total * 0.7 ? "Great Work!" : "Keep Going!"}
              </p>
              <p className="text-sm text-zinc-400 mb-2 max-w-xs mx-auto leading-relaxed">
                You scored <span className="text-white font-semibold">{score}</span> out of <span className="text-white font-semibold">{total}</span> correct.{" "}
                {score === total
                  ? "You've mastered this topic."
                  : score >= total * 0.7
                  ? "A few more rounds and you'll have it down."
                  : "Review the material and try again. Practice makes perfect."}
              </p>

              {/* Star rating visual */}
              <div className="flex justify-center gap-1 my-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5 transition-colors",
                      i < Math.ceil((pct / 100) * 5) ? "text-orange-400 fill-orange-400" : "text-zinc-700"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setFinished(false);
                  setCurrentQuestion(0);
                  setSelectedAnswer(null);
                  setShowResult(false);
                  setScore(0);
                  setProgressTracked(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-zinc-400 hover:text-white hover:border-white/15 text-sm font-medium transition-all mb-8"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry Quiz
              </button>

              <ContinueLearning
                className="justify-center"
                actions={
                  score === total
                    ? [
                        { label: "Make flashcards", prompt: `Create flashcards for ${topic}` },
                        { label: "See my progress", prompt: "Show me my learning progress dashboard" },
                      ]
                    : [
                        { label: "Explain what I missed", prompt: `Explain the key concepts of ${topic} that I might be missing` },
                        { label: "Study this topic", prompt: `Teach me about ${topic}` },
                        { label: "See my progress", prompt: "Show me my learning progress dashboard" },
                      ]
                }
              />
            </motion.div>
          ) : q ? (
            <>
              {/* Question number pill */}
              <div className="mb-5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 text-[11px] font-semibold uppercase tracking-widest border border-orange-500/15">
                  Question {currentQuestion + 1} of {total}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {/* Question text */}
                  <p className="text-[17px] font-medium text-white mb-7 leading-[1.65]">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {q.options.map((option, i) => {
                      const isSelected = i === selectedAnswer;
                      const isAnswer = i === q.correctIndex;
                      const letterLabel = String.fromCharCode(65 + i);

                      let containerCls = "border-white/8 hover:border-orange-500/25 hover:bg-white/3";
                      let letterCls = "bg-white/6 text-zinc-500 border-white/6 group-hover:text-orange-400 group-hover:border-orange-500/20 group-hover:bg-orange-500/10";
                      let textCls = "text-zinc-300";
                      let trailingIcon = null;

                      if (showResult) {
                        if (isAnswer) {
                          containerCls = "border-orange-500/30 bg-orange-500/10";
                          letterCls = "bg-orange-500 text-white border-orange-500/50";
                          textCls = "text-orange-200";
                          trailingIcon = <Check className="w-4.5 h-4.5 text-orange-400" strokeWidth={2.5} />;
                        } else if (isSelected && !isCorrect) {
                          containerCls = "border-white/8 bg-white/4";
                          letterCls = "bg-white/8 text-zinc-200 border-white/15";
                          textCls = "text-zinc-300";
                          trailingIcon = <X className="w-4.5 h-4.5 text-zinc-400" strokeWidth={2.5} />;
                        } else {
                          containerCls = "border-white/4 opacity-40";
                          letterCls = "bg-white/4 text-zinc-600 border-white/4";
                          textCls = "text-zinc-500";
                        }
                      } else if (isSelected) {
                        containerCls = "border-orange-500/40 bg-orange-500/8";
                        letterCls = "bg-orange-500 text-white border-orange-500/50";
                        textCls = "text-orange-100";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(i)}
                          disabled={showResult}
                          className={cn(
                            "group w-full text-left flex items-center gap-3.5 rounded-xl px-4 py-3.5 border transition-all duration-200 cursor-pointer disabled:cursor-default",
                            containerCls
                          )}
                        >
                          <span className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border transition-all duration-200",
                            letterCls
                          )}>
                            {letterLabel}
                          </span>
                          <span className={cn("text-[15px] leading-snug flex-1", textCls)}>{option}</span>
                          {trailingIcon && <span className="shrink-0 ml-auto">{trailingIcon}</span>}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              <div className="mt-7">
                {!showResult ? (
                  <div className="flex justify-end">
                    <button
                      onClick={handleCheck}
                      disabled={selectedAnswer === null}
                      className={cn(
                        "rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-200",
                        selectedAnswer !== null
                          ? "bg-orange-500 text-white hover:bg-orange-400"
                          : "bg-white/5 text-zinc-600 cursor-not-allowed border border-white/6"
                      )}
                    >
                      Check Answer
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "rounded-xl px-4 py-3.5 text-[14px] leading-relaxed flex items-start gap-2.5",
                        isCorrect
                          ? "bg-orange-500/10 border border-orange-500/20 text-orange-200"
                          : "bg-white/4 border border-white/8 text-zinc-300"
                      )}
                    >
                      <span className="font-bold shrink-0 mt-px">
                        {isCorrect ? "✓ Correct!" : "✗ Incorrect."}
                      </span>
                      <span className="opacity-80 leading-relaxed">{q.explanation}</span>
                    </motion.div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleNext}
                        className="bg-orange-500 text-white hover:bg-orange-400 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all inline-flex items-center gap-2"
                      >
                        {currentQuestion < total - 1 ? "Next Question" : "See Results"}
                        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        {!finished && (
          <div className="relative border-t border-white/5 px-5 sm:px-6 py-3">
            <div className="flex items-center justify-between text-[11px] text-zinc-600">
              <span className="flex items-center gap-1.5">
                <Brain className="w-3 h-3" />
                StudyForge Quiz
              </span>
              <span className="tabular-nums">{Math.round(((currentQuestion + (showResult ? 1 : 0)) / total) * 100)}% complete</span>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);

QuizCard.displayName = "QuizCard";
