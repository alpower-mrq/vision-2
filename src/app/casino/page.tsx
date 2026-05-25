import { CasinoView } from "@/components/views/CasinoView";

/**
 * Casino vertical — dedicated route reached from the Lobby's Casino
 * pill (or any deep link to `/casino`). The CasinoView component holds
 * the actual content; this file just wires it into the App Router.
 *
 * Eventually this page will have its own designed lobby content (slots
 * tabs, providers, jackpots feed, etc.) rather than reusing the
 * generic CasinoView — currently it's the same content the old
 * SwipeStrip used so we don't regress anything while iterating.
 */
export default function CasinoPage() {
  return <CasinoView />;
}
