import { TopNav } from "@/components/TopNav";
import { BottomBar } from "@/components/BottomBar";
import { LobbyContent } from "@/components/LobbyContent";
import { SideNav } from "@/components/SideNav";
import { FilterProvider } from "@/lib/filter-context";

/**
 * MrQ concept lobby.
 *
 * Wrapped in <FilterProvider> so the sub-filter pills (inside TopNav) and the
 * content area (LobbyContent) share state — clicking Casino / Live / Bingo
 * highlights the pill AND swaps the content view below.
 */
export default function Home() {
  return (
    <FilterProvider>
      <div className="mobile-frame">
        <TopNav />

        <main className="bg-white">
          <LobbyContent />
          {/* Bottom safe area — clears both the floating bottom bar (~52px
              tall, lifted 72px above viewport bottom) AND iOS Safari's own
              bottom chrome. Everything below the last content row should be
              empty white so Safari's UI lands on a clean white surface. */}
          <div style={{ height: "max(140px, calc(env(safe-area-inset-bottom) + 140px))" }} aria-hidden />
        </main>

        <BottomBar />
        <SideNav />
      </div>
    </FilterProvider>
  );
}
