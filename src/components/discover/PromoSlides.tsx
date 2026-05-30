"use client";

import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Promo slides inserted into the /discover (Top Picks) feed.
 *
 * Two variants, both 100dvh snap-targets sitting between reels:
 *   • ArenaPromoSlide       — Arena recruiter, after the 8th video
 *   • FreeSpinsPromoSlide   — Free spins reward, after the 12th
 *
 * Motion design
 * ─────────────────
 * Both slides build their entrance like a proper title sequence
 * rather than a flat fade-in. The keys:
 *
 *   1. Stagger every element ~80–120 ms so the eye follows a
 *      reading order: pill → headline → subhead → decoration
 *      → CTA.
 *   2. Spring physics on the high-energy beats (the headline
 *      first appears, the cherries pop, the CTA settles) so
 *      they have real weight, not just opacity tweens.
 *   3. Headline "drops" — y starts at -24 with a touch of scale
 *      (0.96) so the words feel like they're settling into
 *      place under gravity.
 *   4. Accent words on FreeSpins ("100 / FREE / SPINS") use a
 *      separate stagger so the yellow lights up beat-by-beat
 *      after the white "YOU HAVE" lands.
 *   5. CTA is the final beat — slight overshoot via a stiff
 *      spring so it lands assertively.
 *
 * All motion gates on `isActive` (60% IntersectionObserver) so
 * it ONLY fires when the slide snaps into view, never invisibly
 * while two reels away.
 */

// Centering strategy — anchor to the visible area, NOT the article.
// ──────────────────────────────────────────────────────────────────
// Each promo article is `height: 100dvh` inside the snap-scroll
// column which itself sits at `-mt-[24px]`. That means:
//   • The article's TOP 24px is hidden behind the BrandBar (the
//     bar is sticky-top with a rounded bottom; the column tucks
//     under it for the corner-cover trick).
//   • The article's BOTTOM extends BELOW the visible viewport by
//     ~48px + safe-area-inset-top (because the column starts
//     `safe-top + 48` from the viewport top, and the article is
//     100dvh tall — so it overflows the bottom of the viewport
//     by exactly that offset).
//
// Padding-based centering kept getting it wrong because the
// "extra" off-screen area at top + bottom isn't symmetric: the
// top is fixed at 24px, the bottom is (safe-top + 48). On a
// notched iPhone safe-top = 47, so the bottom overflows by ~95px
// while the top overflows by only 24px — content centered in the
// article's geometric middle ends up visually ~36px LOW.
//
// Switching to `position: absolute` with hard top/bottom anchors
// pinned to the BrandBar's bottom edge and the BottomNav's top
// edge gives us a bounding box that's exactly the visible area.
// Flex-center inside that, and content lands in the true visual
// centre regardless of device.
//
// brand-bar-height          = safe-top + 72 (10 + 48 + 14)
// article top in viewport-y = (safe-top + 72) - 24 = safe-top + 48
// brand-bar-bottom in article-y = 24
// bottom-nav-top in article-y   = 100dvh - bottom-nav-h - safe-top - 48
//
// → top: 24 (or with extra padding for breathing room)
// → bottom: bottom-nav-h + safe-top + 48
const ANCHOR_TOP = "24px";
const ANCHOR_BOTTOM =
  "calc(var(--bottom-nav-h, 80px) + env(safe-area-inset-top) + 48px)";

function usePromoActive(onActiveChange?: (active: boolean) => void) {
  const articleRef = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const active = entry.intersectionRatio >= 0.6;
          setIsActive(active);
          onActiveChange?.(active);
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onActiveChange]);

  return { articleRef, isActive };
}

// NOTE: the brand-blue scrim cover that masks the BottomNav's
// default black gradient lives at the page level (DiscoverPage),
// NOT inside each article. Reason: iOS Safari has a long-standing
// quirk where `position: fixed` elements inside a `-webkit-
// overflow-scrolling: touch` container get re-anchored to the
// scrollable ancestor instead of the viewport. The article sits
// inside such a container, so a `fixed bottom-0` inside the
// article rendered correctly on desktop preview but ended up off-
// screen on iPhone — leaving the BottomNav's black gradient
// visible underneath the blue promo. Lifting it to the page level
// (alongside FixedReelChrome, which works fine on iOS) sidesteps
// the bug entirely.

// ── Shared motion tokens ───────────────────────────────────────

const SOFT_SPRING: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 22,
  mass: 0.9,
};

const POP_SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 18,
  mass: 0.8,
};

const SETTLE_SPRING: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 26,
  mass: 0.85,
};

// "Drop in" variant — used for headline lines that fall into
// place. Slight upward overshoot at the resting state via the
// soft spring's damping.
const dropIn: Variants = {
  initial: { opacity: 0, y: -24, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SOFT_SPRING,
  },
};

// "Lift in" variant — secondary copy that rises from below.
const liftIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: SOFT_SPRING,
  },
};

// "Pop in" — CTAs and stickers. Stiff overshoot.
const popIn: Variants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: POP_SPRING,
  },
};

// ── Slide 1: Arena ─────────────────────────────────────────────

export function ArenaPromoSlide({
  onActiveChange,
}: {
  onActiveChange?: (active: boolean) => void;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { articleRef, isActive } = usePromoActive(onActiveChange);

  // Top-level orchestrator — when isActive flips true we drive
  // children to their `animate` variants in a 110 ms cascade.
  const stage: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.11,
        delayChildren: 0.05,
      },
    },
  };

  const animateState = reduce
    ? "animate" // skip the stagger entirely when reduced-motion is on
    : isActive
      ? "animate"
      : "initial";

  return (
    <article
      ref={articleRef}
      className="relative w-full snap-start snap-always overflow-hidden"
      style={{
        height: "100dvh",
        backgroundColor: "var(--mrq-blue, #0a2ecb)",
      }}
    >
      <motion.div
        className="absolute flex flex-col"
        style={{
          top: ANCHOR_TOP,
          bottom: ANCHOR_BOTTOM,
          left: 0,
          right: 0,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        variants={stage}
        initial="initial"
        animate={animateState}
      >
        {/* Live now pill — first to drop in. */}
        <motion.div className="flex flex-col gap-[12px]" variants={stage}>
          <motion.span
            variants={dropIn}
            className="inline-flex items-center gap-[8px] self-start rounded-full pl-[12px] pr-[16px] py-[7px]"
            style={{ backgroundColor: "rgba(122, 246, 153, 0.2)" }}
          >
            <motion.span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: "#10B981",
              }}
              // Continuous gentle pulse on the live dot — telegraphs
              // "this is live" without being distracting.
              animate={
                isActive && !reduce
                  ? {
                      boxShadow: [
                        "0 0 0 0px rgba(16, 185, 129, 0.55)",
                        "0 0 0 8px rgba(16, 185, 129, 0)",
                        "0 0 0 0px rgba(16, 185, 129, 0)",
                      ],
                    }
                  : undefined
              }
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <span className="text-[14px] font-extrabold text-white">
              Live now
            </span>
          </motion.span>

          {/* Headline drops down word-block by word-block. Splitting
              "Fancy a bit of" from "chaos?" lets the second line
              hit a beat later for that "and then... CHAOS" reveal. */}
          <div>
            <motion.h2
              variants={dropIn}
              className="text-white font-extrabold uppercase block"
              style={{
                fontSize: "clamp(32px, 10vw, 40px)",
                lineHeight: 0.95,
                letterSpacing: -1.2,
              }}
            >
              Fancy a bit of
            </motion.h2>
            <motion.h2
              variants={dropIn}
              className="text-white font-extrabold uppercase block"
              style={{
                fontSize: "clamp(32px, 10vw, 40px)",
                lineHeight: 0.95,
                letterSpacing: -1.2,
              }}
            >
              chaos?
            </motion.h2>
          </div>

          {/* Sub copy — slides in from the left, slightly lagged. */}
          <motion.p
            variants={liftIn}
            className="font-extrabold lowercase"
            style={{
              color: "#3B9DFF",
              fontSize: "clamp(24px, 7.5vw, 30px)",
              lineHeight: 1,
              letterSpacing: -0.6,
              marginTop: 4,
            }}
          >
            join +200K
            <br />
            brave souls
          </motion.p>
        </motion.div>

        <div className="flex-1" />

        <div className="flex items-end justify-between">
          {/* Cherries pop with a stiff rotational spring. */}
          <motion.div
            variants={popIn}
            aria-hidden
            style={{ transformOrigin: "bottom left" }}
            // Once landed, give it a subtle idle sway so it feels
            // alive rather than frozen.
            animate={
              isActive && !reduce
                ? {
                    opacity: 1,
                    scale: 1,
                    rotate: [-2, 2, -2],
                    transition: {
                      opacity: { duration: 0.4 },
                      scale: POP_SPRING,
                      rotate: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.8,
                      },
                    },
                  }
                : undefined
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/cherry.png"
              alt=""
              width={92}
              height={92}
              draggable={false}
              style={{ display: "block" }}
            />
          </motion.div>

          {/* CTA — the final beat. Spring overshoots slightly so it
              lands assertively. */}
          <motion.button
            variants={popIn}
            type="button"
            onClick={() => router.push("/arena")}
            className="relative inline-flex items-center justify-center rounded-[16px] px-[24px] h-[52px] text-[17px] font-extrabold active:scale-[0.97] transition-transform"
            style={{
              backgroundColor: "#ffffff",
              color: "var(--mrq-blue-dark, #0c2287)",
              boxShadow: "0 12px 28px -12px rgba(0, 0, 0, 0.4)",
              zIndex: 40,
            }}
          >
            Join Arena
          </motion.button>
        </div>
      </motion.div>
    </article>
  );
}

// ── Slide 2: Free spins ─────────────────────────────────────────

export function FreeSpinsPromoSlide({
  onActiveChange,
}: {
  onActiveChange?: (active: boolean) => void;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { articleRef, isActive } = usePromoActive(onActiveChange);

  // Heavier stagger than Arena — each headline line carries
  // narrative weight ("YOU HAVE → 100 → FREE / SPINS → TO CLAIM"),
  // so we let the eye finish reading one before the next lands.
  const stage: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.08,
      },
    },
  };

  // "100" is the wow moment — bigger scale overshoot than the
  // surrounding lines.
  const heroNumber: Variants = {
    initial: { opacity: 0, scale: 0.4, rotate: -4 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 320,
        damping: 14,
        mass: 0.9,
      },
    },
  };

  const animateState = reduce
    ? "animate"
    : isActive
      ? "animate"
      : "initial";

  return (
    <article
      ref={articleRef}
      className="relative w-full snap-start snap-always overflow-hidden"
      style={{
        height: "100dvh",
        backgroundColor: "var(--mrq-blue, #0a2ecb)",
      }}
    >
      <motion.div
        className="absolute flex flex-col items-center justify-center"
        style={{
          top: ANCHOR_TOP,
          bottom: ANCHOR_BOTTOM,
          left: 0,
          right: 0,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        variants={stage}
        initial="initial"
        animate={animateState}
      >
        <div className="text-center">
          <motion.h2
            variants={dropIn}
            className="font-extrabold uppercase text-white"
            style={{
              fontSize: "clamp(40px, 13vw, 52px)",
              lineHeight: 0.96,
              letterSpacing: -1.2,
            }}
          >
            You have
          </motion.h2>

          {/* "100 FREE SPINS" — the wow block. We split into three
              motion children so they cascade beat by beat:
                • 100   → pop with overshoot (the headline number)
                • FREE  → drop down into place
                • SPINS → drop down a hair later
              All in yellow to mark them as the rewarded value. */}
          <div style={{ marginTop: 8 }}>
            <motion.h2
              variants={heroNumber}
              className="font-extrabold uppercase"
              style={{
                color: "#FFD400",
                fontSize: "clamp(44px, 14vw, 60px)",
                lineHeight: 1,
                letterSpacing: -1.4,
              }}
            >
              100
            </motion.h2>
            <motion.h2
              variants={dropIn}
              className="font-extrabold uppercase"
              style={{
                color: "#FFD400",
                fontSize: "clamp(40px, 13vw, 52px)",
                lineHeight: 1,
                letterSpacing: -1.2,
                marginTop: 4,
              }}
            >
              Free
            </motion.h2>
            <motion.h2
              variants={dropIn}
              className="font-extrabold uppercase"
              style={{
                color: "#FFD400",
                fontSize: "clamp(40px, 13vw, 52px)",
                lineHeight: 1,
                letterSpacing: -1.2,
                marginTop: 4,
              }}
            >
              Spins
            </motion.h2>
          </div>

          <motion.h2
            variants={liftIn}
            className="font-extrabold uppercase text-white"
            style={{
              fontSize: "clamp(40px, 13vw, 52px)",
              lineHeight: 0.96,
              letterSpacing: -1.2,
              marginTop: 12,
            }}
          >
            To claim
          </motion.h2>
        </div>

        <motion.button
          variants={popIn}
          transition={SETTLE_SPRING}
          type="button"
          onClick={() => router.push("/rewards")}
          className="relative mt-[28px] inline-flex items-center justify-center rounded-[16px] px-[28px] h-[50px] text-[17px] font-extrabold active:scale-[0.97] transition-transform"
          style={{
            backgroundColor: "#ffffff",
            color: "var(--mrq-blue-dark, #0c2287)",
            boxShadow: "0 12px 28px -12px rgba(0, 0, 0, 0.4)",
            zIndex: 40,
          }}
        >
          Open Rewards
        </motion.button>
      </motion.div>
    </article>
  );
}
