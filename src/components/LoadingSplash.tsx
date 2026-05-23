"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * App loading splash — covers the lobby for ~700ms on first paint, then fades
 * out. Frame-by-frame inspired by Figma nodes 66:14396, 66:14433, 66:14444:
 *
 *   Frame A (0–250ms):     huge MrQ mark fills the screen, scales down + blurs
 *   Frame B (250–650ms):   small MrQ logo bounces in from the centre with a spring
 *   Frame C (650–800ms):   whole splash fades out, revealing the lobby
 *
 * Stays at z-[60] so it sits above every other overlay (BottomBar/SideNav/
 * SearchOverlay) during the boot moment.
 *
 * Phases are time-driven (not lifecycle-driven) so we can keep the timing
 * very tight even when the page has fully painted within the first few ms.
 */
export function LoadingSplash() {
  // Phase 0 = huge Q, Phase 1 = bounce-in mark, Phase 2 = exit fade,
  // Phase 3 = unmounted.
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 280),
      setTimeout(() => setPhase(2), 650),
      setTimeout(() => setPhase(3), 850),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-mrq-blue"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase < 2 ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-hidden
        >
          {/* Frame A: oversized Q mark that fills the screen, then scales down and
              blurs out. The same MrQ SVG is used; we just translate/scale it
              way up so the Q dominates the frame. */}
          <motion.img
            src="/assets/logo-mrq.svg"
            alt=""
            className="absolute h-auto w-auto"
            initial={{ scale: 8, opacity: 1, filter: "blur(0px)" }}
            animate={
              phase === 0
                ? { scale: 8, opacity: 1, filter: "blur(0px)" }
                : { scale: 4, opacity: 0, filter: "blur(20px)" }
            }
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "180px" }}
          />

          {/* Frame B: the actual MrQ logo bounces in from the centre with a
              spring. Hidden during Frame A; springs in once phase >= 1. */}
          <motion.img
            src="/assets/logo-mrq.svg"
            alt="MrQ"
            className="relative"
            style={{ width: "120px", height: "auto" }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={
              phase >= 1
                ? { scale: 1, opacity: 1 }
                : { scale: 0.3, opacity: 0 }
            }
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 14,
              mass: 0.9,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
