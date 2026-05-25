"use client";

import { ScrollAwareFilters } from "./ScrollAwareFilters";
import { HomeView } from "./views/HomeView";

/**
 * Lobby page contents — category pills at the top + the default home
 * feed below.
 *
 * Previously this component also owned the swipe-strip transition
 * between Casino/Live/Bingo/Arena filter views. Those four verticals
 * now live on their own routes (`/casino`, `/live`, ...), so this is
 * just a thin wrapper around the home feed plus the sticky filter band.
 */
export function LobbyContent() {
  return (
    <>
      <ScrollAwareFilters />
      <HomeView />
    </>
  );
}
