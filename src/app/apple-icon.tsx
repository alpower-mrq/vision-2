import { ImageResponse } from "next/og";

/**
 * iOS home-screen icon (180×180 PNG). Same look as the generic icon but
 * sized for the Apple touch-icon convention.
 *
 * iOS Safari uses this for the Add to Home Screen tile.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 140,
          fontWeight: 900,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          letterSpacing: -7,
        }}
      >
        Q
      </div>
    ),
    size,
  );
}
