"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  EMPTY_FILTERS,
  MAX_BET_OPTIONS,
  MIN_BET_OPTIONS,
  RTP_BANDS,
  SORT_OPTIONS,
  VOLATILITY_OPTIONS,
  countActiveFilters,
  type GameFilters,
  type SortKey,
} from "@/lib/game-filters";

/**
 * Inline filter bar for the search takeover.
 *
 * The whole search experience is already a full-page takeover, so there
 * is no bottom sheet — everything lives on one horizontally-scrollable
 * line of facet chips (Sort, Provider, RTP, Volatility, Min/Max wager).
 *
 * Tapping a chip opens a floating dropdown card anchored under the bar.
 * Picking a value filters LIVE — the parent's result list updates
 * immediately, no apply step. Single-value facets close on pick;
 * multi-value facets (Provider, Volatility) stay open so you can stack
 * selections. Tapping the chip again, the backdrop, or a value closes it.
 */

type FacetKey =
  | "sort"
  | "provider"
  | "rtp"
  | "volatility"
  | "minBet"
  | "maxBet";

type Row = { label: string; selected: boolean; onSelect: () => void };

export function FilterBar({
  filters,
  onChange,
  sort,
  onSortChange,
  providers,
}: {
  filters: GameFilters;
  onChange: (next: GameFilters) => void;
  sort: SortKey;
  onSortChange: (next: SortKey) => void;
  providers: string[];
}) {
  const [open, setOpen] = useState<FacetKey | null>(null);
  const toggle = (k: FacetKey) => setOpen((cur) => (cur === k ? null : k));
  const close = () => setOpen(null);

  const activeCount = countActiveFilters(filters);
  const toggleIn = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  // ----- chip labels reflect the current selection -----
  const rtpLabel =
    RTP_BANDS.find((b) => b.value === filters.minRtp && b.value != null)
      ?.label ?? "RTP";
  const minBetLabel =
    MIN_BET_OPTIONS.find(
      (o) => o.value === filters.minBetUpTo && o.value != null,
    )?.label ?? "Min wager";
  const maxBetLabel =
    MAX_BET_OPTIONS.find(
      (o) => o.value === filters.maxBetAtLeast && o.value != null,
    )?.label ?? "Max wager";
  const volLabel =
    filters.volatility.length === 1
      ? filters.volatility[0]
      : filters.volatility.length > 1
        ? `Volatility (${filters.volatility.length})`
        : "Volatility";
  const provLabel =
    filters.providers.length === 1
      ? filters.providers[0]
      : filters.providers.length > 1
        ? `Provider (${filters.providers.length})`
        : "Provider";

  // ----- rows for whichever facet is open -----
  let rows: Row[] = [];
  let closeOnSelect = true;
  if (open === "sort") {
    rows = SORT_OPTIONS.map((o) => ({
      label: o.label,
      selected: sort === o.key,
      onSelect: () => onSortChange(o.key),
    }));
  } else if (open === "provider") {
    closeOnSelect = false;
    rows = providers.map((p) => ({
      label: p,
      selected: filters.providers.includes(p),
      onSelect: () =>
        onChange({ ...filters, providers: toggleIn(filters.providers, p) }),
    }));
  } else if (open === "rtp") {
    rows = RTP_BANDS.map((b) => ({
      label: b.label,
      selected: filters.minRtp === b.value,
      onSelect: () => onChange({ ...filters, minRtp: b.value }),
    }));
  } else if (open === "volatility") {
    closeOnSelect = false;
    rows = VOLATILITY_OPTIONS.map((v) => ({
      label: v,
      selected: filters.volatility.includes(v),
      onSelect: () =>
        onChange({ ...filters, volatility: toggleIn(filters.volatility, v) }),
    }));
  } else if (open === "minBet") {
    rows = MIN_BET_OPTIONS.map((o) => ({
      label: o.label,
      selected: filters.minBetUpTo === o.value,
      onSelect: () => onChange({ ...filters, minBetUpTo: o.value }),
    }));
  } else if (open === "maxBet") {
    rows = MAX_BET_OPTIONS.map((o) => ({
      label: o.label,
      selected: filters.maxBetAtLeast === o.value,
      onSelect: () => onChange({ ...filters, maxBetAtLeast: o.value }),
    }));
  }

  return (
    <div className="relative shrink-0">
      {/* One line — horizontally scrollable, never wraps. */}
      <div className="flex items-center gap-[8px] overflow-x-auto px-[16px] pb-[10px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FacetChip
          label={SORT_OPTIONS.find((s) => s.key === sort)?.label ?? "Sort"}
          active={sort !== "relevance"}
          isOpen={open === "sort"}
          onClick={() => toggle("sort")}
        />
        <FacetChip
          label={provLabel}
          active={filters.providers.length > 0}
          isOpen={open === "provider"}
          onClick={() => toggle("provider")}
        />
        <FacetChip
          label={rtpLabel}
          active={filters.minRtp != null}
          isOpen={open === "rtp"}
          onClick={() => toggle("rtp")}
        />
        <FacetChip
          label={volLabel}
          active={filters.volatility.length > 0}
          isOpen={open === "volatility"}
          onClick={() => toggle("volatility")}
        />
        <FacetChip
          label={minBetLabel}
          active={filters.minBetUpTo != null}
          isOpen={open === "minBet"}
          onClick={() => toggle("minBet")}
        />
        <FacetChip
          label={maxBetLabel}
          active={filters.maxBetAtLeast != null}
          isOpen={open === "maxBet"}
          onClick={() => toggle("maxBet")}
        />
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => {
              onChange(EMPTY_FILTERS);
              close();
            }}
            className="shrink-0 whitespace-nowrap px-[10px] text-[13px] font-bold text-[var(--mrq-blue)] underline-offset-2 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Floating dropdown — overlays the results, so the list below
          doesn't jump. Backdrop catches an outside tap to dismiss. */}
      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              className="fixed inset-0 z-[40] cursor-default"
            />
            <motion.div
              key={open}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-[16px] z-[50] mt-[2px] max-h-[280px] w-[230px] overflow-y-auto rounded-[16px] bg-white py-[6px] shadow-[0_12px_40px_rgba(3,34,172,0.22)] ring-1 ring-black/5"
              role="listbox"
            >
              {rows.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  role="option"
                  aria-selected={r.selected}
                  onClick={() => {
                    r.onSelect();
                    if (closeOnSelect) close();
                  }}
                  className="flex w-full items-center justify-between gap-[10px] px-[16px] py-[11px] text-left text-[14px] font-bold text-[var(--mrq-blue-dark)] active:bg-[#EEF1FC]"
                >
                  <span className="truncate">{r.label}</span>
                  {r.selected && (
                    <CheckIcon className="size-[16px] shrink-0 text-[var(--mrq-blue)]" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Facet chip in the bar. Filled brand-blue when it has a selection or
 *  its dropdown is open; pale-blue idle. The chevron rotates when open. */
function FacetChip({
  label,
  active,
  isOpen,
  onClick,
}: {
  label: string;
  active: boolean;
  isOpen: boolean;
  onClick: () => void;
}) {
  const filled = active || isOpen;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      className="relative z-[60] flex h-[36px] shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full pl-[14px] pr-[11px] text-[13px] font-extrabold active:scale-[0.96] transition-all"
      style={
        filled
          ? { backgroundColor: "var(--mrq-blue)", color: "#fff" }
          : { backgroundColor: "#CED5F5", color: "var(--mrq-blue-dark)" }
      }
    >
      {label}
      <Chevron open={isOpen} />
    </button>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[13px] transition-transform"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
      aria-hidden
      focusable={false}
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable={false}
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
