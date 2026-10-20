// One-off generator for the hand-drawn company marks on About (src/data/company-marks.ts).
// Single-stroke hand lettering plus a few drawn shapes, with a fixed seed so the output never changes.
// Run: node scripts/gen-company-marks.mjs
import { writeFileSync } from 'node:fs';

let seed = 20261020;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const j = (a) => (rnd() - 0.5) * 2 * a;
const f = (n) => Math.round(n * 10) / 10;

// Catmull-Rom through points -> cubic bezier path
function smooth(pts, closed = false) {
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${f(p[1][0])} ${f(p[1][1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [p0, p1, p2, p3] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
const wob = (pts, a) => pts.map(([x, y]) => [x + j(a), y + j(a)]);
const ring = (cx, cy, r, n = 9, a = 0.25) => { const s = rnd() * 6.28, pts = []; for (let i = 0; i <= n; i++) { const t = s + (i / n) * 6.6; pts.push([cx + Math.cos(t) * r + j(a), cy + Math.sin(t) * r * 0.97 + j(a)]); } return pts; };
const disc = (cx, cy, r, n = 14, a = 0.06) => { const pts = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; pts.push([cx + Math.cos(t) * r + j(a), cy + Math.sin(t) * r + j(a)]); } return pts; };
const arc = (cx, cy, r, a0, a1, n = 6) => { const pts = []; for (let i = 0; i <= n; i++) { const t = ((a0 + (a1 - a0) * i / n) * Math.PI) / 180; pts.push([cx + Math.cos(t) * r + j(0.15), cy + Math.sin(t) * r + j(0.15)]); } return pts; };
const blob = (cx, cy, rx, ry, n = 10, a = 0.6) => { const s = rnd() * 6.28, pts = []; for (let i = 0; i < n; i++) { const t = s + (i / n) * 6.2832; pts.push([cx + Math.cos(t) * rx + j(a), cy + Math.sin(t) * ry + j(a)]); } return pts; };
const rrect = (cx, cy, w, h, a = 0.7, r = 5) => { const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2; return wob([[x0 + r, y0], [cx, y0], [x1 - r, y0], [x1, y0 + r], [x1, cy], [x1, y1 - r], [x1 - r, y1], [cx, y1], [x0 + r, y1], [x0, y1 - r], [x0, cy], [x0, y0 + r]], a); };

// Single-stroke lowercase glyphs. y: x-height top 0, baseline 10, ascender -8, descender 16. Each glyph: strokes (point lists), width, optional dot.
const G = {
  H: { w: 11, s: [[[1.5, -8], [1.5, 10]], [[9.5, -8], [9.5, 10]], [[1.5, 1], [9.5, 1]]] },
  a: { w: 10, s: [{ ring: [4.5, 5, 4.4] }, [[8.8, 0.6], [8.8, 10]]] },
  c: { w: 9, s: [[[8, 2], [5, 0.3], [1.8, 2.4], [0.8, 5.5], [2, 8.6], [5, 10], [8, 8.6]]] },
  e: { w: 9, s: [[[0.8, 5.5], [8, 5], [7.5, 2], [4, 0.4], [1, 3], [0.6, 6.8], [3, 9.6], [6, 10], [8.2, 8.6]]] },
  f: { w: 8.6, s: [[[5, 10], [5, -2], [6.4, -6], [9, -7.4]], [[1.5, 1], [8.5, 1]]] },
  h: { w: 9, s: [[[1.5, -8], [1.5, 10]], [[1.5, 4.5], [3, 1.4], [6, 0.5], [8, 3], [8, 10]]] },
  i: { w: 4, s: [[[2, 1.5], [2, 10]]], dot: [2, -2.4] },
  k: { w: 9, s: [[[1.5, -8], [1.5, 10]], [[8, 0.5], [1.5, 6.6]], [[4, 4.6], [8.6, 10]]] },
  l: { w: 4, s: [[[2, -8], [2, 10]]] },
  n: { w: 9, s: [[[1.5, 0.5], [1.5, 10]], [[1.5, 4.5], [3, 1.4], [6, 0.5], [8, 3], [8, 10]]] },
  o: { w: 10, s: [{ ring: [4.8, 5, 4.6] }] },
  p: { w: 10, s: [[[1.5, 0.5], [1.5, 16]], [[1.5, 3], [3, 0.7], [6, 0.3], [8.8, 3], [8.8, 7], [6, 9.8], [3, 9.5], [1.5, 7.5]]] },
  r: { w: 8, s: [[[1.5, 0.5], [1.5, 10]], [[1.5, 4.2], [3, 1.4], [5.8, 0.6], [7.6, 1.6]]] },
  s: { w: 9, s: [[[7.5, 2], [4.5, 0.4], [1.5, 2.4], [4, 5], [7.5, 7.2], [6.5, 9.6], [3.5, 10], [0.5, 8.6]]] },
  t: { w: 9, s: [[[4, -4], [4, 8], [5.5, 10], [8, 9]], [[1, 1], [8, 1]]] },
  v: { w: 9, s: [[[0.5, 0.5], [4.5, 10], [8.5, 0.5]]] },
  w: { w: 12, s: [[[0.5, 0.5], [3, 10], [6, 2], [9, 10], [11.5, 0.5]]] },
  z: { w: 10, s: [[[0.6, 0.8], [8, 0.4], [1, 9.4], [8.6, 10]]] },
  '.': { w: 3, s: [{ ring: [1.5, 9.3, 0.6] }] },
};

// word(): returns { paths, width }. Lays glyphs out on a wobbly baseline.
function word(text, { x = 0, y = 0, scale = 1, gap = 2.2, role = 'ink', w = 1.5, skip = [], italic = 0, sx = scale, italicMap = {} } = {}) {
  let cx = 0;
  const paths = [], at = [];
  [...text].forEach((ch, i) => {
    const g = G[ch];
    const dy = j(0.35), rot = j(0.03);
    const T = ([px, py]) => { const rx = px * Math.cos(rot) - py * Math.sin(rot) + (10 - py) * (italicMap[ch] ?? italic); const ry = px * Math.sin(rot) + py * Math.cos(rot); return [x + (cx + rx + j(0.18)) * sx, y + (ry + dy + j(0.18)) * scale]; };
    at.push({ ch, cx: x + (cx + g.w / 2) * sx, cy: y + (5 + dy) * scale, r: (g.w / 2) * scale });
    if (!skip.includes(i)) {
      for (const s of g.s) paths.push({ d: smooth(s.ring ? ring(s.ring[0], s.ring[1], s.ring[2]).map(T) : s.map(T)), role, w });
      if (g.dot) { const [dx, dyy] = T(g.dot); paths.push({ d: smooth(ring(dx, dyy, 0.5 * scale + 0.4, 6, 0.1), false), role, w: w * 1.3 }); }
    }
    cx += g.w + gap;
  });
  return { paths, width: (cx - gap) * sx, at };
}
const centered = (text, cxPage, opts) => { const probe = word(text, { ...opts, x: 0, y: 0 }); /* consume rnd differently each call; width is deterministic */ const wd = probe.width; return word(text, { ...opts, x: cxPage - wd / 2 }); };

const marks = [];
const shape = (d, role, w = 1.6) => ({ d, role, w });

// 1. Salesforce: a cloud with lobes along the top AND the bottom (union of circles traced from the logo), upright name with the slanted "f"
{
  const C = [[305, 215, 112], [495, 215, 88], [665, 320, 125], [545, 440, 78], [385, 480, 92], [245, 385, 100], [440, 350, 140]];
  const [ox, oy] = [467, 346], N = 140, pts = [];
  for (let k = 0; k < N; k++) {
    const a = (k / N) * 2 * Math.PI, dx = Math.cos(a), dy = Math.sin(a);
    let best = 0;
    for (const [cx, cy, r] of C) { const px = ox - cx, py = oy - cy, b = px * dx + py * dy, disc = b * b - (px * px + py * py - r * r); if (disc >= 0) best = Math.max(best, -b + Math.sqrt(disc)); }
    pts.push([60 + (ox + dx * best - 467) * 0.165, 40 + (oy + dy * best - 346) * 0.165]);
  }
  const cloud = wob(pts.filter((_, k) => k % 2 === 0), 0.12);
  const w = centered('salesforce', 60, { y: 33.6, scale: 0.8, gap: 1.9, w: 2.1, role: 'light', italicMap: { f: 0.3 } });
  marks.push({ name: 'Salesforce', parts: [shape(smooth(cloud, true), 'solid-ink', 0), ...w.paths] });
}
// 2. Zeta: a full rounded tile, chunky white name
{
  const w = centered('zeta', 60, { y: 33, scale: 1.4, gap: 2.4, role: 'light', w: 4 });
  marks.push({ name: 'Zeta', parts: [shape(smooth(rrect(60, 40, 84, 72, 0.5, 11), true), 'fill-ink', 1.4), ...w.paths] });
}
// 3. Kovai.co: bold name with the faceted ring "o" (coloured wedges, a small satellite ring top right), then a lighter .co
{
  const R1 = 8.8, R0 = 5.3;
  const kk = word('k', { x: 7, y: 46, scale: 1.3, w: 3 });
  const o = { cx: 7 + kk.width + 2.6 + R1, cy: 52.2 };
  const va = word('vai', { x: o.cx + R1 + 2.4, y: 46, scale: 1.3, gap: 2.4, w: 3 });
  const k = { paths: [...kk.paths, ...va.paths], width: va.width + (va.paths.length ? o.cx + R1 + 2.4 - 8 : 0) };
  const rad = (a) => (a * Math.PI) / 180;
  const wedge = (a0, a1, role, r0 = R0, r1 = R1) => {
    const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 10)), pt = (r, a) => [o.cx + Math.cos(rad(a)) * r + j(0.06), o.cy + Math.sin(rad(a)) * r + j(0.06)], pts = [];
    for (let q = 0; q <= n; q++) pts.push(pt(r1, a0 + ((a1 - a0) * q) / n));
    for (let q = n; q >= 0; q--) pts.push(pt(r0, a0 + ((a1 - a0) * q) / n));
    return shape('M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z', role, 0.35);
  };
  // angles run clockwise from 3 o'clock; colours are the logo's, mapped to the site's inks
  const ring = [
    wedge(212, 332, 'facet-accent'),   // green, top
    wedge(150, 212, 'facet-muted'),    // orange / yellow, left
    wedge(122, 150, 'facet-accent'),   // light blue
    wedge(98, 122, 'facet-ink'),       // deep blue
    wedge(72, 98, 'facet-muted'),      // orange-red
    wedge(36, 72, 'facet-ink'),        // red
    wedge(-28, 36, 'facet-ink'),       // purple, right
    wedge(-28, 0, 'facet-accent', R0, R1), // light purple sliver beside the satellite
  ];
  const sx = o.cx + Math.cos(rad(-47)) * 7.05, sy = o.cy + Math.sin(rad(-47)) * 7.05;
  const sat = (a0, a1, role) => { const pts = [[sx, sy]]; for (let q = 0; q <= 6; q++) { const a = rad(a0 + ((a1 - a0) * q) / 6); pts.push([sx + Math.cos(a) * 2.15, sy + Math.sin(a) * 2.15]); } return shape('M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z', role, 0.3); };
  const halo = shape(smooth(disc(sx, sy, 3.2, 16, 0.02), true), 'solid-bg', 0);
  const mini = [sat(180, 250, 'facet-accent'), sat(250, 300, 'facet-muted'), sat(300, 340, 'facet-ink'), sat(340, 420, 'facet-ink'), sat(60, 180, 'facet-ink')];
  const co = word('.co', { x: o.cx + R1 + 2.4 + va.width + 3.5, y: 46, scale: 0.95, gap: 1.8, w: 1.8, role: 'ink-muted' });
  marks.push({ name: 'Kovai.co', parts: [...ring, halo, ...mini, ...k.paths, ...co.paths] });
}
// 4. Hackowls: bold name over the owl head (dark body with ear points, lime ring eyes with big pupils, chevron beak), cropped flat at the bottom like the logo
{
  const X = (x) => 60 + (x - 200) * 0.28, Y = (y) => 1 + (y - 118) * 0.28, P = (pts) => pts.map(([x, y]) => [X(x), Y(y)]);
  const w = centered('Hackowls', 60, { y: 5.9, scale: 0.616, sx: 0.83, gap: 2.6, w: 2.9 });
  const head = wob(P([[40, 236], [58, 229], [110, 236], [160, 246], [200, 249], [240, 246], [290, 236], [342, 229], [360, 236], [372, 262], [362, 320], [345, 362], [325, 398], [75, 398], [55, 362], [38, 320], [28, 262]]), 0.2);
  const eye = (cx) => {
    const [ex, ey] = [X(cx), Y(320)];
    const m = cx < 200 ? 1 : -1;
    return [
      shape(smooth(disc(ex, ey, 78 * 0.28), true), 'solid-accent', 0),
      shape(smooth(disc(ex, ey, 62 * 0.28), true), 'solid-light', 0),
      shape(smooth(disc(ex + 0.5 * m, ey + 1.6, 44 * 0.28), true), 'solid-ink', 0),
      shape(smooth(disc(ex + 2.2, ey - 1, 2.1, 10, 0.02), true), 'solid-light', 0),
    ];
  };
  marks.push({ name: 'Hackowls', parts: [
    ...w.paths,
    shape(smooth(head, true), 'solid-ink', 0),
    ...eye(135), ...eye(265),
    shape(smooth(wob(P([[150, 398], [200, 346], [250, 398]]), 0.1), true), 'solid-accent', 0),
    shape(smooth(wob(P([[176, 398], [200, 372], [224, 398]]), 0.1), true), 'solid-ink', 0),
  ] });
}
// 5. Spotknack: a tapered black wedge with two round eyes (white, big pupils, a glint), then the name in a round geometric hand
{
  const wedge = wob([[0.5, 41], [5, 36.5], [12, 34], [19, 33.2], [26, 35], [28.5, 40], [26, 45.6], [19, 47.4], [12, 46.5], [5, 44.5]], 0.15);
  const eye = (cx, r, ring_w) => [
    shape(smooth(disc(cx, 40, r), true), 'fill-light', ring_w),
    shape(smooth(disc(cx - 0.9, 40 - 0.7, r * 0.55), true), 'solid-ink', 0),
    shape(smooth(disc(cx - 1.5, 38.6, 0.8, 10, 0.01), true), 'solid-light', 0),
  ];
  const w = word('spotknack', { x: 32.5, y: 35.6, scale: 0.86, sx: 0.84, gap: 1.6, w: 2.3 });
  marks.push({ name: 'Spotknack', parts: [
    shape(smooth(wedge, true), 'solid-ink', 0),
    ...eye(12.2, 4.6, 1), ...eye(20.6, 5.2, 1.7),
    ...w.paths,
  ] });
}

const out = `/*
  Hand-drawn company marks for About. GENERATED by scripts/gen-company-marks.mjs (fixed seed), do not edit by hand.
  Every mark is drawn in a 120 x 80 box. Roles map to token colours in CompanyMarks.astro:
  ink / light = strokes, fill-ink / fill-light / fill-accent = filled shapes with an ink outline, ink-accent = a sage stroke.
*/
export const companyMarks: { name: string; parts: { d: string; role: string; w: number }[] }[] = ${JSON.stringify(marks, null, 1)};
`;
writeFileSync(new URL('../src/data/company-marks.ts', import.meta.url), out);
console.log('ok', marks.map((m) => m.name + ':' + m.parts.length).join(' '));
