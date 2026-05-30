/**
 * Search filter model + pure helpers.
 *
 * The search page composes three things into one result list:
 *   1. the free-text query (substring match on game name)
 *   2. the active facet filters (provider, RTP, volatility, stakes, type)
 *   3. a sort order
 *
 * Keeping the filter shape and the apply/count logic here (pure, no
 * React) means the search page just holds state and renders — the
 * actual narrowing is testable in isolation and easy to reason about.
 */

import type { GameDetails } from "@/lib/games-catalogue";

export type SortKey =
  | "relevance"
  | "rtp-desc"
  | "rtp-asc"
  | "name-asc"
  | "maxwin-desc";

export const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "relevance", label: "Most relevant" },
  { key: "rtp-desc", label: "Highest RTP" },
  { key: "rtp-asc", label: "Lowest RTP" },
  { key: "maxwin-desc", label: "Biggest max win" },
  { key: "name-asc", label: "A–Z" },
];

export const VOLATILITY_OPTIONS = ["Low", "Medium", "High"] as const;

/** RTP bands — "minimum RTP" thresholds. Picking 96%+ keeps games whose
 *  rtpValue is at least 96. `null` means no RTP floor. */
export const RTP_BANDS: Array<{ value: number | null; label: string }> = [
  { value: null, label: "Any RTP" },
  { value: 95, label: "95%+" },
  { value: 96, label: "96%+" },
  { value: 97, label: "97%+" },
];

/** "Min wager" facet — show games you can stake at or below this amount,
 *  i.e. game.minBet <= value. Lets a low-stakes player rule out games
 *  that force a bigger minimum bet. */
export const MIN_BET_OPTIONS: Array<{ value: number | null; label: string }> = [
  { value: null, label: "Any" },
  { value: 0.1, label: "10p or less" },
  { value: 0.2, label: "20p or less" },
  { value: 0.5, label: "50p or less" },
];

/** "Max wager" facet — show games that allow staking at least this much,
 *  i.e. game.maxBet >= value. Gives high rollers the headroom they want. */
export const MAX_BET_OPTIONS: Array<{ value: number | null; label: string }> = [
  { value: null, label: "Any" },
  { value: 100, label: "£100+" },
  { value: 250, label: "£250+" },
  { value: 400, label: "£400+" },
];

export type GameFilters = {
  providers: string[];
  volatility: string[];
  gameTypes: string[];
  /** Keep games with rtpValue >= minRtp. */
  minRtp: number | null;
  /** Keep games whose minimum stake is <= this (cheap to play). */
  minBetUpTo: number | null;
  /** Keep games whose maximum stake is >= this (high-roller headroom). */
  maxBetAtLeast: number | null;
};

export const EMPTY_FILTERS: GameFilters = {
  providers: [],
  volatility: [],
  gameTypes: [],
  minRtp: null,
  minBetUpTo: null,
  maxBetAtLeast: null,
};

/** Number of filter GROUPS currently active — drives the badge on the
 *  Filters button. (A group counts once no matter how many values are
 *  selected inside it.) */
export function countActiveFilters(f: GameFilters): number {
  let n = 0;
  if (f.providers.length) n++;
  if (f.volatility.length) n++;
  if (f.gameTypes.length) n++;
  if (f.minRtp != null) n++;
  if (f.minBetUpTo != null) n++;
  if (f.maxBetAtLeast != null) n++;
  return n;
}

export function hasAnyFilter(f: GameFilters): boolean {
  return countActiveFilters(f) > 0;
}

/** Parse "5,000x" → 5000 for max-win sorting. */
function maxWinToNumber(maxWin: string): number {
  const n = Number(maxWin.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Apply text query + facet filters + sort. Pure: returns a new array. */
export function applyFilters(
  games: GameDetails[],
  query: string,
  filters: GameFilters,
  sort: SortKey,
): GameDetails[] {
  const q = query.trim().toLowerCase();

  const filtered = games.filter((g) => {
    if (q && !g.name.toLowerCase().includes(q)) return false;
    if (filters.providers.length && !filters.providers.includes(g.provider))
      return false;
    if (filters.volatility.length && !filters.volatility.includes(g.volatility))
      return false;
    if (filters.gameTypes.length && !filters.gameTypes.includes(g.gameType))
      return false;
    if (filters.minRtp != null && g.rtpValue < filters.minRtp) return false;
    if (filters.minBetUpTo != null && g.minBet > filters.minBetUpTo)
      return false;
    if (filters.maxBetAtLeast != null && g.maxBet < filters.maxBetAtLeast)
      return false;
    return true;
  });

  const sorted = [...filtered];
  switch (sort) {
    case "rtp-desc":
      sorted.sort((a, b) => b.rtpValue - a.rtpValue);
      break;
    case "rtp-asc":
      sorted.sort((a, b) => a.rtpValue - b.rtpValue);
      break;
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "maxwin-desc":
      sorted.sort((a, b) => maxWinToNumber(b.maxWin) - maxWinToNumber(a.maxWin));
      break;
    case "relevance":
    default:
      // Leave in catalogue order; if there's a query, surface
      // prefix matches ahead of mid-string matches.
      if (q) {
        sorted.sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
          const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
          return aStarts - bStarts;
        });
      }
      break;
  }
  return sorted;
}
