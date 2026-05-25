"use client";

import Image from "next/image";
import Link from "next/link";
import { useShell } from "@/lib/filter-context";

/**
 * Sticky brand bar — logo on the left, balance + avatar pill on the right.
 *
 * Lives in the AppShell so every page gets the same chrome. Two
 * interactions live here:
 *
 *   • Logo  →  routes to `/` (Lobby). Implemented as a `<Link>` so the
 *     Next.js router handles it (back button works, no full reload).
 *   • Avatar pill  →  opens the slide-in account drawer (SideNav).
 *
 * Previously this lived inside TopNav alongside the category filters,
 * but those filters now live on the Lobby page itself — only Lobby
 * shows them. Splitting the two lets every non-Lobby route inherit
 * just the brand bar without dragging the filter pills along.
 */
export function BrandBar() {
  const { openSideNav } = useShell();

  return (
    // Sticky positioning under env(safe-area-inset-top) so the bar tucks
    // under the iOS notch when launched as a PWA, and sits at the very
    // top of the viewport in a browser.
    <header
      className="sticky top-0 z-30 bg-mrq-blue pb-[10px]"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}
    >
      <div className="relative h-[48px] px-[23px] flex items-center justify-between">
        {/* MrQ logo → Lobby */}
        <Link
          href="/"
          aria-label="Go to lobby"
          className="shrink-0 active:scale-[0.96] transition-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-mrq.svg" alt="MrQ" className="h-[32px] w-[83px]" />
        </Link>

        {/* Balance + divider + avatar pill — tap to open the side nav.
            Darker navy fill (smoked-glass-style: a deep-navy translucent
            tint over the brand-blue header, so it reads noticeably
            darker than the surrounding bar without going fully opaque).
            Inset top highlight + soft outer shadow keep the glass feel
            consistent with the new filter pills below. */}
        <button
          type="button"
          onClick={openSideNav}
          aria-label="Open account menu"
          className="flex items-center gap-[8px] h-[40px] pl-[16px] pr-[4px] rounded-full active:scale-[0.97] transition-transform"
          style={{
            backgroundColor: "rgba(8, 24, 100, 0.65)",
            backdropFilter: "blur(12px) saturate(140%)",
            WebkitBackdropFilter: "blur(12px) saturate(140%)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <span className="text-white text-[15px] leading-none font-extrabold pt-[1px]">
            £113.59
          </span>
          <span
            className="h-[18px] w-px"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.22)" }}
            aria-hidden
          />
          {/* Avatar — slightly smaller now that the pill is thinner.
              Border colour pulled in to match the darker pill background
              so the ring blends instead of standing out. */}
          <div
            className="relative size-[32px] rounded-full overflow-hidden bg-white"
            style={{
              border: "2px solid rgba(8, 24, 100, 0.65)",
              boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <Image
              src="/assets/avatar.png"
              alt=""
              fill
              sizes="32px"
              className="object-cover"
              priority
            />
          </div>
        </button>
      </div>
    </header>
  );
}
