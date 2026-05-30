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
  /** Numeric mirrors of the display strings above — these power the
   *  search filters & sort. `rtp`/`betRange` stay as pretty strings for
   *  rendering; these give us something reliable to compare against.
   *  - rtpValue: RTP as a plain number (e.g. 96.55)
   *  - minBet / maxBet: the bet range in £ (e.g. 0.10 and 100) */
  rtpValue: number;
  minBet: number;
  maxBet: number;
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
    rtpValue: 94,
    volatility: "Medium",
    maxWin: "5,000x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Goosicorn",
    href: "/play/buffalo-bills",
    preview: "/assets/games/game_demo.webp",
  },
  {
    name: "Tiki Tumble",
    src: "/assets/games/slot-08.png",
    rtp: "96.55%",
    rtpValue: 96.55,
    volatility: "Medium",
    maxWin: "2,500x",
    betRange: "£0.20–£250",
    minBet: 0.2,
    maxBet: 250,
    gameType: "Slot",
    provider: "Quickspin",
    preview: "/assets/games/game_demo2.jpeg",
  },
  {
    name: "Jewel Stepper",
    src: "/assets/games/slot-04.png",
    rtp: "96.30%",
    rtpValue: 96.3,
    volatility: "Low",
    maxWin: "3,000x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Microgaming",
    preview: "/assets/games/game_demo.webp",
  },
  {
    name: "Snake Arena",
    src: "/assets/games/slot-13.png",
    rtp: "95.80%",
    rtpValue: 95.8,
    volatility: "High",
    maxWin: "12,000x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Relax Gaming",
    preview: "/assets/games/game_demo2.jpeg",
  },
  {
    name: "Maze Escape",
    src: "/assets/games/slot-11.png",
    rtp: "96.20%",
    rtpValue: 96.2,
    volatility: "Medium",
    maxWin: "6,500x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Hacksaw Gaming",
    preview: "/assets/games/game_demo.webp",
  },
  {
    name: "Mummy Mania",
    src: "/assets/games/slot-07.png",
    rtp: "96.10%",
    rtpValue: 96.1,
    volatility: "Medium",
    maxWin: "4,000x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Yggdrasil",
    preview: "/assets/games/game_demo2.jpeg",
  },
  {
    name: "Western Gold",
    src: "/assets/games/slot-12.png",
    rtp: "96.05%",
    rtpValue: 96.05,
    volatility: "Medium",
    maxWin: "5,000x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Pragmatic Play",
    preview: "/assets/games/game_demo.webp",
  },
  {
    name: "Golden Catch",
    src: "/assets/games/slot-09.png",
    rtp: "96.50%",
    rtpValue: 96.5,
    volatility: "Medium",
    maxWin: "5,500x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Yggdrasil",
    preview: "/assets/games/game_demo2.jpeg",
  },
  {
    name: "Big Bass Splash",
    src: "/assets/games/slot-03.png",
    rtp: "96.71%",
    rtpValue: 96.71,
    volatility: "Medium",
    maxWin: "2,500x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Pragmatic Play",
    preview: "/assets/games/game_demo.webp",
  },
  {
    name: "Birds on a Wire",
    src: "/assets/games/birds-on-a-wire.png",
    rtp: "96.91%",
    rtpValue: 96.91,
    volatility: "High",
    maxWin: "10,000x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Thunderkick",
    preview: "/assets/games/game_demo2.jpeg",
  },
  {
    name: "Fruit Warp",
    src: "/assets/games/fruit-warp.png",
    rtp: "97%",
    rtpValue: 97,
    volatility: "Medium",
    maxWin: "6,000x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Thunderkick",
    preview: "/assets/games/game_demo.webp",
  },
  {
    name: "Wild Swarm",
    src: "/assets/games/wild-swarm.png",
    rtp: "96.32%",
    rtpValue: 96.32,
    volatility: "High",
    maxWin: "8,000x",
    betRange: "£0.10–£100",
    minBet: 0.1,
    maxBet: 100,
    gameType: "Slot",
    provider: "Push Gaming",
    preview: "/assets/games/game_demo2.jpeg",
  },
  // Previously these five lived only in the search page's ALL_GAMES list
  // with no metadata, so they fell back to DEFAULTS. Registering them
  // here gives every searchable game real provider/RTP/stake data —
  // important now that those fields are filterable & sortable.
  {
    name: "Goldilocks",
    src: "/assets/games/slot-02.png",
    rtp: "95.10%",
    rtpValue: 95.1,
    volatility: "Low",
    maxWin: "2,000x",
    betRange: "£0.10–£50",
    minBet: 0.1,
    maxBet: 50,
    gameType: "Slot",
    provider: "Quickspin",
  },
  {
    name: "Reactoonz",
    src: "/assets/games/slot-06.png",
    rtp: "96.51%",
    rtpValue: 96.51,
    volatility: "High",
    maxWin: "4,570x",
    betRange: "£0.20–£100",
    minBet: 0.2,
    maxBet: 100,
    gameType: "Slot",
    provider: "Play'n GO",
  },
  {
    name: "Money Train",
    src: "/assets/games/slot-10.png",
    rtp: "98%",
    rtpValue: 98,
    volatility: "High",
    maxWin: "20,000x",
    betRange: "£0.10–£20",
    minBet: 0.1,
    maxBet: 20,
    gameType: "Slot",
    provider: "Relax Gaming",
  },
  {
    name: "Wild Heist",
    src: "/assets/games/slot-12.png",
    rtp: "96.03%",
    rtpValue: 96.03,
    volatility: "Medium",
    maxWin: "5,500x",
    betRange: "£0.25–£125",
    minBet: 0.25,
    maxBet: 125,
    gameType: "Slot",
    provider: "Hacksaw Gaming",
  },
  {
    name: "South Park",
    src: "/assets/games/south-park.png",
    rtp: "96.31%",
    rtpValue: 96.31,
    volatility: "Medium",
    maxWin: "2,400x",
    betRange: "£0.20–£400",
    minBet: 0.2,
    maxBet: 400,
    gameType: "Slot",
    provider: "NetEnt",
  },
];

const DEFAULTS: Omit<GameDetails, "name" | "src"> = {
  rtp: "96.5%",
  rtpValue: 96.5,
  volatility: "Medium",
  maxWin: "5,000x",
  betRange: "£0.10–£100",
  minBet: 0.1,
  maxBet: 100,
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
    rtpValue: known?.rtpValue ?? DEFAULTS.rtpValue,
    volatility: known?.volatility ?? DEFAULTS.volatility,
    maxWin: known?.maxWin ?? DEFAULTS.maxWin,
    betRange: known?.betRange ?? DEFAULTS.betRange,
    minBet: known?.minBet ?? DEFAULTS.minBet,
    maxBet: known?.maxBet ?? DEFAULTS.maxBet,
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

/** Full searchable catalogue as complete GameDetails records. This is
 *  the single source of truth the search page filters & sorts over —
 *  every entry is guaranteed to carry rtpValue / minBet / maxBet /
 *  provider / volatility / gameType, so the filter UI never has to
 *  reach for DEFAULTS. */
export function getAllGames(): GameDetails[] {
  return CATALOGUE.map((c) => getGameDetails(c.name, c.src!));
}

/** Distinct, alphabetically-sorted provider names across the catalogue
 *  — drives the Provider multi-select in the filter sheet so the option
 *  list always matches the real data. */
export function getProviders(): string[] {
  return Array.from(new Set(getAllGames().map((g) => g.provider))).sort(
    (a, b) => a.localeCompare(b),
  );
}
