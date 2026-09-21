import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "BuildStation. AI for AEC-Energy.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const mark = await readFile(join(process.cwd(), "public/buildstation-mark.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#f5f5f5",
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={220} height={220} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "64px",
          }}
        >
          <div style={{ fontSize: 28, letterSpacing: "0.18em", color: "#a1a1a1" }}>
            BUILDSTATION
          </div>
          <div style={{ fontSize: 72, marginTop: 24, lineHeight: 1 }}>
            AI for AEC-Energy
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
