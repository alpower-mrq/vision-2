"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BINGO_ROOMS, type BingoRoom } from "@/lib/bingo-rooms";

/**
 * Bingo homepage — mirrors the Casino page chrome so the user gets a
 * familiar landing pattern across verticals.
 *
 *   ┌──────────────────────────────────────┐
 *   │  ←                          £113.59 ▢│  ← BrandBar (back arrow)
 *   ├──────────────────────────────────────┤
 *   │  Bingo                                │  ← Title only — the
 *   ├──────────────────────────────────────┤    Rooms chevron pill
 *   │  ┌──────────────────────────────────┐│    was redundant against
 *   │  │  [featured room artwork]         ││    the All-rooms list and
 *   │  │  ▲ Next game in 4 min  (badge)   ││    has been dropped.
 *   │  │  Tropic Like It's Hot            ││  ← Featured "next up" hero
 *   │  └──────────────────────────────────┘│
 *   │                                       │
 *   │  All rooms                            │
 *   │  ┌────────────────────────────────┐  │
 *   │  │ ▢ Room name        [Join]      │  │
 *   │  │   Tagline                      │  │  ← detailed list
 *   │  │   75-ball • 10p • 4m           │  │
 *   │  └────────────────────────────────┘  │
 *   │  ... (5 rooms)                        │
 *   └──────────────────────────────────────┘
 *
 * Previously this view also had a "Popular rooms" carousel between
 * the hero and the All-rooms list — dropped because the carousel
 * surfaced the same five rooms the list does, just less usefully
 * (no metadata, no Join). The Rooms chevron pill was dropped at the
 * same time: with only one bingo surface it had nowhere meaningful
 * to send the user.
 */
export function BingoView() {
  const reduce = useReducedMotion();

  // First room is the "featured" hero — Tropic Like It's Hot, the
  // brand flagship room.
  const featured = BINGO_ROOMS[0];

  return (
    <>
      {/* In-page header — title only. No CTA pill on bingo since the
          page is single-surface (rooms list lives right below). */}
      <div className="px-[16px] pt-[16px] pb-[18px]">
        <h1 className="text-[28px] font-extrabold leading-none text-[var(--mrq-blue-dark)]">
          Bingo
        </h1>
      </div>

      <FeaturedRoom room={featured} reduce={reduce} />

      <section className="px-[16px] pt-[8px] pb-[24px]">
        <h2 className="text-[18px] font-extrabold leading-none text-[var(--mrq-blue)] mb-[12px]">
          All rooms
        </h2>
        <div className="flex flex-col gap-[10px]">
          {BINGO_ROOMS.map((room) => (
            <RoomCard key={room.key} room={room} />
          ))}
        </div>
      </section>
    </>
  );
}

/* ============================================================
   Featured hero — single big room card at the top of the page.

   The "Next game in" indicator is now a floating yellow badge in the
   top-left of the hero: clock icon + countdown text in a high-
   contrast pill. Separating it from the title block at the bottom
   makes the time-sensitive signal pop instead of competing with the
   room name for attention.
   ============================================================ */
function FeaturedRoom({
  room,
  reduce,
}: {
  room: BingoRoom;
  reduce: boolean | null;
}) {
  return (
    <motion.section
      className="px-[16px] pb-[20px]"
      initial={false}
      animate={reduce ? undefined : { opacity: [0, 1], y: [6, 0] }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        aria-label={`Join ${room.name}`}
        className="relative w-full overflow-hidden rounded-[18px] active:scale-[0.99] transition-transform"
        style={{
          aspectRatio: "5 / 4",
          boxShadow:
            "0 14px 32px -16px rgba(10, 46, 203, 0.4), 0 2px 6px -2px rgba(10, 46, 203, 0.18)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.image}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
        />

        {/* Floating countdown badge — top-left. Yellow pill, navy
            text, soft shadow. Pulses subtly to reinforce that the
            countdown is live. */}
        <motion.div
          className="absolute top-[14px] left-[14px] flex items-center rounded-full"
          style={{
            backgroundColor: "#FFBD29", // brand-aligned yellow
            color: "var(--mrq-blue-dark)",
            height: 30,
            paddingLeft: 10,
            paddingRight: 14,
            gap: 6,
            boxShadow:
              "0 4px 12px -4px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
          }}
          animate={
            reduce
              ? undefined
              : {
                  // Gentle scale pulse every ~2s — calls the eye
                  // without distracting from the rest of the card.
                  scale: [1, 1.04, 1],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <ClockIcon />
          <span className="text-[13px] font-extrabold leading-none">
            Next game in {room.nextGameMins} min
          </span>
        </motion.div>

        {/* Dark gradient at the bottom for text legibility. Holds
            the room title + ball/ticket/jackpot summary. */}
        <div
          className="absolute inset-x-0 bottom-0 px-[18px] pb-[16px] pt-[80px] flex flex-col gap-[4px] text-left text-white"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.72) 10%, rgba(0, 0, 0, 0) 100%)",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.55)",
          }}
        >
          <h3 className="text-[24px] font-extrabold leading-tight">
            {room.name}
          </h3>
          <p className="text-[14px] font-bold opacity-95">
            {room.ballType} • {room.ticketPrice} ticket • Jackpot {room.jackpot}
          </p>
        </div>
      </button>
    </motion.section>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
    >
      <circle cx="7" cy="7" r="5.5" />
      <path d="M7 4v3l2 1.4" />
    </svg>
  );
}

/* ============================================================
   Room list card — used inside the "All rooms" section.
   ============================================================ */
function RoomCard({ room }: { room: BingoRoom }) {
  return (
    <button
      type="button"
      aria-label={`Join ${room.name}`}
      className="relative flex items-center gap-[14px] rounded-[16px] bg-white pl-[10px] pr-[14px] py-[10px] active:scale-[0.99] transition-transform text-left"
      style={{
        boxShadow: "0 4px 12px -4px rgba(10, 46, 203, 0.15)",
      }}
    >
      <div className="relative shrink-0 size-[72px] overflow-hidden rounded-[12px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.image}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[16px] font-extrabold leading-tight text-[var(--mrq-blue-dark)] truncate">
          {room.name}
        </h3>
        <p className="text-[12px] font-bold text-[var(--mrq-blue-dark)] opacity-60 mt-[2px] truncate">
          {room.tagline}
        </p>
        <div className="flex items-center gap-[6px] mt-[6px]">
          <span className="text-[12px] font-extrabold text-[var(--mrq-blue)]">
            {room.ballType}
          </span>
          <Dot />
          <span className="text-[12px] font-extrabold text-[var(--mrq-blue-dark)]">
            {room.ticketPrice}
          </span>
          <Dot />
          <span className="text-[12px] font-bold text-[var(--mrq-blue-dark)] opacity-70">
            Jackpot {room.jackpot}
          </span>
        </div>
      </div>

      <span
        className="shrink-0 inline-flex items-center justify-center px-[16px] h-[34px] rounded-full text-[14px] font-extrabold text-white"
        style={{ backgroundColor: "var(--mrq-blue)" }}
      >
        Join
      </span>
    </button>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="text-[12px] text-[var(--mrq-blue-dark)] opacity-40 select-none"
    >
      •
    </span>
  );
}
