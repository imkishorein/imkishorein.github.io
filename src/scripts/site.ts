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
const themeLabel = document.querySelector<HTMLElement>('[data-theme-label]');
const isDark = () => root.dataset.theme === 'dark'; // light is the default, no OS sniffing
const paintTheme = () => {
  if (!themeBtn || !themeLabel) return;
  themeBtn.setAttribute('aria-pressed', String(isDark()));
  themeLabel.textContent = isDark() ? 'Dark' : 'Light';
};
themeBtn?.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  root.dataset.theme = next;
  store.set('imk:theme', next);
  paintTheme();
  play('tick');
});
paintTheme();

/* ───────── sound (synthesised, no files, off by default) ───────── */
let ctx: AudioContext | null = null;
let soundOn = store.get('imk:sound') === 'on';
const volume = () => {
  const v = parseFloat(getComputedStyle(root).getPropertyValue('--sound-volume'));
  return Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0.1;
};
const audio = () => {
  if (!ctx) { const C = window.AudioContext || (window as any).webkitAudioContext; if (C) ctx = new C(); }
  if (ctx?.state === 'suspended') void ctx.resume();
  return ctx;
};
const noise = (c: AudioContext, seconds: number) => {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf; return src;
};
type Sound = 'tick' | 'thunk' | 'on';
function play(kind: Sound, force = false) {
  if (!soundOn && !force) return;
  const c = audio(); if (!c) return;
  const t = c.currentTime, v = volume();
  const out = c.createGain(); out.connect(c.destination);
  if (kind === 'tick') { // light paper tap
    const n = noise(c, 0.04), f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = 1.2;
    out.gain.setValueAtTime(v * 0.9, t); out.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    n.connect(f).connect(out); n.start(t);
  } else if (kind === 'thunk') { // rubber stamp press
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.14);
    out.gain.setValueAtTime(v * 2.2, t); out.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(out); o.start(t); o.stop(t + 0.18);
    const n = noise(c, 0.06), f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 700;
    const g = c.createGain(); g.gain.setValueAtTime(v * 1.2, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    n.connect(f).connect(g).connect(c.destination); n.start(t);
  } else { // soft two-note confirmation
    [660, 990].forEach((hz, i) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; o.frequency.value = hz;
      g.gain.setValueAtTime(0.0001, t + i * 0.09); g.gain.exponentialRampToValueAtTime(v * 0.8, t + i * 0.09 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.22);
      o.connect(g).connect(c.destination); o.start(t + i * 0.09); o.stop(t + i * 0.09 + 0.25);
    });
  }
}
const soundBtn = document.querySelector<HTMLButtonElement>('[data-sound-toggle]');
const soundLabel = document.querySelector<HTMLElement>('[data-sound-label]');
const paintSound = () => {
  soundBtn?.setAttribute('aria-pressed', String(soundOn));
  if (soundLabel) soundLabel.textContent = soundOn ? 'Sound on' : 'Sound off';
};
soundBtn?.addEventListener('click', () => {
  soundOn = !soundOn; store.set('imk:sound', soundOn ? 'on' : 'off'); paintSound();
  if (soundOn) play('on', true);
});
paintSound();
document.addEventListener('click', (e) => {
  const el = (e.target as Element | null)?.closest<HTMLElement>('[data-sound]');
  if (el) play(el.dataset.sound as Sound);
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
  el.addEventListener('click', press);
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
