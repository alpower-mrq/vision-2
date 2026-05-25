"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArenaIcon,
  BingoIcon,
  CasinoIcon,
  LiveIcon,
} from "./FilterIcons";

/**
 * Lobby category pills — Casino / Live / Bingo / Arena.
 *
 * Hides on scroll-down and reveals on scroll-up (iOS-style sticky band).
 * Each pill is a `<Link>` to its dedicated route (`/casino`, `/live`,
 * `/bingo`, `/arena`) — previously they toggled a filter state in
 * context, but each vertical now has its own real page so navigation
 * goes through the router.
 *
 * Rendered ONLY on the Lobby page (imported by `src/app/page.tsx`).
 * Other routes don't show these pills — they have their own designs.
 *
 * Layout:
 *   - `position: sticky; top: calc(env(safe-area-inset-top) + 68px)` —
 *     tucks immediately under the brand bar so the two read as one
 *     continuous blue header.
 *   - z-20, brand bar is z-30. The brand bar's solid blue bg means the
 *     pills disappear cleanly under it as they slide up.
 *
 * Scroll detection:
 *   - Always visible when `scrollY < 100` so the band never hides while the
 *     content below it hasn't yet scrolled past where the band sits.
 *   - Past 100, scrolling down by >4px hides, scrolling up by >4px shows.
 *   - rAF-throttled scroll handler.
 */
const ALWAYS_VISIBLE_BELOW = 100;
const DIRECTION_THRESHOLD = 4;
const BAND_HEIGHT = 46; // pills (36) + pb-[10px] (10). The matching 10px
// gap *above* the pills comes from the brand bar's own pb-[10px], so the
// space above and below the pill row reads as visually consistent.

export function ScrollAwareFilters() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY.current;
        lastY.current = y;

        if (y < ALWAYS_VISIBLE_BELOW) {
          setVisible(true);
          return;
        }
        if (Math.abs(delta) < DIRECTION_THRESHOLD) return;
        setVisible(delta < 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const transition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 36, mass: 0.85 };

  return (
    <motion.div
      className="sticky top-[calc(env(safe-area-inset-top)+68px)] z-20 bg-mrq-blue"
      initial={false}
      animate={{ y: visible ? 0 : -BAND_HEIGHT }}
      transition={transition}
      aria-hidden={!visible}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="px-[16px] pb-[10px]">
        <nav className="flex items-center gap-[6px]" aria-label="Categories">
          <FilterPill href="/casino" Icon={CasinoIcon} label="Casino" />
          <FilterPill href="/live" Icon={LiveIcon} label="Live" />
          <FilterPill href="/bingo" Icon={BingoIcon} label="Bingo" />
          <FilterPill href="/arena" Icon={ArenaIcon} label="Arena" accent="#e0007a" />
        </nav>
      </div>
    </motion.div>
  );
}

function FilterPill({
  href,
  Icon,
  label,
  accent,
}: {
  href: string;
  Icon: ComponentType<{ className?: string }>;
  label: string;
  /** Per-pill accent colour applied to the foreground. Pills on the
   *  Lobby are always shown in their "ready" state (white fill) since
   *  they're quick links into the categories. The accent colours the
   *  icon + text — used for Arena's brand pink. */
  accent?: string;
}) {
  const foreground = accent ?? "#0c2287";

  return (
    <Link
      href={href}
      className="flex flex-1 min-w-0 items-center justify-center gap-[4px] rounded-full px-[8px] py-[6px] h-[34px] active:scale-[0.96] transition-transform"
      style={{
        backgroundColor: "#ffffff",
        color: foreground,
      }}
    >
      <Icon className="h-[16px] w-auto shrink-0" />
      <span
        className="text-[13px] leading-none font-extrabold whitespace-nowrap"
        style={{ letterSpacing: "0" }}
      >
        {label}
      </span>
    </Link>
  );
}
