"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Rewards — Figma 238:5731 (My Rewards tab) + 238:5824 (Offers tab).
 *
 * Two tabs in one page, switched via state (no route change). The
 * whole page sits on a brand-blue gradient surface — AppShell
 * conditionally swaps main's bg to var(--mrq-blue) for /rewards so
 * the canvas extends behind any overscroll too.
 *
 * Reuses the global shell unchanged: BrandBar above, BottomNav
 * below, both as-is. Page content is the only thing new here.
 */

type Tab = "rewards" | "offers";

// ─── Figma design tokens (from 238:5731 design context) ───────────
// Brand/900: #0c2287 (used for active tab fg / blue text on cards)
// Brand/500: #0a2ecb (main brand-blue)
// Brand/yellow/500: #ffdf00 (Your Q Rewards tagline)
// Pink/500: #d000ca (progress bar gradient middle stop)
// Success/500: #00b64c (tick marks)
const TEXT_BRAND_DARK = "var(--mrq-blue-dark)"; // #0c2287
const SURFACE_PILL = "rgba(255,255,255,0.18)";

export default function RewardsPage() {
  const [tab, setTab] = useState<Tab>("rewards");

  return (
    <div className="relative pt-[12px] pb-[24px]">
      {/* TAB SWITCHER (Figma 238:5736)
          White pill, 4px padding, two flex-1 inner buttons. Active
          = brand-blue-900 bg, white text. Inactive = white bg,
          brand-blue-900 text. */}
      <div className="px-[16px]">
        <div className="bg-white flex items-center p-[4px] rounded-full">
          <TabButton
            label="My Rewards"
            active={tab === "rewards"}
            onClick={() => setTab("rewards")}
          />
          <TabButton
            label="Offers"
            active={tab === "offers"}
            onClick={() => setTab("offers")}
          />
        </div>
      </div>

      {tab === "rewards" ? <MyRewardsContent /> : <OffersContent />}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 min-w-0 flex items-center justify-center px-[12px] py-[8px] rounded-full transition-colors"
      style={{
        backgroundColor: active ? TEXT_BRAND_DARK : "transparent",
        color: active ? "#ffffff" : TEXT_BRAND_DARK,
      }}
    >
      <span
        className="text-[14px] font-extrabold whitespace-nowrap"
        style={{ letterSpacing: "0.1px", lineHeight: 1.6 }}
      >
        {label}
      </span>
    </button>
  );
}

/* ============================================================
   MY REWARDS TAB
   ============================================================ */

function MyRewardsContent() {
  return (
    <div className="mt-[24px] flex flex-col gap-[24px]">
      <YourQRewardsHero />
      <AvailableToCollect />
      <InProgress />
    </div>
  );
}

/** "Your Q Rewards / 200 Free Spins" headline block.
 *  Figma 238:5741. */
function YourQRewardsHero() {
  return (
    <div className="relative flex flex-col items-center px-[16px]">
      {/* Soft ellipse backdrop — Figma 238:5742, positioned behind
          the number to add gentle visual interest. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/rewards/ellipse.svg"
        alt=""
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 top-[30px] w-[518px] max-w-none h-[252px] pointer-events-none opacity-90"
      />

      {/* "Your Q Rewards" tagline — yellow text with the Q SVG
          dropped inline between "Your" and "Rewards". Figma 238:5743 */}
      <div className="relative flex items-center justify-center gap-[6px] h-[22px]">
        <span
          className="font-medium text-[14px] text-center"
          style={{
            color: "#ffdf00",
            letterSpacing: "0.1px",
            lineHeight: 1.6,
          }}
        >
          Your
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/rewards/q-title.svg"
          alt="Q"
          className="h-[18px] w-auto"
        />
        <span
          className="font-medium text-[14px] text-center"
          style={{
            color: "#ffdf00",
            letterSpacing: "0.1px",
            lineHeight: 1.6,
          }}
        >
          Rewards
        </span>
      </div>

      {/* Big "200" — Figma 238:5748: font-size 59.874, tracking
          -0.9979, leading 1.2. */}
      <p
        className="relative text-center font-extrabold text-white"
        style={{
          fontSize: "60px",
          letterSpacing: "-1px",
          lineHeight: 1.1,
          marginTop: "4px",
        }}
      >
        200
      </p>

      {/* "Free Spins" with coin icon — Figma 238:5749. */}
      <div className="relative flex items-center justify-center gap-[6px] mt-[2px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/rewards/spins-icon.png"
          alt=""
          aria-hidden
          className="size-[18px] object-contain"
        />
        <span
          className="text-white font-extrabold text-center"
          style={{
            fontSize: "15.5px",
            letterSpacing: "-0.26px",
            lineHeight: 1.6,
          }}
        >
          Free Spins
        </span>
      </div>
    </div>
  );
}

/** "Available to collect" — horizontal scroll of reward cards.
 *  Figma 238:5752. */
function AvailableToCollect() {
  return (
    <section>
      <h2
        className="px-[16px] text-white font-extrabold text-[16px]"
        style={{ lineHeight: 1.6 }}
      >
        Available to collect
      </h2>
      <div
        className="mt-[12px] flex gap-[16px] overflow-x-auto no-scrollbar px-[16px] pb-[2px]"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <AvailableCard
          gameSrc="/assets/rewards/u-vs-q-1.png"
          title="U vs. Q"
          subtitle="Play for free every day"
          ctaLabel="Free"
          ctaState="available"
        />
        <AvailableCard
          gameSrc="/assets/rewards/u-vs-q-2.png"
          title="U vs. Q"
          subtitle="Play for free every day"
          ctaLabel="Free"
          ctaState="available"
        />
        <AvailableCard
          gameSrc="/assets/games/slot-04.png"
          title="Western Gold"
          subtitle="Free spin reward"
          ctaLabel="Free"
          ctaState="available"
        />
      </div>
    </section>
  );
}

/** Single "available to collect" card. Figma 238:5755-5768.
 *  White outer card, light-blue inner (#eff2ff), 56×56 game tile
 *  with a small badge, title + subtitle, then T&Cs footer below
 *  the inner card with an "Available to play" / "Free" badge. */
function AvailableCard({
  gameSrc,
  title,
  subtitle,
  ctaLabel,
  ctaState,
}: {
  gameSrc: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaState: "available" | "claimed";
}) {
  return (
    <div
      className="shrink-0 w-[300px] flex flex-col items-center"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Content container — top half, white bg, 8px padding,
          rounded-top-16. Inside is a #eff2ff inner card with the
          game thumbnail + meta text. */}
      <div className="bg-white p-[8px] rounded-t-[16px] w-full">
        <div className="bg-[#eff2ff] flex gap-[16px] items-start p-[12px] rounded-[12px]">
          {/* Game tile — 56×56, rounded-[12px], white 2px border
              + small badge bottom-left (Figma swap to "Free" gift
              icon — using a coloured circle stand-in). */}
          <div
            className="relative shrink-0 size-[56px] rounded-[12px] overflow-hidden border-2 border-white"
            style={{ backgroundColor: "#cccdd0" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gameSrc}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            {/* "Free" badge — bottom-left corner, brand-blue
                background with a tiny gift icon. */}
            <div
              className="absolute -bottom-[4px] -left-[4px] flex items-center gap-[2px] px-[6px] h-[18px] rounded-full"
              style={{
                backgroundColor: TEXT_BRAND_DARK,
                color: "#ffffff",
              }}
            >
              <GiftIconSmall className="size-[10px]" />
              <span
                className="text-[9px] font-extrabold"
                style={{ letterSpacing: "0.2px", lineHeight: 1 }}
              >
                {ctaLabel}
              </span>
            </div>
          </div>

          <div
            className="flex-1 flex flex-col gap-[4px]"
            style={{ color: TEXT_BRAND_DARK }}
          >
            <p
              className="text-[14px] font-extrabold"
              style={{ letterSpacing: "0.1px", lineHeight: 1.4 }}
            >
              {title}
            </p>
            <p
              className="text-[10px] font-medium"
              style={{ letterSpacing: "0.2px", lineHeight: 1.4 }}
            >
              {subtitle}
            </p>
            {/* "Available to play" pill — Figma 238:5768
                badge-default with type="brand" */}
            <div
              className="inline-flex items-center self-start mt-[2px] px-[8px] h-[20px] rounded-full"
              style={{
                backgroundColor: TEXT_BRAND_DARK,
                color: "#ffffff",
              }}
            >
              <span
                className="text-[10px] font-extrabold"
                style={{ letterSpacing: "0.2px", lineHeight: 1 }}
              >
                {ctaState === "available" ? "Available to play" : "Claimed"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Footer container — bottom half, white bg, T&Cs text.
          Figma 238:5766. */}
      <div className="bg-white pb-[8px] pt-[4px] px-[12px] rounded-b-[16px] w-full">
        <p
          className="text-[10px] font-medium opacity-70"
          style={{
            color: "#0e1120",
            letterSpacing: "0.2px",
            lineHeight: 1.5,
          }}
        >
          Play daily. Max 20 spins. 24h credit. Expiry & game
          restrictions apply.{" "}
          <span className="font-extrabold underline">Full T&amp;Cs</span>
        </p>
      </div>
    </div>
  );
}

/** "In Progress" reward — featured card with progress bar + CTA.
 *  Figma 238:5783. */
function InProgress() {
  // Progress: 14 of 20 = 70%
  const progress = 70;
  return (
    <section className="px-[16px]">
      <h2
        className="text-white font-extrabold text-[16px]"
        style={{ lineHeight: 1.6 }}
      >
        In Progress
      </h2>

      <div
        className="relative mt-[12px] rounded-[16px] px-[16px] pt-[16px] pb-[8px] flex flex-col gap-[12px]"
        style={{ backgroundColor: "#f2f3f3" }}
      >
        {/* Pink indicator dot — top right. Figma 238:5803 */}
        <span
          aria-hidden
          className="absolute top-[8px] right-[8px] size-[10px] rounded-full"
          style={{
            backgroundColor: "#d000ca",
            boxShadow: "0 0 0 4px rgba(208, 0, 202, 0.18)",
          }}
        />

        {/* Reward header — image + title + valid date + status pill */}
        <div className="flex gap-[16px] items-center">
          <div
            className="shrink-0 size-[60px] rounded-[8px] overflow-hidden"
            style={{ border: "1.8px solid rgba(255,255,255,0.6)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/rewards/dab-disco.png"
              alt=""
              className="size-full object-cover"
            />
          </div>
          <div
            className="flex-1 flex flex-col gap-[4px]"
            style={{ color: TEXT_BRAND_DARK }}
          >
            <p
              className="text-[14px] font-bold"
              style={{ lineHeight: 1.45 }}
            >
              May Megahaul Cash Bonus
            </p>
            <p
              className="text-[10px] font-medium"
              style={{ letterSpacing: "0.2px", lineHeight: 1.5 }}
            >
              Valid until 30th May
            </p>
            {/* "In Progress" pill */}
            <div
              className="inline-flex items-center self-start mt-[2px] gap-[4px] px-[8px] h-[20px] rounded-full bg-white"
              style={{ color: TEXT_BRAND_DARK }}
            >
              <ClockIcon className="size-[10px]" />
              <span
                className="text-[10px] font-extrabold"
                style={{ letterSpacing: "0.2px", lineHeight: 1 }}
              >
                In Progress
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar — Figma 238:5793.
            White track, pink-to-purple gradient fill. */}
        <div className="flex flex-col gap-[4px]">
          <div
            className="relative h-[8px] w-full rounded-full overflow-hidden"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(to right, #f05cd2 0%, #d000ca 54%, #8f47f1 100%)",
              }}
            />
          </div>
          <p
            className="text-[12px] font-medium"
            style={{
              color: TEXT_BRAND_DARK,
              letterSpacing: "0.2px",
              lineHeight: 1.6,
            }}
          >
            Wagered £14 of £20
          </p>
        </div>

        {/* "Complete to unlock £20" — Figma button hierarchy=primary
            state=disabled. Brand-blue at 50% opacity. */}
        <button
          type="button"
          disabled
          className="h-[48px] rounded-[12px] w-full flex items-center justify-center font-extrabold text-[16px] text-white"
          style={{
            backgroundColor: "rgba(10, 46, 203, 0.5)",
            letterSpacing: 0,
            lineHeight: "24px",
          }}
        >
          Complete to unlock £20
        </button>

        <p
          className="text-[10px] font-medium opacity-70"
          style={{
            color: "#4d505b",
            letterSpacing: "0.2px",
            lineHeight: 1.5,
          }}
        >
          Get a £20 cash reward when you&apos;ve wagered £20. Opt
          in &amp; meet wager reqs today.{" "}
          <span className="font-extrabold underline">Full T&amp;Cs</span>.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   OFFERS TAB
   ============================================================ */

function OffersContent() {
  return (
    <div className="mt-[24px] flex flex-col gap-[24px]">
      <FeaturedOffers />
      <ThisWeeksOffers />
      <AllOffers />
    </div>
  );
}

function FeaturedOffers() {
  return (
    <section>
      <h2
        className="px-[16px] text-white font-extrabold text-[16px]"
        style={{ lineHeight: 1.6 }}
      >
        Featured offers
      </h2>
      <div
        className="mt-[12px] flex gap-[12px] overflow-x-auto no-scrollbar px-[16px]"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <FeaturedOfferCard
          src="/assets/rewards/offer-friday-frenzy.png"
          alt="Q's Friday Night Frenzy"
          ctaLabel="More info"
        />
        <FeaturedOfferCard
          src="/assets/rewards/offer-extra-2.png"
          alt="Featured offer"
          ctaLabel="More info"
        />
      </div>
    </section>
  );
}

function FeaturedOfferCard({
  src,
  alt,
  ctaLabel,
}: {
  src: string;
  alt: string;
  ctaLabel: string;
}) {
  return (
    <div
      className="relative shrink-0 w-[320px] aspect-[320/120] rounded-[14px] overflow-hidden"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 size-full object-cover"
      />
      <button
        type="button"
        className="absolute bottom-[12px] right-[12px] bg-white text-[12px] font-extrabold px-[14px] py-[8px] rounded-full active:scale-[0.97] transition-transform"
        style={{ color: TEXT_BRAND_DARK, letterSpacing: 0.1 }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function ThisWeeksOffers() {
  return (
    <section className="px-[16px]">
      <h2
        className="text-white font-extrabold text-[16px]"
        style={{ lineHeight: 1.6 }}
      >
        This weeks offers
      </h2>
      <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
        <WeekOfferCard
          src="/assets/rewards/offer-big-catch.png"
          title="Catch 25 free spins"
          meta="Deposit & Play £50 on The Big Catch 2"
        />
        <WeekOfferCard
          src="/assets/rewards/offer-lobstermania.png"
          title="Catch 25 free spins"
          meta="Lobstermania is back in the house!"
        />
      </div>
    </section>
  );
}

function WeekOfferCard({
  src,
  title,
  meta,
}: {
  src: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="aspect-[164/96] rounded-[12px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="size-full object-cover"
        />
      </div>
      <p
        className="text-white font-extrabold text-[14px]"
        style={{ letterSpacing: 0.1, lineHeight: 1.4 }}
      >
        {title}
      </p>
      <p
        className="text-white text-[10px] font-medium opacity-80"
        style={{ letterSpacing: 0.2, lineHeight: 1.45 }}
      >
        {meta}
      </p>
      <button
        type="button"
        className="self-start bg-white text-[12px] font-extrabold px-[14px] py-[6px] rounded-full active:scale-[0.97] transition-transform"
        style={{ color: TEXT_BRAND_DARK, letterSpacing: 0.1 }}
      >
        View offer
      </button>
    </div>
  );
}

function AllOffers() {
  return (
    <section className="px-[16px]">
      <h2
        className="text-white font-extrabold text-[16px]"
        style={{ lineHeight: 1.6 }}
      >
        All offers
      </h2>

      <div className="mt-[12px] bg-white rounded-[16px] overflow-hidden">
        {/* "Get the best deals" banner */}
        <div className="relative aspect-[343/156] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/rewards/offer-best-deals.png"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        </div>

        <div className="px-[16px] pt-[14px] pb-[16px] flex flex-col gap-[8px]">
          <p
            className="font-extrabold text-[16px]"
            style={{ color: TEXT_BRAND_DARK, lineHeight: 1.4 }}
          >
            Q&apos;s Friday Night Frenzy
          </p>
          <p
            className="text-[12px] font-medium"
            style={{
              color: "#d000ca",
              letterSpacing: 0.2,
              lineHeight: 1.45,
            }}
          >
            Valid till 29th April
          </p>
          <p
            className="text-[12px] font-medium opacity-80"
            style={{
              color: "#4d505b",
              letterSpacing: 0.2,
              lineHeight: 1.6,
            }}
          >
            Caveats here. Full T&amp;Cs apply.
          </p>

          <div className="mt-[8px] flex items-center gap-[10px]">
            <button
              type="button"
              className="flex-1 h-[40px] rounded-[10px] font-extrabold text-[14px]"
              style={{
                backgroundColor: "#f2f3f3",
                color: TEXT_BRAND_DARK,
              }}
            >
              Read more
            </button>
            <Link
              href="#"
              className="flex-1 h-[40px] rounded-[10px] flex items-center justify-center font-extrabold text-[14px] text-white"
              style={{ backgroundColor: "var(--mrq-blue)" }}
            >
              Claim offer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ICONS
   ============================================================ */

function GiftIconSmall({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <rect x="3" y="8" width="18" height="13" rx="1.5" />
      <rect x="2" y="6" width="20" height="4" rx="1" />
      <path d="M12 6v15" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3.5L10 10" />
    </svg>
  );
}
