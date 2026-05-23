"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useFilter } from "@/lib/filter-context";

/**
 * Search overlay — full-screen search experience opened by tapping the
 * Search all games pill in the bottom bar.
 *
 * UX:
 *   - Slides in from below with a spring
 *   - Autofocused `<input>` triggers the native iOS keyboard immediately
 *   - Empty state: shows "Popular searches" chips
 *   - Typing: live-filters the game pool and renders matching tiles in a grid
 *   - Back arrow (top-left) closes the overlay
 *
 * Implementation notes:
 *   - The overlay is fixed and z-50 (above everything except the side nav).
 *   - Body scroll is locked while open so the lobby underneath doesn't move.
 *   - Game pool is hard-coded here to keep the demo self-contained — easy to
 *     swap for a real catalogue or backend search later.
 */

type Game = { src: string; name: string; provider: string; tags?: string[] };

const POPULAR_SEARCHES = ["Starburst", "Big Bass", "Rhino", "Wild Ape", "Tiki", "Maze Escape", "Snake Arena"];

const G = (i: number, name: string, provider: string, tags: string[] = []): Game => ({
  src: `/assets/games/slot-${String(i).padStart(2, "0")}.png`,
  name,
  provider,
  tags,
});

const GAMES: Game[] = [
  G(1, "Western Gold 2 Double Barrel", "iSoftBet", ["western", "slot"]),
  G(2, "Golden Catch", "Pragmatic Play", ["fishing", "slot"]),
  G(3, "Snake Arena", "Relax Gaming", ["arena", "slot"]),
  G(4, "Starburst", "NetEnt", ["space", "classic"]),
  G(5, "Big Bass Splash", "Pragmatic Play", ["fishing", "bass"]),
  G(6, "Tiki Tumble", "Push Gaming", ["tiki", "jungle"]),
  G(7, "Rhino Rumble", "Booming Games", ["rhino", "jungle"]),
  G(8, "Wild Ape", "Pragmatic Play", ["wild", "ape", "jungle"]),
  G(9, "Maze Escape Megaways", "Big Time Gaming", ["maze", "megaways"]),
  G(10, "Spaceman", "Pragmatic Play", ["space", "crash"]),
  G(11, "Drops & Wins Big Bass", "Pragmatic Play", ["fishing", "drops"]),
  G(12, "Stack 'Em", "Hacksaw Gaming", ["stack", "casual"]),
  G(13, "Mummy Mania", "Yggdrasil", ["mummy", "egypt"]),
];

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useFilter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query each time the overlay opens; autofocus the input so iOS
  // immediately brings up the keyboard.
  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      // Small delay so the slide-in animation finishes before focusing,
      // otherwise iOS can ignore the focus call mid-transition.
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!searchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [searchOpen]);

  // Close on Esc
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, closeSearch]);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? GAMES.filter(
        (g) =>
          g.name.toLowerCase().includes(trimmed) ||
          g.provider.toLowerCase().includes(trimmed) ||
          g.tags?.some((t) => t.toLowerCase().includes(trimmed)),
      )
    : [];

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role="dialog"
          aria-label="Search games"
          className="fixed inset-0 z-50 flex flex-col bg-white"
          // Constrain to the mobile-frame width on desktop.
          style={{
            maxWidth: "var(--mobile-width)",
            margin: "0 auto",
            left: "max(0px, calc(50vw - var(--mobile-width) / 2))",
            right: "max(0px, calc(50vw - var(--mobile-width) / 2))",
          }}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 38, mass: 0.9 }}
        >
          {/* Search bar */}
          <div
            className="flex items-center gap-[10px] px-[16px] pb-[12px]"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}
          >
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Back"
              className="grid size-[40px] shrink-0 place-items-center rounded-full active:bg-[#f2f3f3] transition-colors"
            >
              <BackIcon className="size-[20px] text-[var(--mrq-blue-dark)]" />
            </button>

            <label
              className="flex flex-1 items-center gap-[8px] h-[44px] rounded-full bg-white px-[14px]"
              style={{ border: "1px solid #ced5f5" }}
            >
              <SearchIcon className="size-[18px] shrink-0 text-mrq-blue" />
              <input
                ref={inputRef}
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Search all games"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none text-[15px] font-semibold text-[var(--mrq-blue-dark)] placeholder:text-[#9ca0aa] bg-transparent"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="shrink-0 size-[20px] grid place-items-center rounded-full bg-[#e6eafa] active:scale-[0.92] transition-transform"
                >
                  <ClearIcon className="size-[10px] text-[var(--mrq-blue-dark)]" />
                </button>
              )}
            </label>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-[16px] pb-[24px]">
            {trimmed.length === 0 ? (
              <EmptyState onPick={(term) => setQuery(term)} />
            ) : results.length === 0 ? (
              <NoResults query={query} />
            ) : (
              <Results games={results} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------- Empty / no-results states --------------------- */

function EmptyState({ onPick }: { onPick: (term: string) => void }) {
  return (
    <div className="pt-[8px]">
      <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-[#6c7080] mb-[10px]">
        Popular searches
      </h2>
      <div className="flex flex-wrap gap-[8px]">
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onPick(term)}
            className="rounded-full px-[14px] py-[8px] text-[14px] font-bold text-[var(--mrq-blue-dark)] active:scale-[0.97] transition-transform"
            style={{
              backgroundColor: "#f2f3f3",
              border: "1px solid #e6e6e7",
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="pt-[40px] text-center">
      <p className="text-[16px] font-extrabold text-[var(--mrq-blue-dark)]">
        No results for &ldquo;{query}&rdquo;
      </p>
      <p className="text-[14px] text-[#6c7080] mt-[6px]">Try a different game name or category.</p>
    </div>
  );
}

/* ---------------------------- Results grid --------------------------- */

function Results({ games }: { games: Game[] }) {
  return (
    <div className="pt-[8px]">
      <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-[#6c7080] mb-[10px]">
        {games.length} {games.length === 1 ? "result" : "results"}
      </h2>
      <div className="grid grid-cols-3 gap-[10px]">
        {games.map((g) => (
          <button
            key={g.name}
            type="button"
            className="flex flex-col gap-[6px] text-left active:scale-[0.98] transition-transform"
          >
            <div
              className="aspect-square w-full overflow-hidden rounded-[12px]"
              style={{ boxShadow: "0 4px 12px -6px rgba(10, 46, 203, 0.2)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt="" className="h-full w-full object-cover" draggable={false} />
            </div>
            <p className="text-[12px] font-extrabold text-[var(--mrq-blue-dark)] line-clamp-1">{g.name}</p>
            <p className="text-[11px] font-semibold text-[#6c7080] line-clamp-1 -mt-[4px]">{g.provider}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- Inline icons --------------------------- */

function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m12 4-6 6 6 6" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ClearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
      <path d="M2 2l6 6M8 2l-6 6" />
    </svg>
  );
}
