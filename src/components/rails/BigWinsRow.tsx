"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/**
 * "Your recent big wins" — horizontal scroll of game tiles with a
 * prize-pill straddling the bottom edge of each.
 *
 *   ┌────┐ ┌────┐ ┌────┐
 *   │art │ │art │ │art │  ← square game tiles
 *   └────┘ └────┘ └────┘
 *    £32   £28    £31    ← prize pill (overlapping bottom)
 *
 * Same pill treatment as the `/search` page's "Recent big wins"
 * section — pulled into its own component so it can live in
 * multiple places without duplicating the markup.
 */

export type Win = {
  src: string;
  alt: string;
  prize: string;
  /** Optional destination — tiles with an href render as a Link
   *  and route to the game page when tapped. Tiles without one
   *  stay as inert buttons for the games that haven't been built
   *  out yet. */
  href?: string;
};

export function BigWinsRow({
  title,
  items,
}: {
  title: string;
  items: Win[];
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      aria-label={title}
      className="pt-3 pb-[18px]"
      initial={false}
      animate={reduce ? undefined : { opacity: [0, 1], y: [6, 0] }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="px-[16px] pb-[10px] text-[18px] font-extrabold text-[var(--mrq-blue)]">
        {title}
      </h2>
      <div
        className="no-scrollbar flex gap-[12px] overflow-x-auto pl-[16px] pr-[16px]"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((win, i) => (
          <WinTile key={`${win.alt}-${i}`} win={win} />
        ))}
      </div>
    </motion.section>
  );
}

function WinTile({ win }: { win: Win }) {
  const tileClasses =
    "block size-[109px] overflow-hidden rounded-[12px] active:scale-[0.98] transition-transform";
  const inner = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={win.src}
      alt={win.alt}
      draggable={false}
      className="h-full w-full object-cover pointer-events-none"
    />
  );

  return (
    <div className="relative shrink-0 pb-[12px]">
      {win.href ? (
        <Link
          href={win.href}
          aria-label={`Play ${win.alt}`}
          className={tileClasses}
        >
          {inner}
        </Link>
      ) : (
        <button type="button" aria-label={win.alt} className={tileClasses}>
          {inner}
        </button>
      )}
      {/* Prize pill — straddles the bottom edge so it pops off the
          game artwork into the page canvas below. */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-white px-[10px] py-[3px] whitespace-nowrap pointer-events-none"
        style={{ boxShadow: "0 4px 10px -4px rgba(10, 46, 203, 0.18)" }}
      >
        <span className="text-[13px] font-extrabold text-[var(--mrq-blue)]">
          {win.prize}
        </span>
      </div>
    </div>
  );
}
