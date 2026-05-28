"use client";

import { HomeView } from "./views/HomeView";

/**
 * Lobby page contents — just the home feed for now.
 *
 * The Casino / Bingo / Live / Arena filter pills (ScrollAwareFilters)
 * used to sit at the top of this view; the user asked to hide them
 * temporarily while we evaluate the lobby without that nav. The
 * component is still on disk and importable — drop `<ScrollAwareFilters />`
 * back above `<HomeView />` here when we want it back.
 */
export function LobbyContent() {
  return <HomeView />;
}
