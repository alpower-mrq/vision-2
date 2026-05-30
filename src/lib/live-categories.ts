/**
 * Shared Live Casino sub-category catalogue.
 *
 * Mirrors the structure of casino-categories.ts so the /live vertical
 * page and its /live/[category] sub-routes can be wired off the same
 * source of truth — one place to add a category and it picks up:
 *
 *   • the Categories+ bottom sheet on /live
 *   • the per-category rails on /live
 *   • the validated slugs for /live/[category]
 *   • the bigger grid on each /live/[category] page
 *
 * Lives outside any "use client" file so both the dynamic-route server
 * file and the client views can import from it.
 */

import type { Category } from "@/components/CategoriesSheet";

export const LIVE_CATEGORIES: Category[] = [
  { key: "roulette", label: "Roulette" },
  { key: "blackjack", label: "Blackjack" },
  { key: "baccarat", label: "Baccarat" },
  { key: "game-shows", label: "Game Shows" },
  { key: "poker", label: "Poker" },
  { key: "mega-wheel", label: "Mega Wheel" },
];

export const LIVE_CATEGORY_KEYS: string[] = LIVE_CATEGORIES.map((c) => c.key);

// Available live-casino artwork in /public/assets/live/. We have a
// finite set (4 "popular" + 5 "table" thumbs) so every tile-set cycles
// through these in a different shuffled order — the rails read as
// distinct categories even though the underlying art repeats.
const LIVE_ART: { src: string; alt: string }[] = [
  { src: "/assets/live/popular-01.png", alt: "Lightning Roulette" },
  { src: "/assets/live/popular-02.png", alt: "Crazy Time" },
  { src: "/assets/live/popular-03.png", alt: "Lightning Dice" },
  { src: "/assets/live/popular-04.png", alt: "Lightning Storm" },
  { src: "/assets/live/table-01.png", alt: "Mega Wheel" },
  { src: "/assets/live/table-02.png", alt: "Blackjack VIP" },
  { src: "/assets/live/table-03.png", alt: "Speed Baccarat" },
  { src: "/assets/live/table-04.png", alt: "Auto Roulette" },
  { src: "/assets/live/table-05.png", alt: "Immersive Roulette" },
];

/** Cycle through LIVE_ART by 1-indexed positions. Indexes can repeat
 *  past 9 — the helper wraps. */
export function liveTileSet(
  idxs: number[],
): { src: string; alt: string }[] {
  return idxs.map((i) => LIVE_ART[(i - 1) % LIVE_ART.length]);
}

/** Tiles for the small rails on the main /live page (7 per category). */
export const LIVE_CATEGORY_RAIL_TILES: Record<
  string,
  { src: string; alt: string }[]
> = {
  roulette: liveTileSet([1, 9, 8, 5, 2, 7, 4]),
  blackjack: liveTileSet([6, 2, 5, 9, 3, 1, 8]),
  baccarat: liveTileSet([7, 4, 1, 8, 6, 2, 9]),
  "game-shows": liveTileSet([2, 4, 5, 3, 8, 1, 6]),
  poker: liveTileSet([5, 6, 7, 2, 4, 9, 3]),
  "mega-wheel": liveTileSet([5, 1, 4, 8, 2, 6, 7]),
};

/** Bigger tiles for the per-category grid on /live/[category] (12). */
export const LIVE_CATEGORY_GRID_TILES: Record<
  string,
  { src: string; alt: string }[]
> = {
  roulette: liveTileSet([1, 9, 8, 5, 2, 7, 4, 3, 6, 1, 8, 9]),
  blackjack: liveTileSet([6, 2, 5, 9, 3, 1, 8, 7, 4, 2, 5, 6]),
  baccarat: liveTileSet([7, 4, 1, 8, 6, 2, 9, 3, 5, 4, 7, 1]),
  "game-shows": liveTileSet([2, 4, 5, 3, 8, 1, 6, 9, 7, 4, 2, 5]),
  poker: liveTileSet([5, 6, 7, 2, 4, 9, 3, 1, 8, 6, 5, 7]),
  "mega-wheel": liveTileSet([5, 1, 4, 8, 2, 6, 7, 9, 3, 1, 5, 4]),
};

/** Cross-category Top 10 — curated mix of the headline live titles. */
export const LIVE_TOP_10: { src: string; alt: string }[] = liveTileSet([
  1, 2, 5, 6, 7, 4, 8, 3, 9, 5,
]);
