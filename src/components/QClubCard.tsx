"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

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
 *   <motion.section>            ← brand-blue floor + bottom padding
 *     <motion.div surface />     ← brand-blue + W-pattern SVG; THIS is
 *                                  the visible card; absolute-positioned
 *                                  inside the section so it covers the
 *                                  full card area AND the extended pb.
 *     <motion.div content />     ← aspect-ratio shell that positions the
 *                                  title / reward tiles / CTA absolutely.
 *                                  Visually transparent — the surface
 *                                  below it is what the user sees.
 *
 * Earlier versions tweened the card from "rounded card" → "full-width
 * section" as you scrolled it into view (gutter, radius, shadow, pb all
 * eased on `useScroll`). Per user feedback the morph "transition" read
 * as crap — you'd catch the card mid-morph (half-rounded, half-faded
 * shadow, growing blue extension) and the visible boundary between the
 * card art and the extending blue strip created a seam. So in
 * `expandOnScroll` mode the section now renders in its FINAL expanded
 * state from the start: no gutter, no corner radius, no shadow, and the
 * brand-blue floor already extends 120px past the card content so it
 * reaches the BottomNav's top edge. No scroll-driven tween, no visible
 * "transition" — the blue section is the same height as the card all
 * the way through.
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
  /** When true, the card renders as a full-width section flush with
   *  the BottomNav's top edge (used on the home feed where the Q Club
   *  is the closing block). When false, renders as a normal rounded
   *  mobile-frame card. No scroll-driven morph between the two states —
   *  the caller picks one. */
  expandOnScroll?: boolean;
}) {
  const reduce = useReducedMotion();

  // Static layout values — no scroll-driven tweens. `expandOnScroll`
  // just picks between the two presets at mount time.
  //   expanded:  full-width, square corners, no shadow, 120px floor
  //              that reaches the BottomNav's top edge.
  //   card:      16px gutters, 12px radius, soft drop shadow, 16px pb.
  const px = expandOnScroll ? 0 : 16;
  const pb = expandOnScroll ? 120 : 16;
  const radius = expandOnScroll ? 0 : 12;
  const boxShadow = expandOnScroll
    ? "none"
    : "0 12px 28px -16px rgba(10, 46, 203, 0.45)";

  return (
    <motion.section
      aria-label="The Q Club"
      className="relative pt-[14px]"
      style={{
        paddingLeft: px,
        paddingRight: px,
        paddingBottom: pb,
      }}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* SURFACE — brand-blue + W-pattern. Absolute inside the section
          so its bounds track the section's paddings: insets match
          padding-left/right, top sits below padding-top, bottom is
          pinned to the section's bottom edge. The W-pattern SVG
          stretches to fill the full surface (preserveAspectRatio
          set on the SVG via CSS). */}
      <div
        aria-hidden
        className="absolute overflow-hidden"
        style={{
          top: 14,
          left: px,
          right: px,
          bottom: 0,
          borderRadius: radius,
          backgroundColor: "#0B2FCB",
          boxShadow,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/qclub/backdrop-rays.svg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full pointer-events-none"
        />
      </div>

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

        {/* "See All Rewards" CTA */}
        <Link
          href="/rewards"
          aria-label="See All Rewards"
          className="absolute left-[14px] right-[14px] h-[48px] rounded-[12px] bg-white grid place-items-center text-[18px] font-extrabold text-[var(--mrq-blue)] active:scale-[0.98] transition-transform"
          style={{
            bottom: `${(14 / 290) * 100}%`,
            letterSpacing: "-0.01em",
            boxShadow: "0 2px 8px -4px rgba(0, 0, 0, 0.18)",
          }}
        >
          See All Rewards
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
