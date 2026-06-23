"use client";

/* Plain <img>/background images are used for the Figma-exported avatar,
   badges and Q+ banner — disable next/image's LCP rule for this file. */
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFilter } from "@/lib/filter-context";
import { AvatarPicker } from "@/components/AvatarPicker";
import {
  PlayStreakCard,
  MenuGroup,
  MenuItem,
  MinusIcon,
  PlusIcon,
  UserIcon,
  WalletIcon,
  HistoryIcon,
  HeartIcon,
  GiftIcon,
  LockIcon,
  DocIcon,
  QuestionIcon,
  LogoutIcon,
} from "@/components/SideNav";

/**
 * Profile — full-page account hub (Figma 445:18822). Reached by tapping
 * the avatar in the BrandBar; the bar shows a back arrow (router.back)
 * and no bottom-nav tab is active while here.
 *
 * It's a *normal* page (BrandBar + BottomNav stay), so the page paints
 * its own brand-blue header (avatar + name + level) flush under the
 * flat-bottomed BrandBar, then the grey body below carries the reused
 * SideNav blocks: Withdraw/Deposit, PlayStreakCard, the menu rows — plus
 * Profile-only bits (Level badge, Your Badges, Upgrade-to-Q+ banner).
 */

const LEVEL_PROGRESS = 0.66; // Level 3 — ~two-thirds toward the next level

export function ProfileView() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { openDeposit, avatarSrc } = useFilter();

  // Entrance: render the start state, then flip one frame later (a short
  // timeout, NOT a single rAF — React flushes rAF-scheduled updates
  // before paint, so the start state would never paint and the CSS
  // transitions would snap). Drives both the blue header reveal and the
  // level-bar grow.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 90);
    return () => clearTimeout(id);
  }, []);

  // Avatar picker (full-page takeover) — opened from the avatar / pencil.
  // The chosen avatar lives in shared shell state (avatarSrc) so it also
  // updates the BrandBar pill.
  const [pickerOpen, setPickerOpen] = useState(false);
  // Bounce the avatar into place when a new one is picked.
  const avatarControls = useAnimationControls();
  const bounceAvatar = () => {
    if (reduce) return;
    avatarControls.start({
      scale: [0.5, 1.15, 0.92, 1],
      transition: { duration: 0.5, times: [0, 0.5, 0.78, 1], ease: "easeOut", delay: 0.12 },
    });
  };

  return (
    <div className="bg-[#f2f3f3] min-h-screen">
      {/* ---------------- BLUE HEADER ---------------- */}
      <header
        className="bg-mrq-blue px-[16px] pt-[10px] pb-[22px]"
        style={{
          borderRadius: "0 0 20px 20px",
          // Same reveal as the Qoins blue header — the panel grows down
          // from under the BrandBar on load.
          clipPath: reduce
            ? undefined
            : entered
              ? "inset(0% 0% 0% 0% round 0px 0px 20px 20px)"
              : "inset(0% 0% 100% 0% round 0px 0px 20px 20px)",
          transition: reduce ? undefined : "clip-path 0.58s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Content holds invisible while the blue bar drops, then fades
            in once it's fully down (delay ≈ the header reveal duration). */}
        <div
          className="flex items-center gap-[16px]"
          style={{
            opacity: reduce || entered ? 1 : 0,
            transition: reduce ? undefined : "opacity 0.4s ease 0.55s",
          }}
        >
          {/* Avatar + pencil edit badge — tapping either opens the
              full-page avatar picker. */}
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            aria-label="Change your avatar"
            className="relative size-[104px] shrink-0 active:scale-[0.97] transition-transform"
          >
            <motion.div
              className="relative size-[104px] rounded-full overflow-hidden bg-white"
              // Subtle light stroke so a blue avatar doesn't blend into
              // the blue header.
              style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.4)", transformOrigin: "center" }}
              animate={avatarControls}
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="" className="block size-full object-cover" />
              ) : (
                <Image
                  src="/assets/profile-avatar.png"
                  alt=""
                  fill
                  sizes="104px"
                  className="object-cover"
                  priority
                />
              )}
            </motion.div>
            <span
              className="absolute bottom-[2px] right-[2px] grid size-[32px] place-items-center rounded-full bg-white"
              style={{ border: "1px solid #9DABEA" }}
            >
              <img
                src="/assets/profile-edit-pencil.svg"
                alt=""
                width={18}
                height={18}
                draggable={false}
              />
            </span>
          </button>

          {/* Name + since + level */}
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <p className="text-[24px] font-extrabold leading-tight text-white truncate">
              Leigh Taylor
            </p>
            {/* Level progress — Duolingo-style bar: a light track with an
                inset rounded fill that carries a glossy highlight stripe,
                and grows from 0 → its value when the page loads. */}
            <div
              className="relative mt-[4px] h-[30px] w-full max-w-[200px] rounded-full p-[3px]"
              style={{ backgroundColor: "#E6EAFA", border: "1px solid #CED5F5" }}
            >
              <div
                className="relative h-full rounded-full overflow-hidden"
                style={{
                  width: reduce || entered ? `${LEVEL_PROGRESS * 100}%` : "0%",
                  backgroundColor: "#FFDF00",
                  transition: reduce ? undefined : "width 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.95s",
                }}
              >
                {/* gloss — lighter rounded highlight along the top of the fill */}
                <span
                  className="absolute left-[5px] right-[5px] top-[3px] h-[6px] rounded-full"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                />
              </div>
              <span className="absolute inset-y-0 left-[14px] flex items-center text-[15px] font-extrabold text-[var(--mrq-blue-dark)]">
                Level 3
              </span>
            </div>
            {/* Tiny progress hint under the level bar */}
            <span className="mt-[5px] text-[12px] font-semibold text-white/80">
              2 badges until Level 4
            </span>
          </div>
        </div>
      </header>

      {/* ---------------- BODY ---------------- */}
      <div className="flex flex-col gap-[16px] px-[16px] pt-[16px]">
        {/* Withdraw / Deposit (reuses the SideNav button treatment) */}
        <div className="grid grid-cols-2 gap-[10px]">
          <button
            type="button"
            className="flex items-center justify-center gap-[8px] h-[54px] rounded-[14px] bg-white text-[var(--mrq-blue-dark)] text-[17px] font-extrabold active:scale-[0.98] transition-transform"
            style={{ border: "1px solid #e6e6e7" }}
          >
            <MinusIcon className="size-[16px]" />
            Withdraw
          </button>
          <button
            type="button"
            onClick={openDeposit}
            className="flex items-center justify-center gap-[8px] h-[54px] rounded-[14px] bg-mrq-blue text-white text-[17px] font-extrabold active:scale-[0.98] transition-transform"
          >
            <PlusIcon className="size-[16px]" />
            Deposit
          </button>
        </div>

        {/* Play Streak + Weekly Summary — reused verbatim from SideNav */}
        <PlayStreakCard />

        {/* Your Badges */}
        <section className="pt-[2px]">
          <div className="flex items-baseline justify-between mb-[14px]">
            <h2 className="text-[20px] font-extrabold text-[#0e1120]">Your Badges</h2>
            <button type="button" className="text-[14px] font-extrabold text-mrq-blue">
              See all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-[8px]">
            <Badge img="/assets/profile-badge-streak-7735ea.png" label="7 Day Streak" index={0} reduce={reduce} />
            <Badge img="/assets/profile-badge-explorer-23a91e.png" label="Game Explorer" index={1} reduce={reduce} />
            <Badge img="/assets/profile-badge-king-59a2fb.png" label="Slot King" index={2} reduce={reduce} />
          </div>
        </section>

        {/* Upgrade to Q+ / season pass banner (taps through to the Weekly Pass) */}
        <button
          type="button"
          onClick={() => router.push("/passes")}
          className="block w-full overflow-hidden rounded-[16px] active:scale-[0.99] transition-transform"
        >
          <img
            src="/assets/profile-qplus-banner.png"
            alt="Upgrade to Q+"
            className="block w-full h-auto"
            draggable={false}
          />
        </button>

        {/* Your Purchases — horizontal rail of redeemed reward offers */}
        <section className="pt-[2px]">
          <div className="flex items-baseline justify-between mb-[14px]">
            <h2 className="text-[20px] font-extrabold text-[#0e1120]">Your Purchases</h2>
            <button type="button" className="text-[14px] font-extrabold text-mrq-blue">
              See all
            </button>
          </div>
          {/* -mx/px lets the cards scroll edge-to-edge under the page
              padding; py + -my keeps the card drop-shadow from being
              clipped by the scroll container's overflow. */}
          <div
            className="flex gap-[12px] overflow-x-auto -mx-[16px] px-[16px] py-[10px] -my-[10px]"
            style={{ scrollbarWidth: "none" }}
          >
            <PurchaseCard
              img="/assets/purchase-starbucks.png"
              title="Starbucks Gift Card"
              desc="Get a free coffee on MrQ at your nearest Starbucks"
            />
            <PurchaseCard
              img="/assets/purchase-nike-2c8573.png"
              title="Nike Gift Voucher"
              desc="Get £20 off your next purchase on Nike.com"
            />
            <PurchaseCard
              img="/assets/purchase-greggs.png"
              title="Greggs Sausage Roll"
              desc="Get a free sausage roll at Greggs"
            />
          </div>
        </section>

        {/* Menu — two grouped cards (account links / legal + promo),
            reusing the SideNav's MenuGroup + MenuItem. */}
        <MenuGroup>
          <MenuItem icon={<UserIcon />} label="Profile" />
          <MenuItem icon={<WalletIcon />} label="Wallet" />
          <MenuItem icon={<HistoryIcon />} label="Transaction History" />
          <MenuItem icon={<HeartIcon />} label="Safer Gambling" />
        </MenuGroup>
        <MenuGroup>
          <MenuItem icon={<GiftIcon />} label="Get 50 free spins!" accent="#e0007a" />
          <MenuItem icon={<LockIcon />} label="Privacy Policy" />
          <MenuItem icon={<DocIcon />} label="Terms & Conditions" />
          <MenuItem icon={<QuestionIcon />} label="Help & FAQs" />
        </MenuGroup>
      </div>

      {/* Footer — Log out + dev reset (carried over from the SideNav so
          the prototype keeps its onboarding-reset affordance). */}
      <div className="flex flex-col px-[16px] pt-[12px]">
        <button
          type="button"
          className="flex items-center gap-[8px] text-[14px] font-extrabold text-[var(--mrq-blue-dark)] px-[8px] py-[12px]"
        >
          <LogoutIcon className="size-[18px]" />
          Log out
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof window === "undefined") return;
            localStorage.removeItem("hasLoggedIn");
            window.location.reload();
          }}
          className="flex items-center gap-[8px] text-[12px] font-bold px-[8px] py-[8px]"
          style={{ color: "rgba(10, 17, 32, 0.55)" }}
        >
          <RefreshIcon className="size-[14px]" />
          Reset onboarding (dev)
        </button>
      </div>

      {/* Full-page avatar picker — writes to shared avatarSrc state */}
      <AvatarPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={bounceAvatar}
      />
    </div>
  );
}

function PurchaseCard({ img, title, desc }: { img: string; title: string; desc: string }) {
  return (
    <div
      className="flex-none w-[150px] rounded-[12px] bg-white overflow-hidden"
      style={{ boxShadow: "0 2px 6px rgba(204, 205, 208, 0.64)" }}
    >
      <img src={img} alt="" className="block w-full h-[86px] object-cover" draggable={false} />
      <div className="px-[12px] py-[10px] flex flex-col gap-[3px]">
        <p className="text-[13px] font-extrabold text-mrq-blue leading-tight truncate">{title}</p>
        <p className="text-[11px] font-medium leading-snug line-clamp-2" style={{ color: "#676972" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

function Badge({
  img,
  label,
  index,
  reduce,
}: {
  img: string;
  label: string;
  index: number;
  reduce: boolean | null;
}) {
  return (
    <div className="flex flex-col items-center gap-[8px]">
      {/* Pop in with a staggered spring (left → right), echoing the
          streak card's fire pips. */}
      <motion.img
        src={img}
        alt=""
        className="block w-full h-auto"
        draggable={false}
        style={{ transformOrigin: "center bottom" }}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: reduce ? 0 : 0.5 + index * 0.12,
          type: "spring",
          stiffness: 400,
          damping: 15,
          mass: 0.7,
        }}
      />
      <span className="text-[13px] font-extrabold text-black text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 10a7 7 0 1 0 2-5L3 7" />
      <path d="M3 3v4h4" />
    </svg>
  );
}
