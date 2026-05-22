import { ImageResponse } from "next/og";

/**
 * Generic app icon (used by browsers, PWA manifest, etc.).
 * Rendered at request time as a 256×256 PNG via @vercel/og.
 *
 * Big "Q" mark on the MrQ brand-blue background, matching the logo's
 * dominant character.
 */
export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a2ecb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: 200,
          fontWeight: 900,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          letterSpacing: -10,
        }}
      >
        Q
      </div>
    ),
    size,
  );
}
