/**
 * @file tambo.ts
 * @description Central configuration file for StudyForge — AI Adaptive Learning Companion
 *
 * Registers all generative UI components and tools for Tambo.
 * The AI reads these registrations to decide which component to render
 * and which tool to call based on user messages.
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { LessonCard, lessonCardSchema } from "@/components/studyforge/lesson-card";
import { QuizCard, quizCardSchema } from "@/components/studyforge/quiz-card";
import { FlashcardDeck, flashcardDeckSchema } from "@/components/studyforge/flashcard-deck";
import { ComparisonTable, comparisonTableSchema } from "@/components/studyforge/comparison-table";
import { ExplainerCard, explainerCardSchema } from "@/components/studyforge/explainer-card";
import { StudyPlan, studyPlanSchema } from "@/components/studyforge/study-plan";
import { ProgressDashboard, progressDashboardSchema } from "@/components/studyforge/progress-dashboard";
import {
  generateQuiz,
  generateFlashcards,
  trackProgress,
  generateStudyPlan,
} from "@/services/study-tools";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * Functions the AI can call to generate or retrieve data before rendering a component.
 */
export const tools: TamboTool[] = [
  {
    name: "generateQuiz",
    description:
      "Generate quiz questions for a study topic. Call this when the user wants to be tested, quizzed, or assessed on their knowledge of a subject.",
    tool: generateQuiz,
    inputSchema: z.object({
      topic: z.string(),
      numQuestions: z.number().optional(),
    }),
    outputSchema: z.object({
      topic: z.string(),
      questions: z.array(
        z.object({
          question: z.string(),
          options: z.array(z.string()),
          correctIndex: z.number(),
          explanation: z.string(),
        })
      ),
    }),
  },
  {
    name: "generateFlashcards",
    description:
      "Generate flashcard pairs (front/back) for a topic. Call this when the user wants to create flashcards, memorize terms, or review key concepts.",
    tool: generateFlashcards,
    inputSchema: z.object({
      topic: z.string(),
      numCards: z.number().optional(),
    }),
    outputSchema: z.object({
      topic: z.string(),
      cards: z.array(
        z.object({
          front: z.string(),
          back: z.string(),
        })
      ),
    }),
  },
  {
    name: "trackProgress",
    description:
      "Track and retrieve learning progress. Use action 'update' to record a score for a topic, or 'get' to retrieve the current learning dashboard data.",
    tool: trackProgress,
    inputSchema: z.object({
      action: z.enum(["get", "update"]),
      topic: z.string().optional(),
      score: z.number().optional(),
    }),
    outputSchema: z.object({
      overallScore: z.number(),
      topicsStudied: z.number(),
      quizzesTaken: z.number(),
      averageQuizScore: z.number(),
      topics: z.array(
        z.object({
          name: z.string(),
          mastery: z.number(),
        })
      ),
      recentActivity: z.array(z.string()),
    }),
  },
  {
    name: "generateStudyPlan",
    description:
      "Generate a day-by-day study plan for an upcoming exam or deadline. Call this when the user asks to plan their study schedule or prepare for an exam.",
    tool: generateStudyPlan,
    inputSchema: z.object({
      topics: z.array(z.string()),
      examDate: z.string(),
      hoursPerDay: z.number().optional(),
    }),
    outputSchema: z.object({
      title: z.string(),
      examDate: z.string(),
      days: z.array(
        z.object({
          day: z.string(),
          topics: z.array(z.string()),
          hours: z.number(),
          priority: z.enum(["high", "medium", "low"]),
        })
      ),
    }),
  },
];

/**
 * components
 *
 * Generative UI components the AI can render in the chat thread.
 * Each description tells the AI exactly WHEN to use this component.
 */
export const components: TamboComponent[] = [
  {
    name: "LessonCard",
    description:
      "A structured lesson card for teaching users about a topic. Use when the user asks to learn, study, understand, or be taught something new. Renders a title, summary, key points, difficulty badge, and estimated study time.",
    component: LessonCard,
    propsSchema: lessonCardSchema,
  },
  {
    name: "QuizCard",
    description:
      "An interactive multiple-choice quiz with instant feedback. Use when the user asks to be quizzed, tested, or assessed on a topic. Renders questions one at a time with selectable options, correct/wrong feedback, explanations, and a final score.",
    component: QuizCard,
    propsSchema: quizCardSchema,
  },
  {
    name: "FlashcardDeck",
    description:
      "An interactive flip-card deck for memorization. Use when the user asks to create flashcards, review terms, memorize concepts, or practice recall. Cards flip on tap to reveal answers, with 'know it' / 'study more' sorting.",
    component: FlashcardDeck,
    propsSchema: flashcardDeckSchema,
  },
  {
    name: "ComparisonTable",
    description:
      "A side-by-side comparison table for two or more concepts. Use when the user asks to compare, contrast, or see differences between topics. Renders subjects as columns and criteria as rows.",
    component: ComparisonTable,
    propsSchema: comparisonTableSchema,
  },
  {
    name: "ExplainerCard",
    description:
      "A simplified explanation card with an analogy and key takeaway. Use when the user says they don't understand something, are confused, or want a simpler explanation. Includes an ELI5-style explanation, a real-world analogy, and a memorable one-liner.",
    component: ExplainerCard,
    propsSchema: explainerCardSchema,
  },
  {
    name: "StudyPlan",
    description:
      "A day-by-day study schedule with priority levels. Use when the user wants to create a study plan, prepare for an exam, or organize their learning over multiple days. Renders a timeline with daily topics, hours, and color-coded priorities.",
    component: StudyPlan,
    propsSchema: studyPlanSchema,
  },
  {
    name: "ProgressDashboard",
    description:
      "A learning progress dashboard showing scores, topic mastery, and recent activity. Use when the user asks to see their progress, stats, scores, or how they are doing overall. Shows an overall percentage, stat cards, topic-by-topic mastery bars, and a recent activity list.",
    component: ProgressDashboard,
    propsSchema: progressDashboardSchema,
  },
  {
    name: "Graph",
    description:
      "A chart component that renders bar, line, or pie charts using Recharts. Use when the user asks to visualize data, see trends, or display statistics as a chart. Supports customizable labels, datasets, and styling.",
    component: Graph,
    propsSchema: graphSchema,
  },
];
