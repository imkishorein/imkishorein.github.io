/*
  Behaviour: theme toggle, sound, stamp press, shift-click hanko.
  Everything is optional. The site works with JS off.
*/

const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const root = document.documentElement;
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── theme ───────── */
const themeBtn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
const isDark = () => root.dataset.theme === 'dark'; // light is the default, no OS sniffing
const paintTheme = () => {
  themeBtn?.setAttribute('aria-pressed', String(isDark())); // pressed = dark = the lantern is out
};
themeBtn?.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  const apply = () => {
    root.dataset.theme = next;
    store.set('imk:theme', next);
    paintTheme();
    if (themeBtn) { // a one-off kick: the lantern flares up and sends out a ring when lit, swings itself still when put out
      themeBtn.dataset.just = next === 'dark' ? 'off' : 'on';
      setTimeout(() => delete themeBtn.dataset.just, 1500);
    }
  };
  play('switch');
  const startVT = (document as any).startViewTransition?.bind(document);
  if (!startVT || reduceMotion() || !themeBtn) { apply(); return; }
  /* The change spreads out from the lantern like light: switching to light, the light page grows out of the
     lantern; switching to dark, the light page shrinks back into it and the dark shows underneath. */
  const body = themeBtn.querySelector('.body') ?? themeBtn;
  const rect = body.getBoundingClientRect();
  const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const toDark = next === 'dark';
  root.dataset.vt = toDark ? 'to-dark' : 'to-light';
  const vt = startVT(apply);
  vt.ready.then(() => {
    const small = `circle(0px at ${x}px ${y}px)`, big = `circle(${radius}px at ${x}px ${y}px)`;
    root.animate({ clipPath: toDark ? [big, small] : [small, big] }, { duration: 800, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: toDark ? '::view-transition-old(root)' : '::view-transition-new(root)' });
  });
  vt.finished.finally(() => { delete root.dataset.vt; });
});
paintTheme();

/* ───────── sound (synthesised, no files, off by default) ─────────
   One master bus (gain, soft low-pass, compressor) so every sound shares the same
   warmth and can never spike. Each sound gets a small random pitch shift so quick
   repeats feel like paper, not a machine. Volume is read from --sound-volume. */
let ctx: AudioContext | null = null;
let bus: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let soundOn = store.get('imk:sound') === 'on';
const volume = () => {
  const v = parseFloat(getComputedStyle(root).getPropertyValue('--sound-volume'));
  return Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0.1;
};
/* gesture: true from a click or press (may create and resume the context).
   gesture: false from hover: only plays if audio is already running, because a
   suspended context would queue the sound and play it late on the next click. */
const audio = (gesture: boolean) => {
  if (!ctx) {
    if (!gesture) return null;
    const C = window.AudioContext || (window as any).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    bus = ctx.createGain();
    const soften = ctx.createBiquadFilter(); soften.type = 'lowpass'; soften.frequency.value = 7000;
    const guard = ctx.createDynamicsCompressor();
    bus.connect(soften).connect(guard).connect(ctx.destination);
  }
  if (ctx.state === 'suspended' && gesture) void ctx.resume();
  return gesture || ctx.state === 'running' ? ctx : null;
};
/* Browsers only let audio start after a user gesture. Unlock it on the first press, tap or key anywhere (silently),
   so sounds with no gesture of their own (the postbox paper plane) work whenever sound is on, also after a page load. */
['pointerdown', 'keydown', 'touchend'].forEach((ev) => addEventListener(ev, () => { audio(true); }, { passive: true }));
const noise = (c: AudioContext, seconds: number, at: number) => {
  if (!noiseBuf) { // one shared second of white noise, built once
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = c.createBufferSource(); src.buffer = noiseBuf;
  src.start(at, Math.random() * (1 - seconds), seconds);
  return src;
};
type Sound = 'tick' | 'switch' | 'thunk' | 'rustle' | 'whoosh' | 'bonk' | 'ping' | 'on';
function play(kind: Sound, hover = false) {
  if (!soundOn) return;
  const c = audio(!hover); if (!c || !bus) return;
  const t = c.currentTime, v = volume();
  const j = 0.96 + Math.random() * 0.08; // pitch jitter, ±4%
  const env = (g: GainNode, peak: number, dur: number, attack = 0.002, at = t) => {
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  };
  const click = (hz: number, peak: number, dur: number, at: number) => { // filtered noise burst
    const n = noise(c, dur, at), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.frequency.value = hz * j; f.Q.value = 1.2;
    env(g, peak, dur, 0.001, at);
    n.connect(f).connect(g).connect(bus!);
  };
  if (kind === 'tick') { // light paper tap: links
    click(2600, v * 0.9, 0.04, t);
  } else if (kind === 'switch') { // two-stage toggle click: theme and sound switches
    click(1500, v * 0.9, 0.03, t);
    click(3100, v * 0.7, 0.035, t + 0.05);
  } else if (kind === 'thunk') { // rubber stamp press
    const o = c.createOscillator(), g = c.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(140 * j, t); o.frequency.exponentialRampToValueAtTime(48 * j, t + 0.14);
    env(g, v * 2.2, 0.16, 0.003);
    o.connect(g).connect(bus); o.start(t); o.stop(t + 0.18);
    const n = noise(c, 0.06, t), f = c.createBiquadFilter(), ng = c.createGain();
    f.type = 'lowpass'; f.frequency.value = 700;
    env(ng, v * 1.2, 0.06, 0.002);
    n.connect(f).connect(ng).connect(bus);
  } else if (kind === 'rustle') { // faint paper brush: hover on a note
    const n = noise(c, 0.14, t), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.frequency.value = 5200 * j; f.Q.value = 0.7;
    env(g, v * 0.45, 0.14, 0.05);
    n.connect(f).connect(g).connect(bus);
  } else if (kind === 'whoosh') { // a soft airy swish as the paper plane leaves the postbox
    const n = noise(c, 0.7, t), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.Q.value = 0.9;
    f.frequency.setValueAtTime(700 * j, t); f.frequency.exponentialRampToValueAtTime(3200 * j, t + 0.6);
    env(g, v * 0.5, 0.7, 0.18);
    n.connect(f).connect(g).connect(bus);
  } else if (kind === 'ping') { // an in-chat message pop, in the spirit of a chat app: two quick soft sine blips, the second higher
    [[1046, 0, 0.09], [1568, 0.075, 0.16]].forEach(([hz, d, dur]) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = hz * j;
      env(g, v * 1.1, dur, 0.006, t + d);
      o.connect(g).connect(bus!); o.start(t + d); o.stop(t + d + dur + 0.03);
    });
  } else if (kind === 'bonk') { // a paper plane tapping into something: short, dull and light
    const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle';
    o.frequency.setValueAtTime(260 * j, t); o.frequency.exponentialRampToValueAtTime(120 * j, t + 0.08);
    env(g, v * 0.9, 0.1, 0.002);
    o.connect(g).connect(bus); o.start(t); o.stop(t + 0.12);
    click(1800, v * 0.5, 0.025, t);
  } else { // soft two-note confirmation: sound switched on
    [660, 990].forEach((hz, i) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = hz;
      env(g, v * 0.8, 0.22, 0.01, t + i * 0.09);
      o.connect(g).connect(bus!); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.25);
    });
  }
}

/* The postbox paper plane (Postbox.astro). Every 30s it is tossed out of the bottom hatch, swoops up and over, and flies at a
   random piece of the page (a line of text, a stamp, a heading...). It taps into it, the target gives a tiny shake,
   the plane bounces back, tumbles and falls. Everything is built from the live layout, so it never hits a fixed spot.
   Sounds only play when sound is on and audio is already running. Skipped under reduced motion. */
const plane = document.querySelector<SVGElement>('.postbox .plane');
const still = matchMedia('(prefers-reduced-motion: reduce)');
const HITTABLE = 'main h1, main h2, main h3, main p, main li, main a, main img, .stamp, .pm';
function pickTarget(ox: number, oy: number) {
  const H = innerHeight, W = innerWidth, avoid = plane?.closest('.postbox')?.getBoundingClientRect();
  const hits: { x: number; y: number; side: number; el: HTMLElement }[] = [];
  document.querySelectorAll<HTMLElement>(HITTABLE).forEach((el) => {
    if (el.closest('.postbox, nav, header, footer')) return;
    const r = document.createRange(); r.selectNodeContents(el);
    const rects = el.matches('img, .stamp, .pm') ? [el.getBoundingClientRect()] : [...r.getClientRects()];
    rects.forEach((q) => { // anything visible right now (so it follows the scroll position), clear of the top bar and the postbox
      if (q.width < 24 || q.height < 10 || q.top < 70 || q.bottom > H - 12 || q.left < 0 || q.right > W) return;
      if (avoid && q.right > avoid.left - 10 && q.left < avoid.right && q.bottom > avoid.top - 10) return;
      const side = q.right < ox - 40 ? 1 : -1;                              // 1: hit its right edge flying left; -1: its left edge flying right
      hits.push({ x: side === 1 ? q.right : q.left, y: q.top + q.height * (0.25 + Math.random() * 0.5), side, el });
    });
  });
  if (!hits.length) return null;
  const want = 70 + Math.random() * (H - 100);                              // a random height on screen, so top, middle and bottom all get hit
  hits.sort((m, n) => Math.abs(m.y - want) - Math.abs(n.y - want));
  return hits[Math.floor(Math.random() * Math.min(5, hits.length))];
}
function launchPlane() {
  const origin = plane?.parentElement?.getBoundingClientRect();
  if (!plane || !origin || document.hidden || still.matches) return;
  const ox = origin.x, oy = origin.y, rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const hit = pickTarget(ox, oy); if (!hit) return;
  const tx = hit.x - ox + 16 * hit.side, ty = hit.y - oy;                              // plane centre at impact, relative to the hatch
  const p1 = { x: tx * 0.1 - 20, y: Math.min(ty, 0) - rnd(60, 200) };       // climb out of the hatch first
  const p2 = { x: tx + hit.side * rnd(120, 260), y: ty + rnd(-70, 40) };               // then come in at the target from the right
  const flight = Math.min(5200, 2600 + Math.hypot(tx, ty) * 3), N = 30;
  const drop = innerHeight - hit.y + 30;                                   // fall all the way to the bottom of the viewport
  const bounce = 260, fall = 450 + Math.sqrt(drop) * 32, total = flight + bounce + fall;
  const kf: Keyframe[] = []; let prev = 0, endRot = 0;
  for (let i = 0; i <= N; i++) {
    const u = i / N, p = 1 - Math.pow(1 - u, 1.4), q = 1 - p;               // quick toss, slower glide
    const x = 3 * q * q * p * p1.x + 3 * q * p * p * p2.x + p * p * p * tx;
    const y = 3 * q * q * p * p1.y + 3 * q * p * p * p2.y + p * p * p * ty;
    const dx = 3 * (q * q * p1.x + 2 * q * p * (p2.x - p1.x) + p * p * (tx - p2.x));
    const dy = 3 * (q * q * p1.y + 2 * q * p * (p2.y - p1.y) + p * p * (ty - p2.y));
    let rot = Math.atan2(dy, dx) * 180 / Math.PI - 180;                     // the drawing's nose points left
    while (rot - prev > 180) rot -= 360; while (rot - prev < -180) rot += 360; prev = rot;
    const r = rot + Math.sin(u * Math.PI * 4) * 3 * (1 - u); endRot = rot;
    const scale = 0.35 + 0.95 * Math.min(u / 0.12, 1);
    kf.push({ offset: (u * flight) / total, opacity: Math.min(u / 0.04, 1), transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(1)}deg) scale(${scale.toFixed(2)})` });
  }
  const at = (dx: number, dy: number, rot: number, opacity: number, ms: number, easing = 'linear'): Keyframe =>
    ({ offset: ms / total, opacity, easing, transform: `translate(${(tx + dx).toFixed(1)}px, ${(ty + dy).toFixed(1)}px) rotate(${(endRot + rot).toFixed(1)}deg) scale(1.3)` });
  const drift = rnd(10, 40), spin = rnd(140, 260) * (Math.random() < 0.5 ? -1 : 1);
  kf.push(at(14 * hit.side, -8, -32 * hit.side, 1, flight + bounce, 'linear'));                                     // knocked back, then gravity
  [0.25, 0.5, 0.75, 1].forEach((f) => kf.push(at((14 + drift * f) * hit.side, drop * f * f, spin * f, f < 0.85 ? 1 : 0, flight + bounce + fall * f)));
  const box = plane.closest('.postbox'), lead = 280;                      // the hatch drops open first, then the plane slips out
  box?.classList.add('sending'); setTimeout(() => box?.classList.remove('sending'), lead + 900);
  plane.animate(kf, { duration: total, delay: lead, fill: 'backwards', easing: 'linear' });
  setTimeout(() => play('whoosh', true), lead);
  setTimeout(() => { // the hit: a tap sound and a tiny shake of whatever it landed on (individual properties, so existing transforms survive)
    play('bonk', true);
    if (getComputedStyle(hit.el).display !== 'inline') hit.el.animate(
      [{ translate: '0 0', rotate: '0deg' }, { translate: '-3px 1px', rotate: '-0.25deg', offset: 0.3 }, { translate: '2px 0', rotate: '0.15deg', offset: 0.6 }, { translate: '0 0', rotate: '0deg' }],
      { duration: 320, easing: 'ease-out' });
  }, lead + flight);
}
setTimeout(() => { launchPlane(); setInterval(launchPlane, 30000); }, 3000);

const soundBtn = document.querySelector<HTMLButtonElement>('[data-sound-toggle]');
const soundState = document.querySelector<HTMLElement>('[data-sound-state]');
const paintSound = () => {
  soundBtn?.setAttribute('aria-pressed', String(soundOn));
  if (soundState) soundState.textContent = soundOn ? 'On' : 'Off';
};
soundBtn?.addEventListener('click', () => {
  soundOn = !soundOn; store.set('imk:sound', soundOn ? 'on' : 'off'); paintSound();
  if (soundOn) play('on');
});
paintSound();

/* Links and buttons with data-sound. The sound fires as early as the input allows,
   because a link click starts a page load that can cut a sound off:
   mouse on press, touch and pen on release (a scroll cancels it, so scrolling past a
   link stays silent), keyboard on click. The click that follows a pointer sound is skipped. */
let lastPointerSound = 0;
const soundTarget = (e: Event) => (e.target as Element | null)?.closest<HTMLElement>('[data-sound]');
const soundFor = (e: PointerEvent | MouseEvent) => {
  const el = soundTarget(e);
  if (el && !e.shiftKey) play(el.dataset.sound as Sound); // shift-click belongs to the hanko
  return !!el && !e.shiftKey;
};
document.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' && e.button === 0 && soundFor(e)) lastPointerSound = performance.now();
});
document.addEventListener('pointerup', (e) => {
  if (e.pointerType !== 'mouse' && soundFor(e)) lastPointerSound = performance.now();
});
document.addEventListener('click', (e) => {
  if (performance.now() - lastPointerSound < 800) return;
  soundFor(e);
});

/* Hover sounds (mouse only, throttled): data-sound-hover="rustle" */
let lastHover = 0;
document.querySelectorAll<HTMLElement>('[data-sound-hover]').forEach((el) => {
  el.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    const now = performance.now();
    if (now - lastHover < 160) return;
    lastHover = now;
    play(el.dataset.soundHover as Sound, true);
  });
});

/* ───────── hero: an old-school Japanese wooden-handled stamp for a cursor ─────────
   A cursor image cannot animate, so on a mouse the real cursor is hidden and a stamp element follows the pointer.
   Pressing anywhere on the hero lifts it, slams it down and leaves a ring of ink (a round 〒 seal) that stays
   until the page is refreshed. On the hero stamp itself the re-postmark, dip and sound fire at impact. Touch and keyboard skip the cursor. */
const STAMP_SVG = `<svg viewBox="0 0 40 76" aria-hidden="true" focusable="false">
  <g class="halo"><path d="M11 15 C11 3 29 3 29 15 L27.4 45 L12.6 45 Z"/><rect x="11.4" y="45" width="17.2" height="6" rx="1.6"/><path d="M15.6 51 L24.4 51 L25 60 L15 60 Z"/><rect x="11" y="60" width="18" height="8" rx="2.4"/></g>
  <path class="wood" d="M11 15 C11 3 29 3 29 15 L27.4 45 L12.6 45 Z"/>
  <path class="grain" d="M16 8 C15.2 20 15.4 32 15.8 43 M20.4 5.4 C20.8 18 20.6 32 20.2 44 M24.6 8 C25.2 20 24.8 32 24.2 43"/>
  <rect class="brass" x="11.4" y="45" width="17.2" height="6" rx="1.6"/>
  <path class="grain" d="M12.4 48 L27.6 48" style="stroke:var(--pb-ink)"/>
  <path class="wood" d="M15.6 51 L24.4 51 L25 60 L15 60 Z"/>
  <rect class="die" x="11" y="60" width="18" height="8" rx="2.4"/>
  <ellipse class="face" cx="20" cy="70" rx="10.4" ry="2.4"/>
</svg>`;
/* each stamp is a different traditional blessing (the kind on omamori charms, new year cards and shop signs): a kanji in a double ring with the English under it. A shuffled bag, so a wish only
   repeats after all of them have been used and never twice in a row. */
const WISHES: [string, string][] = [['福', 'Fortune'], ['幸', 'Happiness'], ['寿', 'Long life'], ['吉', 'Good omen'], ['開運', 'Good luck'], ['招福', 'Fortune comes'], ['繁栄', 'Prosperity'], ['平和', 'Peace']];
let bag: [string, string][] = [];
let lastWish = '';
const nextWish = () => {
  if (!bag.length) { bag = [...WISHES].sort(() => Math.random() - 0.5); if (bag[bag.length - 1][0] === lastWish) bag.reverse(); }
  const w = bag.pop()!; lastWish = w[0]; return w;
};
/* The English is kept well inside the inner ring: a two word phrase is split over two lines, a long single word shrinks,
   and the whole seal grows (64 to 104px) so the text always renders at a readable size (about 6px and up). */
const sealFit = (word: string) => {
  const lines = word.split(' '), n = Math.max(...lines.map((l) => l.length)), avail = lines.length > 1 ? 24 : 27;
  const fs = Math.min(5.6, (avail - 0.4 * n) / (0.64 * n));
  return { lines, fs, size: Math.min(104, Math.max(64, (6.4 * 56) / fs)) };
};
const sealSvg = ([kanji]: [string, string], fit: { lines: string[]; fs: number }) => {
  const two = fit.lines.length > 1, long = kanji.length > 1;
  const label = fit.lines.map((l, i) => `<text x="28" y="${two ? 37.6 + i * 6.2 : 41.6}" text-anchor="middle" fill="currentColor" style="font-family:var(--font-sans);font-weight:600;font-size:${fit.fs.toFixed(2)}px;letter-spacing:0.4px;text-transform:uppercase">${l}</text>`).join('');
  return `<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false">
  <g fill="none" stroke="currentColor" stroke-linecap="round"><circle cx="28" cy="28" r="25.4" stroke-width="2.6" stroke-dasharray="48 1.8 30 1.6 38 2"/><circle cx="28" cy="28" r="21.4" stroke-width="1"/></g>
  <text x="28" y="${(two ? 28 : 31) + (long ? 0 : 1)}" text-anchor="middle" fill="currentColor" lang="ja" style="font-family:var(--font-jp);font-weight:700;font-size:${long ? 15 : 20}px">${kanji}</text>${label}
</svg>`;
};
const canHover = matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector<HTMLElement>('.envelope');
const heroStamp = hero?.querySelector<HTMLElement>('[data-stamp-press]');
const mark = heroStamp?.querySelector<SVGElement>('.postmark');
/* the hero stamp's own press: sound, a dip, and the postmark re-struck */
const pressStamp = () => {
  play('thunk');
  if (reduceMotion() || !heroStamp) return;
  heroStamp.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(4px) rotate(-1deg)' }, { transform: 'translateY(0) rotate(0)' }], { duration: 260, easing: 'cubic-bezier(.5,0,.2,1.4)' });
  mark?.animate([{ opacity: 0.2, transform: 'scale(1.18) rotate(-6deg)' }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' });
};
let struck = false; // a mouse press already handled by the cursor stamp, so the click that follows is ignored
if (hero && canHover.matches) {
  const cur = document.createElement('div'); cur.className = 'stamp-cursor'; cur.innerHTML = STAMP_SVG; document.body.append(cur);
  const art = cur.querySelector('svg') as SVGElement;
  let px = 0, py = 0, shown = false, raf = 0;
  const place = () => { raf = 0; cur.style.transform = `translate(${px - 20}px, ${py - 72}px)`; };
  const move = (e: PointerEvent) => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(place); };
  /* a casual nudge so people know a click stamps: until the first stamp, a small speech bubble pops up beside the cursor
     after a short hover and the stamp wiggles. It comes back (with the next line) every time they return without clicking, until the first stamp. */
  const HINTS = ['Psst. Click to stamp.', 'Go on. Nothing bad will happen.', 'Still here? Click already.'];
  const hint = document.createElement('span'); hint.className = 'stamp-hint'; hint.setAttribute('aria-hidden', 'true'); cur.append(hint);
  let stamped = false, hintTimer = 0, hintsShown = 0;
  const showHint = () => {
    if (stamped || !shown) return;
    hint.textContent = HINTS[hintsShown++ % HINTS.length];
    cur.classList.toggle('flip', px > innerWidth - 260); hint.classList.add('show');
    if (!reduceMotion()) art.animate([{ transform: 'rotate(6deg)' }, { transform: 'rotate(-10deg) translateY(-3px)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(-6deg) translateY(-2px)' }, { transform: 'rotate(6deg)' }], { duration: 700, easing: 'ease-in-out' });
  };
  const hideHint = () => { clearTimeout(hintTimer); hint.classList.remove('show'); };
  const show = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; shown = true; hero.classList.add('has-stamp-cursor'); move(e); cur.classList.add('on'); if (!stamped) { clearTimeout(hintTimer); hintTimer = window.setTimeout(showHint, 700); } };
  const hide = () => { shown = false; hero.classList.remove('has-stamp-cursor'); cur.classList.remove('on'); hideHint(); };
  hero.addEventListener('pointerenter', show);
  hero.addEventListener('pointermove', (e) => { if (!shown) show(e); else move(e); });
  hero.addEventListener('pointerleave', hide);
  /* press anywhere on the hero: lift, slam, and the ink stays where it landed until the page is refreshed */
  hero.addEventListener('pointerdown', (e) => {
    struck = false; if (!shown || e.pointerType !== 'mouse' || e.button !== 0 || e.shiftKey) return; // shift-click is the hanko
    struck = true; stamped = true; hideHint();
    const x = e.clientX, y = e.clientY, onStamp = !!heroStamp?.contains(e.target as Node);
    const still = reduceMotion(), time = 420, impact = still ? 0 : 0.4 * time;
    if (!still) art.animate([
      { transform: 'translateY(0) rotate(6deg)', offset: 0 },
      { transform: 'translateY(-15px) rotate(-3deg) scale(1.04)', offset: 0.18, easing: 'cubic-bezier(.5,0,1,.6)' },
      { transform: 'translateY(3px) rotate(0deg) scale(1, .92)', offset: 0.4 },
      { transform: 'translateY(0.5px) rotate(0deg) scale(1, .97)', offset: 0.55 },
      { transform: 'translateY(0) rotate(6deg)', offset: 1 },
    ], { duration: time, easing: 'ease-out' });
    setTimeout(() => { // the stamp lands
      if (onStamp) pressStamp(); else play('thunk');
      const r = hero.getBoundingClientRect(), seal = document.createElement('div');
      const wish = nextWish(), fit = sealFit(wish[1]);
      seal.className = 'stamp-impression'; seal.innerHTML = sealSvg(wish, fit);
      seal.style.width = seal.style.height = `${fit.size}px`; seal.style.margin = `${-fit.size / 2}px 0 0 ${-fit.size / 2}px`;
      seal.style.left = `${x - r.left}px`; seal.style.top = `${y - r.top}px`; seal.style.transform = `rotate(${(Math.random() * 16 - 8).toFixed(1)}deg)`;
      seal.style.opacity = String(0.8 + Math.random() * 0.15); hero.append(seal);
      if (!still) seal.animate([{ scale: '1.14', opacity: 0 }, { scale: '1', offset: 0.35 }], { duration: 220, easing: 'ease-out' });
    }, impact);
  });
}
/* touch and keyboard: no cursor, so the hero stamp presses at once */
heroStamp?.addEventListener('click', (e) => { if ((e as MouseEvent).shiftKey) return; if (struck) { struck = false; return; } pressStamp(); }); // shift-click is the hanko
heroStamp?.addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') { e.preventDefault(); pressStamp(); } });

/* ───────── hidden: shift-click leaves a hanko mark ───────── */
document.addEventListener('click', (e) => {
  if (!e.shiftKey) return;
  e.preventDefault();
  play('thunk');
  const mark = document.createElement('span');
  mark.className = 'hanko'; mark.lang = 'ja'; mark.textContent = '印'; mark.setAttribute('aria-hidden', 'true');
  const tilt = (Math.random() * 16 - 8).toFixed(1);
  Object.assign(mark.style, { position: 'absolute', left: `${e.pageX - 21}px`, top: `${e.pageY - 21}px`, zIndex: '20', pointerEvents: 'none', transform: `rotate(${tilt}deg)`, opacity: '0.9' });
  document.body.append(mark);
  if (reduceMotion()) { setTimeout(() => mark.remove(), 2400); return; }
  mark.animate([{ transform: `scale(1.6) rotate(${tilt}deg)`, opacity: 0 }, { transform: `scale(1) rotate(${tilt}deg)`, opacity: 0.9 }], { duration: 220, easing: 'cubic-bezier(.5,0,.2,1.4)' });
  setTimeout(() => mark.animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 900, fill: 'forwards' }).finished.then(() => mark.remove()), 1800);
});
