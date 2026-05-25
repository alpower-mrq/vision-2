"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useShell } from "@/lib/filter-context";

/**
 * Persistent bottom navigation — Lobby / Search / Discover / Rewards.
 *
 * Replaces the old single-page BottomBar (home + search pill + gift).
 * Now that Search/Discover/Rewards are real Next.js routes, the bar is
 * a tab bar: each item is a `<Link>`, and the visually active tab is
 * derived from `usePathname()` — survives reloads, deep links, the back
 * button, the lot.
 *
 * Visual treatment (matches Figma node 103:24911):
 *   • Active tab: rounded blue pill behind icon + label, white foreground
 *   • Inactive tabs: just icon + label in MrQ blue, no fill
 *   • Active pill slides between tabs via Framer Motion `layoutId` —
 *     subtle, smooth, no big bounce.
 *
 * Persists across every route in the shell, sitting above the bottom
 * safe-area inset so it clears the iOS home indicator / Safari chrome.
 */

type Tab = {
  key: string;
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const TABS: Tab[] = [
  { key: "lobby", href: "/", label: "Lobby", Icon: HomeIcon },
  { key: "search", href: "/search", label: "Search", Icon: SearchIcon },
  { key: "discover", href: "/discover", label: "Discover", Icon: DiscoverIcon },
  { key: "rewards", href: "/rewards", label: "Rewards", Icon: GiftIcon },
];

/** Which tab is "active" given the current pathname. Anything under
 *  `/search` counts as Search, etc. The Lobby tab catches `/` plus the
 *  category landing pages (`/casino`, `/live`, `/bingo`, `/arena`) so it
 *  stays lit when the user drills into a vertical from the top filters. */
function activeTabFor(pathname: string): string {
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/discover")) return "discover";
  if (pathname.startsWith("/rewards")) return "rewards";
  return "lobby";
}

export function BottomNav() {
  const pathname = usePathname();
  const active = activeTabFor(pathname);
  const reduce = useReducedMotion();
  const { bootDone } = useShell();

  // One-shot entrance on first paint after the splash dissolves —
  // matches the cadence the previous bottom bar used. Controlled via
  // CSS transition (not Framer's animate prop) so the entrance fires
  // exactly once and never re-triggers on context re-renders.
  const shown = reduce || bootDone;
  const entranceCss = reduce
    ? "none"
    : "opacity 0.3s 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s 0.9s cubic-bezier(0.22, 1, 0.36, 1)";

  // Floor sits at env(safe-area-inset-bottom) — covers the iOS Safari
  // chrome strip with a frosted white so the brand-blue pill on the
  // bar above doesn't bleed into the device chrome.
  const floorHeight = "env(safe-area-inset-bottom)";
  const barOffset = "calc(env(safe-area-inset-bottom) + 12px)";

  return (
    <>
      {/* Frosted white floor — hidden in PWA standalone via the
          `.bottom-bar-floor` rule in globals.css. */}
      <div
        className="bottom-bar-floor pointer-events-none fixed bottom-0 inset-x-0 z-30"
        style={{
          height: floorHeight,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          opacity: shown ? 1 : 0,
          transition: entranceCss,
        }}
        aria-hidden
      />

      {/* Floating tab bar */}
      <div
        className="pointer-events-none fixed inset-x-0 z-40 flex justify-center"
        style={{
          bottom: barOffset,
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
          transition: entranceCss,
        }}
      >
        <nav
          aria-label="Primary"
          className="pointer-events-auto flex w-full max-w-[var(--mobile-width)] items-stretch gap-[4px] rounded-full p-[6px] mx-[16px]"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            border: "1px solid #ced5f5",
            boxShadow:
              "0 16px 36px -12px rgba(10, 46, 203, 0.32), 0 2px 8px -2px rgba(10, 46, 203, 0.12)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {TABS.map((tab) => (
            <TabItem key={tab.key} tab={tab} active={tab.key === active} />
          ))}
        </nav>
      </div>
    </>
  );
}

function TabItem({ tab, active }: { tab: Tab; active: boolean }) {
  // Subtle press feedback — separate spring on tap so it feels instant.
  const [pressed, setPressed] = useState(false);
  // Reset press state after navigation so the next tap re-fires it.
  useEffect(() => {
    if (!pressed) return;
    const t = setTimeout(() => setPressed(false), 160);
    return () => clearTimeout(t);
  }, [pressed]);

  const Icon = tab.Icon;

  return (
    <Link
      href={tab.href}
      aria-current={active ? "page" : undefined}
      onPointerDown={() => setPressed(true)}
      className="relative flex flex-1 min-w-0 flex-col items-center justify-center rounded-full px-[6px] py-[8px]"
      style={{
        // Active foreground (icon + label) goes white because the pill
        // behind it is brand-blue; inactive sits in brand-blue on the
        // pale bar fill.
        color: active ? "#ffffff" : "var(--mrq-blue)",
        transform: pressed ? "scale(0.94)" : "scale(1)",
        transition: "transform 160ms cubic-bezier(0.22, 1, 0.36, 1), color 220ms ease",
      }}
    >
      {/* Sliding active-pill background — shared layoutId means Framer
          animates a single pill between tab positions instead of
          fading two separate pills in/out. The motion.div only exists
          on the active tab; AnimatePresence isn't needed because
          layoutId handles the transition. */}
      {active && (
        <motion.span
          layoutId="bottom-nav-pill"
          className="absolute inset-0 rounded-full -z-10"
          style={{ backgroundColor: "var(--mrq-blue)" }}
          transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}
          aria-hidden
        />
      )}

      <Icon className="h-[26px] w-auto" />
      <span
        className="mt-[4px] text-[12px] font-extrabold leading-none whitespace-nowrap"
        style={{ letterSpacing: "0.01em" }}
      >
        {tab.label}
      </span>
    </Link>
  );
}

/* ----------- Inline icons (24×24 lucide-style outlines) ----------- */

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable={false}>
      <path d="M12 3.172 3 11.05V21a1 1 0 0 0 1 1h5v-7h6v7h5a1 1 0 0 0 1-1v-9.95l-9-7.878Z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function DiscoverIcon({ className }: { className?: string }) {
  // Lightning bolt — "spark" for the Reels-style discover feed.
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable={false}>
      <path d="M13.5 2 4 14h6.5L9.5 22 20 9.5h-7L13.5 2Z" />
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <rect x="3" y="7" width="18" height="4" rx="1" />
      <path d="M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
      <path d="M12 7v14" />
      <path d="M12 7c-1.5-2-5.5-2-5.5 0 0 1 1 1.5 2.5 1.5 1.5 0 3-.5 3-1.5Z" />
      <path d="M12 7c1.5-2 5.5-2 5.5 0 0 1-1 1.5-2.5 1.5-1.5 0-3-.5-3-1.5Z" />
    </svg>
  );
}
