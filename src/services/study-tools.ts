/**
 * Study tools for StudyForge.
 * These are mock implementations that return structured data
 * for the Tambo AI to use when generating component props.
 */

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Flashcard {
  front: string;
  back: string;
}

interface StudyDay {
  day: string;
  topics: string[];
  hours: number;
  priority: "high" | "medium" | "low";
}

interface ProgressData {
  overallScore: number;
  topicsStudied: number;
  quizzesTaken: number;
  averageQuizScore: number;
  topics: { name: string; mastery: number }[];
  recentActivity: string[];
}

// ──────────────────────────────────────────────────────────
// Persistent progress store (localStorage-backed)
// ──────────────────────────────────────────────────────────
const STORAGE_KEY = "forgeai-progress";

interface SerializedStore {
  scores: number[];
  topics: Record<string, number>;
  activities: string[];
}

function loadStore(): {
  scores: number[];
  topicsMastered: Map<string, number>;
  activities: string[];
} {
  if (typeof window === "undefined") {
    return { scores: [], topicsMastered: new Map(), activities: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data: SerializedStore = JSON.parse(raw);
      return {
        scores: data.scores ?? [],
        topicsMastered: new Map(Object.entries(data.topics ?? {})),
        activities: data.activities ?? [],
      };
    }
  } catch {
    // corrupt data – start fresh
  }
  return { scores: [], topicsMastered: new Map(), activities: [] };
}

function saveStore() {
  if (typeof window === "undefined") return;
  try {
    const data: SerializedStore = {
      scores: progressStore.scores,
      topics: Object.fromEntries(progressStore.topicsMastered),
      activities: progressStore.activities,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable – ignore
  }
}

const progressStore = loadStore();

/**
 * generateQuiz
 * Returns a set of quiz questions for a given topic.
 */
export async function generateQuiz({
  topic,
  numQuestions = 4,
}: {
  topic: string;
  numQuestions?: number;
}): Promise<{ topic: string; questions: QuizQuestion[] }> {
  // Return a template — the Tambo AI will fill real content via props,
  // but this demonstrates the tool pattern and provides fallback data.
  const templates: QuizQuestion[] = [
    {
      question: `What is a fundamental concept of ${topic}?`,
      options: [
        "The primary definition",
        "A common misconception",
        "An unrelated concept",
        "A historical reference",
      ],
      correctIndex: 0,
      explanation: `The fundamental concept relates to the core principles of ${topic}.`,
    },
    {
      question: `Which event is most associated with ${topic}?`,
      options: [
        "A secondary event",
        "The key turning point",
        "An earlier unrelated event",
        "A modern development",
      ],
      correctIndex: 1,
      explanation: `The key turning point is widely recognized as the most significant event in ${topic}.`,
    },
    {
      question: `What was the primary outcome of ${topic}?`,
      options: [
        "No significant change",
        "Minor adjustments",
        "A major transformation",
        "Complete reversal",
      ],
      correctIndex: 2,
      explanation: `${topic} led to a major transformation in the field.`,
    },
    {
      question: `Who is a key figure associated with ${topic}?`,
      options: [
        "An observer",
        "A critic",
        "A minor participant",
        "The leading figure",
      ],
      correctIndex: 3,
      explanation: `The leading figure played a pivotal role in shaping ${topic}.`,
    },
  ];

  return {
    topic,
    questions: templates.slice(0, numQuestions),
  };
}

/**
 * generateFlashcards
 * Returns a set of flashcards for a given topic.
 */
export async function generateFlashcards({
  topic,
  numCards = 6,
}: {
  topic: string;
  numCards?: number;
}): Promise<{ topic: string; cards: Flashcard[] }> {
  const templates: Flashcard[] = [
    { front: `Define ${topic}`, back: `${topic} is a subject covering key principles and concepts in the field.` },
    { front: `When did ${topic} originate?`, back: `${topic} has roots tracing back to foundational events in history.` },
    { front: `Key figure in ${topic}?`, back: `Several important figures contributed to the development of ${topic}.` },
    { front: `Main impact of ${topic}?`, back: `${topic} significantly influenced subsequent developments in the area.` },
    { front: `${topic} vs its predecessor?`, back: `${topic} introduced new ideas that improved upon earlier approaches.` },
    { front: `Legacy of ${topic}?`, back: `The legacy of ${topic} continues to shape modern understanding.` },
  ];

  return {
    topic,
    cards: templates.slice(0, numCards),
  };
}

/**
 * trackProgress
 * Simulates storing and retrieving learning progress.
 */
export async function trackProgress({
  action,
  topic,
  score,
}: {
  action: "get" | "update";
  topic?: string;
  score?: number;
}): Promise<ProgressData> {
  if (action === "update" && topic && score !== undefined) {
    progressStore.scores.push(score);
    progressStore.topicsMastered.set(
      topic,
      Math.max(progressStore.topicsMastered.get(topic) || 0, score)
    );
    progressStore.activities.unshift(
      `Scored ${score}% on ${topic}`
    );
    if (progressStore.activities.length > 5) {
      progressStore.activities.pop();
    }
    saveStore();
  }

  const topicEntries = Array.from(progressStore.topicsMastered.entries());
  const avgScore =
    progressStore.scores.length > 0
      ? Math.round(
          progressStore.scores.reduce((a, b) => a + b, 0) /
            progressStore.scores.length
        )
      : 0;
  const overall =
    topicEntries.length > 0
      ? Math.round(
          topicEntries.reduce((sum, [, v]) => sum + v, 0) / topicEntries.length
        )
      : 0;

  return {
    overallScore: overall,
    topicsStudied: topicEntries.length,
    quizzesTaken: progressStore.scores.length,
    averageQuizScore: avgScore,
    topics: topicEntries.map(([name, mastery]) => ({ name, mastery })),
    recentActivity:
      progressStore.activities.length > 0
        ? progressStore.activities
        : ["Start your first lesson to track progress here"],
  };
}

/**
 * generateStudyPlan
 * Creates a day-by-day study plan from topics and an exam date.
 */
export async function generateStudyPlan({
  topics,
  examDate,
  hoursPerDay = 2,
}: {
  topics: string[];
  examDate: string;
  hoursPerDay?: number;
}): Promise<{
  title: string;
  examDate: string;
  days: StudyDay[];
}> {
  const priorities: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Spread topics across available days
  const days: StudyDay[] = topics.map((topic, i) => ({
    day: dayNames[i % dayNames.length],
    topics: [topic],
    hours: hoursPerDay,
    priority: priorities[Math.min(i, priorities.length - 1)],
  }));

  // Add a review day at the end
  days.push({
    day: "Review Day",
    topics: ["Review all topics", "Practice weak areas"],
    hours: Math.round(hoursPerDay * 1.5),
    priority: "high",
  });

  return {
    title: `Study Plan for ${topics[0] || "Exam"}`,
    examDate,
    days,
  };
}
