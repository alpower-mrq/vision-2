"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Sticky sub-category tabs strip — sits on the blue bar directly below
 * the BrandBar. Same scroll-aware show/hide behaviour as the Lobby's
 * category pills:
 *
 *   • Always visible while the page is near the top (scrollY < 100)
 *   • Slides up off-screen on scroll-down
 *   • Reveals on scroll-up
 *
 * Tabs are horizontally scrollable when they overflow the viewport
 * width. Active tab gets a yellow label + a yellow underline that
 * slides between positions via Framer Motion `layoutId` (same effect
 * as the bottom-nav active pill, just an underline instead of a fill).
 *
 * State is client-side only for now (selected tab in local state) —
 * sub-categories don't need URL state until we wire real content per
 * tab; can graduate to a search-param when that happens.
 */

type CategoryTab = string;

// Same band height the Lobby uses (ScrollAwareFilters.BAND_HEIGHT) so
// the total blue-header height on category pages matches the Lobby.
const BAND_HEIGHT = 48;

export function CategoryTabs({
  tabs,
  defaultTab,
  onChange,
}: {
  tabs: CategoryTab[];
  defaultTab?: CategoryTab;
  /** Fired when the user taps a different tab. Optional — the
   *  component owns its own state if a parent doesn't need it. */
  onChange?: (tab: CategoryTab) => void;
}) {
  const [active, setActive] = useState<CategoryTab>(defaultTab ?? tabs[0]);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const reduce = useReducedMotion();

  // Scroll-aware show/hide — same logic as ScrollAwareFilters.
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
        if (y < 100) {
          setVisible(true);
          return;
        }
        if (Math.abs(delta) < 4) return;
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
      // Hide translateY equals the band height so it parks exactly
      // off-screen. Band height matches ScrollAwareFilters' BAND_HEIGHT
      // so the blue header on /casino is the same total height as on
      // the Lobby.
      animate={{ y: visible ? 0 : -BAND_HEIGHT }}
      transition={transition}
      aria-hidden={!visible}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div
        // Pinned min-height + items-end so the tab buttons + their
        // yellow underline sit FLUSH with the bottom edge of the blue
        // band. No bottom padding on the container — the underline at
        // bottom:0 of each button is the visual "end" of the blue
        // header, butting straight up against the page canvas.
        className="no-scrollbar flex items-end gap-[24px] overflow-x-auto px-[16px]"
        style={{ scrollbarWidth: "none", minHeight: `${BAND_HEIGHT}px` }}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActive(tab);
                onChange?.(tab);
              }}
              className="relative shrink-0 pt-[6px] pb-[8px]"
            >
              <span
                className="text-[15px] font-extrabold leading-none whitespace-nowrap"
                style={{
                  color: isActive ? "#ffd400" : "#ffffff",
                  // Subtle de-emphasis on inactive labels.
                  opacity: isActive ? 1 : 0.92,
                  transition: "color 220ms ease",
                }}
              >
                {tab}
              </span>

              {/* Active underline — shared layoutId means a single bar
                  slides between tabs instead of fading two in/out.
                  Extended ~10px on each side so it spans wider than the
                  label and reads as a heavier emphasis. */}
              {isActive && (
                <motion.span
                  layoutId="category-tab-underline"
                  className="absolute h-[3px] rounded-full"
                  style={{
                    backgroundColor: "#ffd400",
                    left: "-10px",
                    right: "-10px",
                    bottom: "0",
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
