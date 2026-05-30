"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Promo slides inserted into the /discover (Top Picks) feed.
 *
 * Two variants, both 100dvh snap-targets sitting between reels:
 *   • ArenaPromoSlide       — Arena recruiter, sits after video 8
 *   • FreeSpinsPromoSlide   — Reward CTA, sits after video 10
 *
 * Both share:
 *   • Brand-blue full-bleed surface
 *   • Absolute inset-0 flex column with brand-bar + bottom-nav
 *     padding so content always sits in the visible safe area
 *   • A fixed blue scrim at z-[35] that masks the BottomNav's
 *     default black /discover gradient (same trick SuggestionCard
 *     uses — without it the bottom edge fades to black, which
 *     reads as a video bleeding through)
 *   • Responsive headline sizing via clamp() so the copy scales
 *     gracefully from 360px-wide handsets up to a 430px Pro Max
 *   • Entrance animations gated on a 60% IntersectionObserver
 *     (matches the reel feed's own threshold)
 *   • An onActiveChange callback the page wires to a promoActive
 *     flag → force-pauses adjacent reels + hides FixedReelChrome
 */

const TOP_PADDING = "calc(env(safe-area-inset-top) + 96px)";
const BOTTOM_PADDING = "calc(var(--bottom-nav-h, 80px) + 24px)";

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

/**
 * Fixed brand-blue cover that masks the BottomNav's default black
 * /discover scrim while this promo slide is in view. Same shape +
 * z-stack as the one in SuggestionCard — the BottomNav renders
 * after our slide in AppShell so we have to outrank its z-30
 * scrim. Nav buttons (z-40) still float above.
 */
function BottomScrimCover({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="fixed bottom-0 pointer-events-none"
      style={{
        left: "var(--frame-right-offset)",
        right: "var(--frame-right-offset)",
        height: 100,
        background: "var(--mrq-blue, #0a2ecb)",
        zIndex: 39,
      }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

// ── Slide 1: Arena ─────────────────────────────────────────────

export function ArenaPromoSlide({
  onActiveChange,
}: {
  onActiveChange?: (active: boolean) => void;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { articleRef, isActive } = usePromoActive(onActiveChange);

  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: isActive
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 20 },
    transition: {
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  });

  return (
    <article
      ref={articleRef}
      className="relative w-full snap-start snap-always overflow-hidden"
      style={{
        height: "100dvh",
        backgroundColor: "var(--mrq-blue, #0a2ecb)",
      }}
    >
      <BottomScrimCover isActive={isActive} />

      <div
        className="absolute inset-0 flex flex-col"
        style={{
          paddingTop: TOP_PADDING,
          paddingBottom: BOTTOM_PADDING,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* Top group — Live pill, then headline + subhead. */}
        <motion.div {...fadeUp(0)} className="flex flex-col gap-[12px]">
          <span
            className="inline-flex items-center gap-[8px] self-start rounded-full pl-[12px] pr-[16px] py-[7px]"
            style={{ backgroundColor: "rgba(122, 246, 153, 0.2)" }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: "#10B981",
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.28)",
              }}
            />
            <span className="text-[14px] font-extrabold text-white">
              Live now
            </span>
          </span>

          <h2
            className="text-white font-extrabold uppercase"
            style={{
              // Capped at 40px so "FANCY A BIT OF" fits one line in
              // the narrowest mobile-frame (360px → 312px content
              // after 24px gutters). Caps via min() against the
              // frame width since `vw` reads off the desktop viewport
              // on the dev preview and overshoots otherwise.
              fontSize: "clamp(32px, 10vw, 40px)",
              lineHeight: 0.95,
              letterSpacing: -1.2,
            }}
          >
            Fancy a bit of
            <br />
            chaos?
          </h2>
          <p
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
          </p>
        </motion.div>

        <div className="flex-1" />

        {/* Bottom row — cherries on the left, CTA on the right. */}
        <div className="flex items-end justify-between">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: -10 }}
            animate={
              isActive
                ? { opacity: 1, scale: 1, rotate: 0 }
                : { opacity: 0, scale: 0.6, rotate: -10 }
            }
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 16,
              delay: 0.22,
            }}
            aria-hidden
            style={{ transformOrigin: "bottom left" }}
          >
            {/* The exact cherries sticker from Figma (node 277:80557).
                Figma renders this as TWO layered SVGs in a grid cell:
                  • base (Group 5027)  at natural size
                  • detail (Group 5028) at inset -5.95% / -6.29%
                    (slightly oversize for the outline pass)
                Stacking them here matches the canvas render. */}
            <div className="relative" style={{ width: 84, height: 88 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/promo/cherries-base.svg"
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  display: "block",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/promo/cherries-detail.svg"
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  top: "-5.95%",
                  bottom: "-5.95%",
                  left: "-6.29%",
                  right: "-6.29%",
                  width: "112.58%",
                  height: "111.9%",
                  display: "block",
                }}
              />
            </div>
          </motion.div>

          <motion.button
            {...fadeUp(0.15)}
            type="button"
            onClick={() => router.push("/arena")}
            className="inline-flex items-center justify-center rounded-full px-[28px] h-[54px] text-[18px] font-extrabold active:scale-[0.97] transition-transform"
            style={{
              backgroundColor: "#ffffff",
              color: "var(--mrq-blue-dark, #0c2287)",
              boxShadow: "0 12px 28px -12px rgba(0, 0, 0, 0.4)",
            }}
          >
            Join Arena
          </motion.button>
        </div>
      </div>
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

  return (
    <article
      ref={articleRef}
      className="relative w-full snap-start snap-always overflow-hidden"
      style={{
        height: "100dvh",
        backgroundColor: "var(--mrq-blue, #0a2ecb)",
      }}
    >
      <BottomScrimCover isActive={isActive} />

      <div
        className="absolute inset-0 flex flex-col items-center"
        style={{
          paddingTop: TOP_PADDING,
          paddingBottom: BOTTOM_PADDING,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <div className="flex-1" />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={
            isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }
          }
          transition={{
            duration: 0.55,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center"
        >
          <h2
            className="font-extrabold uppercase text-white"
            style={{
              fontSize: "clamp(40px, 13vw, 52px)",
              lineHeight: 0.96,
              letterSpacing: -1.2,
            }}
          >
            You have
          </h2>
          <h2
            className="font-extrabold uppercase"
            style={{
              color: "#FFD400",
              fontSize: "clamp(40px, 13vw, 52px)",
              lineHeight: 1,
              letterSpacing: -1.2,
              marginTop: 8,
            }}
          >
            100 free
            <br />
            spins
          </h2>
          <h2
            className="font-extrabold uppercase text-white"
            style={{
              fontSize: "clamp(40px, 13vw, 52px)",
              lineHeight: 0.96,
              letterSpacing: -1.2,
              marginTop: 8,
            }}
          >
            To claim
          </h2>
        </motion.div>

        <div style={{ flex: 1.4 }} />

        <motion.button
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={
            isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
          }
          transition={{
            duration: 0.5,
            delay: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
          type="button"
          onClick={() => router.push("/rewards")}
          className="self-stretch inline-flex items-center justify-center rounded-full h-[56px] text-[18px] font-extrabold active:scale-[0.97] transition-transform"
          style={{
            backgroundColor: "#ffffff",
            color: "var(--mrq-blue-dark, #0c2287)",
            boxShadow: "0 12px 28px -12px rgba(0, 0, 0, 0.4)",
          }}
        >
          Open Rewards
        </motion.button>
      </div>
    </article>
  );
}
