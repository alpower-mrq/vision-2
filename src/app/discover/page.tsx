"use client";

/**
 * Discover — vertical-snap reels of game previews (TikTok / Reels style).
 *
 * SCAFFOLD: the structure is in place — a CSS scroll-snap container with
 * 100dvh-tall cards stacked vertically — but the per-card content is
 * placeholder. Each card is a "reel" that will eventually:
 *
 *   • Show a looping game preview video
 *   • Have a heart/favourite button on the right edge
 *   • Tap-through to the game's detail page
 *   • Swipe left → next reel; right → previous (or just vertical scroll)
 *
 * Why scroll-snap (not Framer Motion drag): native scroll-snap on iOS
 * Safari has momentum + rubber-banding for free, and the keyboard
 * accessibility (page up/down, arrow keys) works out of the box. A
 * Framer-based pager would feel less native on touch devices.
 *
 * The bottom nav stays visible on this page (per the spec, "navigation
 * still needs to make sense"). Splash + brand bar also persist from
 * the shared AppShell.
 */

type Reel = {
  id: string;
  game: string;
  studio: string;
  // Tailwind gradient classes — placeholder until real preview video
  // posters/loops are wired up.
  bg: string;
};

const REELS: Reel[] = [
  { id: "1", game: "Spicy Meatballs Megaways", studio: "Big Time Gaming", bg: "from-[#0a2ecb] to-[#ff4fb5]" },
  { id: "2", game: "Snake Arena Showdown", studio: "Quickspin", bg: "from-[#0c2287] to-[#ffd400]" },
  { id: "3", game: "Western Gold Duel", studio: "Microgaming", bg: "from-[#34c759] to-[#0a2ecb]" },
  { id: "4", game: "Golden Catch Cup", studio: "Hacksaw", bg: "from-[#ff4fb5] to-[#ffb800]" },
  { id: "5", game: "Crash Royale", studio: "Pragmatic", bg: "from-[#1d2b6e] to-[#38b6ff]" },
];

export default function DiscoverPage() {
  return (
    <div
      // overscroll-contain stops vertical scroll from bubbling out of the
      // reel column to the page; mandatory snap keeps each reel locked
      // to viewport once flicked.
      className="-mt-px relative h-[100dvh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory overscroll-contain bg-black"
      style={{ scrollbarWidth: "none" }}
    >
      {REELS.map((reel) => (
        <Reel key={reel.id} reel={reel} />
      ))}
    </div>
  );
}

function Reel({ reel }: { reel: Reel }) {
  return (
    <article
      className={`relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-gradient-to-br ${reel.bg}`}
    >
      {/* Placeholder content — replaced by <video autoplay loop muted />
          when the preview asset pipeline is in place. */}
      <div className="absolute inset-0 grid place-items-center">
        <p
          className="text-white opacity-30"
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "44px",
            letterSpacing: "1px",
            textShadow: "0 4px 14px rgba(0, 0, 0, 0.35)",
          }}
        >
          PREVIEW
        </p>
      </div>

      {/* Bottom-left meta: game title + studio. Lifted off the bottom
          edge so it clears the floating bottom nav. */}
      <div
        className="absolute left-0 right-[80px] px-[18px] flex flex-col gap-[4px] text-white"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 96px)",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] opacity-80">
          {reel.studio}
        </p>
        <h2 className="text-[22px] font-extrabold leading-tight">{reel.game}</h2>
        <button
          type="button"
          className="mt-[10px] self-start rounded-full bg-white text-mrq-blue px-[18px] py-[10px] text-[14px] font-extrabold active:scale-[0.97] transition-transform"
        >
          Play now
        </button>
      </div>

      {/* Right edge: vertical action stack (favourite, share, more) —
          mirrors the TikTok layout. Wired as stubs for now. */}
      <div
        className="absolute right-[12px] flex flex-col items-center gap-[18px]"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 120px)" }}
      >
        <ActionButton aria="Favourite this game">
          <HeartIcon className="size-[24px]" />
        </ActionButton>
        <ActionButton aria="Share this game">
          <ShareIcon className="size-[22px]" />
        </ActionButton>
        <ActionButton aria="More options">
          <MoreIcon className="size-[22px]" />
        </ActionButton>
      </div>
    </article>
  );
}

function ActionButton({ children, aria }: { children: React.ReactNode; aria: string }) {
  return (
    <button
      type="button"
      aria-label={aria}
      className="grid size-[44px] place-items-center rounded-full text-white active:scale-[0.9] transition-transform"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.32)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {children}
    </button>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden focusable={false}>
      <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 6.5-7 11-7 11Z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden focusable={false}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8 11 8-4M8 13l8 4" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable={false}>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}
