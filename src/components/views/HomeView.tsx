import { HeroCarousel } from "@/components/carousel/HeroCarousel";
import { GameRail } from "@/components/rails/GameRail";
import { RecentlyPlayedGrid } from "@/components/rails/RecentlyPlayedGrid";

/**
 * Default lobby view — shown when no sub-filter pill is selected.
 *
 * Order on the home feed:
 *   1. HeroCarousel        — promo cards (existing)
 *   2. RecentlyPlayedGrid  — 2-column grid of recently-played games
 *                             (NEW; different layout to the rails)
 *   3. GameRail × N        — horizontal scrolling tile rails
 *
 * The grid above the rails gives the user a quick way back into games
 * they've already played, without having to scroll the horizontal
 * rails to find them. Visually it also breaks up the rhythm — three
 * rails in a row felt repetitive.
 */
const G = (i: number, alt: string) => ({
  src: `/assets/games/slot-${String(i).padStart(2, "0")}.png`,
  alt,
});

const PICKED_FOR_YOU = [
  G(1, "Slot game 1"),
  G(2, "Slot game 2"),
  G(3, "Slot game 3"),
  G(4, "Starburst"),
  G(5, "Slot game 5"),
  G(6, "Slot game 6"),
  G(7, "Slot game 7"),
];

const RECENTLY_PLAYED_GRID = [
  { src: "/assets/games/slot-04.png", name: "Jewel Stepper" },
  { src: "/assets/games/slot-08.png", name: "Tiki Tumble" },
  { src: "/assets/games/slot-01.png", name: "Buffalo Bills" },
  { src: "/assets/games/slot-13.png", name: "Big Bass Bonanza" },
];

const EXPLORE_GAMEPLAYS = [
  G(3, "Slot game 3"),
  G(5, "Slot game 5"),
  G(8, "Slot game 8"),
  G(13, "Slot game 13"),
  G(12, "Slot game 12"),
];

const FRESH_FROM_Q = [
  G(6, "Slot game 6"),
  G(4, "Starburst"),
  G(5, "Slot game 5"),
  G(7, "Slot game 7"),
  G(1, "Slot game 1"),
  G(2, "Slot game 2"),
  G(3, "Slot game 3"),
];

export function HomeView() {
  return (
    <>
      <HeroCarousel />
      <RecentlyPlayedGrid items={RECENTLY_PLAYED_GRID} />
      <GameRail
        title="Picked For You, By Q"
        tiles={PICKED_FOR_YOU}
        tileWidth={109}
        tileHeight={164}
      />
      <GameRail
        title="Explore gameplays"
        tiles={EXPLORE_GAMEPLAYS}
        tileWidth={57}
        tileHeight={85}
      />
      <GameRail
        title="Fresh from Q"
        tiles={FRESH_FROM_Q}
        tileWidth={109}
        tileHeight={164}
      />
    </>
  );
}
