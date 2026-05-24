"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * App loading splash — full storyboard inspired by Figma node 71:14585.
 *
 * Beats:
 *
 *   0ms       white screen
 *   0–500ms   blue panel slides + bounces down from the top (covers top ~58%
 *             of the viewport)
 *   300–900ms MrQ logo bounces down from the top, lands centred in the blue
 *             panel (delayed so the panel is already in place when it lands)
 *   900–1300  tagline "THE CASINO YOU / LOVE TO HATE" fades in below the
 *             blue, in the white half
 *   1300–2800 hold — finished frame visible
 *   2800–3200 blue panel (with logo inside it) slides up off the top; the
 *             tagline fades down out of view at the same time
 *   3200      whole splash fades out, revealing the lobby underneath
 *
 * Total ≈ 3.2s.
 *
 * Stays at z-[60] so it sits above every other overlay (BottomBar / SideNav /
 * SearchOverlay) during the boot moment.
 */

const LOGO_RATIO = 32 / 83; // height / width
const lh = (w: number) => Math.round(w * LOGO_RATIO);

// Blue panel takes the top portion. 58% leaves room for the tagline beneath.
const BLUE_PCT = 58;

export function LoadingSplash() {
  const [mounted, setMounted] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Kick off the exit phase after the hold; unmount shortly after so the
    // splash doesn't sit invisibly above the lobby.
    const exitTimer = setTimeout(() => setExiting(true), 2800);
    const unmountTimer = setTimeout(() => setMounted(false), 3400);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  const dropSpring = { type: "spring" as const, stiffness: 220, damping: 14, mass: 1 };
  const dropSpringSoft = { type: "spring" as const, stiffness: 260, damping: 18, mass: 0.9 };
  const exitEase = { duration: 0.4, ease: [0.55, 0, 0.45, 1] as [number, number, number, number] };

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[60] overflow-hidden bg-white"
          initial={{ opacity: 1 }}
          // Final fade-out reveals the lobby underneath.
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, delay: exiting ? 0.18 : 0 }}
          aria-hidden
        >
          {/* Blue top panel — bounces in from above on entrance, slides back
              up on exit. The logo lives inside it so it travels with the
              panel on the way out. */}
          <motion.div
            className="absolute left-0 right-0 top-0 bg-mrq-blue overflow-hidden flex items-center justify-center"
            style={{ height: `${BLUE_PCT}%` }}
            initial={{ y: "-100%" }}
            animate={{ y: exiting ? "-100%" : 0 }}
            transition={exiting ? exitEase : dropSpringSoft}
          >
            {/* MrQ logo — bounces down from the top after a small delay so
                it visibly lands in an already-settled blue panel. Width +
                height set explicitly so the 83:32 aspect is locked. */}
            <motion.img
              src="/assets/logo-mrq.svg"
              alt="MrQ"
              initial={{ y: "-260%", opacity: 0 }}
              animate={{
                y: exiting ? 0 : 0,
                opacity: 1,
              }}
              transition={
                exiting
                  ? { duration: 0 } // logo moves with the panel; no separate exit
                  : { ...dropSpring, delay: 0.32 }
              }
              style={{ width: "240px", height: `${lh(240)}px` }}
            />
          </motion.div>

          {/* Tagline — sits in the white bottom area, fades in once the
              logo has landed; fades + slides down on exit. */}
          <motion.div
            className="absolute left-0 right-0 flex flex-col items-center text-center"
            style={{
              top: `${BLUE_PCT}%`,
              paddingTop: "44px",
              color: "var(--mrq-blue)",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "30px",
              lineHeight: 1.0,
              letterSpacing: "0.5px",
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: exiting ? 0 : 1,
              y: exiting ? 24 : 0,
            }}
            transition={
              exiting
                ? { duration: 0.35, ease: [0.55, 0, 0.45, 1] }
                : { duration: 0.5, delay: 0.95, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <span>THE CASINO YOU</span>
            <span style={{ marginTop: "8px" }}>LOVE TO HATE</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
