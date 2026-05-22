import type { MetadataRoute } from "next";

/**
 * Web App Manifest — tells browsers (especially iOS Safari + Android Chrome)
 * that this site can be installed as a standalone app on the user's home
 * screen.
 *
 * Key fields for "feels like a native app":
 *   - display: "standalone"     → no browser chrome when launched from home
 *   - background_color           → splash background while loading
 *   - theme_color                → status bar tint on Android
 *   - orientation: "portrait"    → locks to portrait, matches a phone app
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MrQ",
    short_name: "MrQ",
    description: "MrQ mobile lobby concept",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a2ecb",
    theme_color: "#0a2ecb",
    icons: [
      // Generated dynamically by app/icon.tsx (PNG) — Next.js wires these up.
      {
        src: "/icon",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
