"use client";

import Link from "next/link";

/**
 * Arena — Figma 230:57295 ("Dashboard - 9PM price drop live").
 *
 * Two-tone brand surface (matches AppShell):
 *   • Top half: brand-blue #0a2ecb (matches BrandBar; carried by
 *     the page wrapper's bg)
 *   • Bottom half: brand-dark #0c2287 (painted by an absolute
 *     <ArenaBackdrop /> overlay starting just below the
 *     leaderboard, ~y=620)
 *
 * Page structure (top → bottom):
 *   1. Arena title row (h1 + Dashboard+ pill)
 *   2. Today's result card (rgba-white-15 surface, big "#14",
 *      "Open today's prize" white CTA)
 *   3. Today's final leaderboard (3 ranked rows + highlighted
 *      user row, "View full leaderboard" link)
 *   4. Play to climb (horizontal scroll of 146px game tiles)
 *   5. Yesterday's results card + "View price" link
 *   6. All eligible games (horizontal scroll of 146px tiles)
 *
 * Spacing tokens (Figma):
 *   --spacing/30x = 12, --spacing/40x = 16
 *   --radius/lg = 12, --radius/xl = 16, --radius/2xl = 20
 *
 * Typography (Gilroy):
 *   Heading/MD       30/1.2  ExtraBold  tracking -1.5  → "#14"
 *   Body/XL-XStrong  20/1.6  ExtraBold  tracking -0.3  → "#48"
 *   Body/Lg-XStrong  18/1.6  ExtraBold  tracking -0.3  → button label
 *   Body/MD-XStrong  16/1.6  ExtraBold                  → section titles
 *   Body/SM          14/1.6  Medium     tracking 0.1   → leaderboard rows
 *   Body/SM-XStrong  14/1.6  ExtraBold  tracking 0.1   → scores, view-all
 *   Body/XS          12/1.6  Medium     tracking 0.2   → "Yesterday" + small captions
 */

// ── Layout / colour constants ──────────────────────────────────────
const BRAND_TOP = "#0a2ecb";
const BRAND_DARK = "#0c2287";
const SURFACE_15 = "rgba(255, 255, 255, 0.15)"; // today's result card
const SURFACE_10 = "rgba(255, 255, 255, 0.10)"; // leaderboard rows, yesterday card
const SURFACE_30 = "rgba(255, 255, 255, 0.30)"; // current-user leaderboard row
const SURFACE_BORDER = "rgba(255, 255, 255, 0.08)";

type LeaderboardEntry = {
  rank: number;
  name: string;
  score: string;
  avatar: string;
  isUser?: boolean;
};

const LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "swiftSwan#102",
    score: "12,420",
    avatar: "/assets/arena/leaderboard-avatar.png",
  },
  {
    rank: 2,
    name: "RogueGoose#88",
    score: "10,810",
    avatar: "/assets/arena/leaderboard-avatar.png",
  },
  {
    rank: 3,
    name: "NeonNibble#19",
    score: "9,640",
    avatar: "/assets/arena/leaderboard-avatar.png",
  },
  {
    rank: 14,
    name: "You - Alba",
    score: "4,210",
    avatar: "/assets/arena/user-avatar.png",
    isUser: true,
  },
];

const PLAY_TO_CLIMB = [
  "/assets/arena/play-1.png",
  "/assets/arena/play-2.png",
  "/assets/arena/play-3.png",
];

const ELIGIBLE_GAMES = [
  "/assets/arena/eligible-1.png",
  "/assets/arena/eligible-2.png",
  "/assets/arena/eligible-3.png",
  "/assets/arena/eligible-4.png",
  "/assets/arena/eligible-5.png",
  "/assets/arena/eligible-6.png",
  "/assets/arena/eligible-7.png",
];

export default function ArenaPage() {
  return (
    <div
      className="relative min-h-[100dvh] pb-[32px]"
      style={{
        // Smooth vertical gradient from brand-blue at the top
        // to brand-dark at the bottom of the page. Replaces the
        // earlier two-tone treatment (a hard step at y=620 via
        // <ArenaBackdrop />), which the user asked to drop in
        // favour of a continuous fade.
        background: `linear-gradient(180deg, ${BRAND_TOP} 0%, ${BRAND_DARK} 100%)`,
        isolation: "isolate",
      }}
    >
      <ArenaTitleRow />
      <TodaysResult />
      <TodaysLeaderboard />
      <PlayToClimb />
      <YesterdayResults />
      <AllEligibleGames />
    </div>
  );
}

/* ============================================================
   1. TITLE ROW — Arena h1 + Dashboard+ pill
   ============================================================ */
function ArenaTitleRow() {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 16,
      }}
    >
      <h1
        className="text-white"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 35,
          lineHeight: 1,
          letterSpacing: 0.1,
        }}
      >
        Arena
      </h1>
      <div
        className="inline-flex items-center justify-center rounded-[4px]"
        style={{
          width: 118,
          height: 30,
          backgroundColor: "#9dabea", // Brand/200
        }}
      >
        <span
          className="text-white font-bold"
          style={{ fontSize: 16, lineHeight: 1.6, letterSpacing: 0.1 }}
        >
          Dashboard+
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   2. TODAY'S RESULT CARD
   ============================================================ */
function TodaysResult() {
  return (
    <section className="px-[16px]">
      <div
        className="rounded-[16px] flex flex-col"
        style={{
          backgroundColor: SURFACE_15,
          padding: 16,
          gap: 16,
        }}
      >
        <div>
          <p
            className="text-white font-medium opacity-70"
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              letterSpacing: 0.2,
            }}
          >
            Today&apos;s result
          </p>
          <p
            className="text-white font-extrabold"
            style={{
              fontSize: 30,
              lineHeight: 1.2,
              letterSpacing: -1.5,
              marginTop: 4,
            }}
          >
            You finished #14
          </p>
        </div>
        <button
          type="button"
          className="w-full flex items-center justify-center rounded-[8px] bg-white active:scale-[0.98] transition-transform"
          style={{ height: 48 }}
        >
          <span
            className="font-extrabold"
            style={{
              color: BRAND_DARK,
              fontSize: 18,
              lineHeight: 1.6,
              letterSpacing: -0.2,
            }}
          >
            Open today&apos;s prize
          </span>
        </button>
      </div>
    </section>
  );
}

/* ============================================================
   3. TODAY'S FINAL LEADERBOARD
   ============================================================ */
function TodaysLeaderboard() {
  return (
    <section className="px-[16px]" style={{ marginTop: 24 }}>
      <h2
        className="text-white font-extrabold"
        style={{ fontSize: 16, lineHeight: 1.6 }}
      >
        Today&apos;s final leaderboard
      </h2>
      <div
        className="flex flex-col"
        style={{ gap: 8, marginTop: 12 }}
      >
        {LEADERBOARD.map((entry) => (
          <LeaderboardRow key={entry.rank} entry={entry} />
        ))}
      </div>
      <Link
        href="#"
        className="block text-center text-white font-extrabold opacity-70 active:opacity-100 transition-opacity"
        style={{
          marginTop: 16,
          fontSize: 14,
          lineHeight: 1.6,
          letterSpacing: 0.1,
        }}
      >
        View full leaderboard
      </Link>
    </section>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div
      className="relative flex items-center rounded-[16px]"
      style={{
        height: 49,
        paddingLeft: 12,
        paddingRight: 16,
        backgroundColor: entry.isUser ? SURFACE_30 : SURFACE_10,
        border: `1px solid ${SURFACE_BORDER}`,
      }}
    >
      <div className="flex items-center" style={{ gap: 8 }}>
        <p
          className="text-white font-medium"
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            letterSpacing: 0.1,
            minWidth: 14,
          }}
        >
          {entry.rank}
        </p>
        {/* Avatar — 24×24 with a 2px white ring on the
            current-user row (matches Figma 230:57377). */}
        <div
          className="relative shrink-0 rounded-full overflow-hidden"
          style={{
            width: 24,
            height: 24,
            border: entry.isUser ? "2px solid #ffffff" : undefined,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.avatar}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        </div>
        <p
          className="text-white font-medium"
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            letterSpacing: 0.1,
          }}
        >
          {entry.name}
        </p>
      </div>
      <p
        className="ml-auto text-white font-extrabold"
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          letterSpacing: 0.1,
        }}
      >
        {entry.score}
      </p>
    </div>
  );
}

/* ============================================================
   4. PLAY TO CLIMB — horizontal carousel
   ============================================================ */
function PlayToClimb() {
  return (
    <ArenaGameRail
      title="Play to climb"
      tiles={PLAY_TO_CLIMB}
      marginTop={32}
    />
  );
}

/* ============================================================
   5. YESTERDAY'S RESULTS CARD
   ============================================================ */
function YesterdayResults() {
  return (
    <section className="px-[16px]" style={{ marginTop: 32 }}>
      <h2
        className="text-white font-extrabold"
        style={{ fontSize: 16, lineHeight: 1.6 }}
      >
        Yesterday&apos;s results
      </h2>
      <div
        className="rounded-[16px] flex items-center"
        style={{
          marginTop: 12,
          height: 99,
          paddingLeft: 16,
          paddingRight: 16,
          gap: 12,
          backgroundColor: SURFACE_10,
          border: `1px solid ${SURFACE_BORDER}`,
        }}
      >
        <div
          className="relative shrink-0"
          style={{ width: 75, height: 75 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/arena/yesterday-prize.png"
            alt=""
            className="absolute inset-0 size-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-white font-medium opacity-70"
            style={{
              fontSize: 12,
              lineHeight: 1.6,
              letterSpacing: 0.2,
            }}
          >
            Yesterday
          </p>
          <p
            className="text-white font-extrabold"
            style={{
              fontSize: 20,
              lineHeight: 1.6,
              letterSpacing: -0.3,
            }}
          >
            You finished #48
          </p>
        </div>
      </div>
      <Link
        href="#"
        className="block text-center text-white font-extrabold opacity-70 active:opacity-100 transition-opacity"
        style={{
          marginTop: 16,
          fontSize: 14,
          lineHeight: 1.6,
          letterSpacing: 0.1,
        }}
      >
        View price
      </Link>
    </section>
  );
}

/* ============================================================
   6. ALL ELIGIBLE GAMES — horizontal carousel
   ============================================================ */
function AllEligibleGames() {
  return (
    <ArenaGameRail
      title="All eligible games"
      tiles={ELIGIBLE_GAMES}
      marginTop={32}
    />
  );
}

/* ============================================================
   Shared rail component (146×146 tiles, 8px gap, scroll snap)
   ============================================================ */
function ArenaGameRail({
  title,
  tiles,
  marginTop,
}: {
  title: string;
  tiles: string[];
  marginTop: number;
}) {
  // SECTION carries the 16px page gutter (paddingLeft) so the
  // title AND the scroll's first tile both inherit it. This is
  // the same pattern that fixed the Rewards Available carousel
  // — putting padding on the inner flex of an overflow-x scroller
  // is unreliable, but the section's own padding is rock-solid.
  return (
    <section style={{ marginTop, paddingLeft: 16 }}>
      <h2
        className="text-white font-extrabold"
        style={{ paddingRight: 16, fontSize: 16, lineHeight: 1.6 }}
      >
        {title}
      </h2>
      <div
        className="no-scrollbar"
        style={{
          marginTop: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            paddingRight: 16,
            gap: 8,
          }}
        >
          {tiles.map((src, i) => (
            <ArenaGameTile key={i} src={src} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArenaGameTile({ src }: { src: string }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: 146,
        height: 146,
        borderRadius: 20,
        scrollSnapAlign: "start",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}
