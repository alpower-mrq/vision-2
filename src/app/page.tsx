import { LobbyContent } from "@/components/LobbyContent";

/**
 * Lobby — the app's landing page.
 *
 * Renders only the lobby-specific content (category pills + home
 * feed). The mobile-frame, brand bar, bottom nav, side-nav drawer and
 * loading splash all live in the shared AppShell (see
 * `src/app/layout.tsx` → `AppShell`) and wrap every route.
 */
export default function Home() {
  return <LobbyContent />;
}
