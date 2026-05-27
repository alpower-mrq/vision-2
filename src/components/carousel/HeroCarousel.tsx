"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";
import { useFilter } from "@/lib/filter-context";

/**
 * Hero promo carousel — landscape PNG cards just below the filter band.
 *
 * Cards are simple PNGs (export from Figma → PNG 2× → save into
 * /public/assets/hero/). Each card uses the same 3:2 landscape aspect
 * so they line up cleanly in the snap rail.
 *
 * Behaviour:
 *   • Horizontal scroll-snap-mandatory + snap-stop: always so every
 *     release lands cleanly on a card.
 *   • Cards sit at ~88% viewport width so a sliver of the next card
 *     peeks on the right — swipe affordance.
 *   • Mouse drag uses `useDraggableScroll` for desktop; native touch
 *     scroll handles mobile.
 *
 * Scroll-off:
 *   The hero is NOT part of the sticky filter band — it's visible
 *   ONLY when the page is at the very top. The moment the user starts
 *   scrolling (>8px), the strip slides up off-screen AND collapses
 *   its height to 0 so the rails below pull up cleanly. Reappears
 *   only when scrollY returns to ~0 (2px hysteresis prevents
 *   touch-wobble flicker).
 */
const CARDS: Array<{ key: string; src: string; alt: string }> = [
  {
    key: "big-weekender",
    src: "/assets/hero/card-big-weekender.png",
    alt: "Big Weekender is back again",
  },
  {
    key: "get-spicy",
    src: "/assets/hero/card-get-spicy.png",
    alt: "Play Now — Get Spicy",
  },
  {
    key: "big-weekender-2",
    src: "/assets/hero/card-big-weekender.png",
    alt: "Big Weekender is back again",
  },
];

// 3:2 landscape — matches the Figma card aspect (303×162 ≈ 1.87:1
// but 3:2 reads as cleaner with consistent rails below).
const CARD_ASPECT = 3 / 2;

// Hysteresis for the scroll-off behaviour. Hide once we're a few
// pixels in, reveal only when fully back at the top.
const HIDE_AT = 8;
const REVEAL_AT = 2;

export function HeroCarousel() {
  const railRef = useDraggableScroll<HTMLDivElement>();
  const reduce = useReducedMotion();
  const { bootDone } = useFilter();

  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setVisible((curr) => {
          if (curr && y > HIDE_AT) return false;
          if (!curr && y <= REVEAL_AT) return true;
          return curr;
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const dealIn = reduce || bootDone;
  const hiddenTransform = reduce
    ? { opacity: 0, y: 0 }
    : { opacity: 0, y: -32 };

  return (
    <motion.section
      aria-label="Featured promotions"
      className="relative overflow-hidden"
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
      animate={
        !dealIn
          ? { opacity: 0, y: 24, scale: 0.96 }
          : visible
            ? { opacity: 1, y: 0, scale: 1, height: "auto" }
            : { ...hiddenTransform, height: 0, scale: 1 }
      }
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div
        ref={railRef}
        // Padding matches the rest of the page rhythm: px-[16px] for
        // horizontal (same as GameRail, ScrollAwareFilters,
        // RecentlyPlayedGrid). Vertical: pt-[12px] pb-[10px] —
        // symmetric-ish, leaves a hair more below so cards don't
        // crash into the rail title that follows.
        className="no-scrollbar flex gap-[10px] overflow-x-auto overflow-y-hidden px-[16px] pt-[12px] pb-[10px] snap-x snap-mandatory"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapStop: "always",
        }}
      >
        {CARDS.map((card) => (
          <div
            key={card.key}
            className="shrink-0 snap-start"
            style={{
              // 88% of available width so a sliver of the next card
              // peeks on the right edge.
              width: "min(88%, calc(var(--mobile-width) - 32px))",
              aspectRatio: `${CARD_ASPECT}`,
            }}
          >
            <PromoCard src={card.src} alt={card.alt} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function PromoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <button
      type="button"
      aria-label={alt}
      className="relative block h-full w-full overflow-hidden rounded-[16px] active:scale-[0.985] transition-transform"
      style={{ boxShadow: "0 8px 24px -10px rgba(10, 46, 203, 0.35)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
    </button>
  );
}
