import { LiveCasinoView } from "@/components/views/LiveCasinoView";

/**
 * Live Casino vertical — dedicated route reached from the Lobby's Live
 * Casino pill / mega-card, the Explore page's Live Casino card, or any
 * deep link to `/live`. The LiveCasinoView component holds the actual
 * content; this file just wires it into the App Router.
 *
 * Mirrors /casino's structure: hero swiper + Top 10 rail + per-category
 * rails (Roulette / Blackjack / Baccarat / Game Shows / Poker / Mega
 * Wheel). See /casino for the equivalent on the slots side.
 */
export default function LiveCasinoPage() {
  return <LiveCasinoView />;
}
