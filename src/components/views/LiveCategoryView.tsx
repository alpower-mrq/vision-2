"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CategoriesSheet } from "../CategoriesSheet";
import { ChevronDownIcon } from "../CategoryChevron";
import { GameTileInfo } from "../GameTileInfo";
import { useShell } from "@/lib/filter-context";
import { getGameDetails } from "@/lib/games-catalogue";
import {
  LIVE_CATEGORIES,
  LIVE_CATEGORY_GRID_TILES,
} from "@/lib/live-categories";

/**
 * Per-category Live Casino page, e.g. `/live/roulette` or `/live/blackjack`.
 *
 * Mirrors CasinoCategoryView's layout — title stays "Live Casino" so the
 * vertical is always obvious, the active sub-category is communicated by
 * the pluralised CTA pill on the right ("Roulettes+", "Blackjacks+") and
 * the "Browse all X games" sub-line. Tapping the pill opens the same
 * CategoriesSheet as /live for jumping between sub-categories without
 * round-tripping through the homepage.
 */

function labelFor(key: string): string {
  return LIVE_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

function ctaLabelForCategory(key: string): string {
  const label = labelFor(key);
  // "Game Shows" is already plural; pass it through.
  if (label.toLowerCase().endsWith("s")) return label;
  return `${label}s`;
}

function CategoryTile({
  tile,
}: {
  tile: { src: string; alt: string };
}) {
  const router = useRouter();
  const { openGameDetails } = useShell();
  const details = getGameDetails(tile.alt, tile.src);

  return (
    <button
      type="button"
      aria-label={tile.alt}
      onClick={() => {
        if (details.href) {
          router.push(details.href);
          return;
        }
        if (typeof window !== "undefined") {
          // eslint-disable-next-line no-console
          console.log("[LiveCategory] open game →", tile.alt);
        }
      }}
      className="relative aspect-square overflow-hidden rounded-[12px] active:scale-[0.98] transition-transform"
      style={{ boxShadow: "0 4px 12px -4px rgba(10, 46, 203, 0.2)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.src}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />
      <GameTileInfo onClick={() => openGameDetails(details)} />
    </button>
  );
}

export function LiveCategoryView({ category }: { category: string }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduce = useReducedMotion();

  const label = useMemo(() => labelFor(category), [category]);
  const ctaLabel = useMemo(() => ctaLabelForCategory(category), [category]);
  const tiles = LIVE_CATEGORY_GRID_TILES[category] ?? [];

  // Hop to another sub-category from the sheet. There is no /live/games
  // "all" page yet — the sheet hides that row via hideAllGames below,
  // so we don't need a null branch.
  const handleSelect = (key: string | null) => {
    if (key && key !== category) router.push(`/live/${key}`);
  };

  return (
    <>
      <div className="flex items-center justify-between px-[16px] pt-[16px] pb-[6px]">
        <h1 className="text-[28px] font-extrabold leading-none text-[var(--mrq-blue-dark)]">
          Live Casino
        </h1>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          className="inline-flex items-center gap-[6px] h-[30px] pl-[14px] pr-[12px] rounded-full text-[16px] font-extrabold active:scale-[0.97] transition-transform"
          style={{
            backgroundColor: "#dee3f7",
            color: "var(--mrq-blue-dark)",
          }}
        >
          <span>{ctaLabel}</span>
          <ChevronDownIcon size={14} />
        </button>
      </div>
      <p className="px-[16px] pb-[12px] text-[14px] font-bold text-[var(--mrq-blue-dark)] opacity-70">
        Browse all {label} games
      </p>

      <motion.div
        className="grid grid-cols-3 gap-[8px] px-[16px] pb-[24px]"
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {tiles.map((tile, i) => (
          <CategoryTile key={`${tile.src}-${i}`} tile={tile} />
        ))}
      </motion.div>

      <CategoriesSheet
        open={sheetOpen}
        selected={category}
        categories={LIVE_CATEGORIES}
        onSelect={handleSelect}
        onClose={() => setSheetOpen(false)}
        // Sub-route → offer a quick hop back to the /live homepage.
        onHome={() => router.push("/live")}
        title="Live Casino Categories"
        hideAllGames
      />
    </>
  );
}
