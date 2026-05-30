"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { CategoriesSheet } from "../CategoriesSheet";
import { ChevronDownIcon } from "../CategoryChevron";
import { LiveGameCard } from "@/components/rails/LiveGameRail";
import {
  LIVE_ALL_GAMES,
  LIVE_CATEGORIES,
} from "@/lib/live-categories";

/**
 * Live Casino "All games" landing — /live/games.
 *
 * Mirrors CasinoAllGamesView: same header / CTA pill as the per-
 * category page, the pill highlights the All row in the sheet
 * (selected={null}). Body is a 2-column grid of every live game.
 */

export function LiveAllGamesView() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduce = useReducedMotion();

  const handleSelect = (key: string | null) => {
    if (key) router.push(`/live/${key}`);
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
          <span>All games</span>
          <ChevronDownIcon size={14} />
        </button>
      </div>
      <p className="px-[16px] pb-[12px] text-[14px] font-bold text-[var(--mrq-blue-dark)] opacity-70">
        Browse every Live Casino game
      </p>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 gap-[12px] px-[16px] pb-[24px]"
      >
        {LIVE_ALL_GAMES.map((game, i) => (
          <LiveGameCard
            key={`${game.name}-${i}`}
            game={game}
            fixedWidth={null}
          />
        ))}
      </motion.div>

      <CategoriesSheet
        open={sheetOpen}
        selected={null}
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
