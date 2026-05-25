"use client";

import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Tinder-style swipeable hero card.
 *
 * Layout:
 *
 *   [ X ]    [ Card ]    [ ▶︎ ]
 *
 * The SKIP and PLAY affordances sit OUTSIDE the card (siblings in
 * a flex row) so the user always sees what each swipe direction
 * means — independent of whether they're dragging the card at the
 * moment. They light up as the user drags toward their side and
 * hit full opacity right at the swipe-commit threshold.
 *
 * Interactions:
 *   • Swipe left  → skip (red X)
 *   • Swipe right → play (blue ▶︎)
 *   • Tap         → open game (currently a stub)
 *
 * Drag mechanics:
 *   • Horizontal only (`drag="x"`).
 *   • Past ±100px on release: animate card off-screen, advance deck.
 *   • Below threshold: spring back to centre.
 *   • Card rotates ±12° with drag for that physical "card on a table"
 *     feel.
 *
 * Implementation notes:
 *   • The shared `x` MotionValue lives in `SwipeableHero` (parent), not
 *   in `SwipeCard`, so the affordances outside the card can read drag
 *   progress without poking into SwipeCard's internals. SwipeCard
 *   resets `x` to 0 on every mount (each new card after a swipe) so
 *   the next card starts at centre.
 *   • The card body has NO inner buttons (info / heart / play stack).
 *   Those were stealing touch events from the drag, making it feel
 *   stuck/buggy — and they were redundant anyway now that tapping the
 *   card opens the game and swiping right launches play.
 */

export type HeroGame = {
  src: string;
  alt: string;
  title: string;
  rtp: string;
  /** Yellow "Exclusive" sticker top-left of the artwork. */
  exclusive?: boolean;
};

const SWIPE_THRESHOLD = 100;
// Bigger than the card width so the card flies fully off-screen before
// the next one swaps in.
const SWIPE_EXIT_DISTANCE = 600;

export function SwipeableHero({ games }: { games: HeroGame[] }) {
  const [index, setIndex] = useState(0);
  const current = games[index % games.length];
  const next = games[(index + 1) % games.length];

  // The shared MotionValue. SwipeCard binds its drag to this, the
  // affordances on either side read from it via useTransform.
  const x = useMotionValue(0);

  // Drag-tied opacity + scale for the OUTSIDE affordances.
  //   Right side  (play, +x)  : 10 → 100px reveals
  //   Left  side  (skip, -x)  : -100 → -10px reveals
  const playOpacityFromDrag = useTransform(x, [10, 100], [0, 1]);
  const nopeOpacityFromDrag = useTransform(x, [-100, -10], [1, 0]);
  const playScaleFromDrag = useTransform(x, [10, 100], [0.85, 1.05]);
  const nopeScaleFromDrag = useTransform(x, [-100, -10], [1.05, 0.85]);

  // One-off discoverability pulse on the very first card. Both icons
  // fade in to 40% then back out so the user immediately sees "you can
  // swipe left or right". `Math.max`-combined with the drag-tied value
  // below — as soon as the user starts dragging, the drag opacity
  // overtakes the hint and the hint stops mattering.
  const hintOpacity = useMotionValue(0);
  useEffect(() => {
    if (index !== 0) return;
    const controls = animate(hintOpacity, [0, 0.45, 0.45, 0], {
      duration: 1.8,
      times: [0, 0.18, 0.72, 1],
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [index, hintOpacity]);

  const playOpacity = useTransform(
    [playOpacityFromDrag, hintOpacity],
    ([drag, hint]) => Math.max(drag as number, hint as number),
  );
  const nopeOpacity = useTransform(
    [nopeOpacityFromDrag, hintOpacity],
    ([drag, hint]) => Math.max(drag as number, hint as number),
  );

  return (
    // Outer row: affordances on the sides, card in the middle.
    // `flex` not absolute positioning, so everything reflows cleanly
    // at narrower viewports.
    <div className="flex items-center justify-center gap-[10px] w-full">
      <Affordance
        side="left"
        opacity={nopeOpacity}
        scale={nopeScaleFromDrag}
        ringColor="rgba(255, 66, 89, 0.85)"
      >
        <CrossIcon className="size-[24px] text-[#ff4259]" />
      </Affordance>

      {/* Card column — fixed-aspect frame holding the stacked cards. */}
      <div
        className="relative shrink-0"
        style={{
          // Landscape 4:3. Matches `south-park` (362×272), `birds-on-
          // a-wire` (800×600) and is close enough to `fruit-warp` (16:9)
          // that side cropping is moderate. Narrow width (260px) keeps
          // the hero from dominating the page.
          aspectRatio: "4 / 3",
          width: "260px",
        }}
      >
        {/* Underlay: the NEXT card peeking from behind. Drops to
            opacity 0.65 + a heavier scrim so it doesn't compete with
            the front card for attention. */}
        <NextCardPreview key={`peek-${index}`} game={next} />

        {/* Front: active draggable card. Remounted on every swipe so
            its drag transform starts cleanly at the centre. */}
        <SwipeCard
          key={`top-${index}`}
          x={x}
          game={current}
          onSwiped={() => setIndex((i) => i + 1)}
          // Tap (without dragging) opens the game. For now this is a
          // stub; once there's a /game/<slug> route or play modal
          // wired up, swap this for the real launch.
          onTap={() => {
            if (typeof window !== "undefined") {
              // eslint-disable-next-line no-console
              console.log("[SwipeableHero] open game →", current.title);
            }
          }}
        />
      </div>

      <Affordance
        side="right"
        opacity={playOpacity}
        scale={playScaleFromDrag}
        ringColor="rgba(10, 46, 203, 0.85)"
      >
        <PlayIcon className="size-[22px] text-mrq-blue translate-x-[2px]" />
      </Affordance>
    </div>
  );
}

/** The peek behind the active card. */
function NextCardPreview({ game }: { game: HeroGame }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      // Spring in slightly compressed.
      initial={{ scale: 0.9, y: 18, opacity: 0.5 }}
      // Resting peek: scale 0.93, y:16 so a small band of the next
      // card protrudes below the front card. Lower opacity (0.65) +
      // heavier scrim below so the back card reads firmly as "behind"
      // and doesn't compete with the front for visual attention.
      animate={{ scale: 0.93, y: 16, opacity: 0.65 }}
      transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.9 }}
      aria-hidden
    >
      <CardSurface game={game} />
      {/* Heavier scrim — pushes the back card visibly behind without
          obliterating the artwork. */}
      <div
        className="absolute inset-0 rounded-[14px] pointer-events-none"
        style={{ backgroundColor: "rgba(245, 245, 245, 0.45)" }}
      />
    </motion.div>
  );
}

function SwipeCard({
  game,
  x,
  onSwiped,
  onTap,
}: {
  game: HeroGame;
  x: MotionValue<number>;
  onSwiped: () => void;
  onTap: () => void;
}) {
  // Visual transforms derived from x.
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const opacity = useTransform(x, [-300, -50, 0, 50, 300], [0.5, 1, 1, 1, 0.5]);

  // Reset x to 0 whenever a fresh card mounts (post-swipe). Without
  // this the new card would inherit the previous card's exit position.
  useEffect(() => {
    x.set(0);
  }, [x]);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragElastic={0.7}
      dragMomentum={false}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      }}
      // Framer's onTap fires when the press is released without
      // having crossed the drag threshold. If the user dragged the
      // card, onTap is suppressed and onDragEnd takes over — so a
      // real swipe never accidentally fires the tap-to-open.
      onTap={onTap}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
          const direction = info.offset.x > 0 ? 1 : -1;
          // Right swipe = play. Left swipe = skip. Both currently
          // just advance the deck; the real game-launch flow plugs
          // in here for the right-swipe case.
          animate(x, direction * SWIPE_EXIT_DISTANCE, {
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1],
            onComplete: onSwiped,
          });
        } else {
          animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
        }
      }}
    >
      <CardSurface game={game} />
    </motion.div>
  );
}

/**
 * Affordance chip — sits OUTSIDE the card, vertically centred next
 * to it. Its opacity + scale are driven by the parent's drag motion
 * value, so as the user drags the card toward this side the chip
 * brightens and grows.
 */
function Affordance({
  side,
  opacity,
  scale,
  ringColor,
  children,
}: {
  side: "left" | "right";
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  ringColor: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      aria-hidden
      className="shrink-0 grid place-items-center pointer-events-none"
      style={{
        // Slight outward tilt for a Tinder-stamp feel.
        rotate: side === "left" ? "-10deg" : "10deg",
        width: "48px",
        height: "48px",
        borderRadius: "9999px",
        backgroundColor: "#ffffff",
        border: `2px solid ${ringColor}`,
        boxShadow: "0 6px 14px -6px rgba(10, 46, 203, 0.25)",
        opacity,
        scale,
      }}
    >
      {children}
    </motion.div>
  );
}

function CardSurface({ game }: { game: HeroGame }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[14px]"
      style={{
        boxShadow:
          "0 10px 24px -14px rgba(10, 46, 203, 0.4), 0 2px 6px -2px rgba(10, 46, 203, 0.18)",
      }}
    >
      {/* Artwork — pointer-events:none so the parent motion.div
          gets all touch/click events for dragging + tapping. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={game.src}
        alt={game.alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
      />

      {/* "Exclusive" sticker top-left — kept; smaller now that the
          card itself is smaller. */}
      {game.exclusive && (
        <div
          className="absolute left-[10px] top-[10px] grid place-items-center text-mrq-blue-dark pointer-events-none"
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: "#ffd400",
            clipPath: generateStarClip(12, 0.5, 0.85),
            transform: "rotate(-8deg)",
            border: "2px solid #ffffff",
            boxShadow: "0 4px 10px -4px rgba(10, 46, 203, 0.35)",
          }}
        >
          <span
            className="text-[11px] font-extrabold leading-none"
            style={{ letterSpacing: "0.02em" }}
          >
            exclusive
          </span>
        </div>
      )}

      {/* Title block bottom-left. Spans the full card width now that
          there's no action-button stack to clear on the right. */}
      <div
        className="absolute bottom-[12px] left-[14px] right-[14px] flex flex-col gap-[2px] text-white pointer-events-none"
        style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.45)" }}
      >
        <h3 className="text-[18px] font-extrabold leading-tight">
          {game.title}
        </h3>
        <p className="text-[12px] font-extrabold opacity-95">
          RTP: {game.rtp}
        </p>
      </div>
    </div>
  );
}

// Generate a star clip-path with N points and given inner/outer radii
// in normalized 0..1 (centre at 50,50).
function generateStarClip(points: number, innerR: number, outerR: number): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (Math.PI * i) / points - Math.PI / 2;
    const xv = 50 + Math.cos(a) * r * 50;
    const yv = 50 + Math.sin(a) * r * 50;
    pts.push(`${xv.toFixed(2)}% ${yv.toFixed(2)}%`);
  }
  return `polygon(${pts.join(", ")})`;
}

/* ----------- Inline icons ----------- */

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden
      focusable={false}
    >
      <path d="M4 2.5v11l10-5.5-10-5.5Z" />
    </svg>
  );
}
