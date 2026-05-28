"use client";

import { useEffect, useRef, useState } from "react";

/**
 * For You / Discover — vertical-snap reels feed (TikTok / Reels style).
 *
 * Performance contract — every choice here is in service of:
 *
 *   1. First frame visible almost immediately on landing.
 *   2. Smooth flick-scrolling, no jank from background videos.
 *   3. Minimum bytes pulled over the wire on cellular.
 *   4. Hardware-accelerated playback on iPhone Safari.
 *
 * How it's achieved:
 *
 *   • Native CSS `scroll-snap-type: y mandatory` for the pager — no
 *     JS pager, no Framer drag. Lets iOS Safari's compositor own the
 *     scroll thread.
 *   • IntersectionObserver per reel: only the reel whose video element
 *     is ≥60% in view plays. Off-screen reels are paused AND have
 *     their `currentTime` reset to 0 so the buffer can be reclaimed.
 *   • Eager `<video preload="auto">` only on the active reel + the
 *     next ONE in line. Every other reel sits at `preload="none"` so
 *     the browser doesn't fetch metadata for clips the user may never
 *     reach.
 *   • The `<video>` element uses `poster` (the slot artwork PNG) for
 *     the first paint, then crossfades to the moving frames once
 *     `playing` fires. No spinners, no blank black boxes.
 *   • `muted` + `playsInline` so iOS honours autoplay without a tap.
 *   • `style={{ transform: "translateZ(0)" }}` on the video element
 *     forces it onto its own GPU layer so the compositor can scroll
 *     the page without redrawing the video frames.
 *
 * Source video requirements (re-encode the originals to match these
 * specs before shipping — the raw files in public/assets/videos are
 * 8–15 MB each, which is too heavy for cellular):
 *
 *   ffmpeg -i input.mp4 \
 *     -c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p \
 *     -vf "scale='min(720,iw)':-2,fps=30" \
 *     -preset slow -b:v 1500k -maxrate 1800k -bufsize 3M \
 *     -g 48 -keyint_min 48 -sc_threshold 0 \
 *     -c:a aac -b:a 96k -ac 2 -ar 44100 \
 *     -movflags +faststart \
 *     output.mp4
 *
 *   • H.264 main profile, 4:2:0 YUV — universal hardware decode.
 *   • Max 720x1280 portrait, 30fps, 1.5 Mbps CBR-ish.
 *   • 48-frame keyframe interval (1.6s @ 30fps) so seeks land fast.
 *   • AAC stereo 96 kbps audio.
 *   • `+faststart` rewrites the moov atom to the front of the file
 *     so the player can start decoding before the full file lands.
 */

type Reel = {
  id: string;
  game: string;
  studio: string;
  /** Static poster shown until the video stream is ready to paint
   *  its first frame. Same slot artwork used elsewhere in the app
   *  — already cached if the user has visited Casino. */
  poster: string;
  /** MP4 source, served from /public so it streams through the
   *  Next.js static handler with proper range-request support. */
  video: string;
};

const REELS: Reel[] = [
  {
    id: "v1",
    game: "Buffalo Bills",
    studio: "Big Time Gaming",
    poster: "/assets/games/slot-01.png",
    video: "/assets/videos/video1.mp4",
  },
  {
    id: "v2",
    game: "Tiki Tumble",
    studio: "Quickspin",
    poster: "/assets/games/slot-08.png",
    video: "/assets/videos/video2.mp4",
  },
  {
    id: "v3",
    game: "Jewel Stepper",
    studio: "Microgaming",
    poster: "/assets/games/slot-04.png",
    video: "/assets/videos/video3.mp4",
  },
];

export default function DiscoverPage() {
  // Index of the reel currently snapped into view. Drives both
  // playback (only this reel runs its video) and preloading (this
  // reel + the next one get preload="auto"; the rest stay at "none").
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      // -mt-px tucks the reel column behind the BrandBar's bottom
      // pixel — without it, the rounded corners of the brand bar
      // reveal a hairline of #f5f5f5 page bg at the top of the reel.
      className="-mt-px relative h-[100dvh] overflow-y-auto overflow-x-hidden snap-y snap-mandatory overscroll-contain bg-black"
      style={{
        scrollbarWidth: "none",
        // Tell iOS Safari this scroll-port owns its own scroll
        // thread; helps keep the video frames smooth while the
        // user is mid-flick.
        WebkitOverflowScrolling: "touch",
      }}
    >
      {REELS.map((reel, i) => (
        <ReelView
          key={reel.id}
          reel={reel}
          index={i}
          activeIndex={activeIndex}
          onEnter={() => setActiveIndex(i)}
        />
      ))}
    </div>
  );
}

function ReelView({
  reel,
  index,
  activeIndex,
  onEnter,
}: {
  reel: Reel;
  index: number;
  activeIndex: number;
  onEnter: () => void;
}) {
  const articleRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [firstFramePainted, setFirstFramePainted] = useState(false);

  const isActive = index === activeIndex;
  // Preload aggressively for the active reel + the next one in line.
  // Everything else stays at "none" so the browser doesn't even fetch
  // metadata until it's needed.
  const preload =
    index === activeIndex || index === activeIndex + 1 ? "auto" : "none";

  // Sync up which reel is in view. IntersectionObserver fires once
  // ≥60% of the reel is visible — that's the "snapped into place"
  // threshold for the scroll-snap pager.
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            onEnter();
          }
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onEnter]);

  // Drive playback off the `isActive` flag. Active reel plays; every
  // other reel pauses and resets its currentTime so the browser can
  // reclaim the decoded-frame buffer.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      // Best-effort autoplay. Safari rejects this if the tab loses
      // focus mid-flick; we silently swallow the error.
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
      // Reset so the next time this reel comes into view it starts
      // from the top instead of resuming mid-clip.
      try {
        v.currentTime = 0;
      } catch {
        // currentTime can throw if the video isn't seekable yet.
      }
      // Drop any half-buffered frames. Reloading with the same src
      // is the trick to nudge the browser into freeing memory.
      v.removeAttribute("src");
      v.load();
      v.src = reel.video;
    }
  }, [isActive, reel.video]);

  return (
    <article
      ref={articleRef}
      className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-black"
    >
      {/* Poster — shown until the first real frame paints. Same slot
          artwork used elsewhere in the app, so it's already in the
          browser cache by the time the user lands here. Crossfaded
          out once the video element fires `playing`. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={reel.poster}
        alt=""
        aria-hidden
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-200"
        style={{ opacity: firstFramePainted ? 0 : 1 }}
      />

      <video
        ref={videoRef}
        src={reel.video}
        poster={reel.poster}
        // Autoplay-friendly defaults: silent + inline so iOS allows
        // it without a tap; loop so the clip cycles.
        autoPlay={isActive}
        muted
        loop
        playsInline
        // Hint the codec + container so iOS Safari doesn't sniff.
        // muted-autoplay also helps preserve battery on iPhone.
        // eslint-disable-next-line react/no-unknown-property
        disableRemotePlayback
        controls={false}
        // disablePictureInPicture so the user can't accidentally pop
        // a reel out — kills the smooth scroll if it happens.
        // eslint-disable-next-line react/no-unknown-property
        disablePictureInPicture
        preload={preload}
        onPlaying={() => setFirstFramePainted(true)}
        onLoadedData={() => {
          // If the active reel finishes loading its first frame
          // before `playing` fires (e.g. the user is mid-scroll and
          // pause was called), still hide the poster so the eventual
          // play call doesn't briefly flash the static artwork.
          if (isActive) setFirstFramePainted(true);
        }}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        // Force the video onto its own GPU compositor layer so the
        // page can scroll without re-rasterising the video frames.
        style={{ transform: "translateZ(0)", willChange: "transform" }}
      />

      {/* Soft bottom gradient so the title + action stack reads on
          top of the video regardless of frame brightness. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden
      />

      {/* Bottom-left meta: studio + game title. Anchored to the
          BottomNav's actual top edge via --bottom-nav-h, so the
          title sits at a consistent visual offset in browser mode
          AND standalone PWA mode (where the bottom nav has a
          different effective height). */}
      <div
        className="absolute left-0 right-[88px] px-[18px] flex flex-col gap-[4px] text-white pointer-events-none"
        style={{
          bottom: "calc(var(--bottom-nav-h) + 28px)",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] opacity-80">
          {reel.studio}
        </p>
        <h2 className="text-[22px] font-extrabold leading-tight">
          {reel.game}
        </h2>
      </div>

      {/* Right-edge action stack — same --bottom-nav-h anchor so the
          buttons clear the floating tab bar by the same gap in every
          mode. */}
      <div
        className="absolute right-[12px] flex flex-col items-center gap-[14px]"
        style={{
          bottom: "calc(var(--bottom-nav-h) + 60px)",
        }}
      >
        <ActionButton aria="Game info">
          <InfoIcon className="size-[22px] text-white" />
        </ActionButton>
        <ActionButton aria="Favourite game">
          <HeartIcon className="size-[22px] text-white" />
        </ActionButton>
        <PlayButton aria={`Play ${reel.game}`}>
          <PlayIcon className="size-[22px] text-white translate-x-[2px]" />
        </PlayButton>
      </div>
    </article>
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
      className="grid size-[46px] place-items-center rounded-full text-white active:scale-[0.9] transition-transform"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.32)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
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
      className="grid size-[56px] place-items-center rounded-full active:scale-[0.92] transition-transform"
      style={{
        backgroundColor: "var(--mrq-blue)",
        boxShadow:
          "0 10px 22px -8px rgba(10, 46, 203, 0.6), 0 2px 6px -2px rgba(10, 46, 203, 0.22)",
      }}
    >
      {children}
    </button>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v5h1" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 6.5-7 11-7 11Z" />
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
