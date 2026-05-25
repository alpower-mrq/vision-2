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

        {/* Balance + divider + avatar pill — tap to open the side nav */}
        <button
          type="button"
          onClick={openSideNav}
          aria-label="Open account menu"
          className="flex items-center gap-[8px] h-[48px] pl-[16px] pr-[8px] py-[4px] rounded-full active:scale-[0.97] transition-transform"
          style={{
            backgroundColor: "rgba(255,255,255,0.32)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <span className="text-white text-[16px] leading-none font-extrabold pt-[2px]">
            £113.59
          </span>
          <span className="h-[20px] w-px bg-mrq-divider" aria-hidden />
          <div
            className="relative size-[36px] rounded-full overflow-hidden bg-white border-2 border-mrq-blue"
            style={{ boxShadow: "4px 4px 8px 0 rgba(10,46,203,0.24)" }}
          >
            <Image
              src="/assets/avatar.png"
              alt=""
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
        </button>
      </div>
    </header>
  );
}
