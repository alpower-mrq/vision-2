"use client";

/* eslint-disable @next/next/no-img-element */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { useShell } from "@/lib/filter-context";

/**
 * Avatar picker — full-page brand-blue takeover (Netflix / Prime style)
 * opened from the Profile screen's avatar or pencil. Title sits left, an
 * X closes it top-right. Each set is a horizontally-scrolling grid:
 * Characters / Classics run two rows, Legends (only 8) runs one.
 *
 * Selecting writes the chosen image to shared shell state (persisted to
 * localStorage), so the Profile header AND the BrandBar pill update.
 */

const enc = (dir: string, file: string) => encodeURI(`/assets/avatars/${dir}/${file}`);

const SET1 = [
  "Avatar-standard-cowgirl-1.png",
  "Avatar-standard-cowgirl-2.png",
  "Avatar-standard-cowgirl-3.png",
  "Avatar-standard-dinner-girl-1.png",
  "Avatar-standard-dinner-girl-2.png",
  "Avatar-standard-dinner-girl-3.png",
  "Avatar-standard-gardener-1.png",
  "Avatar-standard-gardener-2.png",
  "Avatar-standard-gardener-3.png",
  "Avatar-standard-museum-guy-1.png",
  "Avatar-standard-museum-guy-2.png",
  "Avatar-standard-museum-guy-3.png",
  "Avatar-standard-warehouse-guy-1.png",
  "Avatar-standard-warehouse-guy-2.png",
  "Avatar-standard-warehouse-guy-3.png",
  "Avatar-standard-waterfall-guy-1.png",
  "Avatar-standard-waterfall-guy-2.png",
  "Avatar-standard-waterfall-guy-3.png",
  "Avatar-standard-wrecking-ball-guy-1.png",
  "Avatar-standard-wrecking-ball-guy-2.png",
  "Avatar-standard-wrecking-ball-guy-3.png",
  "Avatar-standard-yacht-guy-1.png",
  "Avatar-standard-yacht-guy-2.png",
  "Avatar-standard-yacht-guy-3.png",
].map((f) => enc("set1", f));

const SET2 = [
  "Avatar 89.png",
  "Avatar 90.png",
  "Avatar 92.png",
  "Avatar 93.png",
  "Avatar 96.png",
  "Avatar 97.png",
  "Avatar 100.png",
  "Avatar 103.png",
  "Avatar 104.png",
  "Avatar 106.png",
  "Avatar 107.png",
  "Avatar 111.png",
  "Avatar 112.png",
  "Avatar 113.png",
  "Avatar 114.png",
  "Avatar 115.png",
].map((f) => enc("set2", f));

const SET3 = [
  "Avatar 149.png",
  "Avatar 154.png",
  "Avatar 162.png",
  "Avatar 166.png",
  "Avatar 167.png",
  "Avatar 169.png",
  "Avatar 170.png",
  "Avatar 171.png",
].map((f) => enc("set3", f));

const SETS: { title: string; items: string[]; rows: number }[] = [
  { title: "The Usual Suspects", items: SET2, rows: 2 },
  { title: "Fresh Off the Reels", items: SET1, rows: 2 },
  { title: "Feeling Lucky?", items: SET3, rows: 1 },
];

export function AvatarPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  /** Fired when the user actually selects an avatar (not on hydration). */
  onPick?: () => void;
}) {
  const reduce = useReducedMotion();
  const { avatarSrc, setAvatar } = useShell();

  // Lock body scroll + Esc-to-close while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const pick = (src: string) => {
    setAvatar(src);
    onPick?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        // Clamped to the mobile-frame column (like SideNav) so on desktop
        // the takeover fills the 375px frame, not the whole viewport.
        <motion.div
          className="fixed inset-y-0 z-[70] flex flex-col overflow-hidden"
          style={{
            left: "var(--frame-right-offset)",
            right: "var(--frame-right-offset)",
            background: "#0c2287",
          }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Choose your avatar"
        >
          {/* Header — title left, X right */}
          <div
            className="flex items-center justify-between px-[20px] pb-[8px]"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 16px)" }}
          >
            <h1 className="text-[24px] font-extrabold text-white">Choose your avatar</h1>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-[40px] shrink-0 place-items-center active:scale-[0.9] transition-transform"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Body — vertical scroll through the sets; each set scrolls
              horizontally across its rows. */}
          <div
            className="flex-1 overflow-y-auto pt-[12px]"
            style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
          >
            {SETS.map((set) => (
              <section key={set.title} className="mb-[16px]">
                <h2 className="px-[20px] mb-[10px] text-[18px] font-extrabold text-white">
                  {set.title}
                </h2>
                {/* py gives the active ring room so it isn't clipped by the
                    horizontal scroll container's overflow. */}
                <div className="overflow-x-auto px-[20px] py-[8px]" style={{ scrollbarWidth: "none" }}>
                  <div
                    className="grid grid-flow-col auto-cols-max gap-[12px] w-max"
                    style={{ gridTemplateRows: `repeat(${set.rows}, minmax(0, 1fr))` }}
                  >
                    {set.items.map((src) => (
                      <AvatarSwatch
                        key={src}
                        src={src}
                        selected={src === avatarSrc}
                        onClick={() => pick(src)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AvatarSwatch({
  src,
  selected,
  onClick,
}: {
  src: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Select avatar"
      aria-pressed={selected}
      className="active:scale-[0.94] transition-transform"
    >
      {/* Square with rounded corners; active avatar gets a yellow ring. */}
      <span
        className="block size-[80px] rounded-[18px] overflow-hidden bg-white/5"
        style={{
          boxShadow: selected
            ? "0 0 0 3px #0a2ecb, 0 0 0 6px #ffdf00"
            : "inset 0 0 0 1px rgba(255,255,255,0.12)",
        }}
      >
        <img src={src} alt="" className="block size-full object-cover" draggable={false} />
      </span>
    </button>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
