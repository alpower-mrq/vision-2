"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useState } from "react";

/**
 * Tinder-style swipeable hero card.
 *
 * A stack of game cards is shown one at a time. The user drags the
 * top card horizontally; past a threshold it animates off-screen and
 * the next game slides in from a slightly smaller scale (mimicking
 * the "card behind" appearing).
 *
 * Drag mechanics:
 *   • Horizontal drag only (`drag="x"`).
 *   • Card rotates with displacement (-12° at -300px, +12° at +300px).
 *   • Past ±100px on release, animate to ±500px then advance the
 *     index — the next card mounts at scale:0.95 and grows in.
 *   • Below threshold, springs back to centre.
 *
 * Visual elements on each card:
 *   • Full-bleed game artwork
 *   • Yellow "Exclusive" sticker top-left
 *   • Title + RTP bottom-left
 *   • Info / Heart / Play action stack on the right edge
 *
 * The card list loops (modulo); the user can keep swiping forever.
 */

export type HeroGame = {
  src: string;
  alt: string;
  title: string;
  rtp: string;
  /** Show the yellow "Exclusive" sticker on this card */
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

  return (
    <div
      className="relative w-full"
      style={{
        // ~95% of mobile-frame width, taller than wide so the artwork
        // dominates and the action buttons + bottom title fit naturally.
        aspectRatio: "337 / 380",
        maxWidth: "calc(var(--mobile-width) - 24px)",
        margin: "0 auto",
      }}
    >
      {/* Underlay: the NEXT card, peeking from behind. Slightly
          smaller and pushed down a few pixels so the user can see
          there's another card waiting. When the top card swipes
          away, this underlay grows into the front position (handled
          by the `key`-driven remount on the front card). */}
      <NextCardPreview key={`peek-${index}`} game={next} />

      {/* Front: the active draggable card. Remounted (via the
          changing key) each time the user swipes one away, so the
          motion value resets cleanly to centre. */}
      <SwipeCard
        key={`top-${index}`}
        game={current}
        onSwiped={() => setIndex((i) => i + 1)}
      />
    </div>
  );
}

/** The peek behind the active card — non-interactive, slightly
 *  smaller, dimmed by a soft scrim. When the front card swipes off,
 *  this one expands into the front position with a quick spring. */
function NextCardPreview({ game }: { game: HeroGame }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ scale: 0.92, y: 14, opacity: 0.75 }}
      animate={{ scale: 0.95, y: 10, opacity: 0.92 }}
      transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.9 }}
      aria-hidden
    >
      <CardSurface game={game} />
      {/* Subtle scrim so the back card reads as "behind" rather than
          competing for attention with the front. Goes away as the
          front card is dragged (could be wired to drag progress
          later; static for now). */}
      <div
        className="absolute inset-0 rounded-[18px] pointer-events-none"
        style={{ backgroundColor: "rgba(245, 245, 245, 0.22)" }}
      />
    </motion.div>
  );
}

function SwipeCard({
  game,
  onSwiped,
}: {
  game: HeroGame;
  onSwiped: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  // Opacity dips slightly at the edges of the drag — a subtle cue that
  // you're close to dismissing.
  const opacity = useTransform(x, [-300, -50, 0, 50, 300], [0.5, 1, 1, 1, 0.5]);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragElastic={0.7}
      dragMomentum={false}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
          const direction = info.offset.x > 0 ? 1 : -1;
          animate(x, direction * SWIPE_EXIT_DISTANCE, {
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1],
            onComplete: onSwiped,
          });
        } else {
          // Snap back to centre.
          animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
        }
      }}
    >
      <CardSurface game={game} />
    </motion.div>
  );
}

function CardSurface({ game }: { game: HeroGame }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[18px]"
      style={{
        boxShadow:
          "0 14px 32px -16px rgba(10, 46, 203, 0.4), 0 2px 6px -2px rgba(10, 46, 203, 0.18)",
      }}
    >
      {/* Artwork */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={game.src}
        alt={game.alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* "Exclusive" sticker top-left */}
      {game.exclusive && (
        <div
          className="absolute left-[18px] top-[18px] grid place-items-center text-mrq-blue-dark"
          style={{
            width: "78px",
            height: "78px",
            // Yellow burst star — twelve points using a single
            // background-image-free CSS approach (clip-path).
            backgroundColor: "#ffd400",
            // Twelve-pointed star clip-path. The peaks alternate between
            // a "tall point" radius and a "short trough" radius around
            // the centre.
            clipPath: generateStarClip(12, 0.5, 0.85),
            transform: "rotate(-8deg)",
            border: "2px solid #ffffff",
            boxShadow: "0 4px 10px -4px rgba(10, 46, 203, 0.35)",
          }}
        >
          <span
            className="text-[15px] font-extrabold leading-none"
            style={{ letterSpacing: "0.02em" }}
          >
            exclusive
          </span>
        </div>
      )}

      {/* Title block bottom-left */}
      <div
        className="absolute bottom-[18px] left-[18px] right-[88px] flex flex-col gap-[2px] text-white pointer-events-none"
        style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.45)" }}
      >
        <h3 className="text-[22px] font-extrabold leading-tight">
          {game.title}
        </h3>
        <p className="text-[14px] font-extrabold opacity-95">
          RTP: {game.rtp}
        </p>
      </div>

      {/* Action stack right-edge */}
      <div className="absolute bottom-[18px] right-[14px] flex flex-col items-center gap-[12px]">
        <ActionButton aria="Game info">
          <InfoIcon className="size-[20px] text-white" />
        </ActionButton>
        <ActionButton aria="Favourite">
          <HeartIcon className="size-[20px] text-white" />
        </ActionButton>
        <PlayButton aria="Play">
          <PlayIcon className="size-[18px] text-white" />
        </PlayButton>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  aria,
}: {
  children: React.ReactNode;
  aria: string;
}) {
  return (
    <button
      type="button"
      aria-label={aria}
      // pointer-events on so the buttons remain tappable even though
      // the card is draggable. Framer's drag handler ignores clicks
      // that don't translate the card past threshold.
      className="grid size-[42px] place-items-center rounded-full active:scale-[0.9] transition-transform"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.20)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.20)",
      }}
    >
      {children}
    </button>
  );
}

function PlayButton({
  children,
  aria,
}: {
  children: React.ReactNode;
  aria: string;
}) {
  return (
    <button
      type="button"
      aria-label={aria}
      className="grid size-[52px] place-items-center rounded-full active:scale-[0.92] transition-transform"
      style={{
        backgroundColor: "var(--mrq-blue)",
        boxShadow:
          "0 8px 18px -6px rgba(10, 46, 203, 0.55), 0 2px 6px -2px rgba(10, 46, 203, 0.22)",
      }}
    >
      {children}
    </button>
  );
}

// Generate a star clip-path with N points and given inner/outer radii
// in normalized 0..1 (centre at 50,50).
function generateStarClip(points: number, innerR: number, outerR: number): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (Math.PI * i) / points - Math.PI / 2;
    const x = 50 + Math.cos(a) * r * 50;
    const y = 50 + Math.sin(a) * r * 50;
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return `polygon(${pts.join(", ")})`;
}

/* ----------- Inline icons ----------- */

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden focusable={false}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v5h1" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden focusable={false}>
      <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 6.5-7 11-7 11Z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden focusable={false}>
      <path d="M4 2.5v11l10-5.5-10-5.5Z" />
    </svg>
  );
}
