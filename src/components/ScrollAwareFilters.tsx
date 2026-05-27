"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Lobby category pills — Casino / Live / Bingo / Arena.
 *
 * Hides on scroll-down and reveals on scroll-up (iOS-style sticky band).
 *
 * Only the Casino pill currently links to a real route (`/casino`).
 * Live, Bingo, and Arena are kept in the band as visual placeholders
 * but their pages have been removed while we focus on perfecting the
 * Casino flow — so they render as inert buttons (no href, no nav). Once
 * those verticals are designed they can become `<Link>`s again by
 * filling in the `href` prop on FilterPill below.
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
// 36px filter pill + 12px bottom padding. Matching 12px gap above is
// supplied by the brand bar's pb so the vertical rhythm reads as
// consistent. Compact enough that the pills feel like filters
// (secondary controls), not primary CTAs.
const BAND_HEIGHT = 48;

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
      // No `bg-mrq-blue` — the band now sits on the page's white
      // canvas, with the pills picking up the brand-blue colour
      // themselves (Figma 131:36171).
      className="sticky top-[calc(env(safe-area-inset-top)+68px)] z-20 bg-[#f5f5f5]"
      initial={false}
      animate={{ y: visible ? 0 : -BAND_HEIGHT }}
      transition={transition}
      aria-hidden={!visible}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="px-[16px] pt-[12px] pb-[12px]">
        <nav className="flex items-center gap-[8px]" aria-label="Categories">
          <FilterPill href="/casino" label="Casino" />
          {/* Inert until the corresponding routes return. */}
          <FilterPill label="Bingo" />
          <FilterPill label="Live" />
          <FilterPill label="Arena" />
        </nav>
      </div>
    </motion.div>
  );
}

/**
 * Lobby filter pill — sits on the white page canvas now (Figma
 * 131:36171). Pale brand-blue fill (#CED5F5) with dark navy bold
 * text — same family as the Categories+ pill on the Casino page so
 * the two UI elements read as one cohesive set of chips.
 */
function FilterPill({ href, label }: { href?: string; label: string }) {
  // Pill chrome is identical whether the pill is a real link or an
  // inert placeholder — only the wrapping element differs.
  const className =
    "flex flex-1 min-w-0 items-center justify-center rounded-full h-[36px] px-[14px] active:scale-[0.96] transition-transform";
  const style = {
    backgroundColor: "#CED5F5",
    color: "var(--mrq-blue-dark)",
  } as const;
  const labelEl = (
    <span
      className="text-[14px] leading-none font-extrabold whitespace-nowrap"
      style={{ letterSpacing: "0.01em" }}
    >
      {label}
    </span>
  );

  if (!href) {
    // No destination yet — render as an inert button so the pill still
    // gets pressed-state feedback but never navigates.
    return (
      <button type="button" className={className} style={style} aria-disabled>
        {labelEl}
      </button>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      {labelEl}
    </Link>
  );
}
