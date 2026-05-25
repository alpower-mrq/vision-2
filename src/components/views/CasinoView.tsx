"use client";

import { CategoryTabs } from "../CategoryTabs";
import { SwipeableHero, type HeroGame } from "../SwipeableHero";
import { GameRail } from "@/components/rails/GameRail";

/**
 * Casino category page.
 *
 *   ┌──────────────────────────────────────┐
 *   │  ← Casino                  £113.59 ▢ │  ← BrandBar (shared)
 *   ├──────────────────────────────────────┤
 *   │  Home  Featured  New  Jackpot  …    │  ← CategoryTabs (sticky)
 *   ├──────────────────────────────────────┤
 *   │  ┌────────────────────────────────┐  │
 *   │  │  exclusive   [hero artwork]    │  │
 *   │  │              ⓘ ♡ ▶︎            │  │  ← Swipeable hero
 *   │  │  Buffalo Bills · RTP 95%      │  │
 *   │  └────────────────────────────────┘  │
 *   ├──────────────────────────────────────┤
 *   │  Recently played Casino    Show all  │
 *   │  ▢▢▢▢▢▢…                            │  ← Game rails
 *   └──────────────────────────────────────┘
 *
 * The sub-tabs (Home / Featured / New / …) are visual + state-only
 * for now — they don't change the rails yet. Real per-tab content is
 * a follow-up; the scaffold's job is to land the chrome.
 */

const CASINO_TABS = [
  "Home",
  "Featured",
  "New",
  "Jackpot",
  "Megaways",
  "Slingo",
  "Tables",
  "Live",
];

// Build the swipeable hero deck. Only the slot-XX images are used
// because they share the 2:3 portrait aspect (320×480 or 640×960)
// the SwipeableHero card is sized for — landscape promo art
// (south-park, fruit-warp, birds-on-a-wire) and squares (wild-swarm)
// got visibly cropped under `object-cover`. Drop those until we have
// matching cinematic 2:3 hero artwork for each game.
const HERO_DECK: HeroGame[] = [
  {
    src: "/assets/games/slot-01.png",
    alt: "Buffalo Bills Hypercharged",
    title: "Buffalo Bills",
    rtp: "95%",
    exclusive: true,
  },
  {
    src: "/assets/games/slot-04.png",
    alt: "Jewel Stepper",
    title: "Jewel Stepper",
    rtp: "96.5%",
  },
  {
    src: "/assets/games/slot-08.png",
    alt: "Tiki Tumble",
    title: "Tiki Tumble",
    rtp: "96%",
    exclusive: true,
  },
  {
    src: "/assets/games/slot-11.png",
    alt: "Maze Escape",
    title: "Maze Escape",
    rtp: "97.5%",
  },
  {
    src: "/assets/games/slot-13.png",
    alt: "Dragon Hoard",
    title: "Dragon Hoard",
    rtp: "96.85%",
    exclusive: true,
  },
];

const RECENTLY_PLAYED = [1, 2, 3, 4, 5, 6, 7].map((i) => ({
  src: `/assets/games/slot-${String(i).padStart(2, "0")}.png`,
  alt: `Recently played ${i}`,
}));

const FEATURED = [8, 9, 10, 11, 12, 13, 1].map((i) => ({
  src: `/assets/games/slot-${String(i).padStart(2, "0")}.png`,
  alt: `Featured ${i}`,
}));

const CLASSICS = [3, 5, 7, 2, 4, 6, 8].map((i) => ({
  src: `/assets/games/slot-${String(i).padStart(2, "0")}.png`,
  alt: `Classic ${i}`,
}));

export function CasinoView() {
  return (
    <>
      <CategoryTabs tabs={CASINO_TABS} defaultTab="Home" />

      <div className="pt-[16px] flex flex-col gap-[18px]">
        {/* Tinder-style swipeable hero. Sits with a small horizontal
            inset so the card looks lifted off the page canvas. */}
        <div className="px-[12px]">
          <SwipeableHero games={HERO_DECK} />
        </div>

        {/* Game rails — small square thumbs. GameRail handles its own
            internal drag-to-scroll. */}
        <GameRail
          title="Recently played Casino"
          tiles={RECENTLY_PLAYED}
          tileWidth={109}
          tileHeight={109}
        />
        <GameRail
          title="Featured slots"
          tiles={FEATURED}
          tileWidth={109}
          tileHeight={109}
        />
        <GameRail
          title="Casino classics"
          tiles={CLASSICS}
          tileWidth={109}
          tileHeight={109}
        />
      </div>
    </>
  );
}
