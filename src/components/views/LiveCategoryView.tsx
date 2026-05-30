"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CategoriesSheet } from "../CategoriesSheet";
import { ChevronDownIcon } from "../CategoryChevron";
import { LiveGameCard } from "@/components/rails/LiveGameRail";
import {
  LIVE_CATEGORIES,
  LIVE_GAMES_BY_CATEGORY,
} from "@/lib/live-categories";

/**
 * Per-category Live Casino page, e.g. `/live/roulette`.
 *
 * Same header pattern as CasinoCategoryView — title + pluralised CTA
 * pill + "Browse all X games" sub-line — and a 2-column grid of the
 * same rich LiveGameCard used in the rails on /live. Card stays
 * info-dense (player count, dealer, optional spin history) but in a
 * vertical grid rather than a horizontal scroller, so this page
 * mirrors Casino's "real" browse layout per the design.
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

export function LiveCategoryView({ category }: { category: string }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduce = useReducedMotion();

  const label = useMemo(() => labelFor(category), [category]);
  const ctaLabel = useMemo(() => ctaLabelForCategory(category), [category]);
  const games = LIVE_GAMES_BY_CATEGORY[category] ?? [];

  const handleSelect = (key: string | null) => {
    if (key === null) router.push("/live/games");
    else if (key !== category) router.push(`/live/${key}`);
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

      {/* 2-column grid of the rich Live cards — each grid cell sizes
          the card to fill its column. Reuses LiveGameCard from the
          rails so the chrome is identical to the homepage rails. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 gap-[12px] px-[16px] pb-[24px]"
      >
        {games.map((game, i) => (
          <LiveGameCard
            key={`${game.name}-${i}`}
            game={game}
            fixedWidth={null}
          />
        ))}
      </motion.div>

      <CategoriesSheet
        open={sheetOpen}
        selected={category}
        categories={LIVE_CATEGORIES}
        onSelect={handleSelect}
        onClose={() => setSheetOpen(false)}
        onHome={() => router.push("/live")}
        homeLabel="Back to Live Casino Home"
        title="Live Casino Categories"
      />
    </>
  );
}
