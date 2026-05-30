"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SwipeableHero, type HeroGame } from "../SwipeableHero";
import { GameRail } from "@/components/rails/GameRail";
import { Top10Rail } from "@/components/rails/Top10Rail";
import { CategoriesSheet } from "../CategoriesSheet";
import { ChevronDownIcon } from "../CategoryChevron";
import {
  LIVE_CATEGORIES,
  LIVE_CATEGORY_RAIL_TILES,
  LIVE_TOP_10,
} from "@/lib/live-categories";

/**
 * Live Casino homepage — the curated landing page for the Live Casino
 * vertical. Mirrors CasinoView's structure so the two verticals read
 * as siblings: header + Categories+ pill, swipeable hero, Top 10
 * curated rail, then per-category rails.
 *
 *   ┌──────────────────────────────────────┐
 *   │  ←                          £113.59 ▢│  ← BrandBar (back arrow only)
 *   ├──────────────────────────────────────┤
 *   │  Live Casino            Categories+  │  ← In-page header
 *   ├──────────────────────────────────────┤
 *   │  ┌────────────────────────────────┐  │
 *   │  │  [hero artwork]                │  │  ← Swipeable hero
 *   │  └────────────────────────────────┘  │
 *   ├──────────────────────────────────────┤
 *   │  Top 10 Live Games                   │
 *   │  ⓵▢ ⓶▢ ⓷▢ ⓸▢ ⓹▢ …                  │  ← Top 10 rail
 *   │  Roulette                 See all    │
 *   │  ▢▢▢▢▢▢…                            │  ← Per-category rails
 *   │  Blackjack                See all    │
 *   │  ▢▢▢▢▢▢…                            │
 *   │  …                                   │
 *   └──────────────────────────────────────┘
 *
 * Differences from Casino:
 *   • Hero deck uses real live-table titles (Lightning Roulette, Crazy
 *     Time, Mega Wheel, Blackjack VIP). The hero card itself doesn't
 *     route anywhere yet — no /play/<live-game> routes exist — but the
 *     details sheet still opens via the info chip.
 *   • Top 10 title geo-located to "St Albans" same as Casino so the
 *     copy reads consistently across the two verticals.
 *   • Sub-categories are Roulette / Blackjack / Baccarat / Game Shows /
 *     Poker / Mega Wheel — the Live-specific facet set.
 */

const HERO_DECK: HeroGame[] = [
  {
    src: "/assets/live/popular-01.png",
    alt: "Lightning Roulette",
    title: "Lightning Roulette",
    rtp: "97.30%",
    exclusive: true,
    volatility: "Medium",
    maxWin: "500x",
    betRange: "£0.20–£500",
    gameType: "Roulette",
    provider: "Evolution",
  },
  {
    src: "/assets/live/popular-02.png",
    alt: "Crazy Time",
    title: "Crazy Time",
    rtp: "96.08%",
    volatility: "High",
    maxWin: "20,000x",
    betRange: "£0.10–£1,000",
    gameType: "Game show",
    provider: "Evolution",
  },
  {
    src: "/assets/live/table-01.png",
    alt: "Mega Wheel",
    title: "Mega Wheel",
    rtp: "96.51%",
    volatility: "Medium",
    maxWin: "500x",
    betRange: "£0.10–£500",
    gameType: "Game show",
    provider: "Pragmatic Play Live",
  },
  {
    src: "/assets/live/table-02.png",
    alt: "Blackjack VIP",
    title: "Blackjack VIP",
    rtp: "99.28%",
    exclusive: true,
    volatility: "Low",
    maxWin: "—",
    betRange: "£5–£5,000",
    gameType: "Blackjack",
    provider: "Evolution",
  },
];

export function LiveCasinoView() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Sheet selection — both branches navigate, no local filter state.
  const handleSelect = (key: string | null) => {
    setSheetOpen(false);
    // Live doesn't have an "All games" page yet — fall back to the
    // first sub-category if a null pick happens. Saves the user
    // landing on a 404.
    router.push(key === null ? "/live/roulette" : `/live/${key}`);
  };

  return (
    <>
      {/* In-page header — same shape as Casino's. The Live Casino
          homepage isn't itself a category, so the pill stays as plain
          "Categories+" with no active state. */}
      <div className="flex items-center justify-between px-[16px] pt-[16px] pb-[18px]">
        <h1 className="text-[28px] font-extrabold leading-none text-[var(--mrq-blue-dark)]">
          Live Casino
        </h1>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          className="inline-flex items-center gap-[6px] h-[30px] pl-[14px] pr-[12px] rounded-full text-[16px] font-extrabold active:scale-[0.97] transition-transform"
          style={{
            backgroundColor: "#dee3f7",
            color: "var(--mrq-blue-dark)",
          }}
        >
          <span>Categories</span>
          <ChevronDownIcon size={14} />
        </button>
      </div>

      <div className="flex flex-col">
        {/* Tinder-style swipeable hero — real live-table titles in the
            deck so the prototype shows what kind of content lives in
            this vertical, not just generic art. */}
        <div className="pb-[24px]">
          <SwipeableHero games={HERO_DECK} />
        </div>

        {/* Top 10 — curated cross-category live games. */}
        <Top10Rail title="Top 10 Live Games in St Albans" tiles={LIVE_TOP_10} />

        {/* Per-category rails — always all shown. "See all" routes to
            the dedicated /live/[key] page. */}
        {LIVE_CATEGORIES.map((cat) => (
          <GameRail
            key={cat.key}
            title={cat.label}
            tiles={LIVE_CATEGORY_RAIL_TILES[cat.key] ?? []}
            tileWidth={109}
            tileHeight={109}
            onSeeAll={() => router.push(`/live/${cat.key}`)}
          />
        ))}
      </div>

      <CategoriesSheet
        open={sheetOpen}
        // No row active when opening from the live-casino homepage —
        // homepage isn't itself any single sub-category.
        selected={undefined}
        categories={LIVE_CATEGORIES}
        onSelect={handleSelect}
        onClose={() => setSheetOpen(false)}
        title="Live Casino Categories"
        // No "All games" landing exists for Live yet — hide the row
        // so the sheet only lists real navigable destinations.
        hideAllGames
      />
    </>
  );
}
