/** Tiny monthly trend line for table rows (2px stroke, end-point dot). */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const W = 96;
  const H = 28;
  const pad = 3;
  const max = Math.max(1, ...values);
  const step = (W - pad * 2) / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => [pad + i * step, H - pad - ((H - pad * 2) * v) / max] as const);
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <polyline
        points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="#16A34A"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lx} cy={ly} r={3} fill="#16A34A" stroke="#fff" strokeWidth={1.5} />
    </svg>
  );
}
