import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const steps = [
  {
    title: "Describe what you want to learn",
    detail:
      "Write a prompt in plain language. ForgeAI reads the intent and the subject.",
  },
  {
    title: "Tambo picks the right UI",
    detail:
      "Tambo routes the request to a matching component, such as lessons, quizzes, or flashcards.",
  },
  {
    title: "Study with focused tools",
    detail:
      "The UI is generated with structured data so each view is clean, consistent, and useful.",
  },
];

const highlights = [
  {
    label: "Built for a hackathon",
    value:
      "Karan built ForgeAI for a hackathon using Tambo to power generative UI.",
  },
  {
    label: "Simple by design",
    value:
      "No gradients or glows. The interface stays flat, clean, and professional.",
  },
  {
    label: "Component first",
    value:
      "Each response maps to a reusable component so the system feels cohesive.",
  },
];

export default function HowItWorksPage() {
  return (
    <div
      className="min-h-screen bg-white text-[#1F2223]"
      style={{ fontFamily: "Onest, Manrope, Geist, Arial, sans-serif" }}
    >
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#E7E6E4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold">ForgeAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#444444]">
            <Link href="/gallery" className="hover:text-black transition-colors">
              Components
            </Link>
            <Link href="/how-it-works" className="hover:text-black transition-colors">
              How it works
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-[#EC6341] text-white px-5 py-2 text-sm font-semibold shadow-[rgba(237,101,66,0.25)_0px_8px_20px_0px] hover:brightness-95 transition"
            >
              Try for free
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[#EC6341] font-semibold">
          How it works
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
          From prompt to study tool in seconds
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[#666666] max-w-2xl">
          ForgeAI turns simple requests into focused learning tools. It is built
          with Tambo so each response maps to a clean, reusable component.
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 grid gap-5 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-3xl border border-[#E7E6E4] bg-white px-6 py-6"
          >
            <p className="text-xs font-semibold text-[#EC6341]">Step {index + 1}</p>
            <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-[#666666] leading-relaxed">
              {step.detail}
            </p>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-[28px] border border-[#E7E6E4] bg-[#FCFCFC] px-6 py-8 sm:px-8 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-semibold">Why this approach</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-[#E7E6E4] bg-white px-5 py-5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[#666666]">
                  {item.label}
                </p>
                <p className="mt-3 text-sm text-[#333333] leading-relaxed">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-[#1F2223] text-white px-6 py-8 sm:px-8 sm:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                Ready to try
              </p>
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold">
                Start a lesson with one prompt.
              </h2>
              <p className="mt-3 text-sm text-white/70 max-w-xl">
                Ask for a lesson, a quiz, or a study plan. ForgeAI will choose the
                right component and render it instantly.
              </p>
            </div>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#1F2223] px-6 py-3 text-sm font-semibold"
            >
              Open the app
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
