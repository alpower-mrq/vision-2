"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SwipeableHero, type HeroGame } from "../SwipeableHero";
import { GameRail } from "@/components/rails/GameRail";
import { Top10Rail } from "@/components/rails/Top10Rail";
import { CategoriesSheet } from "../CategoriesSheet";
import {
  CATEGORIES,
  CATEGORY_RAIL_TILES,
  tileSet,
} from "@/lib/casino-categories";

/**
 * Casino homepage — the curated landing page for the Casino vertical.
 *
 *   ┌──────────────────────────────────────┐
 *   │  ←                          £113.59 ▢│  ← BrandBar (back arrow only)
 *   ├──────────────────────────────────────┤
 *   │  Casino                 Categories+  │  ← In-page header
 *   ├──────────────────────────────────────┤
 *   │  ┌────────────────────────────────┐  │
 *   │  │  [hero artwork]                │  │  ← Swipeable hero
 *   │  └────────────────────────────────┘  │
 *   ├──────────────────────────────────────┤
 *   │  Top 10 Casino Games                 │
 *   │  ⓵▢ ⓶▢ ⓷▢ ⓸▢ ⓹▢ …                  │  ← Top 10 rail
 *   │  New                      See all    │
 *   │  ▢▢▢▢▢▢…                            │  ← Per-category rails
 *   │  Jackpot                  See all    │
 *   │  ▢▢▢▢▢▢…                            │
 *   │  …                                   │
 *   └──────────────────────────────────────┘
 *
 * "Categories+" opens the CategoriesSheet — every row inside is a real
 * navigation:
 *   • Sub-category key → /casino/[key]
 *   • "All games"      → /casino/games
 *
 * Because the casino homepage isn't itself "All games" or any single
 * sub-category, the sheet opens with NO row highlighted when launched
 * from here. Each rail's "See all" also drops the user on the
 * dedicated category page.
 */

const HERO_DECK: HeroGame[] = [
  {
    src: "/assets/games/birds-on-a-wire.png",
    alt: "Birds on a Wire",
    title: "Birds on a Wire",
    rtp: "96.91%",
    exclusive: true,
  },
  {
    src: "/assets/games/south-park.png",
    alt: "South Park",
    title: "South Park",
    rtp: "96.55%",
  },
  {
    src: "/assets/games/fruit-warp.png",
    alt: "Fruit Warp",
    title: "Fruit Warp",
    rtp: "97%",
    exclusive: true,
  },
  {
    src: "/assets/games/wild-swarm.png",
    alt: "Wild Swarm",
    title: "Wild Swarm",
    rtp: "96.32%",
  },
];

// Top 10 — cross-category curated feed.
const TOP_10 = tileSet([1, 4, 7, 2, 9, 11, 13, 5, 8, 3], "Top 10");

export function CasinoView() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Sheet selection — both branches navigate, no local filter state.
  const handleSelect = (key: string | null) => {
    setSheetOpen(false);
    router.push(key === null ? "/casino/games" : `/casino/${key}`);
  };

  return (
    <>
      {/* In-page header: title on the left, Categories CTA on the right.
          The casino homepage isn't itself a category, so the pill
          stays as plain "Categories+" — no pluralised state. */}
      <div className="flex items-center justify-between px-[16px] pt-[16px] pb-[18px]">
        <h1 className="text-[28px] font-extrabold leading-none text-[var(--mrq-blue-dark)]">
          Casino
        </h1>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          // Matches Figma 177:35024: 30px tall, 4px rounded rect (NOT
          // a pill), pale blue/200 fill, white extrabold label.
          className="h-[30px] px-[14px] rounded-[4px] text-[16px] font-extrabold text-white active:scale-[0.97] transition-transform"
          style={{ backgroundColor: "#9DABEA" }}
        >
          Categories+
        </button>
      </div>

      <div className="flex flex-col">
        {/* Tinder-style swipeable hero. */}
        <div className="pb-[24px]">
          <SwipeableHero games={HERO_DECK} />
        </div>

        {/* Top 10 — cross-category curated. */}
        <Top10Rail tiles={TOP_10} />

        {/* Every sub-category rail is always shown; "See all" drops
            the user on /casino/[key]. */}
        {CATEGORIES.map((cat) => (
          <GameRail
            key={cat.key}
            title={cat.label}
            tiles={CATEGORY_RAIL_TILES[cat.key] ?? []}
            tileWidth={109}
            tileHeight={109}
            onSeeAll={() => router.push(`/casino/${cat.key}`)}
          />
        ))}
      </div>

      <CategoriesSheet
        open={sheetOpen}
        // No row active when opening from the casino homepage — the
        // homepage isn't itself "All games" or any single sub-cat.
        selected={undefined}
        categories={CATEGORIES}
        onSelect={handleSelect}
        onClose={() => setSheetOpen(false)}
        title="Casino categories"
      />
    </>
  );
}
