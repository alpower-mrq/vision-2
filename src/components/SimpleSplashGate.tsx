"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useShell } from "@/lib/filter-context";

/**
 * Simple branded splash — the returning-user counterpart to the
 * WelcomeGate.
 *
 *   ┌─────────────────────────────┐
 *   │                             │
 *   │           MrQ               │  ← brand wordmark
 *   │   Took you long enough._    │  ← randomised typed line
 *   │                             │
 *   └─────────────────────────────┘
 *
 * Plays for ~2200 ms on every app open ONLY if the user has the
 * `hasLoggedIn` flag set in localStorage. First-time users get the
 * WelcomeGate instead; this component dismisses itself instantly
 * for them.
 *
 * The typed message below the logo cycles randomly through a short
 * pool of brand voice lines on every load. Easy to add / edit:
 * just push to the `LINES` array.
 *
 * Sits at z-[65] — above the WelcomeGate (z-[60]) so on first
 * paint the brand-blue splash surface covers both possible paths,
 * and the right one stays visible after the mount-time
 * localStorage check decides.
 */

const HOLD_MS = 2200;
// Pool of brand voice lines — randomly picked on each app open.
// User maintains this list; new entries can be appended freely.
const LINES = [
  "Took you long enough.",
  "I was starting to worry.",
  "Here for the vibes, I hope.",
];

const TYPE_INTERVAL_MS = 38;

export function SimpleSplashGate() {
  const { markBootDone } = useShell();
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState(false);

  // Pick the line once per mount so it doesn't change mid-type.
  const line = useMemo(
    () => LINES[Math.floor(Math.random() * LINES.length)],
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasLoggedIn = localStorage.getItem("hasLoggedIn") === "1";

    if (!hasLoggedIn) {
      // First-time user — the WelcomeGate underneath takes over.
      // Dismiss instantly without firing bootDone so the welcome
      // flow gets to control that signal.
      setVisible(false);
      return;
    }

    // Returning user — show the splash, run the typewriter, then
    // mark boot done and fade out.
    setActive(true);
    const timer = window.setTimeout(() => {
      markBootDone();
      setVisible(false);
    }, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [markBootDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 bottom-0 z-[65] overflow-hidden flex flex-col items-center justify-center"
          style={{
            left: "var(--frame-right-offset)",
            right: "var(--frame-right-offset)",
            backgroundColor: "var(--mrq-blue)",
            gap: 24,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.55, 0, 0.45, 1] }}
          aria-hidden
        >
          {/* MrQ wordmark — mask-image trick so the SVG's
              preserveAspectRatio="none" baked in doesn't stretch it.
              140×54 at the natural 83:32 ratio. White paint over
              the brand-blue surface. */}
          <span
            role="img"
            aria-label="MrQ"
            style={{
              display: "block",
              width: 140,
              height: 54,
              backgroundColor: "#ffffff",
              WebkitMaskImage: "url(/assets/logo-mrq.svg)",
              maskImage: "url(/assets/logo-mrq.svg)",
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />

          {/* Typewriter line — renders only when `active` is true
              (i.e. for the returning-user path), starts blank,
              types one character at a time. */}
          {active && <TypedLine text={line} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TypedLine({ text }: { text: string }) {
  // Track how many characters we've revealed so far.
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= text.length) return;
    const t = window.setTimeout(() => setShown((n) => n + 1), TYPE_INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [shown, text]);

  return (
    <p
      className="text-center"
      style={{
        color: "#ffffff",
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: -0.1,
        lineHeight: 1.4,
        minHeight: 26, // reserve space so the layout doesn't jump on first char
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {text.slice(0, shown)}
      {/* Blinking cursor — visible while we're still typing, hidden
          once the full line is revealed. */}
      {shown < text.length && (
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "2px",
            height: "0.95em",
            marginLeft: "2px",
            verticalAlign: "text-bottom",
            backgroundColor: "#ffffff",
            animation: "splashCursorBlink 0.9s steps(1) infinite",
          }}
        />
      )}
      <style jsx>{`
        @keyframes splashCursorBlink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </p>
  );
}
