/**
 * Lightweight catalogue of game metadata, keyed by name.
 *
 * The prototype's tile data is heterogeneous — some tiles know just
 * a `src` + `alt`/`name`, others carry richer hero metadata. The
 * GameDetailsSheet needs a consistent shape (rtp, volatility, etc.)
 * for every tile, so this catalogue:
 *
 *   • holds known metadata for the handful of "real" games in the
 *     prototype (Buffalo Bills, Tiki Tumble, etc.), and
 *   • falls back to sensible defaults for anything not registered.
 *
 * `getGameDetails(name, src)` is the single entry point — give it a
 * tile's name + image and it returns a complete GameDetails record
 * suitable for the sheet to render.
 */

export type GameDetails = {
  name: string;
  src: string;
  rtp: string;
  volatility: string;
  maxWin: string;
  betRange: string;
  gameType: string;
  provider: string;
  /** Optional destination for the sheet's Play CTA. When set, the
   *  Play button routes there; when unset, the button closes the
   *  sheet and logs a stub (the game isn't built out yet). */
  href?: string;
  /** Optional gameplay screenshot rendered inside the details sheet
   *  so the user can see what the game actually looks like before
   *  tapping Play. Optional per-game — games without a preview just
   *  skip the image block, no placeholder. */
  preview?: string;
};

type CatalogueEntry = Partial<Omit<GameDetails, "name">> & {
  name: string;
};

const CATALOGUE: CatalogueEntry[] = [
  {
    name: "Buffalo Bills",
    src: "/assets/games/slot-01.png",
    rtp: "94%",
    volatility: "Medium",
    maxWin: "5,000x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Goosicorn",
    href: "/play/buffalo-bills",
    preview: "/assets/games/game_demo.webp",
  },
  {
    name: "Tiki Tumble",
    src: "/assets/games/slot-08.png",
    rtp: "96.55%",
    volatility: "Medium",
    maxWin: "2,500x",
    betRange: "£0.20–£250",
    gameType: "Slot",
    provider: "Quickspin",
    preview: "/assets/games/game_demo2.jpeg",
  },
  {
    name: "Jewel Stepper",
    src: "/assets/games/slot-04.png",
    rtp: "96.30%",
    volatility: "Low",
    maxWin: "3,000x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Microgaming",
  },
  {
    name: "Snake Arena",
    src: "/assets/games/slot-13.png",
    rtp: "95.80%",
    volatility: "High",
    maxWin: "12,000x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Relax Gaming",
  },
  {
    name: "Maze Escape",
    src: "/assets/games/slot-11.png",
    rtp: "96.20%",
    volatility: "Medium",
    maxWin: "6,500x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Hacksaw Gaming",
  },
  {
    name: "Mummy Mania",
    src: "/assets/games/slot-07.png",
    rtp: "96.10%",
    volatility: "Medium",
    maxWin: "4,000x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Yggdrasil",
  },
  {
    name: "Western Gold",
    src: "/assets/games/slot-12.png",
    rtp: "96.05%",
    volatility: "Medium",
    maxWin: "5,000x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Pragmatic Play",
  },
  {
    name: "Golden Catch",
    src: "/assets/games/slot-09.png",
    rtp: "96.50%",
    volatility: "Medium",
    maxWin: "5,500x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Yggdrasil",
  },
  {
    name: "Big Bass Splash",
    src: "/assets/games/slot-03.png",
    rtp: "96.71%",
    volatility: "Medium",
    maxWin: "2,500x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Pragmatic Play",
  },
  {
    name: "Birds on a Wire",
    src: "/assets/games/birds-on-a-wire.png",
    rtp: "96.91%",
    volatility: "High",
    maxWin: "10,000x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Thunderkick",
  },
  {
    name: "Fruit Warp",
    src: "/assets/games/fruit-warp.png",
    rtp: "97%",
    volatility: "Medium",
    maxWin: "6,000x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Thunderkick",
  },
  {
    name: "Wild Swarm",
    src: "/assets/games/wild-swarm.png",
    rtp: "96.32%",
    volatility: "High",
    maxWin: "8,000x",
    betRange: "£0.10–£100",
    gameType: "Slot",
    provider: "Push Gaming",
  },
];

const DEFAULTS: Omit<GameDetails, "name" | "src"> = {
  rtp: "96.5%",
  volatility: "Medium",
  maxWin: "5,000x",
  betRange: "£0.10–£100",
  gameType: "Slot",
  provider: "Example Studios",
};

/** Build a full GameDetails record for any tile. Looks up by name
 *  first, then by src, falling back to defaults if neither is known. */
export function getGameDetails(name: string, src: string): GameDetails {
  const known =
    CATALOGUE.find((c) => c.name === name) ??
    CATALOGUE.find((c) => c.src === src);

  return {
    name,
    src,
    rtp: known?.rtp ?? DEFAULTS.rtp,
    volatility: known?.volatility ?? DEFAULTS.volatility,
    maxWin: known?.maxWin ?? DEFAULTS.maxWin,
    betRange: known?.betRange ?? DEFAULTS.betRange,
    gameType: known?.gameType ?? DEFAULTS.gameType,
    provider: known?.provider ?? DEFAULTS.provider,
    href: known?.href,
    // Forward the optional gameplay preview if the catalogue
    // carries one. Was being silently dropped before because the
    // return statement only listed the fields it knew about; the
    // src-fallback match for "Buffalo Bills Hypercharged" hit the
    // Buffalo Bills entry but the preview never made it through.
    preview: known?.preview,
  };
}
