"use client";

/* This view is a faithful port of the "Qoins Rewards" Claude Design
   mockup — it leans on plain <img> + CSS background-images (crossfades,
   contain-fit avatar gear) rather than next/image, so disable that rule
   for the whole file. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import "./qoins.css";

/**
 * Qoins Rewards — MrQ's loyalty-currency screen (imported from Claude
 * Design "Qoins Rewards"). Reached from the coins pill in the BrandBar
 * (replaces the old Season Pass diamond).
 *
 * The page owns its own chrome: AppShell hides the global BrandBar /
 * BottomNav on /qoins, and this view paints its own brand-blue header
 * (back arrow + Qoins pill + wallet pill) plus the page below.
 *
 * All styles are scoped under `#qoins-screen` in ./qoins.css so the
 * design's generic class names (.header, .body, .coin, .section …)
 * can't leak into the rest of the (Tailwind-based) app.
 */

const ASSETS = {
  coinPng: "/assets/qoin.svg",
  westernGold: "/assets/qoins-western-gold.jpg",
  glasses1: "/assets/qoins-glasses1.png",
  glasses2: "/assets/qoins-glasses2.png",
  circle1: "/assets/qoins-circle1.png",
  circle2: "/assets/qoins-circle2.png",
  avatarNav: "/assets/qoins-avatar-nav.png",
  headsOrTails: "/assets/qoins-heads-or-tails.png",
  joyMp3: "/assets/qoins-joy.mp3",
  collectedMp3: "/assets/qoins-collected.mp3",
} as const;

/* ---------- icons ---------- */
function CheckIcon() {
  return (
    <svg className="check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 6.5" />
    </svg>
  );
}

/* ---------- offer card ---------- */
type OfferCardProps = {
  img: string;
  hoverImg?: string;
  avatar?: boolean;
  title: string;
  desc: string;
  cost?: number;
  affordable?: boolean;
  bestValue?: boolean;
  purchased?: boolean;
  removed?: boolean;
  onRedeem?: () => void;
  onRemove?: () => void;
  onAdd?: () => void;
};

function OfferCard({
  img, hoverImg, avatar, title, desc, cost,
  affordable = true, bestValue = false, purchased = false, removed = false,
  onRedeem, onRemove, onAdd,
}: OfferCardProps) {
  return (
    <div className={"offer" + (bestValue ? " is-best" : "")}>
      {bestValue && <span className="offer-flag">Best value</span>}
      {hoverImg ? (
        <div className="offer-img avatar-bg offer-img-swap">
          <img className="oi oi-base" src={img} alt="" />
          <img className={"oi oi-top" + (purchased ? " on" : "")} src={hoverImg} alt="" />
        </div>
      ) : (
        <div
          className={"offer-img" + (avatar ? " avatar-bg" : "")}
          style={{ backgroundImage: `url(${img})` }}
        />
      )}
      <div className="offer-body">
        <div className="offer-title">{title}</div>
        {(purchased || removed)
          ? <p className="offer-desc owned-text"><CheckIcon />Purchased</p>
          : <p className="offer-desc">{desc}</p>}
        {purchased ? (
          <button className="cost-btn remove-btn" onClick={onRemove}>Remove</button>
        ) : removed ? (
          <button className="cost-btn" onClick={onAdd}>Add</button>
        ) : (
          <button className="cost-btn" onClick={onRedeem} disabled={!affordable} aria-disabled={!affordable}>
            <span className="coin" />
            {cost}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- free-to-play game card (carousel tile) ---------- */
function GameCard({
  img,
  title,
  cost,
  affordable = true,
  onPlay,
}: {
  img: string;
  title: string;
  cost: number;
  affordable?: boolean;
  onPlay?: () => void;
}) {
  return (
    <div className="gamecard">
      <div className="gamecard-img" style={{ backgroundImage: `url(${img})` }} />
      <div className="offer-body">
        <div className="offer-title">{title}</div>
        <button className="cost-btn" onClick={onPlay} disabled={!affordable} aria-disabled={!affordable}>
          <span>Play</span>
          <span className="coin" />
          <span>{cost}</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- celebration fx — coins arc from the claim button into the Qoins pill ---------- */
function celebrate(layer: HTMLElement | null, btnRect: DOMRect | null, style: string) {
  if (!layer || !btnRect) return;
  const f = layer.getBoundingClientRect();
  const o = { x: btnRect.left + btnRect.width / 2 - f.left, y: btnRect.top + btnRect.height / 2 - f.top };
  // Fly destination is the global BrandBar's coin pill (the in-page pill
  // was removed in favour of the shared top bar).
  const pill = document.querySelector<HTMLElement>('a[aria-label="Open Qoins Rewards"]');
  let w = { x: o.x, y: o.y - 200 };
  if (pill) { const pr = pill.getBoundingClientRect(); w = { x: pr.left + pr.width / 2 - f.left, y: pr.top + pr.height / 2 - f.top }; }
  const popPill = () => pill && pill.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.22)" }, { transform: "scale(1)" }],
    { duration: 340, easing: "cubic-bezier(.34,1.56,.64,1)" });

  // subtle mode: just a pop + glow on the wallet pill
  if (style === "glow") {
    popPill();
    if (pill) { pill.classList.add("pill-glow"); setTimeout(() => pill.classList.remove("pill-glow"), 700); }
    return;
  }

  // the big balance coin gives a little shake as the coins pour out
  const heroCoin = document.querySelector<HTMLElement>(".hero-coin");
  if (heroCoin) heroCoin.animate(
    [{ transform: "rotate(0deg) scale(1)" }, { transform: "rotate(-7deg) scale(1.04)" }, { transform: "rotate(6deg) scale(1.04)" },
    { transform: "rotate(-5deg) scale(1.02)" }, { transform: "rotate(4deg) scale(1.02)" }, { transform: "rotate(0deg) scale(1)" }],
    { duration: 560, iterations: 2, easing: "ease-in-out" });
  const N = 16;
  for (let i = 0; i < N; i++) {
    const el = document.createElement("img");
    el.className = "fx-coin";
    el.src = ASSETS.coinPng;
    const size = 24 + Math.random() * 12;
    el.style.width = el.style.height = size + "px";
    el.style.left = o.x + "px";
    el.style.top = o.y + "px";
    layer.appendChild(el);
    const liftX = (Math.random() - 0.5) * 100;
    const liftY = -50 - Math.random() * 70;
    const delay = 60 + i * 45;
    el.animate(
      [
        { transform: "translate(-50%,-50%) translate(0,0) scale(.4)", opacity: 0, offset: 0 },
        { transform: `translate(-50%,-50%) translate(${liftX}px,${liftY}px) scale(1)`, opacity: 1, offset: .34 },
        { transform: `translate(-50%,-50%) translate(${w.x - o.x}px,${w.y - o.y}px) scale(.4)`, opacity: 1, offset: 1 }
      ],
      { duration: 640, delay, easing: "cubic-bezier(.5,0,.4,1)", fill: "backwards" }
    ).onfinish = () => { el.remove(); popPill(); };
  }
  setTimeout(() => {
    if (pill) { pill.classList.add("pill-glow"); setTimeout(() => pill.classList.remove("pill-glow"), 700); }
  }, 60 + N * 45 + 640);
}

/* ---------- how Qoins works — swipeable carousel ---------- */
type HowItem = { title: string; text: string; icon: React.ReactNode };
const HOW_ITEMS: HowItem[] = [
  {
    title: "Claim daily", text: "Tap claim every day and watch your Qoins stack up fast.",
    icon: <path d="M3 10h18M6 10V7a3 3 0 0 1 3-3c1.5 0 2.5 1 3 2.5C15.5 5 16.5 4 18 4a3 3 0 0 1 3 3v3M5 10v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8M12 6v14" />,
  },
  {
    title: "Spend in the Q Shop", text: "Swap your Qoins for free spins, games and avatar gear.",
    icon: <path d="M3 9l1.5-4.5h15L21 9M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9M3 9h18M9 13h6" />,
  },
  {
    title: "No wagering, ever", text: "Spend Qoins, keep what you win. No fine-print gotchas.",
    icon: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4" />,
  },
  {
    title: "Play to earn more", text: "Free-to-play games like Heads or Tails grow your pot.",
    icon: <path d="M5 5l14 7-14 7V5z" />,
  },
];
function HowQoinsWorks({ onClose, closing }: { onClose: () => void; closing: boolean }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => { const el = ref.current; if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" }); };
  return (
    <div className={"how how-lead" + (closing ? " how-closing" : "")}>
      <div className="how-top">
        <h2 className="section-title">How Qoins works</h2>
        <button className="how-close" aria-label="Dismiss" onClick={onClose}>Dismiss</button>
      </div>
      <div className="how-rail" ref={ref} onScroll={onScroll}>
        {HOW_ITEMS.map((it, i) => (
          <div className="how-card" key={i}>
            <div className="how-inner">
              <div className="how-head">
                <span className="how-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{it.icon}</svg>
                </span>
                <div className="how-h">{it.title}</div>
              </div>
              <p className="how-p">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="dots">
        {HOW_ITEMS.map((_, i) => (
          <span key={i} className={"dot" + (i === active ? " active" : "")} onClick={() => goTo(i)} role="button" aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/* ---------- main screen ---------- */
type CollectionItem = {
  id: number;
  type: "avatar" | "spins";
  title: string;
  img: string;
  active?: boolean;
  count?: number;
  game?: string;
};
type ToastData = { title: string; msg?: string };

// Starting state (was tweakable in the mockup; fixed values here).
const START_BALANCE = 87;
const ACCENT = "#f67ad9";
const CLAIM_AMOUNT = 5;
const CELEBRATION = "coins";

export function QoinsRewardsView() {
  const reduce = useReducedMotion();
  // Opening transition: the blue header reveals (clip grows down) on
  // entry, then the hero + page content fade in. Flip one frame after
  // mount so the start state paints first and the CSS transitions run.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    // Double rAF: let the start state (clipped header / faded content)
    // paint in one frame, then flip on the next so the CSS transitions
    // actually run instead of coalescing into a single paint.
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      if (id2) cancelAnimationFrame(id2);
    };
  }, []);

  const [balance, setBalance] = useState(START_BALANCE);
  const [display, setDisplay] = useState(START_BALANCE);
  const [claimed, setClaimed] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [newSpin, setNewSpin] = useState<number | null>(null);
  const [howOpen, setHowOpen] = useState(true);
  const [howClosing, setHowClosing] = useState(false);
  const dismissHow = () => {
    setHowClosing(true);
    setTimeout(() => { setHowOpen(false); setHowClosing(false); }, 420);
  };
  const claimRef = useRef<HTMLButtonElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const joyRef = useRef<HTMLAudioElement>(null);
  const collectedRef = useRef<HTMLAudioElement>(null);
  const toastTid = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Monotonic id source for redeemed items — avoids Date.now()/Math.random()
  // (flagged impure by react-hooks/purity) while staying unique per session.
  const idSeq = useRef(0);

  const countTo = useCallback((from: number, to: number, delay?: number) => {
    cancelAnimationFrame(rafRef.current);
    const dur = 900, start = performance.now() + (delay || 0);
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / dur));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleClaim = () => {
    if (claimed) return;
    if (joyRef.current && joyRef.current.paused) { joyRef.current.play().catch(() => {}); }

    const next = balance + CLAIM_AMOUNT;
    setBalance(next);
    countTo(display, next, 500);
    setClaimed(true);

    if (heroRef.current) {
      heroRef.current.classList.remove("pop", "glow");
      void heroRef.current.offsetWidth;
      heroRef.current.classList.add("pop", "glow");
    }
    if (claimRef.current && fxRef.current) {
      const r = claimRef.current.getBoundingClientRect();
      celebrate(fxRef.current, r, CELEBRATION);
    }
  };

  const showToast = (input: string | ToastData) => {
    const data: ToastData = typeof input === "string" ? { title: input } : input;
    setToast(data);
    clearTimeout(toastTid.current);
    toastTid.current = setTimeout(() => setToast(null), 2400);
  };

  type Offer = {
    img: string;
    hoverImg?: string;
    avatar?: boolean;
    type: "spins" | "avatar";
    count?: number;
    game?: string;
    title: string;
    desc: string;
    cost: number;
  };

  const offers: Offer[] = [
    { img: ASSETS.westernGold, type: "spins", count: 25, game: "Western Gold 2", title: "25 Free Spins", desc: "Get 25 free Spins on Western Gold 2", cost: 75 },
    { img: ASSETS.westernGold, type: "spins", count: 50, game: "Western Gold 2", title: "50 Free Spins", desc: "Get 50 free Spins on Western Gold 2", cost: 130 },
    { img: ASSETS.westernGold, type: "spins", count: 100, game: "Western Gold 2", title: "100 Free Spins", desc: "Get 100 free Spins on Western Gold 2", cost: 230 },
    { img: ASSETS.westernGold, type: "spins", count: 200, game: "Western Gold 2", title: "200 Free Spins", desc: "Get 200 free Spins on Western Gold 2", cost: 440 },
    { img: ASSETS.westernGold, type: "spins", count: 400, game: "Western Gold 2", title: "400 Free Spins", desc: "Get 400 free Spins on Western Gold 2", cost: 850 },
  ];
  const merch: Offer[] = [
    { img: ASSETS.glasses1, hoverImg: ASSETS.glasses2, avatar: true, type: "avatar", title: "Buy sunglasses", desc: "Grab some fresh shades for your avatar", cost: 25 },
    { img: ASSETS.circle1, hoverImg: ASSETS.circle2, avatar: true, type: "avatar", title: "Golden line", desc: "Ever wanted a fancy gold avatar ring? Now's your chance", cost: 40 },
  ];
  const games = [
    { img: "/assets/spin.png", title: "Spin the Wheel", cost: 10 },
    { img: "/assets/higher.png", title: "Higher or Lower", cost: 10 },
    { img: "/assets/love.png", title: "Love It or Hate It", cost: 10 },
  ];

  const redeem = (offer: Offer) => {
    if (display < offer.cost) { showToast(`Need ${offer.cost - display} more Qoins for that`); return; }
    const next = balance - offer.cost;
    setBalance(next);
    countTo(display, next);
    const id = ++idSeq.current;
    const item: CollectionItem = offer.type === "avatar"
      ? { id, type: "avatar", title: offer.title, img: offer.img, active: true }
      : { id, type: "spins", count: offer.count, title: offer.title, game: offer.game, img: offer.img };
    setCollection((c) => [item, ...c]);
    if (offer.type !== "avatar") { setNewSpin(item.id); setTimeout(() => setNewSpin(null), 800); }
    if (collectedRef.current) {
      collectedRef.current.currentTime = 0;
      collectedRef.current.play().catch(() => {});
    }
    showToast({
      title: offer.type === "avatar" ? "It's yours!" : "You've got free spins!",
      msg: offer.type === "avatar" ? `${offer.title} added to your avatar` : `${offer.title} on ${offer.game}`,
    });
  };

  const playSpins = (item: CollectionItem) => {
    showToast(`Loading ${item.game} — your ${item.count} spins are ready`);
  };
  // add/remove an owned merch item without re-buying it
  const setMerchActive = (title: string, active: boolean) => {
    setCollection((c) => c.map((it) => (it.type === "avatar" && it.title === title) ? { ...it, active } : it));
    showToast(active ? `${title} added back` : `${title} removed`);
  };

  // all free-spins rewards owned (newest first) — shown in the blue area
  const spinsItems = collection.filter((c) => c.type === "spins");

  return (
    <div id="qoins-screen" style={{ ["--accent" as string]: ACCENT }}>
      {/* ---------------- HEADER ----------------
          No in-page top bar here — the global BrandBar (logo + Qoins
          pill + wallet/avatar) sits above this, same as every other
          page, so there's no component swap / jump on entry. This blue
          header holds just the balance hero + owned spins. */}
      <div
        className="header"
        style={{
          clipPath: reduce
            ? undefined
            : entered
              ? "inset(0% 0% 0% 0% round 0px 0px 24px 24px)"
              : "inset(0% 0% 100% 0% round 0px 0px 24px 24px)",
          transition: reduce ? undefined : "clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* balance card + your free spins all live in the blue */}
        <div
          className="hero-stack"
          style={{
            opacity: reduce || entered ? 1 : 0,
            transition: reduce ? undefined : "opacity 0.4s ease 0.42s",
          }}
        >
          <div className="hero-card">
            <div className="hero-top">
              <span className="coin hero-coin" />
              <div className="hero-info">
                <div className="hero-label">Your Qoins Balance</div>
                <div className="hero-amount" ref={heroRef}>{display}</div>
              </div>
            </div>
            <button
              className="claim-btn"
              ref={claimRef}
              onPointerDown={() => { if (!claimed && joyRef.current) joyRef.current.play().catch(() => {}); }}
              onClick={handleClaim}
              disabled={claimed}
            >
              {claimed
                ? <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}><CheckIcon />Claimed today</span>
                : `Claim Today's Qoins (+${CLAIM_AMOUNT})`}
            </button>
          </div>

          {spinsItems.map((s) => (
            <div className={"spins-card" + (s.id === newSpin ? " spins-enter" : "")} key={s.id}>
              <div className="spins-thumb" style={{ backgroundImage: `url(${s.img})` }} />
              <div className="spins-info">
                <div className="spins-title">{s.count} Free Spins</div>
                <div className="spins-sub">on {s.game}</div>
              </div>
              <button className="spins-play" onClick={() => playSpins(s)}>Play now</button>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- BODY ---------------- */}
      <div
        className="body"
        style={{
          opacity: reduce || entered ? 1 : 0,
          transition: reduce ? undefined : "opacity 0.45s ease 0.5s",
        }}
      >
        {/* how Qoins works — swipeable carousel (leads the page) */}
        {howOpen && <HowQoinsWorks closing={howClosing} onClose={dismissHow} />}

        {/* free spins */}
        <div className={"section" + (howOpen ? "" : " section-first")}>
          <h2 className="section-title">Free Spins</h2>
          <div className="rail">
            {offers.map((o, i) => (
              <OfferCard key={i} {...o} affordable={display >= o.cost} onRedeem={() => redeem(o)} />
            ))}
          </div>
        </div>

        {/* free to play — swipeable carousel of game tiles */}
        <div className="section">
          <h2 className="section-title">Q Free to Play Games</h2>
          <div className="rail">
            {games.map((g) => (
              <GameCard
                key={g.title}
                {...g}
                affordable={display >= g.cost}
                onPlay={() =>
                  display >= g.cost
                    ? showToast(`Loading ${g.title} — good luck!`)
                    : showToast(`Need ${g.cost - display} more Qoins to play`)
                }
              />
            ))}
          </div>
        </div>

        {/* merch */}
        <div className="section">
          <h2 className="section-title">MrQ Digital Merch</h2>
          <div className="rail">
            {merch.map((o) => {
              const item = collection.find((c) => c.type === "avatar" && c.title === o.title);
              return (
                <OfferCard
                  key={o.title}
                  {...o}
                  affordable={display >= o.cost}
                  purchased={!!item && !!item.active}
                  removed={!!item && !item.active}
                  onRedeem={() => redeem(o)}
                  onRemove={() => setMerchActive(o.title, false)}
                  onAdd={() => setMerchActive(o.title, true)}
                />
              );
            })}
          </div>
        </div>

        {/* legal */}
        <p className="legal">Qoins have no cash value and can&apos;t be withdrawn. Rewards subject to availability. 18+. <a className="legal-link" href="#">Full T&amp;Cs</a>.</p>
      </div>

      {/* toast */}
      {toast && (
        <div className="qtoast" role="status">
          <span className="qtoast-avatar"><img src={ASSETS.avatarNav} alt="" /></span>
          <span className="qtoast-text">
            <span className="qtoast-title">{toast.title}</span>
            {toast.msg && <span className="qtoast-sub">{toast.msg}</span>}
          </span>
        </div>
      )}

      {/* fx layer (fixed, viewport) */}
      <div className="fx-layer" ref={fxRef} />

      <audio ref={joyRef} src={ASSETS.joyMp3} preload="auto" />
      <audio ref={collectedRef} src={ASSETS.collectedMp3} preload="auto" />
    </div>
  );
}
