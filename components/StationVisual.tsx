import StationCore from "./StationCore";
import Icon from "./Icon";

export default function StationVisual() {
  return (
    <div className="station-visual">
      <div className="visual-coordinates" aria-hidden="true"><span>BS / NETWORK</span><span>01 — ∞</span></div>
      <div className="visual-orbit orbit-one" aria-hidden="true" /><div className="visual-orbit orbit-two" aria-hidden="true" />
      <svg className="visual-connections" viewBox="0 0 500 500" fill="none" aria-hidden="true"><path d="M80 165h75l95 85h120v110M140 385v-90l110-45V100h110" stroke="currentColor" strokeDasharray="4 6" /><circle cx="80" cy="165" r="4" fill="currentColor" /><circle cx="140" cy="385" r="4" fill="currentColor" /><circle cx="360" cy="100" r="4" fill="currentColor" /></svg>
      <StationCore />
      <div className="visual-chip chip-code" aria-hidden="true"><span className="chip-icon"><Icon name="code" /></span><div><span className="eyebrow">01 / CREA</span><strong>Open by default.</strong></div></div>
      <div className="visual-chip chip-community" aria-hidden="true"><span className="chip-icon"><Icon name="people" /></span><div><span className="eyebrow">02 / CONECTA</span><strong>Mejor en comunidad.</strong></div><span className="status-dot" /></div>
      <div className="visual-code" aria-hidden="true"><span className="code-comment">{"// tu siguiente gran idea"}</span><br /><span className="code-blue">const</span> futuro = <span className="code-blue">build</span>({"{"}<br /><span className="code-indent">ideas, código, comunidad</span><br />{"}"});<span className="code-cursor" /></div>
      <div className="visual-bottom" aria-hidden="true"><span>IDEA → COMMIT → COMUNIDAD</span><span>↗</span></div>
    </div>
  );
}
