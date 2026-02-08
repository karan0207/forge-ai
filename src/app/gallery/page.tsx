"use client";

import { LessonCard } from "../../components/studyforge/lesson-card";
import { QuizCard } from "../../components/studyforge/quiz-card";
import { FlashcardDeck } from "../../components/studyforge/flashcard-deck";
import { ComparisonTable } from "../../components/studyforge/comparison-table";
import { ExplainerCard } from "../../components/studyforge/explainer-card";
import { StudyPlan } from "../../components/studyforge/study-plan";
import { ProgressDashboard } from "../../components/studyforge/progress-dashboard";
import { components } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const sampleLesson = {
  title: "The French Revolution",
  summary:
    "The French Revolution (1789–1799) was a period of radical political and societal change in France. It began with the Estates General and ended with Napoleon's rise to power.",
  keyPoints: [
    "Storming of the Bastille on July 14, 1789 marked the revolution's symbolic start",
    "The Declaration of the Rights of Man established fundamental freedoms",
    "The Reign of Terror under Robespierre saw mass executions",
    "Napoleon Bonaparte seized power in a 1799 coup d'état",
    "The revolution inspired democratic movements worldwide",
  ],
  difficulty: "intermediate" as const,
  estimatedMinutes: 15,
};

const sampleQuiz = {
  topic: "Photosynthesis",
  questions: [
    {
      question: "What is the primary pigment involved in photosynthesis?",
      options: ["Melanin", "Chlorophyll", "Hemoglobin", "Carotene"],
      correctIndex: 1,
      explanation: "Chlorophyll is the green pigment that captures light energy for photosynthesis.",
    },
    {
      question: "Where does the light-dependent reaction occur?",
      options: ["Stroma", "Thylakoid membrane", "Cell wall", "Nucleus"],
      correctIndex: 1,
      explanation: "Light-dependent reactions happen in the thylakoid membrane of chloroplasts.",
    },
    {
      question: "What gas is released as a byproduct of photosynthesis?",
      options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
      correctIndex: 2,
      explanation: "Oxygen is released when water molecules are split during the light reactions.",
    },
  ],
};

const sampleFlashcards = {
  topic: "Machine Learning Key Terms",
  cards: [
    { front: "What is supervised learning?", back: "A type of ML where the model learns from labeled training data to predict outcomes." },
    { front: "Define overfitting", back: "When a model learns the training data too well, including noise, and performs poorly on new data." },
    { front: "What is a neural network?", back: "A computing system inspired by biological neural networks, consisting of layers of interconnected nodes." },
    { front: "What is gradient descent?", back: "An optimization algorithm that iteratively adjusts parameters to minimize a loss function." },
  ],
};

const sampleComparison = {
  title: "Mitosis vs Meiosis",
  subjects: ["Mitosis", "Meiosis"],
  criteria: [
    { label: "Purpose", values: ["Growth & repair", "Produce gametes"] },
    { label: "Divisions", values: ["1 division", "2 divisions"] },
    { label: "Daughter cells", values: ["2 identical", "4 unique"] },
    { label: "Chromosome count", values: ["Diploid (2n)", "Haploid (n)"] },
    { label: "Crossing over", values: ["No", "Yes"] },
  ],
};

const sampleExplainer = {
  title: "Quantum Entanglement",
  simpleExplanation:
    "Quantum entanglement is when two particles become linked so that measuring one instantly affects the other, no matter how far apart they are. It's one of the weirdest features of quantum physics.",
  analogy:
    "Imagine you have a pair of magic gloves. You put them in separate boxes and send one to Mars. The moment you open your box and find a left glove, you instantly know the Mars box has a right glove — without looking.",
  keyTakeaway: "Entangled particles share a connection that transcends distance — measuring one reveals the state of the other instantly.",
};

const sampleStudyPlan = {
  title: "Biology Final Exam Prep",
  examDate: "February 14, 2026",
  days: [
    { day: "Monday, Feb 9", topics: ["Cell Biology", "Membrane Transport"], hours: 2, priority: "high" as const },
    { day: "Tuesday, Feb 10", topics: ["Genetics & DNA"], hours: 2, priority: "high" as const },
    { day: "Wednesday, Feb 11", topics: ["Photosynthesis", "Cellular Respiration"], hours: 1.5, priority: "medium" as const },
    { day: "Thursday, Feb 12", topics: ["Evolution", "Natural Selection"], hours: 1.5, priority: "medium" as const },
    { day: "Friday, Feb 13", topics: ["Review all topics", "Practice weak areas"], hours: 3, priority: "high" as const },
  ],
};

const sampleProgress = {
  overallScore: 72,
  topicsStudied: 5,
  quizzesTaken: 8,
  averageQuizScore: 78,
  topics: [
    { name: "French Revolution", mastery: 90 },
    { name: "Photosynthesis", mastery: 75 },
    { name: "Machine Learning", mastery: 60 },
    { name: "Quantum Physics", mastery: 55 },
    { name: "Cell Biology", mastery: 80 },
  ],
  recentActivity: [
    { date: "2026-02-02", score: 90 },
    { date: "2026-02-03", score: 78 },
    { date: "2026-02-04", score: 82 },
    { date: "2026-02-05", score: 75 },
  ],
};

const galleryItems = [
  { name: "LessonCard", description: "Structured lesson with key points, difficulty & time", component: <LessonCard {...sampleLesson} /> },
  { name: "QuizCard", description: "Interactive multiple-choice quiz with instant feedback", component: <QuizCard {...sampleQuiz} /> },
  { name: "FlashcardDeck", description: "Flip-card deck with know-it / study-more sorting", component: <FlashcardDeck {...sampleFlashcards} /> },
  { name: "ComparisonTable", description: "Side-by-side comparison of two or more concepts", component: <ComparisonTable {...sampleComparison} /> },
  { name: "ExplainerCard", description: "ELI5 explanation with analogy & key takeaway", component: <ExplainerCard {...sampleExplainer} /> },
  { name: "StudyPlan", description: "Day-by-day study schedule with priority levels", component: <StudyPlan {...sampleStudyPlan} /> },
  { name: "ProgressDashboard", description: "Learning stats, topic mastery & recent activity", component: <ProgressDashboard {...sampleProgress} /> },
];

export default function GalleryPage() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={[]}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
    >
      <div
        className="min-h-screen bg-white dark:bg-[#111] text-[#222222] dark:text-[#eee]"
        style={{ fontFamily: "Onest, Manrope, Geist, Arial, sans-serif" }}
      >
        {/* Nav */}
        <nav className="sticky top-0 z-40 bg-white/90 dark:bg-[#161616]/90 backdrop-blur border-b border-[#E7E6E4] dark:border-[#333]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-semibold">ForgeAI</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#1F2223] transition-colors"
              >
                Open Chat
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Header */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#EC6341] font-semibold">
            Component Gallery
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1F2223]">
            {components.length} Generative UI Components
          </h1>
          <p className="mt-3 text-sm text-[#666666] max-w-xl mx-auto">
            Each component is AI-selected at runtime based on your natural language prompt.
            The AI decides the best UI — you just ask.
          </p>
        </section>

        {/* Gallery */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 space-y-12">
          {galleryItems.map((item) => (
            <div key={item.name}>
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-lg font-semibold text-[#1F2223]">{item.name}</h2>
                <span className="text-xs text-[#666666]">{item.description}</span>
              </div>
              <div className="max-w-3xl">{item.component}</div>
            </div>
          ))}
        </section>
      </div>
    </TamboProvider>
  );
}
