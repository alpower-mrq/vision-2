import { CasinoAllGamesView } from "@/components/views/CasinoAllGamesView";

/**
 * "All games" page — the destination for the CategoriesSheet's
 * "All games" row. Sits next to /casino (the curated homepage) and
 * /casino/[category] (per-sub-category browse) as the third leg of
 * the Casino routing tree.
 *
 * `/casino/games` takes precedence over `/casino/[category]` because
 * Next.js routes static segments before dynamic ones, so the
 * "games" slug here can't accidentally be matched by the dynamic
 * category page.
 */
export default function CasinoAllGamesPage() {
  return <CasinoAllGamesView />;
}
