/**
 * Shared bingo rooms catalogue.
 *
 * Five real MrQ bingo rooms — same names + artwork that live on the
 * production MrQ bingo lobby. Each room carries the metadata a
 * lobby/list cell needs (image, ticket price, jackpot, next-game
 * countdown, ball type) so the /bingo view and the Explore mega-card
 * preview can pull from a single source of truth.
 *
 * Lives outside any "use client" file so server components can read
 * it for things like static metadata or future route validation.
 */

export type BingoRoom = {
  key: string;
  name: string;
  image: string;
  /** Tickets per game — short string, e.g. "10P", "1P", "FREE". */
  ticketPrice: string;
  /** Current jackpot pot, formatted, e.g. "£74.66". */
  jackpot: string;
  /** HH:MM:SS countdown until the next session — pre-formatted so
   *  the card just displays it. */
  nextGameTime: string;
  /** Number of balls in this room's game variant: 30 / 75 / 90. */
  ballCount: 30 | 75 | 90;
  /** Live players currently in the room. */
  players: number;
  tagline: string;
};

export const BINGO_ROOMS: BingoRoom[] = [
  {
    key: "tropic-like-its-hot",
    name: "Tropic Like It's Hot",
    image: "/assets/bingo/lobby-tropic-like-its-hot.png",
    ticketPrice: "10P",
    jackpot: "£74.66",
    nextGameTime: "02:55:25",
    ballCount: 30,
    players: 35,
    tagline: "Island vibes, sun-soaked wins",
  },
  {
    key: "cheap-as-chips",
    name: "Cheap As Chips",
    image: "/assets/bingo/lobby-cheap-as-chips.png",
    ticketPrice: "1P",
    jackpot: "£28.40",
    nextGameTime: "00:01:32",
    ballCount: 90,
    players: 124,
    tagline: "Penny tickets, big smiles",
  },
  {
    key: "dab-and-disco",
    name: "Dab And Disco",
    image: "/assets/bingo/lobby-dab-and-disco.png",
    ticketPrice: "25P",
    jackpot: "£312.90",
    nextGameTime: "00:08:15",
    ballCount: 75,
    players: 82,
    tagline: "Dab to the beat all night long",
  },
  {
    key: "on-the-house",
    name: "On The House",
    image: "/assets/bingo/lobby-on-the-house.png",
    ticketPrice: "FREE",
    jackpot: "£25.00",
    nextGameTime: "00:12:42",
    ballCount: 90,
    players: 211,
    tagline: "Free games, real cash prizes",
  },
  {
    key: "pinch-a-penny",
    name: "Pinch A Penny",
    image: "/assets/bingo/lobby-pinch-a-penny.png",
    ticketPrice: "1P",
    jackpot: "£18.20",
    nextGameTime: "00:06:20",
    ballCount: 75,
    players: 56,
    tagline: "Penny pinching paradise",
  },
];

/** Mega-card preview tiles — same shape every category-rail consumer uses. */
export const BINGO_TILES = BINGO_ROOMS.map((r) => ({
  src: r.image,
  alt: r.name,
}));
