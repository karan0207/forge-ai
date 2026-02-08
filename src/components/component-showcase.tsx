"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Brain, Layers, GitCompareArrows, Lightbulb, CalendarDays, BarChart3 } from "lucide-react";

const showcaseItems = [
  {
    icon: BookOpen,
    name: "LessonCard",
    color: "#EC6341",
    preview: ["The French Revolution", "5 key points · Intermediate · 15 min"],
    detail: "Structured lessons with key points, difficulty badge, and estimated time.",
  },
  {
    icon: Brain,
    name: "QuizCard",
    color: "#6366F1",
    preview: ["Photosynthesis Quiz", "3 questions · Instant feedback"],
    detail: "Multiple-choice quizzes with real-time scoring and explanations.",
  },
  {
    icon: Layers,
    name: "FlashcardDeck",
    color: "#F59E0B",
    preview: ["ML Key Terms", "4 cards · Flip to reveal"],
    detail: "Swipeable flashcards with know-it / study-more sorting.",
  },
  {
    icon: GitCompareArrows,
    name: "ComparisonTable",
    color: "#10B981",
    preview: ["Mitosis vs Meiosis", "5 criteria · Side-by-side"],
    detail: "Side-by-side comparison tables for any two concepts.",
  },
  {
    icon: Lightbulb,
    name: "ExplainerCard",
    color: "#8B5CF6",
    preview: ["Quantum Entanglement", "Simple explanation + analogy"],
    detail: "ELI5 explanations with real-world analogies and key takeaways.",
  },
  {
    icon: CalendarDays,
    name: "StudyPlan",
    color: "#0EA5E9",
    preview: ["Biology Final Prep", "5-day plan · Priority levels"],
    detail: "Day-by-day study schedules tuned to your exam date.",
  },
  {
    icon: BarChart3,
    name: "ProgressDashboard",
    color: "#EC4899",
    preview: ["72% overall · 5 topics", "8 quizzes · Recent activity"],
    detail: "Track mastery across topics with visual progress charts.",
  },
];

export function ComponentShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    const speed = 0.5; // px per frame

    const scroll = () => {
      if (!paused && el) {
        el.scrollLeft += speed;
        // loop: when halfway (original set ends), jump back
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(scroll);
    };
    raf = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // Duplicate items for seamless loop
  const items = [...showcaseItems, ...showcaseItems];

  return (
    <section className="py-12 sm:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[#EC6341] font-semibold">
          Generative UI
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#1F2223] dark:text-white">
          7 components, zero manual selection
        </h2>
        <p className="mt-2 text-sm text-[#666666] max-w-lg mx-auto">
          The AI picks the perfect component for every prompt. Here's what it can render.
        </p>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="flex gap-5 overflow-x-auto scrollbar-hide px-4 sm:px-6"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.name}-${i}`}
              className="shrink-0 w-[260px] rounded-2xl border border-[#E7E6E4] dark:border-[#333] bg-white dark:bg-[#1a1a1a] p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Icon className="w-4.5 h-4.5" style={{ color: item.color }} />
              </div>
              <h3 className="text-sm font-semibold text-[#1F2223] dark:text-white">
                {item.name}
              </h3>
              <div className="mt-2 space-y-1">
                {item.preview.map((line, j) => (
                  <p key={j} className="text-xs text-[#666666] dark:text-[#999]">
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-[#999] dark:text-[#777] leading-relaxed">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
