"use client";

/**
 * Rewards — placeholder page.
 *
 * Real designs are coming later. For now this is just a route shell so
 * the bottom-nav tab has somewhere to land. The shape mirrors the other
 * pages: padded vertical stack inside the mobile-frame, brand bar above
 * and bottom nav below (both provided by the shared AppShell).
 */
export default function RewardsPage() {
  return (
    <div className="px-[16px] pt-[16px] flex flex-col gap-[16px]">
      {/* Hero card */}
      <div
        className="relative overflow-hidden rounded-[18px] px-[20px] py-[24px]"
        style={{
          background: "linear-gradient(135deg, #ffd400 0%, #ff9a00 100%)",
          boxShadow: "0 10px 24px -10px rgba(255, 154, 0, 0.45)",
        }}
      >
        <p className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[var(--mrq-blue-dark)] opacity-70">
          Rewards
        </p>
        <h1
          className="mt-[6px] text-[var(--mrq-blue-dark)]"
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "34px",
            lineHeight: 0.95,
            letterSpacing: "0.5px",
          }}
        >
          YOUR PERKS
          <br />
          LIVE HERE
        </h1>
        <p className="mt-[10px] text-[14px] font-bold text-[var(--mrq-blue-dark)] opacity-80">
          Designs coming soon. This page will host bonus offers, free
          spins, loyalty levels and personal challenges.
        </p>
      </div>

      {/* Stub feature cards — replace with real content once designs land. */}
      <RewardCard
        title="50 free spins waiting"
        meta="Claim before Sunday"
        accent="#e0007a"
      />
      <RewardCard
        title="Daily challenge"
        meta="Spin 10× any slot today"
        accent="#0a2ecb"
      />
      <RewardCard
        title="Loyalty progress"
        meta="Level 3 · 70% to next tier"
        accent="#34c759"
      />
    </div>
  );
}

function RewardCard({
  title,
  meta,
  accent,
}: {
  title: string;
  meta: string;
  accent: string;
}) {
  return (
    <button
      type="button"
      className="flex items-center justify-between gap-[14px] rounded-[14px] bg-white px-[16px] py-[14px] text-left active:scale-[0.99] transition-transform"
      style={{
        border: "1px solid #e6e6e7",
        boxShadow: "0 4px 10px -6px rgba(10, 46, 203, 0.12)",
      }}
    >
      <div className="flex items-center gap-[14px] min-w-0">
        <span
          className="grid size-[10px] shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold text-[var(--mrq-blue-dark)] truncate">
            {title}
          </p>
          <p className="mt-[2px] text-[12px] font-bold text-[var(--mrq-blue-dark)] opacity-60 truncate">
            {meta}
          </p>
        </div>
      </div>
      <ChevronIcon className="size-[16px] text-[var(--mrq-blue-dark)] opacity-50 shrink-0" />
    </button>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <path d="m6 4 4 4-4 4" />
    </svg>
  );
}
