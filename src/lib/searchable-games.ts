/**
 * Unified, cross-vertical searchable catalogue.
 *
 * The search page used to only know about casino slots. But MrQ spans
 * four verticals — Casino, Live Casino, Bingo and Arena — and a player
 * filtering by RTP / provider / stake should be able to scope across
 * (or into) any of them. This module assembles ONE flat list of
 * `SearchableGame` records, each tagged with a `category`, so the
 * filter bar can gate + narrow over everything from a single source.
 *
 * Data provenance:
 *   • Casino     — the real slot catalogue (games-catalogue.ts).
 *   • Live Casino — real MrQ live titles (Lightning Roulette, Crazy
 *                   Time, Mega Wheel, plus table games) with live-game
 *                   RTPs and studio providers.
 *   • Bingo      — the five production bingo rooms (bingo-rooms.ts).
 *                   Bingo has no RTP, so rtpValue is left undefined and
 *                   the stake comes from the ticket price.
 *   • Arena      — casino slots that are eligible for the Arena
 *                   leaderboard mode.
 *
 * RTP is OPTIONAL here on purpose: bingo rooms genuinely don't have an
 * RTP, so any RTP filter naturally excludes them (see game-filters).
 */

import { getAllGames } from "@/lib/games-catalogue";
import { BINGO_ROOMS } from "@/lib/bingo-rooms";

export const GAME_CATEGORIES = [
  "Casino",
  "Live Casino",
  "Bingo",
  "Arena",
] as const;

export type GameCategory = (typeof GAME_CATEGORIES)[number];

export type SearchableGame = {
  name: string;
  src: string;
  href?: string;
  category: GameCategory;
  provider: string;
  /** "Slot", "Roulette", "Blackjack", "Game show", "Bingo room"… */
  gameType: string;
  /** Display RTP, e.g. "96.5%". Undefined where it doesn't apply (bingo). */
  rtp?: string;
  /** Numeric RTP for filtering/sorting. Undefined where N/A. */
  rtpValue?: number;
  volatility?: string;
  /** Display stake range, e.g. "£0.10–£100" or "10p per ticket". */
  betRange: string;
  minBet: number;
  maxBet: number;
};

// ---- Casino (real slot catalogue) ---------------------------------------
const CASINO: SearchableGame[] = getAllGames().map((g) => ({
  name: g.name,
  src: g.src,
  href: g.href,
  category: "Casino",
  provider: g.provider,
  gameType: g.gameType,
  rtp: g.rtp,
  rtpValue: g.rtpValue,
  volatility: g.volatility,
  betRange: g.betRange,
  minBet: g.minBet,
  maxBet: g.maxBet,
}));

// ---- Live Casino --------------------------------------------------------
// Live games carry an RTP too, but no "volatility" in the slot sense.
const LIVE_CASINO: SearchableGame[] = [
  {
    name: "Lightning Roulette",
    src: "/assets/live/popular-01.png",
    category: "Live Casino",
    provider: "Evolution",
    gameType: "Roulette",
    rtp: "97.30%",
    rtpValue: 97.3,
    betRange: "£0.20–£500",
    minBet: 0.2,
    maxBet: 500,
  },
  {
    name: "Crazy Time",
    src: "/assets/live/popular-02.png",
    category: "Live Casino",
    provider: "Evolution",
    gameType: "Game show",
    rtp: "96.08%",
    rtpValue: 96.08,
    betRange: "£0.10–£1,000",
    minBet: 0.1,
    maxBet: 1000,
  },
  {
    name: "Lightning Dice",
    src: "/assets/live/popular-03.png",
    category: "Live Casino",
    provider: "Evolution",
    gameType: "Game show",
    rtp: "96.21%",
    rtpValue: 96.21,
    betRange: "£0.10–£500",
    minBet: 0.1,
    maxBet: 500,
  },
  {
    name: "Mega Wheel",
    src: "/assets/live/table-01.png",
    category: "Live Casino",
    provider: "Pragmatic Play Live",
    gameType: "Game show",
    rtp: "96.51%",
    rtpValue: 96.51,
    betRange: "£0.10–£500",
    minBet: 0.1,
    maxBet: 500,
  },
  {
    name: "Blackjack VIP",
    src: "/assets/live/table-02.png",
    category: "Live Casino",
    provider: "Evolution",
    gameType: "Blackjack",
    rtp: "99.28%",
    rtpValue: 99.28,
    betRange: "£5–£5,000",
    minBet: 5,
    maxBet: 5000,
  },
  {
    name: "Speed Baccarat",
    src: "/assets/live/table-03.png",
    category: "Live Casino",
    provider: "Pragmatic Play Live",
    gameType: "Baccarat",
    rtp: "98.94%",
    rtpValue: 98.94,
    betRange: "£1–£2,500",
    minBet: 1,
    maxBet: 2500,
  },
  {
    name: "Auto Roulette",
    src: "/assets/live/table-04.png",
    category: "Live Casino",
    provider: "Pragmatic Play Live",
    gameType: "Roulette",
    rtp: "97.30%",
    rtpValue: 97.3,
    betRange: "£0.10–£1,000",
    minBet: 0.1,
    maxBet: 1000,
  },
  // -------- Expansion so the filter set covers more live tables --------
  { name: "Immersive Roulette",      src: "/assets/live/popular-01.png", category: "Live Casino", provider: "Evolution",          gameType: "Roulette",  rtp: "97.30%", rtpValue: 97.3,  betRange: "£0.20–£1,000", minBet: 0.2, maxBet: 1000 },
  { name: "Speed Roulette",          src: "/assets/live/popular-02.png", category: "Live Casino", provider: "Evolution",          gameType: "Roulette",  rtp: "97.30%", rtpValue: 97.3,  betRange: "£0.20–£500",   minBet: 0.2, maxBet: 500 },
  { name: "American Roulette Live",  src: "/assets/live/popular-03.png", category: "Live Casino", provider: "Evolution",          gameType: "Roulette",  rtp: "94.70%", rtpValue: 94.7,  betRange: "£0.20–£500",   minBet: 0.2, maxBet: 500 },
  { name: "Lightning Blackjack",     src: "/assets/live/table-01.png",   category: "Live Casino", provider: "Evolution",          gameType: "Blackjack", rtp: "99.50%", rtpValue: 99.5,  betRange: "£1–£2,500",    minBet: 1,   maxBet: 2500 },
  { name: "Free Bet Blackjack",      src: "/assets/live/table-02.png",   category: "Live Casino", provider: "Evolution",          gameType: "Blackjack", rtp: "98.45%", rtpValue: 98.45, betRange: "£5–£1,000",    minBet: 5,   maxBet: 1000 },
  { name: "Speed Blackjack",         src: "/assets/live/table-03.png",   category: "Live Casino", provider: "Evolution",          gameType: "Blackjack", rtp: "99.29%", rtpValue: 99.29, betRange: "£5–£5,000",    minBet: 5,   maxBet: 5000 },
  { name: "Power Blackjack",         src: "/assets/live/table-04.png",   category: "Live Casino", provider: "Evolution",          gameType: "Blackjack", rtp: "99.55%", rtpValue: 99.55, betRange: "£5–£2,500",    minBet: 5,   maxBet: 2500 },
  { name: "Baccarat Squeeze",        src: "/assets/live/table-01.png",   category: "Live Casino", provider: "Evolution",          gameType: "Baccarat",  rtp: "98.94%", rtpValue: 98.94, betRange: "£1–£5,000",    minBet: 1,   maxBet: 5000 },
  { name: "No Commission Baccarat",  src: "/assets/live/table-02.png",   category: "Live Casino", provider: "Evolution",          gameType: "Baccarat",  rtp: "98.76%", rtpValue: 98.76, betRange: "£1–£2,500",    minBet: 1,   maxBet: 2500 },
  { name: "Monopoly Live",           src: "/assets/live/popular-02.png", category: "Live Casino", provider: "Evolution",          gameType: "Game show", rtp: "96.23%", rtpValue: 96.23, betRange: "£0.10–£1,000", minBet: 0.1, maxBet: 1000 },
  { name: "Dream Catcher",           src: "/assets/live/popular-03.png", category: "Live Casino", provider: "Evolution",          gameType: "Game show", rtp: "96.58%", rtpValue: 96.58, betRange: "£0.10–£500",   minBet: 0.1, maxBet: 500 },
  { name: "Deal or No Deal Live",    src: "/assets/live/popular-01.png", category: "Live Casino", provider: "Evolution",          gameType: "Game show", rtp: "95.42%", rtpValue: 95.42, betRange: "£0.10–£500",   minBet: 0.1, maxBet: 500 },
  { name: "Boom City",               src: "/assets/live/table-03.png",   category: "Live Casino", provider: "Pragmatic Play Live", gameType: "Game show", rtp: "96.27%", rtpValue: 96.27, betRange: "£0.10–£500",   minBet: 0.1, maxBet: 500 },
  { name: "Sweet Bonanza CandyLand", src: "/assets/live/table-04.png",   category: "Live Casino", provider: "Pragmatic Play Live", gameType: "Game show", rtp: "96.48%", rtpValue: 96.48, betRange: "£0.10–£500",   minBet: 0.1, maxBet: 500 },
  { name: "Mega Ball",               src: "/assets/live/popular-02.png", category: "Live Casino", provider: "Evolution",          gameType: "Game show", rtp: "95.40%", rtpValue: 95.4,  betRange: "£0.20–£500",   minBet: 0.2, maxBet: 500 },
];

// ---- Bingo (no RTP — stake is the ticket price) -------------------------
function ticketToBet(ticket: string): { min: number; display: string } {
  const t = ticket.trim().toUpperCase();
  if (t === "FREE") return { min: 0, display: "Free to play" };
  // "10P" / "1P" / "25P" → pence; "£X" → pounds
  if (t.endsWith("P")) {
    const pence = Number(t.replace(/[^0-9.]/g, ""));
    return { min: pence / 100, display: `${ticket} per ticket` };
  }
  const pounds = Number(t.replace(/[^0-9.]/g, ""));
  return { min: pounds, display: `${ticket} per ticket` };
}

const BINGO: SearchableGame[] = BINGO_ROOMS.map((r) => {
  const { min, display } = ticketToBet(r.ticketPrice);
  return {
    name: r.name,
    src: r.image,
    href: "/bingo",
    category: "Bingo",
    provider: "MrQ Bingo",
    gameType: `${r.ballCount}-ball bingo`,
    // rtp / rtpValue intentionally omitted — bingo has no RTP.
    betRange: display,
    minBet: min,
    maxBet: min,
  };
});

// ---- Arena (slots eligible for the leaderboard mode) --------------------
const ARENA: SearchableGame[] = [
  {
    name: "Buffalo Bills — Arena",
    src: "/assets/arena/eligible-1.png",
    href: "/arena",
    category: "Arena",
    provider: "Goosicorn",
    gameType: "Arena slot",
    rtp: "94%",
    rtpValue: 94,
    volatility: "Medium",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
  },
  {
    name: "Snake Arena — Arena",
    src: "/assets/arena/eligible-2.png",
    href: "/arena",
    category: "Arena",
    provider: "Relax Gaming",
    gameType: "Arena slot",
    rtp: "95.80%",
    rtpValue: 95.8,
    volatility: "High",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
  },
  {
    name: "Big Bass Splash — Arena",
    src: "/assets/arena/eligible-3.png",
    href: "/arena",
    category: "Arena",
    provider: "Pragmatic Play",
    gameType: "Arena slot",
    rtp: "96.71%",
    rtpValue: 96.71,
    volatility: "Medium",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
  },
  {
    name: "Money Train — Arena",
    src: "/assets/arena/eligible-4.png",
    href: "/arena",
    category: "Arena",
    provider: "Relax Gaming",
    gameType: "Arena slot",
    rtp: "98%",
    rtpValue: 98,
    volatility: "High",
    betRange: "£0.10–£20",
    minBet: 0.1,
    maxBet: 20,
  },
  // -------- Expansion so Arena has its own filterable population --------
  { name: "Tiki Tumble — Arena",       src: "/assets/arena/eligible-5.png", href: "/arena", category: "Arena", provider: "Quickspin",       gameType: "Arena slot", rtp: "96.55%", rtpValue: 96.55, volatility: "Medium", betRange: "£0.20–£250", minBet: 0.2,  maxBet: 250 },
  { name: "Jewel Stepper — Arena",     src: "/assets/arena/eligible-6.png", href: "/arena", category: "Arena", provider: "Microgaming",     gameType: "Arena slot", rtp: "96.30%", rtpValue: 96.3,  volatility: "Low",    betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100 },
  { name: "Maze Escape — Arena",       src: "/assets/arena/eligible-1.png", href: "/arena", category: "Arena", provider: "Hacksaw Gaming",  gameType: "Arena slot", rtp: "96.20%", rtpValue: 96.2,  volatility: "Medium", betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100 },
  { name: "Mummy Mania — Arena",       src: "/assets/arena/eligible-2.png", href: "/arena", category: "Arena", provider: "Yggdrasil",       gameType: "Arena slot", rtp: "96.10%", rtpValue: 96.1,  volatility: "Medium", betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100 },
  { name: "Western Gold — Arena",      src: "/assets/arena/eligible-3.png", href: "/arena", category: "Arena", provider: "Pragmatic Play",  gameType: "Arena slot", rtp: "96.05%", rtpValue: 96.05, volatility: "Medium", betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100 },
  { name: "Golden Catch — Arena",      src: "/assets/arena/eligible-4.png", href: "/arena", category: "Arena", provider: "Yggdrasil",       gameType: "Arena slot", rtp: "96.50%", rtpValue: 96.5,  volatility: "Medium", betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100 },
  { name: "Birds on a Wire — Arena",   src: "/assets/arena/eligible-5.png", href: "/arena", category: "Arena", provider: "Thunderkick",     gameType: "Arena slot", rtp: "96.91%", rtpValue: 96.91, volatility: "High",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100 },
  { name: "Fruit Warp — Arena",        src: "/assets/arena/eligible-6.png", href: "/arena", category: "Arena", provider: "Thunderkick",     gameType: "Arena slot", rtp: "97%",    rtpValue: 97,    volatility: "Medium", betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100 },
  { name: "Wild Swarm — Arena",        src: "/assets/arena/eligible-1.png", href: "/arena", category: "Arena", provider: "Push Gaming",     gameType: "Arena slot", rtp: "96.32%", rtpValue: 96.32, volatility: "High",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100 },
  { name: "Razor Returns — Arena",     src: "/assets/arena/eligible-2.png", href: "/arena", category: "Arena", provider: "Push Gaming",     gameType: "Arena slot", rtp: "96.32%", rtpValue: 96.32, volatility: "High",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100 },
];

export const SEARCHABLE_GAMES: SearchableGame[] = [
  ...CASINO,
  ...LIVE_CASINO,
  ...BINGO,
  ...ARENA,
];

/** Distinct providers across every vertical, alphabetical. */
export function getAllProviders(): string[] {
  return Array.from(new Set(SEARCHABLE_GAMES.map((g) => g.provider))).sort(
    (a, b) => a.localeCompare(b),
  );
}
