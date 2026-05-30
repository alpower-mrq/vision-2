"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * "Suggested for you" interstitial slide for the Top Picks (/discover)
 * reels feed. Slots into the vertical-snap reel column the same way
 * an article does (full-height snap-start), and offers a sideways-
 * swipeable 4-page carousel — Casino → Live Casino → Bingo → Arena —
 * each with a 2×2 grid of game tiles.
 *
 * Inspired by Instagram's "Suggested for you" panel — the structure
 * (2×2 grid + dot indicator + page-specific subtitle) maps cleanly
 * onto our needs but with games instead of accounts, MrQ brand-blue
 * as the page surface, and Brand/900 as the tile surface.
 */

type Tile = {
  name: string;
  src: string;
  /** Optional route. When unset, tapping the tile just stubs out. */
  href?: string;
};

type Page = {
  id: "casino" | "live" | "bingo" | "arena";
  label: string;
  /** Always 4 — the 2×2 grid is hard-coded. */
  tiles: [Tile, Tile, Tile, Tile];
  /** Copy + destination for the "See all …" CTA pinned at the bottom
   *  of the big card. Routes the user to the category's own page so
   *  the suggestion slide can act as a launchpad into the full
   *  catalogue. */
  seeAllLabel: string;
  seeAllHref: string;
};

// Page-by-page tile sets. Reuses existing artwork from the rails.
const PAGES: ReadonlyArray<Page> = [
  {
    id: "casino",
    label: "Casino picks",
    tiles: [
      {
        name: "Buffalo Bills",
        src: "/assets/games/slot-01.png",
        href: "/play/buffalo-bills",
      },
      { name: "Tiki Tumble", src: "/assets/games/slot-08.png" },
      { name: "Snake Arena", src: "/assets/games/slot-13.png" },
      { name: "Jewel Stepper", src: "/assets/games/slot-04.png" },
    ],
    seeAllLabel: "See All Casino Games",
    seeAllHref: "/casino/games",
  },
  {
    id: "live",
    label: "Live Casino picks",
    tiles: [
      { name: "Lightning Roulette", src: "/assets/live/popular-01.png" },
      { name: "Crazy Time", src: "/assets/live/popular-02.png" },
      { name: "Mega Wheel", src: "/assets/live/table-01.png" },
      { name: "Lightning Storm", src: "/assets/live/popular-03.png" },
    ],
    seeAllLabel: "See All Live Casino",
    seeAllHref: "/casino/live",
  },
  {
    id: "bingo",
    label: "Bingo rooms",
    tiles: [
      {
        name: "Cheap as Chips",
        src: "/assets/bingo/lobby-cheap-as-chips.png",
        href: "/bingo",
      },
      {
        name: "Dab & Disco",
        src: "/assets/bingo/lobby-dab-and-disco.png",
        href: "/bingo",
      },
      {
        name: "On the House",
        src: "/assets/bingo/lobby-on-the-house.png",
        href: "/bingo",
      },
      {
        name: "Pinch a Penny",
        src: "/assets/bingo/lobby-pinch-a-penny.png",
        href: "/bingo",
      },
    ],
    seeAllLabel: "See All Bingo Rooms",
    seeAllHref: "/bingo",
  },
  {
    id: "arena",
    label: "Arena tournaments",
    tiles: [
      {
        name: "Big Bass Prize",
        src: "/assets/arena/big-bass-prize.png",
        href: "/arena",
      },
      { name: "Today's Pick", src: "/assets/arena/play-1.png", href: "/arena" },
      {
        name: "Open Tournament",
        src: "/assets/arena/play-2.png",
        href: "/arena",
      },
      { name: "Climb the Board", src: "/assets/arena/play-3.png", href: "/arena" },
    ],
    seeAllLabel: "See All Arena Tournaments",
    seeAllHref: "/arena",
  },
];

const TILE_BG = "#0C2287"; // Brand/900 — the "dark blue for game tiles" spec.

export function SuggestionCard({
  muted = false,
  onActiveChange,
}: {
  /** Page-level mute state from the discover feed. When true the
   *  bg music stays silent even on the active slide. */
  muted?: boolean;
  /** Fires whenever this slide enters / leaves the viewport at ≥60%
   *  intersection. Used by the parent (DiscoverPage) to hide the
   *  reel-feed's FixedReelChrome (mute / actions / title) while
   *  the suggestion card is in view, and to pause all reel videos
   *  so their audio doesn't leak under this slide's own music. */
  onActiveChange?: (active: boolean) => void;
}) {
  const router = useRouter();
  const articleRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const x = useMotionValue(0);

  // Measure the swipe viewport so the snap distance matches the
  // mobile-frame column on desktop, not a hard-coded value.
  useEffect(() => {
    const measure = () => {
      if (viewportRef.current) {
        setPageWidth(viewportRef.current.clientWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Track visibility — same ≥60% threshold the ReelArticle uses to
  // promote a reel to "active". Bubbles up so the parent can hide
  // the reel chrome (which is otherwise still painted over the
  // suggestion card on top of reel 3's metadata).
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const active = entry.intersectionRatio >= 0.6;
          setIsActive(active);
          onActiveChange?.(active);
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onActiveChange]);

  // Snap to the active page on every change. Drag-end below also
  // calls setPageIndex, which re-triggers this effect — same path
  // for both tap-on-dot and swipe-release.
  useEffect(() => {
    if (pageWidth === 0) return;
    animate(x, -pageIndex * pageWidth, {
      type: "spring",
      stiffness: 360,
      damping: 36,
      mass: 0.8,
    });
  }, [pageIndex, pageWidth, x]);

  // Bg music — play gametile_videobgmusic.mp3 in a loop while this
  // slide is active. Pauses immediately when the user scrolls away
  // (resets to 0 so each visit replays from the top) and honours
  // the page-level muted flag so the reel feed's speaker toggle
  // controls this too. Browser autoplay policy will block the
  // first cold play() if the user hasn't tapped yet — we swallow
  // the rejected promise so it doesn't crash, and the music will
  // start on the next active flip (when the user has interacted).
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
    if (isActive && !muted) {
      el.currentTime = 0;
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      el.pause();
      try {
        el.currentTime = 0;
      } catch {
        /* not seekable yet — ignore */
      }
    }
  }, [isActive, muted]);

  const currentPage = PAGES[pageIndex];

  return (
    <article
      ref={articleRef}
      className="relative w-full snap-start snap-always overflow-hidden"
      style={{
        height: "100dvh",
        backgroundColor: "var(--mrq-blue, #0a2ecb)",
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src="/assets/gametile_videobgmusic.mp3"
        loop
        preload="auto"
        aria-hidden
      />

      {/* Flat brand-blue cover — masks the BottomNav's default
          black-on-/discover scrim while this slide is in view.

          Sized to EXACTLY the BottomNav scrim's visible gradient
          footprint (100px from the viewport bottom — the nav's
          inner gradient is 90px, +10px buffer). Anything taller
          starts encroaching on the dots row sitting above the
          nav, so the cover stops short and the dots stay clear.

          zIndex 39 sits ABOVE the BottomNav's own scrim (z-30) and
          BELOW the nav buttons (z-40). Inline zIndex to guarantee
          the stacking order applies — a Tailwind arbitrary value
          can be JIT-purged in production builds. */}
      <motion.div
        aria-hidden
        className="fixed bottom-0 pointer-events-none"
        style={{
          left: "var(--frame-right-offset)",
          right: "var(--frame-right-offset)",
          height: 100,
          background: "var(--mrq-blue, #0a2ecb)",
          zIndex: 39,
        }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Layout: title + big card + dots, centred between the
          brand bar (top) and the BottomNav (bottom).

          Why absolute + manual bias: the /discover snap container
          uses -mt-[24px] to slide UP behind the brand bar's rounded
          corners. That means each article (this one included)
          extends 24px + brand-bar-height BELOW the viewport. A
          straight flex justify-center on the article would put the
          content at the article's geometric centre — which is
          visually BELOW the screen's centre because the article
          overflows downward.

          We absolute-position the content stack and offset it
          UPWARD by ~36px so it lands in the visual middle of what
          the user actually sees (between the brand bar and the
          nav), with the dots always on-screen. */}
      <div
        className="absolute inset-0 flex flex-col items-center"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 24px)",
          paddingBottom:
            "calc(var(--bottom-nav-h, 80px) + env(safe-area-inset-bottom) + 88px)",
          justifyContent: "center",
        }}
      >

        {/* Title — big, centred, single line. Drives the slide's
            visual hierarchy. */}
        <h2
          className="text-white text-[26px] font-extrabold text-center px-[24px] pb-[18px] leading-tight"
          style={{ letterSpacing: -0.4 }}
        >
          {currentPage.label}
        </h2>

        {/* Horizontal swipe viewport — sized to its content (no
            flex-1) so the dots sit right below the card instead
            of being pushed to the bottom of the slide. */}
        <div
          ref={viewportRef}
          className="relative overflow-hidden w-full"
        >
          <motion.div
            className="flex"
            style={{
              x,
              width: pageWidth * PAGES.length,
              touchAction: "pan-y",
            }}
            drag="x"
            dragConstraints={{
              left: -((PAGES.length - 1) * pageWidth),
              right: 0,
            }}
            dragElastic={0.18}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const SWIPE_OFFSET = 50;
              const SWIPE_VELOCITY = 350;
              const offset = info.offset.x;
              const velocity = info.velocity.x;
              let next = pageIndex;
              if (
                (offset < -SWIPE_OFFSET || velocity < -SWIPE_VELOCITY) &&
                pageIndex < PAGES.length - 1
              ) {
                next = pageIndex + 1;
              } else if (
                (offset > SWIPE_OFFSET || velocity > SWIPE_VELOCITY) &&
                pageIndex > 0
              ) {
                next = pageIndex - 1;
              }
              if (next === pageIndex) {
                animate(x, -pageIndex * pageWidth, {
                  type: "spring",
                  stiffness: 360,
                  damping: 36,
                });
              } else {
                setPageIndex(next);
              }
            }}
          >
            {PAGES.map((page) => (
              <div
                key={page.id}
                className="shrink-0 flex items-center justify-center px-[24px]"
                style={{ width: pageWidth || "100%" }}
              >
                {/* THE big card — single dark-blue frame around
                    all four artworks + a "See all …" CTA. Reads as
                    one cohesive object rather than four separate
                    cards. Subtle drop shadow + an inset hairline
                    highlight at the top edge give it a lifted,
                    premium feel against the brand-blue surface. */}
                <div
                  className="rounded-[22px] w-full"
                  style={{
                    backgroundColor: TILE_BG,
                    padding: 12,
                    maxWidth: 320,
                    boxShadow:
                      "0 24px 48px -20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <div
                    className="grid grid-cols-2"
                    style={{ gap: 8 }}
                  >
                    {page.tiles.map((tile, i) => (
                      <button
                        key={`${page.id}-${i}`}
                        type="button"
                        aria-label={`Play ${tile.name}`}
                        onClick={() => {
                          if (tile.href) {
                            router.push(tile.href);
                          }
                        }}
                        className="relative aspect-square overflow-hidden rounded-[14px] active:scale-[0.97] transition-transform"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tile.src}
                          alt={tile.name}
                          draggable={false}
                          className="absolute inset-0 size-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* See all CTA — white pill at the bottom of the
                      card, routes to the category's own page so the
                      slide doubles as a launchpad. Sits inside the
                      card (not below it) so it visually belongs to
                      the same object as the artworks. */}
                  <button
                    type="button"
                    onClick={() => router.push(page.seeAllHref)}
                    className="mt-[10px] w-full h-[40px] rounded-[12px] text-[13px] font-extrabold active:scale-[0.98] transition-transform"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "var(--mrq-blue-dark, #0c2287)",
                      letterSpacing: 0.2,
                    }}
                  >
                    {page.seeAllLabel}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Page dots — sit right below the card so they feel
            attached to it (and obviously swipable). Bigger + more
            confident than before so the user can see them at a
            glance and tap them comfortably. */}
        <div className="flex items-center justify-center gap-[10px] pt-[22px]">
          {PAGES.map((page, i) => {
            const active = i === pageIndex;
            return (
              <button
                key={page.id}
                type="button"
                aria-label={`Show ${page.label}`}
                onClick={() => setPageIndex(i)}
                className="grid place-items-center"
                style={{ width: 24, height: 24 }}
              >
                <span
                  className="block rounded-full transition-all"
                  style={{
                    width: active ? 22 : 8,
                    height: 8,
                    backgroundColor: active
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.32)",
                  }}
                />
              </button>
            );
          })}
        </div>

      </div>
    </article>
  );
}

