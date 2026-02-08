import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { ComponentShowcase } from "@/components/component-showcase";

const featureCards = [
  {
    title: "Adaptive lessons",
    desc: "Ask to learn and get structured lessons with key points, difficulty, and time estimates.",
  },
  {
    title: "Interactive quizzes",
    desc: "Test yourself with instant feedback and explanations that reinforce memory.",
  },
  {
    title: "Generative study tools",
    desc: "Flashcards, comparisons, explainers, and plans appear automatically from your prompt.",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen bg-white dark:bg-[#111] text-[#222222] dark:text-[#eee]"
      style={{
        fontFamily: "Onest, Manrope, Geist, Arial, sans-serif",
      }}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-[#161616]/90 backdrop-blur border-b border-[#E7E6E4] dark:border-[#333]">
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% -10%, rgba(231,230,228,0.8) 0%, rgba(255,255,255,0) 60%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E6E4] bg-white px-3 py-1 text-xs text-[#444444]">
            <Sparkles className="w-3.5 h-3.5 text-[#EC6341]" />
            Built for adaptive learning
          </div>

          <h1 className="mt-6 sm:mt-8 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
            Your AI learning companion
            <span className="block text-[#EC6341]">that adapts to you.</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Ask to learn, quiz yourself, compare topics, or plan your study session.
            ForgeAI picks the best UI for every request.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-[#1F2223] text-white px-7 py-3 text-sm font-semibold shadow-[rgba(0,0,0,0.05)_0px_10px_50px_-3.5px] hover:-translate-y-px transition"
            >
              Start learning
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-[#E7E6E4] bg-white px-7 py-3 text-sm font-semibold text-[#1F2223] hover:bg-[#FCFCFC] transition"
            >
              Explore components
            </Link>
          </div>

          <p className="mt-8 text-xs text-[#666666]">
            Built with generative UI so every lesson feels custom.
          </p>
        </div>
      </section>

      {/* Feature band */}
      <section className="bg-[#FCFCFC] border-y border-[#E7E6E4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid gap-4 sm:grid-cols-3">
          {featureCards.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-[#E7E6E4] bg-white px-6 py-6 shadow-[rgba(0,0,0,0.01)_0px_10px_50px_-3.5px]"
            >
              <h3 className="text-lg font-semibold text-[#1F2223]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-[#666666] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Component Showcase Carousel */}
      <ComponentShowcase />

      {/* CTA */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-[#1F2223] text-white px-6 py-8 sm:px-8 sm:py-12 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                Launch ready
              </p>
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold">
                Bring ForgeAI to your learners.
              </h2>
              <p className="mt-3 text-sm text-white/70 max-w-xl">
                Launch a guided, interactive learning experience with lessons,
                quizzes, flashcards, comparisons, and study plans.
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
