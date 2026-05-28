"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CategoriesSheet } from "../CategoriesSheet";
import { ChevronDownIcon } from "../CategoryChevron";
import {
  CATEGORIES,
  CATEGORY_GRID_TILES,
} from "@/lib/casino-categories";

/**
 * Per-category Casino page, e.g. `/casino/jackpot` or `/casino/new`.
 *
 *   ┌──────────────────────────────────────┐
 *   │  ←                          £113.59 ▢│  ← BrandBar (back arrow only)
 *   ├──────────────────────────────────────┤
 *   │  Casino                 Jackpots+    │  ← In-page header
 *   │  Browse all Jackpot games            │  ← Sub-line names category
 *   ├──────────────────────────────────────┤
 *   │  ▢▢▢ ▢▢▢ ▢▢▢                        │  ← 3-col tile grid
 *   │  ▢▢▢ ▢▢▢ ▢▢▢                        │
 *   │  ▢▢▢ ▢▢▢ ▢▢▢                        │
 *   └──────────────────────────────────────┘
 *
 * Title stays "Casino" so the user always knows which vertical they're
 * inside; the active sub-category is communicated by (a) the pluralised
 * CTA pill on the right ("Jackpots+", "Tables+"), and (b) the
 * "Browse all X games" sub-line below the title.
 *
 * Tapping the pill opens the same CategoriesSheet as /casino, letting
 * the user hop between sub-categories without going back to the main
 * page. Selecting "All games" returns to the /casino feed.
 */

function labelFor(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

function ctaLabelForCategory(key: string): string {
  // Pluralised so the pill reads as a "more like this" affordance,
  // e.g. on /casino/jackpot the pill says "Jackpots" (chevron renders
  // separately). Previously this appended a literal "+" — the icon
  // now lives in JSX so we only return the plain word here.
  const label = labelFor(key);
  return label.endsWith("s") ? label : `${label}s`;
}

export function CasinoCategoryView({ category }: { category: string }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduce = useReducedMotion();

  const label = useMemo(() => labelFor(category), [category]);
  const ctaLabel = useMemo(() => ctaLabelForCategory(category), [category]);
  const tiles = CATEGORY_GRID_TILES[category] ?? [];

  // Hop to another sub-category page from the sheet. "All games"
  // (key === null) goes to the dedicated /casino/games browse view —
  // NOT the /casino homepage, which is a curated experience and
  // distinct from the all-games browse.
  const handleSelect = (key: string | null) => {
    if (key === null) router.push("/casino/games");
    else if (key !== category) router.push(`/casino/${key}`);
  };

  return (
    <>
      {/* In-page header. Title + CTA pill, same pattern as /casino. */}
      <div className="flex items-center justify-between px-[16px] pt-[16px] pb-[6px]">
        <h1 className="text-[28px] font-extrabold leading-none text-[var(--mrq-blue-dark)]">
          Casino
        </h1>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          // Shared chevron-down pill style — pale lavender bg, navy
          // label, chevron-down on the right. Matches the /casino
          // homepage's Categories pill and Arena's Dashboard pill.
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

      {/* 3-column tile grid. Tiles match the GameRail dimensions
          (square, ~109px wide on a 375px viewport) for visual
          continuity with the main feed. Single section-level fade-up
          matches the entrance pattern used by every other rail on the
          page (per-card stagger was inconsistent — variants didn't
          always propagate to children). */}
      <motion.div
        className="grid grid-cols-3 gap-[8px] px-[16px] pb-[24px]"
        initial={false}
        animate={reduce ? undefined : { opacity: [0, 1], y: [6, 0] }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {tiles.map((tile, i) => (
          <button
            key={`${tile.src}-${i}`}
            type="button"
            aria-label={tile.alt}
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
          </button>
        ))}
      </motion.div>

      <CategoriesSheet
        open={sheetOpen}
        selected={category}
        categories={CATEGORIES}
        onSelect={handleSelect}
        onClose={() => setSheetOpen(false)}
        // Sub-route → offer a quick hop back to the curated /casino
        // homepage. Sheet handles closing itself after the tap.
        onHome={() => router.push("/casino")}
        title="Casino Categories"
      />
    </>
  );
}
