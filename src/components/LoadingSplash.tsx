"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * App loading splash — covers the lobby for ~2.6s on first paint, then fades
 * out. Frame-by-frame inspired by Figma nodes 66:14396, 66:14433, 66:14444:
 *
 *   Frame A  (0–280ms):    oversized MrQ mark fills the screen, scales down + blurs
 *   Frame B  (280–650ms):  white MrQ logo bounces in from the centre with a spring
 *   Hold     (650–2400ms): logo stays put so the brand reads
 *   Frame C  (2400–2600ms): whole splash fades out, revealing the lobby
 *
 * Stays at z-[60] so it sits above every other overlay (BottomBar/SideNav/
 * SearchOverlay) during the boot moment.
 *
 * Logo aspect: the logo SVG is 83 × 32 viewBox with `preserveAspectRatio
 * ="none"`, so we have to set BOTH width and height explicitly to keep it
 * from stretching when the parent isn't the same aspect. We use the 83:32
 * ratio (each frame just picks a width and computes the matching height).
 */

const LOGO_RATIO = 32 / 83; // height / width
const lh = (w: number) => Math.round(w * LOGO_RATIO);

export function LoadingSplash() {
  // 0 = huge mark, 1 = bounce-in logo, 2 = exit fade, 3 = unmounted.
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 280),
      setTimeout(() => setPhase(2), 2400),
      setTimeout(() => setPhase(3), 2600),
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
          {/* Frame A: oversized MrQ mark that fills the screen, then scales
              down and blurs out as the bounce-in logo takes over. Width +
              height set explicitly so the 83:32 aspect ratio is preserved
              (the SVG itself uses preserveAspectRatio=none). */}
          <motion.img
            src="/assets/logo-mrq.svg"
            alt=""
            className="absolute"
            initial={{ scale: 6, opacity: 1, filter: "blur(0px)" }}
            animate={
              phase === 0
                ? { scale: 6, opacity: 1, filter: "blur(0px)" }
                : { scale: 3, opacity: 0, filter: "blur(20px)" }
            }
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "180px", height: `${lh(180)}px` }}
          />

          {/* Frame B: the MrQ logo bounces in from the centre with a spring.
              Explicit width AND height again to lock the 83:32 aspect. */}
          <motion.img
            src="/assets/logo-mrq.svg"
            alt="MrQ"
            className="relative"
            style={{ width: "140px", height: `${lh(140)}px` }}
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
