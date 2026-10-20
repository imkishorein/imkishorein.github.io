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
type Sound = 'tick' | 'switch' | 'thunk' | 'rustle' | 'on';
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
  } else { // soft two-note confirmation: sound switched on
    [660, 990].forEach((hz, i) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = hz;
      env(g, v * 0.8, 0.22, 0.01, t + i * 0.09);
      o.connect(g).connect(bus!); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.25);
    });
  }
}

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

/* ───────── stamp press: click the hero stamp to re-postmark ───────── */
document.querySelectorAll<HTMLElement>('[data-stamp-press]').forEach((el) => {
  const mark = el.querySelector<SVGElement>('.postmark');
  const press = () => {
    play('thunk');
    if (reduceMotion()) return;
    el.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(4px) rotate(-1deg)' }, { transform: 'translateY(0) rotate(0)' }], { duration: 260, easing: 'cubic-bezier(.5,0,.2,1.4)' });
    mark?.animate([{ opacity: 0.2, transform: 'scale(1.18) rotate(-6deg)' }, { opacity: 1, transform: 'scale(1) rotate(0)' }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' });
  };
  el.addEventListener('click', (e) => { if (!(e as MouseEvent).shiftKey) press(); }); // shift-click is the hanko
  el.addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') { e.preventDefault(); press(); } });
});

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
