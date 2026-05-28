"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

/**
 * Categories drop-panel — Netflix-style.
 *
 *   ┌──────────────────────────┐  ← page chrome (brand bar)
 *   │       Bingo              │
 *   │  ┌───────────────────┐   │
 *   │  │  All games        │   │  ← dark-glass dropdown
 *   │  │  New              │   │     anchored just below the
 *   │  │  Jackpot          │   │     brand bar, rounded corners,
 *   │  │  Megaways         │   │     translucent + heavy blur
 *   │  │  …                │   │
 *   │  └───────────────────┘   │
 *   └──────────────────────────┘
 *
 * Previously this was a slide-up bottom sheet with a grab handle,
 * close button and chevron rows. Switched to a top-anchored
 * dropdown to match the Netflix Films category picker — quieter,
 * faster to skim, no chrome competing with the content.
 *
 * Surface: rgba(20, 20, 20, 0.62) with a 40px blur + light border
 * highlight. Each row is just a white text label with generous
 * vertical padding — no icons, no chevrons.
 *
 * Backdrop tap + Esc dismiss. Opening locks page scroll.
 */

export type Category = { key: string; label: string };

export function CategoriesSheet({
  open,
  selected,
  categories,
  onSelect,
  onClose,
  title,
}: {
  open: boolean;
  /**
   * Currently selected row to highlight:
   *   - a category key (e.g. "jackpot") → that row is active
   *   - `null` → the "All games" row is active
   *   - `undefined` → NO row is active
   */
  selected: string | null | undefined;
  categories: Category[];
  onSelect: (key: string | null) => void;
  onClose: () => void;
  /** Currently unused — kept for API compatibility with callers
   *  that still pass it. The Netflix-style panel has no header. */
  title?: string;
}) {
  // Body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Silence the unused-prop warning without breaking the public API.
  void title;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — soft black dim, dismisses on tap. */}
          <motion.button
            type="button"
            aria-label="Close categories"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />

          {/* Panel — fixed near the top, just below the brand bar.
              Clamped to the mobile-frame's column via
              --frame-right-offset (matches BottomNav, ResumeBar). */}
          <motion.div
            role="dialog"
            aria-label="Categories"
            className="fixed z-50 overflow-hidden"
            style={{
              // Sit ~10px below the brand bar (safe-area + 56px bar
              // height + 14px breathing room).
              top: "calc(env(safe-area-inset-top) + 70px)",
              left: "calc(var(--frame-right-offset) + 16px)",
              right: "calc(var(--frame-right-offset) + 16px)",
              maxHeight: "calc(100dvh - env(safe-area-inset-top) - 160px)",
              borderRadius: 20,
              // Dark translucent glass — the Netflix panel feel.
              backgroundColor: "rgba(20, 20, 20, 0.62)",
              backdropFilter: "blur(40px) saturate(160%)",
              WebkitBackdropFilter: "blur(40px) saturate(160%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow:
                "0 20px 40px -10px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
            }}
            initial={{ y: -12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul
              className="overflow-y-auto"
              style={{
                maxHeight:
                  "calc(100dvh - env(safe-area-inset-top) - 160px)",
                paddingTop: 6,
                paddingBottom: 6,
              }}
            >
              <CategoryRow
                label="All games"
                active={selected === null}
                onClick={() => {
                  onSelect(null);
                  onClose();
                }}
              />
              {categories.map((cat) => (
                <CategoryRow
                  key={cat.key}
                  label={cat.label}
                  active={selected === cat.key}
                  onClick={() => {
                    onSelect(cat.key);
                    onClose();
                  }}
                />
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CategoryRow({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center text-left active:scale-[0.99] transition-transform"
        style={{
          paddingLeft: 22,
          paddingRight: 22,
          paddingTop: 14,
          paddingBottom: 14,
          backgroundColor: active
            ? "rgba(255, 255, 255, 0.08)"
            : "transparent",
        }}
      >
        <span
          className="leading-none"
          style={{
            color: "#ffffff",
            // Active rows get the heavier weight so the selected
            // category reads as locked in without needing a chevron
            // or icon.
            fontWeight: active ? 700 : 500,
            fontSize: 17,
          }}
        >
          {label}
        </span>
      </button>
    </li>
  );
}
