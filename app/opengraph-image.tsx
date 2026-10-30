import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "BuildStation — Las ideas se construyen en comunidad. IA aplicada a infraestructura. Desde Lima, construyendo para LatAm.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A new image URL lets sharing crawlers refresh the previous English cover.
export function generateImageMetadata() {
  return [{ id: "comunidad-20261030", alt, size, contentType }];
}

export default async function OpenGraphImage() {
  const mark = await readFile(join(process.cwd(), "public/brand/official-mark.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0e11",
          backgroundImage: "radial-gradient(ellipse at 90% 35%, #173c53 0%, #0b0e11 65%)",
          color: "#efeee9",
          padding: "54px 64px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: "-1px" }}>BuildStation</div>
          <div style={{ display: "flex", fontSize: 15, letterSpacing: "3px", color: "#71c9ff" }}>BUILD. SHARE. REPEAT.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 740 }}>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-4px" }}>Las ideas se</div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-4px" }}>construyen</div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-4px", color: "#71c9ff" }}>en comunidad.</div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 23, color: "#a0a8b0" }}>IA aplicada a infraestructura.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 276, height: 290, border: "1px solid #36566c", borderRadius: 42, background: "#111e28" }}>
            {/* ImageResponse requires a native image with embedded source data. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" width={208} height={220} style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingTop: 24, borderTop: "1px solid #2c3a45", fontSize: 17, color: "#a0a8b0" }}>
          <span>CONSTRUCCIÓN / MINERÍA / ENERGÍA / REAL ESTATE</span>
          <span style={{ color: "#71c9ff" }}>LIMA → LATAM</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
