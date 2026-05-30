import { notFound } from "next/navigation";
import { LiveCategoryView } from "@/components/views/LiveCategoryView";
import { LIVE_CATEGORY_KEYS } from "@/lib/live-categories";

/**
 * Per-category Live Casino page, e.g. `/live/roulette`.
 *
 * Destination for the "See all" links on each rail in the main /live
 * page. Unknown categories 404 — we don't want stale links dropping
 * users into a blank wall.
 *
 * In Next.js 16 `params` is a Promise that we await on the server,
 * then forward the resolved key to the client view (LiveCategoryView
 * owns the visual treatment).
 */
export default async function LiveCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!LIVE_CATEGORY_KEYS.includes(category)) notFound();
  return <LiveCategoryView category={category} />;
}
