import type { Project } from "@/lib/data";

// План дома в метрах: SVG сам вписывается в блок, стены, дверь, окна и размеры
export function Plan({ project }: { project: Project }) {
  const { width: w, depth: d, area } = project;
  const m = Math.max(w, d);
  const pad = m * 0.2;
  const tail = m * 0.08;
  const t = 0.12 + m * 0.01;
  const thin = { vectorEffect: "non-scaling-stroke" } as const;
  const grid = Array.from({ length: 41 }, (_, i) => i - 20);
  const door = { x: Math.max(t + 0.3, w * 0.22), size: Math.min(0.9, w * 0.28) };
  const frontWindow = Math.min(1.2, w * 0.3);
  const sideWindow = Math.min(1.2, d * 0.3);
  // Окно: разрыв в стене и два тонких стекла по оси стены
  const windowH = (x: number, y: number, len: number) => <g key={`h${x}${y}`}><rect className="plan-floor" x={x} y={y} width={len} height={t} /><line className="plan-glass" x1={x} x2={x + len} y1={y + t * 0.35} y2={y + t * 0.35} {...thin} /><line className="plan-glass" x1={x} x2={x + len} y1={y + t * 0.65} y2={y + t * 0.65} {...thin} /></g>;
  const windowV = (x: number, y: number, len: number) => <g key={`v${x}${y}`}><rect className="plan-floor" x={x} y={y} width={t} height={len} /><line className="plan-glass" y1={y} y2={y + len} x1={x + t * 0.35} x2={x + t * 0.35} {...thin} /><line className="plan-glass" y1={y} y2={y + len} x1={x + t * 0.65} x2={x + t * 0.65} {...thin} /></g>;
  const tick = m * 0.025;
  const dimY = -pad * 0.45;
  const dimX = -pad * 0.45;
  return <svg className="plan-drawing" viewBox={`${-pad} ${-pad} ${w + pad + tail} ${d + pad + tail}`} role="img" aria-label={`План дома ${w} на ${d} метров, ${area} м²`}>
    {grid.map(i => <line key={`gx${i}`} className="plan-grid" x1={i} x2={i} y1={-20} y2={d + 20} {...thin} />)}
    {grid.map(i => <line key={`gy${i}`} className="plan-grid" y1={i} y2={i} x1={-20} x2={w + 20} {...thin} />)}
    <rect className="plan-wall" x={0} y={0} width={w} height={d} />
    <rect className="plan-floor" x={t} y={t} width={w - 2 * t} height={d - 2 * t} />
    {windowH(w / 2 - frontWindow / 2, 0, frontWindow)}
    {windowH(Math.min(w - t - 0.3 - frontWindow, w * 0.62), d - t, frontWindow)}
    {windowV(0, d / 2 - sideWindow / 2, sideWindow)}
    {windowV(w - t, d / 2 - sideWindow / 2, sideWindow)}
    <rect className="plan-floor" x={door.x} y={d - t} width={door.size} height={t} />
    <line className="plan-door" x1={door.x} y1={d - t} x2={door.x} y2={d - t - door.size} {...thin} />
    <path className="plan-swing" d={`M ${door.x + door.size} ${d - t} A ${door.size} ${door.size} 0 0 0 ${door.x} ${d - t - door.size}`} {...thin} />
    <text className="plan-area" x={w / 2} y={d / 2} fontSize={m * 0.085}>{area} м²</text>
    <g className="plan-dim">
      <line x1={0} x2={w} y1={dimY} y2={dimY} {...thin} />
      <line x1={0} x2={0} y1={dimY - tick * 2} y2={-t} {...thin} /><line x1={w} x2={w} y1={dimY - tick * 2} y2={-t} {...thin} />
      <line x1={-tick} x2={tick} y1={dimY + tick} y2={dimY - tick} {...thin} /><line x1={w - tick} x2={w + tick} y1={dimY + tick} y2={dimY - tick} {...thin} />
      <line y1={0} y2={d} x1={dimX} x2={dimX} {...thin} />
      <line y1={0} y2={0} x1={dimX - tick * 2} x2={-t} {...thin} /><line y1={d} y2={d} x1={dimX - tick * 2} x2={-t} {...thin} />
      <line x1={dimX - tick} x2={dimX + tick} y1={tick} y2={-tick} {...thin} /><line x1={dimX - tick} x2={dimX + tick} y1={d + tick} y2={d - tick} {...thin} />
    </g>
    <text className="plan-dim-text" x={w / 2} y={dimY - m * 0.03} fontSize={m * 0.05}>{w} м</text>
    <text className="plan-dim-text" x={dimX - m * 0.03} y={d / 2} fontSize={m * 0.05} transform={`rotate(-90 ${dimX - m * 0.03} ${d / 2})`}>{d} м</text>
  </svg>;
}
