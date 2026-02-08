"use client";

import { Graph } from "@/components/tambo/graph";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import React, { forwardRef, useMemo, useState } from "react";
import { z } from "zod";

/* Schema */

export const progressDashboardSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall learning progress score out of 100"),
  topicsStudied: z
    .number()
    .min(0)
    .describe("Total number of topics studied so far"),
  quizzesTaken: z
    .number()
    .min(0)
    .describe("Total number of quizzes completed"),
  averageQuizScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Average score across all quizzes"),
  topics: z
    .array(
      z.object({
        name: z.string().describe("Topic name"),
        mastery: z
          .number()
          .min(0)
          .max(100)
          .describe("Mastery percentage for this topic"),
      })
    )
    .optional()
    .describe("List of topics with mastery levels"),
  recentActivity: z
    .array(
      z.object({
        date: z.string().describe("Date of activity in YYYY-MM-DD format"),
        score: z
          .number()
          .min(0)
          .max(100)
          .describe("Score achieved on this date"),
      })
    )
    .optional()
    .describe("Recent activity data for trend graph"),
});

export type ProgressDashboardProps = z.infer<typeof progressDashboardSchema>;

/* Helpers */

function getMasteryColor(mastery: number) {
  if (mastery >= 80)
    return {
      bar: "bg-orange-500",
      text: "text-orange-300",
      badge: "bg-orange-500/10 text-orange-300 border-orange-500/20",
      label: "Strong",
    };
  if (mastery >= 60)
    return {
      bar: "bg-orange-400",
      text: "text-orange-300",
      badge: "bg-orange-500/8 text-orange-200 border-orange-500/20",
      label: "Progress",
    };
  if (mastery >= 40)
    return {
      bar: "bg-white/20",
      text: "text-zinc-300",
      badge: "bg-white/6 text-zinc-300 border-white/10",
      label: "Learning",
    };
  return {
    bar: "bg-white/10",
    text: "text-zinc-400",
    badge: "bg-white/4 text-zinc-400 border-white/10",
    label: "Needs Work",
  };
}

function getScoreGrade(score: number) {
  if (score >= 90) return { grade: "A+", color: "text-orange-400" };
  if (score >= 80) return { grade: "A", color: "text-orange-300" };
  if (score >= 70) return { grade: "B", color: "text-zinc-200" };
  if (score >= 60) return { grade: "C", color: "text-zinc-400" };
  return { grade: "D", color: "text-zinc-500" };
}

/* Stat Card Sub-Component */

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  suffix?: string;
  accent: string;
  delay: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent,
  delay,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
      className="group relative overflow-hidden rounded-xl border border-white/6 bg-white/2 p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/4"
    >
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-medium tracking-wider text-white/40 uppercase">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-2xl font-bold tracking-tight", accent)}>
              {value}
            </span>
            {suffix && (
              <span className="text-xs font-medium text-white/30">
                {suffix}
              </span>
            )}
          </div>
        </div>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border border-white/6 bg-white/3",
            "transition-all duration-300 group-hover:scale-105"
          )}
        >
          <Icon className={cn("h-4 w-4", accent)} strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  );
}

/* Circular Progress Ring */

function ProgressRing({
  score,
  size = 140,
}: {
  score: number;
  size?: number;
}) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const grade = getScoreGrade(score);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-3xl font-bold tracking-tight text-white"
        >
          {score}
        </motion.span>
        <span className={cn("text-xs font-semibold", grade.color)}>
          {grade.grade}
        </span>
      </div>
    </div>
  );
}

/* Topic Mastery Bar */

function TopicBar({
  name,
  mastery,
  index,
}: {
  name: string;
  mastery: number;
  index: number;
}) {
  const colors = getMasteryColor(mastery);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.1 * index + 0.4 }}
      className="group space-y-1.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              colors.bar,
              "shadow-sm"
            )}
          />
          <span className="text-sm font-medium text-white/70 transition-colors group-hover:text-white/90">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-1.5 py-0.5 text-[10px] font-semibold leading-none",
              colors.badge
            )}
          >
            {colors.label}
          </span>
          <span className={cn("text-xs font-bold tabular-nums", colors.text)}>
            {mastery}%
          </span>
        </div>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-white/4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${mastery}%` }}
          transition={{
            duration: 0.9,
            delay: 0.1 * index + 0.5,
            ease: [0.23, 1, 0.32, 1],
          }}
          className={cn("absolute inset-y-0 left-0 rounded-full", colors.bar)}
        />
      </div>
    </motion.div>
  );
}

/* Main Component */

export const ProgressDashboard = forwardRef<
  HTMLDivElement,
  ProgressDashboardProps
>(
  function ProgressDashboard(
    {
      overallScore,
      topicsStudied,
      quizzesTaken,
      averageQuizScore,
      topics,
      recentActivity,
    },
    ref
  ) {
    const [activeSection, setActiveSection] = useState<
      "overview" | "topics" | "activity"
    >("overview");

    const sortedTopics = useMemo(
      () =>
        topics
          ? [...topics].sort((a, b) => b.mastery - a.mastery)
          : [],
      [topics]
    );

    const averageMastery = useMemo(() => {
      if (!sortedTopics.length) return 0;
      return Math.round(
        sortedTopics.reduce((s, t) => s + t.mastery, 0) / sortedTopics.length
      );
    }, [sortedTopics]);

    const highMasteryCount = useMemo(
      () => sortedTopics.filter((t) => t.mastery >= 80).length,
      [sortedTopics]
    );

    const activityGraphData = useMemo(() => {
      if (!recentActivity || recentActivity.length === 0) return null;
      return {
        type: "line" as const,
        labels: recentActivity.map((entry) => entry.date),
        datasets: [
          {
            label: "Score",
            data: recentActivity.map((entry) => entry.score),
            color: "hsl(24, 94%, 55%)",
          },
        ],
      };
    }, [recentActivity]);

    const tabItems = [
      { id: "overview" as const, label: "Overview", icon: BarChart3 },
      { id: "topics" as const, label: "Topics", icon: Brain },
      { id: "activity" as const, label: "Activity", icon: Activity },
    ];

    return (
      <div
        ref={ref}
        className="group/card relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/8 bg-[#0c0c0c] shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="relative border-b border-white/6 bg-white/2 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              {/* Icon Container */}
              <div className="relative">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
                  <Trophy className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Learning Progress
                </h2>
                <p className="mt-0.5 text-xs text-white/40">
                  Your performance at a glance
                </p>
              </div>
            </div>

            {/* Score Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5"
            >
              <Flame className="h-3.5 w-3.5 text-orange-400" strokeWidth={2} />
              <span className="text-xs font-bold text-orange-300">
                {overallScore}%
              </span>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex gap-1 rounded-lg border border-white/4 bg-white/2 p-1">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  activeSection === tab.id
                    ? "text-white"
                    : "text-white/40 hover:text-white/60"
                )}
              >
                {activeSection === tab.id && (
                  <motion.div
                    layoutId="dashboardTab"
                    className="absolute inset-0 rounded-md border border-white/8 bg-white/6"
                    transition={{ duration: 0.25 }}
                  />
                )}
                <tab.icon className="relative h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="relative px-6 py-5">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeSection === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Score Ring + Stats */}
                <div className="flex items-center gap-6">
                  <ProgressRing score={overallScore} />

                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-white/40">
                        Overall Performance
                      </p>
                      <p className="mt-1 text-sm text-white/60">
                        {overallScore >= 80
                          ? "Excellent progress! Keep up the great work."
                          : overallScore >= 60
                          ? "Good progress. Focus on weaker areas."
                          : "Keep practicing to improve your scores."}
                      </p>
                    </div>

                    {/* Quick insight badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {highMasteryCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-300">
                          <Sparkles className="h-2.5 w-2.5" />
                          {highMasteryCount} strong
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-white/3 px-2 py-0.5 text-[10px] font-medium text-white/50">
                        <Target className="h-2.5 w-2.5" />
                        Avg {averageMastery}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/6" />

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    icon={BookOpen}
                    label="Topics"
                    value={topicsStudied}
                    suffix="studied"
                    accent="text-orange-400"
                    delay={0.1}
                  />
                  <StatCard
                    icon={Zap}
                    label="Quizzes"
                    value={quizzesTaken}
                    suffix="taken"
                    accent="text-orange-300"
                    delay={0.15}
                  />
                  <StatCard
                    icon={Award}
                    label="Quiz Avg"
                    value={averageQuizScore}
                    suffix="%"
                    accent="text-zinc-200"
                    delay={0.2}
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Mastery"
                    value={averageMastery}
                    suffix="% avg"
                    accent="text-zinc-300"
                    delay={0.25}
                  />
                </div>
              </motion.div>
            )}

            {/* Topics Tab */}
            {activeSection === "topics" && (
              <motion.div
                key="topics"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Section Label */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain
                      className="h-4 w-4 text-orange-400"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-semibold text-white/80">
                      Topic Mastery
                    </span>
                  </div>
                  <span className="text-xs text-white/30">
                    {sortedTopics.length} topics
                  </span>
                </div>

                {/* Mastery Bars */}
                {sortedTopics.length > 0 ? (
                  <div className="space-y-3">
                    {sortedTopics.map((topic, i) => (
                      <TopicBar
                        key={topic.name}
                        name={topic.name}
                        mastery={topic.mastery}
                        index={i}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/6 py-10">
                    <Brain className="mb-2 h-8 w-8 text-white/10" />
                    <p className="text-sm text-white/30">No topics yet</p>
                    <p className="mt-0.5 text-xs text-white/20">
                      Start studying to track mastery
                    </p>
                  </div>
                )}

                {/* Legend */}
                {sortedTopics.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap items-center gap-3 rounded-lg border border-white/4 bg-white/2 px-3 py-2"
                  >
                    {[
                      { color: "bg-orange-500", label: "≥80% Strong" },
                      { color: "bg-orange-400", label: "≥60% Progress" },
                      { color: "bg-white/20", label: "≥40% Learning" },
                      { color: "bg-white/10", label: "<40% Needs Work" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-1.5"
                      >
                        <div
                          className={cn("h-2 w-2 rounded-full", item.color)}
                        />
                        <span className="text-[10px] text-white/35">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Activity Tab */}
            {activeSection === "activity" && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Section Label */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity
                      className="h-4 w-4 text-orange-400"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-semibold text-white/80">
                      Score Trend
                    </span>
                  </div>
                  {recentActivity && (
                    <span className="text-xs text-white/30">
                      {recentActivity.length} sessions
                    </span>
                  )}
                </div>

                {/* Graph */}
                {activityGraphData ? (
                  <div className="overflow-hidden rounded-xl border border-white/4 bg-white/2 p-3">
                    <Graph
                      data={activityGraphData}
                      title="Score Trend"
                      showLegend={false}
                      size="sm"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/6 py-10">
                    <Activity className="mb-2 h-8 w-8 text-white/10" />
                    <p className="text-sm text-white/30">No activity yet</p>
                    <p className="mt-0.5 text-xs text-white/20">
                      Complete quizzes to see your trend
                    </p>
                  </div>
                )}

                {/* Recent Activity List */}
                {recentActivity && recentActivity.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium tracking-wider text-white/30 uppercase">
                      Recent Sessions
                    </p>
                    <div className="space-y-1">
                      {recentActivity.slice(-5).reverse().map((a, i) => {
                        const scoreColor = getMasteryColor(a.score);
                        return (
                          <motion.div
                            key={a.date + i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 + 0.2 }}
                            className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/3"
                          >
                            <div className="flex items-center gap-2.5">
                              <Clock
                                className="h-3.5 w-3.5 text-white/25"
                                strokeWidth={1.5}
                              />
                              <span className="text-xs text-white/50">
                                {a.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-xs font-bold tabular-nums",
                                  scoreColor.text
                                )}
                              >
                                {a.score}%
                              </span>
                              <ChevronRight className="h-3 w-3 text-white/15" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Professional Footer */}
        <div className="border-t border-white/4 bg-white/1 px-6 py-3">
          <div className="flex items-center justify-end">
            <span className="text-[10px] tabular-nums text-white/20">
              {topicsStudied} topics · {quizzesTaken} quizzes
            </span>
          </div>
        </div>
      </div>
    );
  }
);

ProgressDashboard.displayName = "ProgressDashboard";
export default ProgressDashboard;
