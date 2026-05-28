"use client";

/**
 * Game-tile info corner — a small frosted-glass cutout in the
 * bottom-right of a square game tile carrying a brand-blue
 * circular "i" badge.
 *
 *   ╭──────────╮
 *   │ artwork  │
 *   │          │
 *   │       ⌒_ │  ← concave white-frosted corner
 *   │      (i) │  ← brand-blue info chip inside it
 *   ╰──────────╯
 *
 * Built with a single absolute-positioned div: the backdrop's
 * `border-top-left-radius` carves the concave inward curve, and
 * the blue chip sits inside the corner. Stays `pointer-events:
 * none` so the parent tile's tap target is unaffected.
 *
 * Used on the main square game tiles in rails (Hot Right Now,
 * Top 10, Same Vibe, etc.) and inline grid tiles
 * (CasinoCategoryView, CasinoAllGamesView, BuffaloBills Similar
 * games). Deliberately omitted on:
 *   • BigWinsRow (My Recent Wins) — per design feedback
 *   • Small horizontal-pill thumbnails (RecentlyPlayedGrid,
 *     LatestBigWinsRow) — the 38–52px thumb is too small to
 *     hang the badge off without crowding the artwork.
 *   • Mega-card preview tiles (72px) — same crowding issue.
 */
export function GameTileInfo({
  size = 36,
  chipSize = 20,
  onClick,
}: {
  /** Width/height of the frosted corner backdrop (px). */
  size?: number;
  /** Diameter of the blue info chip (px). */
  chipSize?: number;
  /** Tap handler for the chip. When provided, the chip becomes an
   *  interactive tap target (with stop-propagation so the parent
   *  tile's onClick doesn't also fire). The frosted backdrop stays
   *  non-interactive — only the chip is. */
  onClick?: () => void;
}) {
  return (
    <span
      // Backdrop stays non-interactive — taps fall through to the
      // tile underneath unless they land on the chip itself.
      aria-hidden
      className="absolute bottom-0 right-0 pointer-events-none"
      style={{
        width: size,
        height: size,
        // Quarter-circle concave cut into the tile. Radius equal to
        // the box size gives a perfect 90° arc.
        borderTopLeftRadius: size,
        backgroundColor: "rgba(245, 245, 245, 0.42)",
        backdropFilter: "blur(10px) saturate(140%)",
        WebkitBackdropFilter: "blur(10px) saturate(140%)",
      }}
    >
      {/* Chip — tucked into the very bottom-right corner. Translucent
          brand-blue dot. When onClick is provided, the chip captures
          its own tap (with pointer-events:auto + stopPropagation) so
          the parent tile's tap action doesn't also fire. */}
      <span
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? "Game info" : undefined}
        onClick={
          onClick
            ? (e) => {
                e.stopPropagation();
                e.preventDefault();
                onClick();
              }
            : undefined
        }
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        className="absolute grid place-items-center rounded-full"
        style={{
          width: chipSize,
          height: chipSize,
          right: 4,
          bottom: 4,
          backgroundColor: "rgba(10, 46, 203, 0.5)",
          pointerEvents: onClick ? "auto" : "none",
          cursor: onClick ? "pointer" : undefined,
        }}
      >
        <InfoGlyph size={Math.round(chipSize * 0.5)} />
      </span>
    </span>
  );
}

function InfoGlyph({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      // White glyph reads cleanly on the semi-transparent blue chip.
      fill="white"
      aria-hidden
      focusable={false}
    >
      {/* "i" glyph — small dot above a longer stem. */}
      <circle cx="7" cy="2.6" r="1.2" />
      <rect x="5.8" y="5" width="2.4" height="7" rx="1.2" />
    </svg>
  );
}
