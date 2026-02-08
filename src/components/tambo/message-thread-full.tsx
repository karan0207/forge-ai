"use client";

import type { messageVariants } from "@/components/tambo/message";
import {
  MessageInput,
  MessageInputError,
  MessageInputFileButton,
  MessageInputMcpPromptButton,
  MessageInputMcpResourceButton,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import {
  MessageSuggestions,
  MessageSuggestionsList,
  MessageSuggestionsStatus,
} from "@/components/tambo/message-suggestions";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { MessageInputMcpConfigButton } from "@/components/tambo/message-input";
import { ThreadContainer, useThreadContainerContext } from "./thread-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import {
  ThreadHistory,
  ThreadHistoryHeader,
  ThreadHistoryList,
  ThreadHistoryNewButton,
  ThreadHistorySearch,
} from "@/components/tambo/thread-history";
import { useMergeRefs } from "@/lib/thread-hooks";
import { type Suggestion, useTambo } from "@tambo-ai/react";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

/**
 * Empty-state hero shown when the thread has no messages yet.
 */
function WelcomeHero() {
  const { thread } = useTambo();
  const hasMessages = thread?.messages && thread.messages.length > 0;

  if (hasMessages) return null;

  return (
    <div className="flex flex-col items-center justify-center flex-1 select-none px-4 py-16 animate-in fade-in duration-500">
      <h1
        className="text-3xl sm:text-4xl font-bold text-[#1F2223] text-center tracking-tight leading-snug"
      >
        What would you like to learn today?
      </h1>
      <p className="mt-4 text-base sm:text-lg text-[#666666] text-center max-w-xl leading-relaxed">
        Your personal study companion — explain topics, test your
        knowledge, compare ideas, or build flashcards.
      </p>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5 text-center text-sm text-[#444]">
        <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E7E6E4]">
          <span className="text-[28px] leading-none">🎓</span>
          <span className="font-medium">Lessons</span>
        </div>
        <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E7E6E4]">
          <span className="text-[28px] leading-none">💡</span>
          <span className="font-medium">Quizzes</span>
        </div>
        <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E7E6E4]">
          <span className="text-[28px] leading-none">🔍</span>
          <span className="font-medium">Compare</span>
        </div>
        <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E7E6E4]">
          <span className="text-[28px] leading-none">🗂️</span>
          <span className="font-medium">Flashcards</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Props for the MessageThreadFull component
 */
export interface MessageThreadFullProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Controls the visual styling of messages in the thread.
   * Possible values include: "default", "compact", etc.
   * These values are defined in messageVariants from "@/components/tambo/message".
   * @example variant="compact"
   */
  variant?: VariantProps<typeof messageVariants>["variant"];
}

/**
 * A full-screen chat thread component with message history, input, and suggestions
 */
export const MessageThreadFull = React.forwardRef<
  HTMLDivElement,
  MessageThreadFullProps
>(({ className, variant, ...props }, ref) => {
  const { containerRef, historyPosition } = useThreadContainerContext();
  const mergedRef = useMergeRefs<HTMLDivElement | null>(ref, containerRef);

  const threadHistorySidebar = (
    <ThreadHistory position={historyPosition}>
      <ThreadHistoryHeader />
      <ThreadHistoryNewButton />
      <ThreadHistorySearch />
      <ThreadHistoryList />
    </ThreadHistory>
  );

  const defaultSuggestions: Suggestion[] = [
    {
      id: "suggestion-1",
      title: "🎓 Learn a topic",
      detailedSuggestion: "Teach me the basics of photosynthesis",
      messageId: "learn-query",
    },
    {
      id: "suggestion-2",
      title: "💡 Take a quiz",
      detailedSuggestion: "Quiz me on the French Revolution",
      messageId: "quiz-query",
    },
    {
      id: "suggestion-3",
      title: "🔍 Compare concepts",
      detailedSuggestion: "Compare mitosis vs meiosis",
      messageId: "compare-query",
    },
    {
      id: "suggestion-4",
      title: "🗂️ Flashcards",
      detailedSuggestion: "Create flashcards for key machine learning terms",
      messageId: "flashcard-query",
    },
  ];

  return (
    <div className="flex h-full w-full">
      {/* Thread History Sidebar - rendered first if history is on the left */}
      {historyPosition === "left" && threadHistorySidebar}

      <ThreadContainer
        ref={mergedRef}
        disableSidebarSpacing
        className={className}
        {...props}
      >
        <ScrollableMessageContainer className="p-2 sm:p-4">
          <WelcomeHero />
          <ThreadContent variant={variant}>
            <ThreadContentMessages />
          </ThreadContent>
        </ScrollableMessageContainer>

        {/* Message suggestions status */}
        <MessageSuggestions>
          <MessageSuggestionsStatus />
        </MessageSuggestions>

        {/* Message input */}
        <div className="px-2 sm:px-4 pb-3 sm:pb-4">
          <MessageInput>
            <MessageInputTextarea placeholder="Ask to learn, quiz, compare, or create flashcards..." />
            <MessageInputToolbar>
              <MessageInputFileButton />
              <MessageInputMcpPromptButton />
              <MessageInputMcpResourceButton />
              {/* Uncomment this to enable client-side MCP config modal button */}
              <MessageInputMcpConfigButton />
              <MessageInputSubmitButton />
            </MessageInputToolbar>
            <MessageInputError />
          </MessageInput>
        </div>

        {/* Message suggestions */}
        <MessageSuggestions initialSuggestions={defaultSuggestions}>
          <MessageSuggestionsList />
        </MessageSuggestions>
      </ThreadContainer>

      {/* Thread History Sidebar - rendered last if history is on the right */}
      {historyPosition === "right" && threadHistorySidebar}
    </div>
  );
});
MessageThreadFull.displayName = "MessageThreadFull";
