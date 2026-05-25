"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Search page — full-page "power search".
 *
 * Currently a stub: just the input + a placeholder for the result panel.
 * The intent is a TikTok-style "discover surface for games" — recent
 * searches, trending, categories, AI suggestions, etc. — but that's a
 * later pass. For now it ships:
 *
 *   • An input that auto-focuses on mount so the on-screen keyboard
 *     comes up immediately when the user lands on the page from the
 *     bottom-nav Search tab (iOS requires focus to happen synchronously
 *     inside a navigation/user-gesture stack to auto-open the keyboard
 *     — useEffect → ref.focus() qualifies).
 *   • An empty-state hint while the field is empty.
 *
 * Not a modal/overlay anymore; it's a regular route and behaves like
 * any other page (back button, deep linkable, etc.).
 */
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus once on mount. requestAnimationFrame defers past the
  // initial paint so the focus doesn't race the navigation animation.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="px-[16px] pt-[16px] flex flex-col gap-[18px]">
      {/* Input row */}
      <div
        className="flex items-center gap-[10px] rounded-full px-[16px] h-[48px]"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #ced5f5",
          boxShadow: "0 4px 14px -8px rgba(10, 46, 203, 0.18)",
        }}
      >
        <SearchIcon className="size-[20px] shrink-0 text-mrq-blue" />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Search all games"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-[15px] font-semibold text-mrq-blue placeholder:text-mrq-blue/60 outline-none"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="size-[24px] rounded-full grid place-items-center bg-mrq-blue/10 text-mrq-blue"
          >
            <CloseIcon className="size-[14px]" />
          </button>
        )}
      </div>

      {/* Result / empty-state panel */}
      {query.length === 0 ? (
        <EmptyState />
      ) : (
        <p className="text-[14px] font-semibold text-[var(--mrq-blue-dark)] opacity-70 px-[4px]">
          Results for &ldquo;{query}&rdquo; will appear here.
        </p>
      )}
    </div>
  );
}

function EmptyState() {
  // Placeholder "ways into search" so the empty page has shape — these
  // will get replaced with recent searches, trending games, category
  // tiles, etc. in a follow-up.
  return (
    <div className="flex flex-col gap-[14px]">
      <h2 className="text-[18px] font-extrabold text-[var(--mrq-blue)]">
        Start typing to find a game
      </h2>
      <ul className="flex flex-col gap-[8px]">
        <Hint label="Trending: Megaways" />
        <Hint label="New releases" />
        <Hint label="Live dealer" />
        <Hint label="Jackpots" />
      </ul>
    </div>
  );
}

function Hint({ label }: { label: string }) {
  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-[14px] bg-white px-[16px] py-[12px] text-left active:scale-[0.99] transition-transform"
        style={{
          border: "1px solid #e6e6e7",
          boxShadow: "0 2px 8px -4px rgba(10, 46, 203, 0.12)",
        }}
      >
        <span className="text-[14px] font-extrabold text-[var(--mrq-blue-dark)]">
          {label}
        </span>
        <ChevronIcon className="size-[16px] text-[var(--mrq-blue-dark)] opacity-50" />
      </button>
    </li>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <path d="m3 3 8 8M11 3l-8 8" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <path d="m6 4 4 4-4 4" />
    </svg>
  );
}
