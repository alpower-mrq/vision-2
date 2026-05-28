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
 *   │             ✦  THE Q CLUB  ✦           │
 *   │   ┌──────────┐    ┌──────────┐         │
 *   │   │ Sweet B. │    │ Cheap A. │         │
 *   │   └──────────┘    └──────────┘         │
 *   │   20 Free Spins   1 Free Bingo Bash    │
 *   │   Valid 30 May    Valid 11 June        │
 *   │  ┌─────────────────────────────────┐   │
 *   │  │       See all Rewards           │   │
 *   │  └─────────────────────────────────┘   │
 *   └───────────────────────────────────────┘
 *
 * Layered structure (in `expandOnScroll` mode):
 *
 *   <motion.section>            ← scroll-tied paddings (gutter + bottom)
 *     <motion.div surface />     ← brand-blue + W-pattern SVG; THIS is
 *                                  the visible card; absolute-positioned
 *                                  inside the section so it grows with
 *                                  the section's padding-bottom on scroll
 *                                  and the W-pattern SVG stretches with it.
 *     <motion.div content />     ← aspect-ratio shell that positions the
 *                                  title / reward tiles / CTA absolutely.
 *                                  Visually transparent — the surface
 *                                  below it is what the user sees.
 *
 * On home (`expandOnScroll`), as the user scrolls the section into view:
 *   • gutter padding:        16 → 0   (card → full-width)
 *   • bottom padding:        16 → 120 (brand-blue floor extends down)
 *   • surface border-radius: 12 → 0
 *   • surface drop-shadow:   on → off
 * The surface div is positioned `top: 14 / left: gutter / right: gutter /
 * bottom: 0`, so it covers the full card area AND the extending pb
 * (the W-pattern paints the whole stretch).
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
   *  a full-width section as the user scrolls it into view. */
  expandOnScroll?: boolean;
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Scroll progress for the section: 0 below viewport → 1 when its
  // top reaches the viewport centre.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start center"],
  });

  const px = useTransform(
    scrollYProgress,
    [0, 1],
    expandOnScroll ? [16, 0] : [16, 16],
  );
  // Section bottom padding grows so the brand-blue surface (which
  // anchors to the section's bottom edge) stretches past the
  // card content and down to the BottomNav's top edge.
  const pb = useTransform(
    scrollYProgress,
    [0, 1],
    expandOnScroll ? [16, 120] : [16, 16],
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
      className="relative pt-[14px]"
      style={
        reduce
          ? { paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }
          : { paddingLeft: px, paddingRight: px, paddingBottom: pb }
      }
      initial={false}
      animate={reduce ? undefined : { opacity: [0, 1], y: [6, 0] }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* SURFACE — brand-blue + W-pattern. Absolute inside the section
          so its bounds track the section's paddings: insets match
          padding-left/right, top sits below padding-top, bottom is
          pinned to the section's bottom edge. As padding-bottom
          grows on scroll, the surface stretches downward and the
          W-pattern SVG scales with it (preserveAspectRatio="none"). */}
      <motion.div
        aria-hidden
        className="absolute overflow-hidden"
        style={
          reduce
            ? {
                top: 14,
                left: 16,
                right: 16,
                bottom: 16,
                borderRadius: 12,
                backgroundColor: "#0B2FCB",
                boxShadow:
                  "0 12px 28px -16px rgba(10, 46, 203, 0.45)",
              }
            : {
                top: 14,
                left: px,
                right: px,
                bottom: 0,
                borderRadius: radius,
                backgroundColor: "#0B2FCB",
                boxShadow,
              }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/qclub/backdrop-rays.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full pointer-events-none"
        />
      </motion.div>

      {/* CONTENT SHELL — invisible. Holds the aspect-ratio that
          defines the card-content height; its absolute children
          position relative to this shell (title at 14/290, reward
          tiles at 76/290, CTA at bottom: 14/290), so they keep
          their Figma positions even though the visible brand-blue
          surface below extends further down. */}
      <div
        className="relative w-full"
        style={{ aspectRatio: "357 / 290" }}
      >
        {/* "The Q Club" title */}
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

        {/* Two reward cards, side-by-side */}
        <div
          className="absolute left-0 right-0 grid grid-cols-2 gap-[14px] px-[11px]"
          style={{ top: `${(76 / 290) * 100}%` }}
        >
          {REWARDS.map((reward) => (
            <RewardTile key={reward.label} reward={reward} />
          ))}
        </div>

        {/* "See all Rewards" CTA */}
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
      </div>
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
