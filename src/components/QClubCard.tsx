"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * "The Q Club" promo card — Figma node 203:42091.
 *
 *   ┌───────────────────────────────────────┐
 *   │             ✦  THE Q CLUB  ✦           │   ← Title SVG (with crown)
 *   │                                       │
 *   │   ┌──────────┐    ┌──────────┐        │
 *   │   │ Sweet B. │    │ Cheap A. │        │
 *   │   └──────────┘    └──────────┘        │
 *   │   20 Free Spins   1 Free Bingo Bash   │
 *   │   Valid 30 May    Valid 11 June       │
 *   │                                       │
 *   │  ┌─────────────────────────────────┐  │
 *   │  │       See all Rewards           │  │   ← White button
 *   │  └─────────────────────────────────┘  │
 *   └───────────────────────────────────────┘
 *
 * Brand-blue (#0B2FCB) card with a subtle dark-gradient W backdrop,
 * the SVG title (with crown ornament) anchored at the top, and two
 * reward thumbnails.
 *
 * `expandOnScroll` mode (used at the bottom of the home feed): as
 * the card enters the viewport from below, its gutter padding, corner
 * radius, and lift-shadow all animate down to zero — so by the time
 * the user has scrolled it into view, the "card" has unfolded into
 * a full-width section that sits flush with the page edges. Acts as
 * a finishing flourish at the bottom of the lobby.
 */

const REWARDS: Array<{
  src: string;
  label: string;
  validUntil: string;
}> = [
  {
    src: "/assets/qclub/reward-sweet-bonanza.png",
    label: "20 Free Spins",
    validUntil: "Valid until 30th May",
  },
  {
    src: "/assets/qclub/reward-cheap-as-chips.png",
    label: "1 Free Bingo Bash",
    validUntil: "Valid until 11th June",
  },
];

export function QClubCard({
  expandOnScroll = false,
}: {
  /** When true, the card morphs from a normal mobile-frame card into
   *  a full-width section as the user scrolls it into view. Driven
   *  by `useScroll` tracking the section's progress through the
   *  viewport — see the inline `offset` for the exact range. */
  expandOnScroll?: boolean;
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Scroll progress for the section. `target: sectionRef` + the
  // `offset` below give us a `scrollYProgress` of 0 when the section
  // is BELOW the viewport (about to enter), reaches 1 when its TOP
  // edge has reached the viewport center. That's the window where
  // the card should be unfolding into a full-width section.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });

  // Snap to the start/end state when reduced-motion is on (no
  // intermediate scroll-driven animation).
  const px = useTransform(
    scrollYProgress,
    [0, 1],
    expandOnScroll ? [16, 0] : [16, 16],
  );
  const radius = useTransform(
    scrollYProgress,
    [0, 1],
    expandOnScroll ? [12, 0] : [12, 12],
  );
  const shadowAlpha = useTransform(
    scrollYProgress,
    [0, 1],
    expandOnScroll ? [0.45, 0] : [0.45, 0.45],
  );
  const boxShadow = useTransform(
    shadowAlpha,
    (a) => `0 12px 28px -16px rgba(10, 46, 203, ${a})`,
  );

  return (
    <motion.section
      ref={sectionRef}
      aria-label="The Q Club"
      className="pt-[14px] pb-[16px]"
      // The section's horizontal padding is the "card gutter" — when
      // expandOnScroll fires it tweens 16 → 0, dropping the card flush
      // to the page edges. Cast through `any` because Framer types the
      // style prop conservatively for motion values.
      style={
        reduce
          ? { paddingLeft: 16, paddingRight: 16 }
          : { paddingLeft: px, paddingRight: px }
      }
      initial={false}
      animate={reduce ? undefined : { opacity: [0, 1], y: [6, 0] }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: "#0B2FCB",
          // Tween radius + shadow alongside the gutter so the card
          // "unfolds" as a single coordinated motion: corners square
          // off, lift shadow fades, gutter padding collapses.
          borderRadius: reduce ? 12 : radius,
          boxShadow: reduce
            ? "0 12px 28px -16px rgba(10, 46, 203, 0.45)"
            : boxShadow,
          aspectRatio: "357 / 290",
        }}
      >
        {/* Backdrop W-gradient — the dark "diamond" shape baked into
            the original Figma frame. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/qclub/backdrop-rays.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full pointer-events-none"
        />

        {/* "The Q Club" title — kept as the original Figma SVG so the
            crown ornament's exact geometry survives. Centred at the
            top. Width is the Figma's 224/357 ratio = 62.8% of the
            card. */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: `${(14 / 290) * 100}%`,
            width: `${(224 / 357) * 100}%`,
            aspectRatio: "224 / 49",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/qclub/the-q-club-title.svg"
            alt="The Q Club"
            className="h-full w-full"
          />
        </div>

        {/* Two reward cards, side-by-side. */}
        <div
          className="absolute left-0 right-0 grid grid-cols-2 gap-[14px] px-[11px]"
          style={{ top: `${(76 / 290) * 100}%` }}
        >
          {REWARDS.map((reward) => (
            <RewardTile key={reward.label} reward={reward} />
          ))}
        </div>

        {/* "See all Rewards" — full-width white pill button anchored
            to the bottom of the card. Drops the user onto /rewards. */}
        <Link
          href="/rewards"
          aria-label="See all Rewards"
          className="absolute left-[14px] right-[14px] h-[48px] rounded-[12px] bg-white grid place-items-center text-[18px] font-extrabold text-[var(--mrq-blue)] active:scale-[0.98] transition-transform"
          style={{
            bottom: `${(14 / 290) * 100}%`,
            letterSpacing: "-0.01em",
            boxShadow: "0 2px 8px -4px rgba(0, 0, 0, 0.18)",
          }}
        >
          See all Rewards
        </Link>
      </motion.div>
    </motion.section>
  );
}

function RewardTile({
  reward,
}: {
  reward: { src: string; label: string; validUntil: string };
}) {
  return (
    <div className="flex flex-col items-stretch text-left">
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "157 / 80",
          // 1.75px white outline matches the Figma's reward frame.
          border: "1.75px solid #ffffff",
          borderRadius: "14px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={reward.src}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <p
        className="mt-[10px] text-[12px] font-extrabold leading-tight text-white"
        style={{ letterSpacing: "0.02em" }}
      >
        {reward.label}
      </p>
      <p
        className="mt-[2px] text-[10px] font-medium leading-tight"
        style={{ color: "#FBECFB", letterSpacing: "0.2px" }}
      >
        {reward.validUntil}
      </p>
    </div>
  );
}
