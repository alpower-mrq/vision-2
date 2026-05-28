"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CategoriesSheet, type Category } from "../CategoriesSheet";
import { ChevronDownIcon } from "../CategoryChevron";
import { GameRail } from "@/components/rails/GameRail";
import { BINGO_ROOMS, type BingoRoom } from "@/lib/bingo-rooms";

/**
 * Bingo homepage — mirrors the Casino page chrome so the user gets a
 * familiar landing pattern across verticals.
 *
 *   ┌──────────────────────────────────────┐
 *   │  ←                          £113.59 ▢│  ← BrandBar (back arrow)
 *   ├──────────────────────────────────────┤
 *   │  Bingo                    Rooms ⌄    │  ← In-page header
 *   ├──────────────────────────────────────┤
 *   │  ┌──────────────────────────────────┐│
 *   │  │  [featured room artwork]         ││  ← Featured "next up" hero
 *   │  │  Next game in 4 min              ││
 *   │  │  Tropic Like It's Hot            ││
 *   │  └──────────────────────────────────┘│
 *   │                                       │
 *   │  Popular rooms          (no See all)  │
 *   │  ▢▢▢ ▢▢▢ ▢▢▢ ▢▢▢ ▢▢▢                  │  ← 146×146 tile rail
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
 * The header chevron pill opens the same CategoriesSheet used by the
 * Casino routes, but feeds it the bingo rooms list so tapping a room
 * could later scroll to that section. For now the sheet selection
 * just closes — the prototype is single-page so there's nowhere to
 * navigate to.
 */
export function BingoView() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduce = useReducedMotion();

  // First room is the "featured" hero — Tropic Like It's Hot, the
  // brand flagship room.
  const featured = BINGO_ROOMS[0];

  // The sheet reuses Casino's CategoriesSheet, which takes a generic
  // Category[]. Map each bingo room into that shape.
  const sheetCategories: Category[] = BINGO_ROOMS.map((r) => ({
    key: r.key,
    label: r.name,
  }));

  // Tile rail wants {src, alt}. The lobby PNGs are landscape-ish but
  // we render them in 146×146 squares (object-cover) — the room art
  // crops cleanly to a square thumbnail.
  const popularTiles = BINGO_ROOMS.map((r) => ({ src: r.image, alt: r.name }));

  return (
    <>
      {/* In-page header — same pattern as /casino. */}
      <div className="flex items-center justify-between px-[16px] pt-[16px] pb-[18px]">
        <h1 className="text-[28px] font-extrabold leading-none text-[var(--mrq-blue-dark)]">
          Bingo
        </h1>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          // Shared pale-lavender chevron pill — same component as
          // Casino's Categories, Casino category pages' pluralised
          // CTAs, Arena's Dashboard pill.
          className="inline-flex items-center gap-[6px] h-[30px] pl-[14px] pr-[12px] rounded-full text-[16px] font-extrabold active:scale-[0.97] transition-transform"
          style={{
            backgroundColor: "#dee3f7",
            color: "var(--mrq-blue-dark)",
          }}
        >
          <span>Rooms</span>
          <ChevronDownIcon size={14} />
        </button>
      </div>

      <FeaturedRoom room={featured} reduce={reduce} />

      <GameRail
        title="Popular rooms"
        tiles={popularTiles}
        tileWidth={146}
        tileHeight={146}
        // No dedicated "popular rooms" landing page — the rail is
        // self-contained, so the See all chrome would dead-end.
        showSeeAll={false}
      />

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

      <CategoriesSheet
        open={sheetOpen}
        // No row active — the bingo homepage isn't a specific room.
        selected={undefined}
        categories={sheetCategories}
        // No per-room route yet — selecting from the sheet just
        // dismisses it. (Future: scroll to the room's row, or navigate
        // to a /bingo/[room] page.)
        onSelect={() => setSheetOpen(false)}
        onClose={() => setSheetOpen(false)}
        title="Bingo Rooms"
      />
    </>
  );
}

/* ============================================================
   Featured hero — single big room card at the top of the page.
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
        {/* Dark gradient at the bottom for text legibility. */}
        <div
          className="absolute inset-x-0 bottom-0 px-[18px] pb-[16px] pt-[80px] flex flex-col gap-[4px] text-left text-white"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.72) 10%, rgba(0, 0, 0, 0) 100%)",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.55)",
          }}
        >
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em] opacity-90">
            Next game in {room.nextGameMins} min
          </p>
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
