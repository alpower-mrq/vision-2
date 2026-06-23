import { ProfileView } from "@/components/views/ProfileView";

// Profile — full-page account hub (Figma 445:18822). Reached by tapping
// the avatar in the BrandBar. A normal page: the global BrandBar (back
// arrow + Qoins/wallet pills) and BottomNav stay, but no bottom-nav tab
// is active while here. Reuses the SideNav's PlayStreakCard + menu rows.
export default function ProfilePage() {
  return <ProfileView />;
}
