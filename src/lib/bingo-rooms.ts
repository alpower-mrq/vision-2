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
  ticketPrice: string;
  jackpot: string;
  nextGameMins: number;
  ballType: "75-ball" | "90-ball";
  tagline: string;
};

export const BINGO_ROOMS: BingoRoom[] = [
  {
    key: "tropic-like-its-hot",
    name: "Tropic Like It's Hot",
    image: "/assets/bingo/lobby-tropic-like-its-hot.png",
    ticketPrice: "10p",
    jackpot: "£250",
    nextGameMins: 4,
    ballType: "75-ball",
    tagline: "Island vibes, sun-soaked wins",
  },
  {
    key: "cheap-as-chips",
    name: "Cheap As Chips",
    image: "/assets/bingo/lobby-cheap-as-chips.png",
    ticketPrice: "1p",
    jackpot: "£50",
    nextGameMins: 2,
    ballType: "90-ball",
    tagline: "Penny tickets, big smiles",
  },
  {
    key: "dab-and-disco",
    name: "Dab And Disco",
    image: "/assets/bingo/lobby-dab-and-disco.png",
    ticketPrice: "25p",
    jackpot: "£500",
    nextGameMins: 8,
    ballType: "75-ball",
    tagline: "Dab to the beat all night long",
  },
  {
    key: "on-the-house",
    name: "On The House",
    image: "/assets/bingo/lobby-on-the-house.png",
    ticketPrice: "Free",
    jackpot: "£25",
    nextGameMins: 12,
    ballType: "90-ball",
    tagline: "Free games, real cash prizes",
  },
  {
    key: "pinch-a-penny",
    name: "Pinch A Penny",
    image: "/assets/bingo/lobby-pinch-a-penny.png",
    ticketPrice: "1p",
    jackpot: "£30",
    nextGameMins: 6,
    ballType: "75-ball",
    tagline: "Penny pinching paradise",
  },
];

/** Mega-card preview tiles — same shape every category-rail consumer uses. */
export const BINGO_TILES = BINGO_ROOMS.map((r) => ({
  src: r.image,
  alt: r.name,
}));
