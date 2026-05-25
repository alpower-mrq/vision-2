"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { useFilter, type LobbyFilter } from "@/lib/filter-context";
import {
  ArenaIcon,
  BingoIcon,
  CasinoIcon,
  LiveIcon,
} from "./FilterIcons";

/**
 * Sub-filter pills (Casino / Live / Bingo) that hide on scroll-down and
 * reveal on scroll-up — iOS-style.
 *
 * Each pill also acts as a content filter (see FilterContext):
 *   - In the `home` state, all three pills render in the active (white) style.
 *   - When one is selected, that pill stays white; the others switch to the
 *     dark-navy inactive style.
 *   - Tapping the active pill again toggles back to `home`.
 *
 * Layout:
 *   - `position: sticky; top: calc(env(safe-area-inset-top) + 68px)` — sticks
 *     immediately under the brand bar (iOS safe-area inset + 10 top padding +
 *     48 brand row + 10 bottom padding) so the two read as one continuous
 *     blue header at the top, whether in a regular browser or launched as an
 *     iOS PWA.
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
      {/* Container padding tightened (was 23 → 16) so the 4 pills fit
          comfortably in the 375px viewport with breathing room. */}
      <div className="px-[16px] pb-[10px]">
        <nav className="flex items-center gap-[6px]" aria-label="Section filters">
          <FilterPill pillKey="casino" Icon={CasinoIcon} label="Casino" />
          <FilterPill pillKey="live" Icon={LiveIcon} label="Live" />
          <FilterPill pillKey="bingo" Icon={BingoIcon} label="Bingo" />
          {/* Arena uses pink as its brand accent — applied to the icon +
              label only when the pill is active. */}
          <FilterPill
            pillKey="arena"
            Icon={ArenaIcon}
            label="Arena"
            accent="#e0007a"
          />
        </nav>
      </div>
    </motion.div>
  );
}

function FilterPill({
  pillKey,
  Icon,
  label,
  accent,
}: {
  pillKey: Exclude<LobbyFilter, "home">;
  /** Inline SVG component — renders with `currentColor` so it inherits
   *  the pill's text colour. Inlining (vs `mask-image`) sidesteps the
   *  browser quirk where Figma's `width="100%" height="100%"` SVGs got
   *  stretched in the mask box regardless of `mask-size: contain`. */
  Icon: ComponentType<{ className?: string }>;
  label: string;
  /** Per-pill accent colour applied to the active foreground (icon +
   *  text). Inactive pills always use the standard navy + white. */
  accent?: string;
}) {
  const { filter, togglePill } = useFilter();
  // In `home`, every pill reads as active so the row matches the original
  // unfiltered look. Once a filter is selected, only that pill stays active.
  const active = filter === "home" || filter === pillKey;
  const activeFg = accent ?? "#0c2287";

  return (
    <motion.button
      type="button"
      onClick={() => togglePill(pillKey)}
      aria-pressed={filter === pillKey}
      // Tighter padding + smaller height + min-w-0 so 4 pills can share the
      // 375px viewport without one being squeezed out. flex-1 keeps them
      // evenly distributed, min-w-0 lets the flexbox actually shrink them
      // (default min-width: auto would force them to their content width).
      className="flex flex-1 min-w-0 items-center justify-center gap-[4px] rounded-full px-[8px] py-[6px] h-[34px]"
      style={{
        backgroundColor: active ? "#ffffff" : "#0c2287",
        color: active ? activeFg : "#ffffff",
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
    >
      {/* Inline SVG icon — fills currentColor so it tracks the pill's
          text colour. Sized via `h-[16px]` with `width: auto` so each
          icon scales uniformly from its own viewBox. No distortion
          possible because the actual SVG geometry is rendered, not a
          stretched mask. */}
      <Icon className="h-[16px] w-auto shrink-0" />
      <span
        className="text-[13px] leading-none font-extrabold whitespace-nowrap"
        style={{ letterSpacing: "0" }}
      >
        {label}
      </span>
    </motion.button>
  );
}
