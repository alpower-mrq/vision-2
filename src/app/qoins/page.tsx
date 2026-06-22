import { QoinsRewardsView } from "@/components/views/QoinsRewardsView";

// Qoins Rewards — MrQ's loyalty-currency screen (Claude Design import
// "Qoins Rewards"). Reached from the coins pill in the BrandBar, which
// replaced the old Season Pass diamond.
//
// The page owns its own chrome — the global BrandBar, BottomNav, and
// ResumePlayingBar are hidden by AppShell on /qoins (same treatment as
// /passes and /play). The view paints its own brand-blue header.
export default function QoinsPage() {
  return <QoinsRewardsView />;
}
