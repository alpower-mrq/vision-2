import { BingoView } from "@/components/views/BingoView";

/**
 * /bingo — top-level bingo lobby page.
 *
 * Sits next to /casino as the second curated vertical destination
 * inside the app. Routes here from the Explore mega-cards "See all"
 * on the bingo slide, from the Start Browsing Bingo sticker, and
 * from the Browse all categories Bingo card.
 *
 * BrandBar handles the back arrow (→ /search) and the BottomNav
 * tab routing keeps Explore active while the user is inside /bingo
 * (Explore being the surface they came from).
 */
export default function BingoPage() {
  return <BingoView />;
}
