"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  const mcpServers = useMcpServers();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <div
        className="flex flex-col h-dvh bg-white dark:bg-[#111] text-[#222222] dark:text-[#eee]"
        style={{ fontFamily: "Onest, Manrope, Geist, Arial, sans-serif" }}
      >
        {/* ── Slim nav ───────────────────────────────────────── */}
        <nav className="shrink-0 bg-white/90 dark:bg-[#161616]/90 backdrop-blur border-b border-[#E7E6E4] dark:border-[#333] z-40">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-sm font-semibold">ForgeAI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#1F2223] transition-colors"
              >
                Gallery
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#1F2223] transition-colors"
              >
                Home
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Chat (fills entire remaining viewport) ─────────── */}
        <div className="flex-1 min-h-0">
          <MessageThreadFull className="max-w-5xl mx-auto h-full px-0 sm:px-0" />
        </div>
      </div>
    </TamboProvider>
  );
}
