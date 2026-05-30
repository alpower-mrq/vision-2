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
  // -----------------------------------------------------------------
  // BIG EXPANSION — additional casino slots so the search filters have
  // a meaningful population to bite on. None of these games are wired
  // to /play routes (no href), so tapping a tile just stubs out — they
  // exist purely to fill the catalogue and demonstrate filter UX.
  // Artwork cycles through the existing slot-NN PNGs (13 files) plus
  // the four named slots; many entries share thumbnails on purpose.
  // -----------------------------------------------------------------
  { name: "Dead or Alive II",          src: "/assets/games/slot-13.png", rtp: "96.82%", rtpValue: 96.82, volatility: "High",   maxWin: "100,000x", betRange: "£0.09–£9",   minBet: 0.09, maxBet: 9,    gameType: "Slot", provider: "NetEnt" },
  { name: "Book of Dead",              src: "/assets/games/slot-07.png", rtp: "96.21%", rtpValue: 96.21, volatility: "High",   maxWin: "5,000x",   betRange: "£0.01–£100", minBet: 0.01, maxBet: 100,  gameType: "Slot", provider: "Play'n GO" },
  { name: "Starburst",                 src: "/assets/games/slot-04.png", rtp: "96.09%", rtpValue: 96.09, volatility: "Low",    maxWin: "500x",     betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "NetEnt" },
  { name: "Gonzo's Quest",             src: "/assets/games/slot-06.png", rtp: "95.97%", rtpValue: 95.97, volatility: "Medium", maxWin: "2,500x",   betRange: "£0.20–£50",  minBet: 0.2,  maxBet: 50,   gameType: "Slot", provider: "NetEnt" },
  { name: "Sweet Bonanza",             src: "/assets/games/slot-03.png", rtp: "96.51%", rtpValue: 96.51, volatility: "High",   maxWin: "21,100x",  betRange: "£0.20–£125", minBet: 0.2,  maxBet: 125,  gameType: "Slot", provider: "Pragmatic Play" },
  { name: "The Dog House",             src: "/assets/games/slot-09.png", rtp: "96.51%", rtpValue: 96.51, volatility: "High",   maxWin: "6,750x",   betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Pragmatic Play" },
  { name: "The Dog House Megaways",    src: "/assets/games/slot-09.png", rtp: "96.55%", rtpValue: 96.55, volatility: "High",   maxWin: "12,305x",  betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Pragmatic Play" },
  { name: "Sugar Rush",                src: "/assets/games/slot-04.png", rtp: "96.50%", rtpValue: 96.5,  volatility: "High",   maxWin: "5,000x",   betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Pragmatic Play" },
  { name: "Gates of Olympus",          src: "/assets/games/slot-01.png", rtp: "96.50%", rtpValue: 96.5,  volatility: "High",   maxWin: "5,000x",   betRange: "£0.20–£125", minBet: 0.2,  maxBet: 125,  gameType: "Slot", provider: "Pragmatic Play" },
  { name: "Wanted Dead or a Wild",     src: "/assets/games/slot-12.png", rtp: "96.38%", rtpValue: 96.38, volatility: "High",   maxWin: "12,500x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Hacksaw Gaming" },
  { name: "Hand of Anubis",            src: "/assets/games/slot-07.png", rtp: "96.31%", rtpValue: 96.31, volatility: "High",   maxWin: "10,000x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Hacksaw Gaming" },
  { name: "Le Bandit",                 src: "/assets/games/slot-12.png", rtp: "96.32%", rtpValue: 96.32, volatility: "High",   maxWin: "30,300x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Hacksaw Gaming" },
  { name: "Chaos Crew",                src: "/assets/games/slot-11.png", rtp: "96.20%", rtpValue: 96.2,  volatility: "High",   maxWin: "10,000x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Hacksaw Gaming" },
  { name: "Razor Returns",             src: "/assets/games/slot-13.png", rtp: "96.32%", rtpValue: 96.32, volatility: "High",   maxWin: "55,000x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Push Gaming" },
  { name: "Razor Shark",               src: "/assets/games/slot-13.png", rtp: "96.70%", rtpValue: 96.7,  volatility: "High",   maxWin: "50,000x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Push Gaming" },
  { name: "Jammin' Jars",              src: "/assets/games/slot-03.png", rtp: "96.83%", rtpValue: 96.83, volatility: "High",   maxWin: "20,000x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Push Gaming" },
  { name: "Mystery Museum",            src: "/assets/games/slot-07.png", rtp: "96.58%", rtpValue: 96.58, volatility: "Medium", maxWin: "10,000x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Push Gaming" },
  { name: "Bonanza",                   src: "/assets/games/slot-05.png", rtp: "96%",    rtpValue: 96,    volatility: "High",   maxWin: "26,000x",  betRange: "£0.20–£50",  minBet: 0.2,  maxBet: 50,   gameType: "Slot", provider: "Big Time Gaming" },
  { name: "Extra Chilli",              src: "/assets/games/slot-08.png", rtp: "96.82%", rtpValue: 96.82, volatility: "High",   maxWin: "20,000x",  betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Big Time Gaming" },
  { name: "White Rabbit Megaways",     src: "/assets/games/slot-04.png", rtp: "97.39%", rtpValue: 97.39, volatility: "High",   maxWin: "17,500x",  betRange: "£0.10–£20",  minBet: 0.1,  maxBet: 20,   gameType: "Slot", provider: "Big Time Gaming" },
  { name: "Lil Devil",                 src: "/assets/games/slot-11.png", rtp: "96.36%", rtpValue: 96.36, volatility: "High",   maxWin: "40,000x",  betRange: "£0.10–£40",  minBet: 0.1,  maxBet: 40,   gameType: "Slot", provider: "Big Time Gaming" },
  { name: "Vikings Go Berzerk",        src: "/assets/games/slot-12.png", rtp: "96.10%", rtpValue: 96.1,  volatility: "Medium", maxWin: "5,000x",   betRange: "£0.25–£125", minBet: 0.25, maxBet: 125,  gameType: "Slot", provider: "Yggdrasil" },
  { name: "Valley of the Gods",        src: "/assets/games/slot-07.png", rtp: "96.20%", rtpValue: 96.2,  volatility: "High",   maxWin: "5,000x",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Yggdrasil" },
  { name: "Holmes & the Stolen Stones",src: "/assets/games/slot-06.png", rtp: "96.80%", rtpValue: 96.8,  volatility: "Medium", maxWin: "5,000x",   betRange: "£0.25–£100", minBet: 0.25, maxBet: 100,  gameType: "Slot", provider: "Yggdrasil" },
  { name: "Pink Elephants",            src: "/assets/games/slot-03.png", rtp: "96.10%", rtpValue: 96.1,  volatility: "High",   maxWin: "8,200x",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Thunderkick" },
  { name: "Pink Elephants 2",          src: "/assets/games/slot-03.png", rtp: "96.10%", rtpValue: 96.1,  volatility: "High",   maxWin: "10,000x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Thunderkick" },
  { name: "Esqueleto Explosivo 2",     src: "/assets/games/slot-11.png", rtp: "96.00%", rtpValue: 96,    volatility: "Medium", maxWin: "10,000x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Thunderkick" },
  { name: "Iron Bank",                 src: "/assets/games/slot-12.png", rtp: "96.10%", rtpValue: 96.1,  volatility: "High",   maxWin: "20,047x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Relax Gaming" },
  { name: "Temple Tumble",             src: "/assets/games/slot-08.png", rtp: "96.25%", rtpValue: 96.25, volatility: "High",   maxWin: "7,767x",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Relax Gaming" },
  { name: "Hellcatraz",                src: "/assets/games/slot-13.png", rtp: "96.62%", rtpValue: 96.62, volatility: "High",   maxWin: "51,840x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Relax Gaming" },
  { name: "Tombstone R.I.P.",          src: "/assets/games/slot-12.png", rtp: "96.06%", rtpValue: 96.06, volatility: "High",   maxWin: "300,000x", betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Nolimit City" },
  { name: "Mental",                    src: "/assets/games/slot-07.png", rtp: "96.08%", rtpValue: 96.08, volatility: "High",   maxWin: "66,666x",  betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Nolimit City" },
  { name: "San Quentin xWays",         src: "/assets/games/slot-11.png", rtp: "96.03%", rtpValue: 96.03, volatility: "High",   maxWin: "150,000x", betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Nolimit City" },
  { name: "Punk Toilet",               src: "/assets/games/slot-11.png", rtp: "96.04%", rtpValue: 96.04, volatility: "High",   maxWin: "60,000x",  betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Nolimit City" },
  { name: "Fire in the Hole",          src: "/assets/games/slot-05.png", rtp: "96.06%", rtpValue: 96.06, volatility: "High",   maxWin: "60,000x",  betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Nolimit City" },
  { name: "Rise of Olympus 100",       src: "/assets/games/slot-01.png", rtp: "96.50%", rtpValue: 96.5,  volatility: "High",   maxWin: "10,000x",  betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Play'n GO" },
  { name: "Moon Princess",             src: "/assets/games/slot-04.png", rtp: "96.50%", rtpValue: 96.5,  volatility: "High",   maxWin: "5,000x",   betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Play'n GO" },
  { name: "Fire Joker",                src: "/assets/games/slot-09.png", rtp: "96.15%", rtpValue: 96.15, volatility: "Medium", maxWin: "800x",     betRange: "£0.05–£100", minBet: 0.05, maxBet: 100,  gameType: "Slot", provider: "Play'n GO" },
  { name: "Legacy of Dead",            src: "/assets/games/slot-07.png", rtp: "96.58%", rtpValue: 96.58, volatility: "High",   maxWin: "5,000x",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Play'n GO" },
  { name: "Sakura Fortune",            src: "/assets/games/slot-09.png", rtp: "96.58%", rtpValue: 96.58, volatility: "High",   maxWin: "2,000x",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Quickspin" },
  { name: "Big Bot Crew",              src: "/assets/games/slot-02.png", rtp: "96.21%", rtpValue: 96.21, volatility: "Medium", maxWin: "1,250x",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Quickspin" },
  { name: "Druidess Gold",             src: "/assets/games/slot-06.png", rtp: "96.40%", rtpValue: 96.4,  volatility: "Medium", maxWin: "750x",     betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Quickspin" },
  { name: "Wild Toro",                 src: "/assets/games/slot-08.png", rtp: "96.40%", rtpValue: 96.4,  volatility: "Medium", maxWin: "2,250x",   betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "ELK Studios" },
  { name: "Hidden",                    src: "/assets/games/slot-11.png", rtp: "96.10%", rtpValue: 96.1,  volatility: "Medium", maxWin: "10,000x",  betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "ELK Studios" },
  { name: "Twin Spin Megaways",        src: "/assets/games/slot-04.png", rtp: "96.04%", rtpValue: 96.04, volatility: "Medium", maxWin: "13,653x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "NetEnt" },
  { name: "Divine Fortune",            src: "/assets/games/slot-01.png", rtp: "96.59%", rtpValue: 96.59, volatility: "Medium", maxWin: "Jackpot",  betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "NetEnt" },
  { name: "Mercy of the Gods",         src: "/assets/games/slot-07.png", rtp: "96.74%", rtpValue: 96.74, volatility: "Medium", maxWin: "Jackpot",  betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "NetEnt" },
  { name: "Mega Fortune",              src: "/assets/games/slot-06.png", rtp: "96.60%", rtpValue: 96.6,  volatility: "Low",    maxWin: "Jackpot",  betRange: "£0.25–£50",  minBet: 0.25, maxBet: 50,   gameType: "Slot", provider: "NetEnt" },
  { name: "Cazino Cosmos",             src: "/assets/games/slot-08.png", rtp: "96.40%", rtpValue: 96.4,  volatility: "Medium", maxWin: "4,200x",   betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Yggdrasil" },
  { name: "Sticky Bandits Wild Return",src: "/assets/games/slot-12.png", rtp: "96.59%", rtpValue: 96.59, volatility: "High",   maxWin: "30,000x",  betRange: "£0.10–£100", minBet: 0.1,  maxBet: 100,  gameType: "Slot", provider: "Quickspin" },
  { name: "Reactoonz 2",               src: "/assets/games/slot-06.png", rtp: "96.20%", rtpValue: 96.2,  volatility: "High",   maxWin: "5,083x",   betRange: "£0.20–£100", minBet: 0.2,  maxBet: 100,  gameType: "Slot", provider: "Play'n GO" },
  { name: "Rich Wilde & the Tome of Madness", src: "/assets/games/slot-02.png", rtp: "96.59%", rtpValue: 96.59, volatility: "Medium", maxWin: "2,000x", betRange: "£0.10–£100", minBet: 0.1, maxBet: 100, gameType: "Slot", provider: "Play'n GO" },
  { name: "Beat the Beast: Cerberus Inferno", src: "/assets/games/slot-11.png", rtp: "96.18%", rtpValue: 96.18, volatility: "High", maxWin: "20,000x", betRange: "£0.10–£100", minBet: 0.1, maxBet: 100, gameType: "Slot", provider: "Thunderkick" },
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
