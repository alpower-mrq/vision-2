"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { getGameDetails } from "@/lib/games-catalogue";

/**
 * "Recently played" — a single row of equal-width square game tiles.
 *
 *   Recently Played Games                       Show all
 *   ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
 *   │ ▢  │ │ ▢  │ │ ▢  │ │ ▢  │ │ ▢  │
 *   └────┘ └────┘ └────┘ └────┘ └────┘
 *
 * Earlier version was a 2×2 grid of white-card pills with the game
 * name printed next to each thumbnail. Per design feedback the row
 * now drops all the card chrome — just the game artwork, five
 * tiles wide, distributed evenly across the page gutter.
 *
 * Each tile uses `flex-1 aspect-square` so the row always fills the
 * width regardless of how many items are passed. Tapping a tile
 * launches the game (via the catalogue href when known, e.g.
 * Buffalo Bills → /play/buffalo-bills) or logs a stub when the
 * destination isn't wired yet.
 */

export type RecentlyPlayedGame = {
  src: string;
  name: string;
  /** Optional explicit destination; overrides the catalogue lookup. */
  href?: string;
};

export function RecentlyPlayedGrid({
  items,
  title = "Recently Played",
  seeAllLabel = "Show All",
  showSeeAll = true,
}: {
  items: RecentlyPlayedGame[];
  title?: string;
  seeAllLabel?: string;
  showSeeAll?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      aria-label={title}
      className="px-[16px] py-3"
      initial={false}
      animate={reduce ? undefined : { opacity: [0, 1], y: [6, 0] }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header row — same typography as GameRail's so the page
          rhythm stays consistent. */}
      <div className="flex items-center justify-between pb-[10px]">
        <h2 className="text-[18px] font-extrabold text-[var(--mrq-blue)]">
          {title}
        </h2>
        {showSeeAll && (
          <button
            type="button"
            className="text-[14px] font-extrabold text-[var(--mrq-blue)]"
          >
            {seeAllLabel}
          </button>
        )}
      </div>

      {/* Row of equal-width tiles — flex-1 + aspect-square so the
          tile size adapts to whatever fits across the page minus
          the 8px inter-tile gaps. */}
      <div className="flex gap-[8px]">
        {items.map((item, i) => (
          <RecentlyPlayedTile key={`${item.src}-${i}`} game={item} />
        ))}
      </div>
    </motion.section>
  );
}

function RecentlyPlayedTile({ game }: { game: RecentlyPlayedGame }) {
  const router = useRouter();
  // Catalogue href as a fallback so titles in the catalogue route
  // even when the caller didn't pass an explicit href.
  const href = game.href ?? getGameDetails(game.name, game.src).href;

  return (
    <button
      type="button"
      aria-label={game.name}
      onClick={() => {
        if (href) {
          router.push(href);
          return;
        }
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.log("[RecentlyPlayed] open game →", game.name);
        }
      }}
      className="relative flex-1 aspect-square overflow-hidden rounded-[10px] active:scale-[0.98] transition-transform"
      style={{
        boxShadow: "0 4px 12px -4px rgba(10, 46, 203, 0.18)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={game.src}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />
    </button>
  );
}
