/* Paper plane flight, simulated rather than drawn as a curve. A point-mass glider in 3D (x across, z toward the viewer, h up)
   with the real glider equations: lift grows with speed squared, so a fast launch zooms up, slows, nose-drops, dives and
   recovers (the phugoid swoops). Banking turns it, so it can circle, loop and double back, and depth shows up as size.
   Rising air (thermals) keeps it up long enough to wander the whole window. Each flight has a "style" (low skim, high climb,
   loop, sweep across the page, circle) that sets how it launches and where it heads, and a final target that is a real thing
   on the page. Random plans are tried until one flies into something. Pure maths, no DOM. */

export type Rect = { x0: number; y0: number; x1: number; y1: number; id: number };
export type Sample = { t: number; x: number; y: number; rot: number; sx: number; sy: number; fall: boolean };
export type Flight = { samples: Sample[]; duration: number; hitAt: number; hitId: number; hitY: number; mode: string };
type Opts = { ox: number; oy: number; W: number; H: number; rects: Rect[] };
type Style = 'low' | 'high' | 'loop' | 'sweep' | 'circle';

const G = 640, VE = 280, LD = 5.5, DT = 1 / 120, REC = 4;      // px/s², trim speed (lift = weight), glide ratio, step, steps per sample
const rad = (d: number) => d * Math.PI / 180, clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const wrap = (a: number) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];

function attempt(o: Opts, style: Style, tgt: Rect): Flight | null {
  const { ox, oy, W, H, rects } = o;
  const side = Math.random() < 0.5 ? -1 : 1, ph = [rnd(0, 6.3), rnd(0, 6.3), rnd(0, 6.3), rnd(0, 6.3)];
  // ---- launch: each style throws differently
  let V: number, gam: number, lift: number;
  const psi0 = Math.PI + rnd(-0.7, 0.7) + (Math.random() < 0.3 ? rnd(-1.2, 1.2) : 0);
  if (style === 'low') { V = rnd(480, 760); gam = rad(rnd(4, 24)); lift = rnd(25, 75); }
  else if (style === 'high') { V = rnd(900, 1200); gam = rad(rnd(52, 74)); lift = rnd(150, 230); }
  else if (style === 'loop') { V = rnd(650, 900); gam = rad(rnd(30, 55)); lift = rnd(90, 150); }
  else if (style === 'circle') { V = rnd(560, 820); gam = rad(rnd(25, 55)); lift = rnd(80, 140); }
  else { V = rnd(600, 900); gam = rad(rnd(20, 60)); lift = rnd(100, 160); }
  let X = 0, Z = 0, h = 0, phi = 0, psi = psi0;

  // ---- the final target: something real on the page, chosen to suit the style
  const tx = (tgt.x0 + tgt.x1) / 2 - ox, th = oy - (tgt.y0 + tgt.y1) / 2;

  // ---- waypoints to fly through on the way (screen-relative to the hatch), different for each style
  const wps: { x: number; h: number }[] = [];
  const wpAt = (fx: number, fy: number) => wps.push({ x: fx * W - ox, h: oy - fy * H });
  if (style === 'sweep') { const n = pick([2, 3]); for (let k = 0; k < n; k++) wpAt(rnd(0.08, 0.92), rnd(0.12, 0.85)); }
  else if (style === 'loop') wpAt(rnd(0.3, 0.8), rnd(0.2, 0.6));
  else if (style === 'high') wpAt(rnd(0.15, 0.85), rnd(0.12, 0.3));
  else if (style === 'low' && Math.random() < 0.5) wpAt(rnd(0.15, 0.85), rnd(0.7, 0.9));
  let wi = 0, wpT = 0;
  const circleBank = rad(rnd(34, 52)) * side, tCircle = rnd(2.4, 3.8);
  const loopFrom = rnd(0.2, 0.5), loopTo = loopFrom + rnd(1.1, 1.6);   // "loop": a hard pull-up, holding the stick back
  let rot = 0, rotInit = false, fall = false, tf = 0, fvx = 0, fvh = 0, spin = 0, rot0 = 0, hitAt = 0, hitId = -1;
  const samples: Sample[] = [];
  const steerTo = (x: number, z: number) => clamp(2.2 * wrap(Math.atan2(z - Z, x - X) - psi), rad(-56), rad(56));

  for (let i = 0, t = 0; t < 14; i++, t = i * DT) {
    const px = ox + X, py = oy - h;
    if (!fall) {
      // ---- where to go: wall > circle > waypoints > final target
      let bank: number, goalH: number | null = null;
      const wp = wps[wi];
      if (px < 40 || px > W - 40) bank = steerTo(W / 2 - ox, 0);
      else if (style === 'circle' && t < tCircle) bank = t > 0.35 ? circleBank : 0;
      else if (wp) {
        bank = steerTo(wp.x, 0); goalH = wp.h;
        if (Math.abs(wp.x - X) < 110 || t - wpT > 4.2) { wi++; wpT = t; }
      } else { bank = steerTo(tx, 0); goalH = th; }
      phi += (bank - phi) * DT / 0.45;

      // ---- glider dynamics
      const q = (V / VE) ** 2, ql = Math.min(q, 2.1), wob = 0.22 * Math.sin(2.1 * t + ph[0]) + 0.16 * Math.sin(3.7 * t + ph[1]);
      let dg = (G / V) * (ql * Math.cos(phi) - Math.cos(gam)) + wob;
      if (style === 'loop' && t > loopFrom && t < loopTo) dg += 3.2;
      else if (goalH !== null) { // elevator: ease the nose toward the height it wants
        const d = Math.hypot((wp ? wp.x : tx) - X, Z), want = clamp(Math.atan2(goalH - h, Math.max(d, 80)), rad(-55), rad(50));
        dg += clamp(2.2 * (want - gam), -2.2, 2.2);
      }
      if (V < VE * 0.55) dg -= 4 * (1 - V / (VE * 0.55));                 // stall: too slow to hold the nose up, so it drops
      if (py < 50) dg -= 2.6;                                              // never fly off the top of the window
      V = Math.max(70, V + (-G * Math.sin(gam) - (G / LD) * q) * DT);
      gam = clamp(gam + dg * DT, rad(-82), rad(88));
      psi += ((G / V) * ql * Math.sin(phi) / Math.max(Math.cos(gam), 0.25) + 0.12 * Math.sin(1.3 * t + ph[2])) * DT;
      const vx = V * Math.cos(gam) * Math.cos(psi), vz = V * Math.cos(gam) * Math.sin(psi), vh = V * Math.sin(gam);
      const air = lift * (0.45 + 0.55 * Math.sin(0.0045 * px + 0.8 * t + ph[3]));   // rising air, patchy across the page
      X += vx * DT; Z += vz * DT; h += (vh + air) * DT;

      // ---- screen heading, smoothed so a plane flying at the viewer does not spin
      if (Math.hypot(vx, vh) > 50) {
        const a = Math.atan2(-vh, vx) * 180 / Math.PI - 180;
        if (!rotInit) { rot = a; rotInit = true; } else { let d = a - rot; while (d > 180) d -= 360; while (d < -180) d += 360; rot += d * Math.min(1, DT * 10); }
      }

      // ---- did it fly into something?
      const nx = ox + X, ny = oy - h;
      if (t > 0.9 && Math.abs(Z) < 90) {
        for (const q2 of rects) {
          if (nx > q2.x0 - 2 && nx < q2.x1 + 2 && ny > q2.y0 - 2 && ny < q2.y1 + 2) {
            const dl = nx - q2.x0, dr = q2.x1 - nx, dtp = ny - q2.y0, db = q2.y1 - ny, m = Math.min(dl, dr, dtp, db);
            if (m === dl || m === dr) { fvx = -0.3 * vx; fvh = vh * 0.4 + 60; }                 // hit a side: bounce back off it
            else { fvx = vx * 0.4; fvh = m === dtp ? Math.abs(vh) * 0.25 + 40 : -Math.abs(vh) * 0.2; } // hit a top (hop up) or a bottom (drop)
            fvx = clamp(fvx, -260, 260);
            fall = true; hitAt = t; hitId = q2.id; rot0 = rot; spin = rnd(160, 300) * (fvx > 0 ? 1 : -1); tf = 0;
            break;
          }
        }
      }
      if (!fall && (nx < -30 || nx > W + 30 || ny > H + 30 || ny < -30)) return null;   // flew away without hitting anything
    } else { // ---- tumbling down: gravity, strong air drag (terminal speed about 230px/s) and a flutter
      tf += DT;
      fvh += (-G * 0.55 - 2.2 * fvh) * DT;
      fvx += (-1.6 * fvx + 150 * Math.sin(7 * tf + ph[0])) * DT;
      X += fvx * DT; h += fvh * DT;
      rot = rot0 + spin * tf * Math.exp(-0.35 * tf) + 22 * Math.sin(6 * tf + ph[1]);
      if (oy - h > H + 40) { samples.push(sample(t, true)); return { samples, duration: t, hitAt, hitId, hitY: oy + (samples.find((q3) => q3.fall)?.y ?? 0), mode: style }; }
      if (tf > 6) return null;
    }
    if (i % REC === 0) samples.push(sample(t, fall));
  }
  return null;

  function sample(t: number, f: boolean): Sample {
    const sz = clamp(1 + Z / 1000, 0.55, 1.5);
    return { t, x: X, y: -h, rot, sx: sz, sy: f ? sz : sz * (0.55 + 0.45 * Math.cos(phi)), fall: f };
  }
}

let last: { x: number; y: number } | null = null;                       // where the last flight ended, so it never hits the same spot twice running
const nearLast = (q: Rect) => !!last && Math.hypot((q.x0 + q.x1) / 2 - last.x, (q.y0 + q.y1) / 2 - last.y) < 140;
/** Pick a style and a target that suits it (low flights aim low, high ones aim at the header and hero, the rest anywhere), then try
 *  random plans until one ends at that target or close to it. Never the same thing twice in a row. */
export function planFlight(o: Opts): Flight | null {
  const { H, rects } = o, styles: Style[] = ['low', 'high', 'loop', 'sweep', 'sweep', 'circle'];
  const first = pick(styles), order = [first, ...styles.filter((s) => s !== first)];
  const band = (s: Style) => (q: Rect) => { const c = (q.y0 + q.y1) / 2; return !nearLast(q) && (s === 'low' ? c > H * 0.6 : s === 'high' ? c < H * 0.36 : true); };
  let any: Flight | null = null; const mid = (q: Rect) => ({ x: (q.x0 + q.x1) / 2, y: (q.y0 + q.y1) / 2 });
  for (const style of order) {
    const cand = rects.filter(band(style)); if (!cand.length) continue;
    const tgt = pick(cand), cx = (tgt.x0 + tgt.x1) / 2, cy = (tgt.y0 + tgt.y1) / 2;
    for (let n = 0; n < 70; n++) {
      const f = attempt(o, style, tgt);
      if (!f || f.hitAt < 1.6 || f.duration > 13 || nearLast(rects[f.hitId])) continue;
      const r = rects[f.hitId], near = Math.hypot((r.x0 + r.x1) / 2 - cx, (r.y0 + r.y1) / 2 - cy) < 220;
      if (near) { last = mid(r); return f; }
      any ??= f;
    }
  }
  if (any) last = mid(rects[any.hitId]);
  return any;
}
