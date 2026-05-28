"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Arena → Today's prize reveal flow.
 *
 * Two screens choreographed in a single route so the entry/exit can
 * be a fluid in-place animation instead of a route transition:
 *
 *   1. Pre-reveal (Figma 251:27253):
 *        • Brand-blue → near-black gradient backdrop
 *        • Big gift box (yesterday-prize.png, 249×249), animated jiggle
 *        • Floating sparkles around it inviting the user to tap
 *        • Caption: "You finished #14" + "Tap to open"
 *        • The whole screen is one big tap-target that toggles state.
 *
 *   2. Reveal (Figma 251:27490):
 *        • Same backdrop
 *        • Confetti burst (50 particles) on mount
 *        • Prize card (big-bass-prize.png, 148×222) scales-in with
 *          a tiny overshoot + soft shadow
 *        • "20 Free Spins!" + subtitle slide up with stagger
 *        • Primary white "Use now" CTA → /rewards
 *        • Secondary "Save for later" link → /arena
 *
 * The page is rendered as a fixed inset-0 overlay (z-[60]) so it
 * covers the BrandBar (z-30) and BottomNav (z-40) — the user gets a
 * full-screen, immersive moment. We honour `--frame-right-offset`
 * so on desktop the overlay hugs the same mobile-frame column as
 * the rest of the app (matching LoadingSplash's pattern).
 *
 * Reduced motion is respected throughout: jiggle, confetti, and
 * spring overshoots are all dropped when the user has prefers-
 * reduced-motion enabled — they still see the prize, just without
 * the showmanship.
 */

const BRAND_TOP = "#0a2ecb";
const BRAND_DARK = "#0c2287";
const BRAND_50 = "#e6eafa"; // subtitle text (Brand/50)

// Confetti palette — picked to read against the dark gradient.
const CONFETTI_COLORS = [
  "#FFD23F", // saturated yellow
  "#FF4D6D", // hot pink
  "#06D6A0", // mint green
  "#3DB2FF", // sky blue
  "#FFFFFF", // white sparkle
  "#FF8C42", // tangerine
];

type Particle = {
  id: number;
  x: number; // end-X offset (px from origin)
  y: number; // end-Y offset (px from origin)
  rotate: number; // end rotation (deg)
  size: number; // px
  color: string;
  delay: number; // seconds
  shape: "square" | "circle";
};

/** Generate a stable burst of confetti particles. Seeded by Math.random
 *  but memoised so re-renders don't re-randomise positions mid-flight. */
function makeConfetti(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    // Spread particles in a full circle, biased slightly downward so the
    // burst feels like it "falls" rather than just expanding evenly.
    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 220; // 120–340 px from origin
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance + 60, // +60 = gravity bias
      rotate: (Math.random() - 0.5) * 720, // -360 to +360
      size: 6 + Math.random() * 8, // 6–14 px
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.18, // stagger up to 180ms
      shape: Math.random() > 0.55 ? "circle" : "square",
    };
  });
}

export default function ArenaPrizePage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  // Generate the confetti burst once per page life; passing it into the
  // Reveal component means the particles are stable even if Reveal
  // re-renders for other reasons.
  const confetti = useMemo(() => makeConfetti(50), []);

  return (
    <motion.div
      // Fixed full-frame overlay — sits above BrandBar (z-30) and
      // BottomNav (z-40), and uses --frame-right-offset so on desktop
      // it hugs the mobile-frame column instead of spreading across
      // the full monitor. Tap anywhere advances pre-reveal → reveal.
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed top-0 bottom-0 z-[60] overflow-hidden"
      style={{
        left: "var(--frame-right-offset)",
        right: "var(--frame-right-offset)",
        // Brand-blue at the top fading into near-black at the bottom.
        // Matches the design's #0e1224 base + #0a2ecb top layer +
        // #0e1120 bottom overlay collapsed into a single gradient for
        // simplicity (the visual outcome is the same).
        background: `linear-gradient(180deg, ${BRAND_TOP} 0%, #131838 55%, #0e1120 100%)`,
        // Honour the iOS safe areas top + bottom.
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Tiny close affordance — tucked top-right so users can bail
          out without committing to the reveal. Skipping it would
          trap the user since the prize flow covers the BrandBar
          back-arrow. */}
      <Link
        href="/arena"
        aria-label="Close prize screen"
        className="absolute z-10 grid place-items-center rounded-full active:scale-[0.94] transition-transform"
        style={{
          top: "calc(env(safe-area-inset-top) + 14px)",
          right: 16,
          width: 36,
          height: 36,
          backgroundColor: "rgba(255, 255, 255, 0.14)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <CloseIcon />
      </Link>

      <AnimatePresence mode="wait" initial={false}>
        {!revealed ? (
          <PreReveal
            key="pre"
            reduceMotion={!!reduceMotion}
            onOpen={() => setRevealed(true)}
          />
        ) : (
          <Reveal
            key="reveal"
            reduceMotion={!!reduceMotion}
            confetti={confetti}
            onUseNow={() => router.push("/rewards")}
            onSaveForLater={() => router.push("/arena")}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================================================
   PRE-REVEAL — gift box that begs to be tapped
   ============================================================ */
function PreReveal({
  reduceMotion,
  onOpen,
}: {
  reduceMotion: boolean;
  onOpen: () => void;
}) {
  // Sparkle positions are pre-set (not random) so the layout reads
  // intentional. Each one fades + drifts on its own loop.
  const sparkles = [
    { top: "30%", left: "14%", size: 14, delay: 0 },
    { top: "22%", right: "18%", size: 10, delay: 0.4 },
    { top: "50%", right: "10%", size: 16, delay: 0.8 },
    { bottom: "32%", left: "12%", size: 12, delay: 0.2 },
    { bottom: "26%", right: "20%", size: 14, delay: 0.6 },
    { top: "16%", left: "44%", size: 8, delay: 1.0 },
  ] as const;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Open today's prize"
      className="absolute inset-0 flex flex-col items-center justify-center text-center"
      // Whole panel exits as one unit when transitioning to Reveal —
      // the gift box itself does the dramatic open animation below.
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
    >
      {/* Floating background sparkles — purely decorative, hidden from
          a11y, paused if the user prefers reduced motion. */}
      {!reduceMotion &&
        sparkles.map((s, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute"
            style={{
              top: "top" in s ? s.top : undefined,
              bottom: "bottom" in s ? s.bottom : undefined,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              width: s.size,
              height: s.size,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.6, 1.2, 0.6],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: s.delay,
              ease: "easeInOut",
            }}
          >
            <SparkleIcon />
          </motion.span>
        ))}

      {/* Gift box — entry: small drop with overshoot bounce, then a
          gentle continuous jiggle inviting the tap. Tapping fires
          the parent onOpen which swaps to the Reveal component. */}
      <motion.div
        className="relative"
        style={{ width: 249, height: 249 }}
        initial={
          reduceMotion
            ? { opacity: 0, scale: 1 }
            : { opacity: 0, scale: 0.6, y: -40 }
        }
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1 }
            : {
                opacity: 1,
                scale: 1,
                y: 0,
              }
        }
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 280, damping: 14, mass: 0.9 }
        }
      >
        {/* Continuous wobble — separate motion layer so the entry
            spring above can finish without the loop overriding it. */}
        <motion.div
          className="absolute inset-0"
          animate={
            reduceMotion
              ? undefined
              : {
                  rotate: [-3, 3, -3],
                  y: [0, -6, 0],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          {/* Glow halo behind the box — soft radial highlight to lift
              the box off the dark backdrop. */}
          <div
            className="absolute inset-[-40px] rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0) 70%)",
              filter: "blur(8px)",
            }}
            aria-hidden
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/arena/yesterday-prize.png"
            alt=""
            className="absolute inset-0 size-full object-contain"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* Caption block — Figma 251:27253 places the text at y=562 in
          a 932 frame; we let the flex centre handle vertical rhythm
          and just push it down a touch below the gift box. */}
      <motion.div
        className="mt-[28px]"
        style={{ width: 311 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      >
        <p
          className="text-white font-extrabold"
          style={{
            fontSize: 30,
            lineHeight: 1.2,
            letterSpacing: -1.5,
          }}
        >
          You finished #14
        </p>
        <motion.p
          className="font-bold"
          style={{
            color: BRAND_50,
            fontSize: 16,
            lineHeight: 1.6,
            letterSpacing: -0.2,
            marginTop: 8,
          }}
          // Subtitle pulses lightly to draw the eye and emphasise the
          // invitation to tap. Pulses are short (1.6s) but obvious.
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.6, 1, 0.6] }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }
          }
        >
          Tap to open
        </motion.p>
      </motion.div>
    </motion.button>
  );
}

/* ============================================================
   REVEAL — confetti + prize card + CTAs
   ============================================================ */
function Reveal({
  reduceMotion,
  confetti,
  onUseNow,
  onSaveForLater,
}: {
  reduceMotion: boolean;
  confetti: Particle[];
  onUseNow: () => void;
  onSaveForLater: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-[16px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
    >
      {/* Confetti burst — particles emit from a single origin point
          near the centre of the screen and explode outward. The
          container is non-interactive (pointer-events-none) so taps
          fall through to the prize card / CTAs underneath. */}
      {!reduceMotion && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: "38%",
            left: "50%",
            width: 0,
            height: 0,
          }}
          aria-hidden
        >
          {confetti.map((p) => (
            <motion.span
              key={p.id}
              className="absolute"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === "circle" ? "50%" : 2,
                top: -p.size / 2,
                left: -p.size / 2,
                boxShadow: `0 0 8px ${p.color}55`,
              }}
              initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: [0, 1, 1, 0.6],
                rotate: p.rotate,
                opacity: [1, 1, 1, 0],
              }}
              transition={{
                duration: 1.6,
                delay: p.delay,
                ease: [0.16, 1, 0.3, 1], // ease-out-quint — fast start
                times: [0, 0.15, 0.7, 1],
              }}
            />
          ))}
        </div>
      )}

      {/* Prize card — scales in with a tiny overshoot for that
          "tada!" beat. The shadow underneath is the same as the
          Figma spec (0 6px 24px rgba(0,0,0,0.25)). */}
      <motion.div
        className="relative"
        style={{
          width: 148,
          height: 222,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 6px 24px 0 rgba(0, 0, 0, 0.45)",
        }}
        initial={
          reduceMotion
            ? { opacity: 0, scale: 1 }
            : { opacity: 0, scale: 0.4, rotate: -8, y: -20 }
        }
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, scale: 1, rotate: 0, y: 0 }
        }
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : {
                type: "spring",
                stiffness: 220,
                damping: 12,
                mass: 0.9,
                delay: 0.05,
              }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/arena/big-bass-prize.png"
          alt="Big Bass Splash prize"
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
      </motion.div>

      {/* Title block — stagger-in below the prize card. */}
      <motion.div
        className="text-center"
        style={{ marginTop: 32, width: 311 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      >
        <p
          className="text-white font-extrabold"
          style={{
            fontSize: 30,
            lineHeight: 1.2,
            letterSpacing: -1.5,
          }}
        >
          20 Free Spins!
        </p>
        <p
          className="font-bold"
          style={{
            color: BRAND_50,
            fontSize: 16,
            lineHeight: 1.6,
            letterSpacing: -0.2,
            marginTop: 10,
          }}
        >
          Find your free spins in the Rewards section
        </p>
      </motion.div>

      {/* Action stack — pinned near the bottom of the screen, slides
          up after the prize + title land. */}
      <motion.div
        className="absolute flex flex-col items-center"
        style={{
          left: 16,
          right: 16,
          bottom: "calc(env(safe-area-inset-bottom) + 32px)",
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.5, ease: "easeOut" }}
      >
        <button
          type="button"
          onClick={onUseNow}
          className="w-full flex items-center justify-center rounded-[8px] active:scale-[0.98] transition-transform"
          style={{
            height: 48,
            backgroundColor: "#ffffff",
          }}
        >
          <span
            className="font-extrabold"
            style={{
              color: BRAND_DARK,
              fontSize: 18,
              lineHeight: 1.6,
              letterSpacing: -0.2,
            }}
          >
            Use now
          </span>
        </button>
        <button
          type="button"
          onClick={onSaveForLater}
          className="text-white font-extrabold active:opacity-100 transition-opacity"
          style={{
            opacity: 0.7,
            fontSize: 16,
            lineHeight: 1.6,
            letterSpacing: -0.2,
            marginTop: 16,
          }}
        >
          Save for later
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   Icons
   ============================================================ */
function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      className="text-white"
      aria-hidden
    >
      <path d="M2 2l10 10M12 2L2 12" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-full" aria-hidden>
      <path
        d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4L12 0z"
        fill="#FFFFFF"
        opacity="0.92"
      />
    </svg>
  );
}
