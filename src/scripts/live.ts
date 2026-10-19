/*
  Live Bengaluru bits: the postmark ring shows today's date and the centre shows the time (its colon blinks in CSS), and the "Now" row shows weather.
  Time zone is fixed to Asia/Kolkata, so it shows Bengaluru time for every visitor.
  Weather is one small request to Open-Meteo (free, no key) for the city centre, so it
  hints at "I'm here" without any precise location. If it fails, the Now row stays hidden.
*/
import { kindFor } from './weather-icon';

const TZ = 'Asia/Kolkata';
const pmDate = document.querySelector<SVGTextElement | SVGTextPathElement>('[data-pm-date]');
const pmHH = document.querySelector<SVGTSpanElement>('[data-pm-hh]');
const pmMM = document.querySelector<SVGTSpanElement>('[data-pm-mm]');
const pmPeriod = document.querySelector<SVGTextElement>('[data-pm-period]');
const wxEl = document.querySelector<HTMLElement>('[data-live-wx]');
const wxRow = document.querySelector<HTMLElement>('[data-live-row]');
const wxIcon = document.querySelector<SVGElement>('[data-wx-icon]');

const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

function tick() {
  const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
  if (pmDate) pmDate.textContent = `${p.day} ${p.month.toUpperCase()} ${p.year}`;
  if (pmHH) pmHH.textContent = p.hour;
  if (pmMM) pmMM.textContent = p.minute;
  if (pmPeriod) pmPeriod.textContent = `${p.dayPeriod.toUpperCase()} · IST`;
}
tick();
let timer = setInterval(tick, 1000);
document.addEventListener('visibilitychange', () => { // no ticking in background tabs
  clearInterval(timer);
  if (!document.hidden) { tick(); timer = setInterval(tick, 1000); }
});

/* weather: WMO code to plain words */
const describe = (code: number, day: boolean) =>
  code === 0 ? (day ? 'Clear' : 'Clear night') : code === 1 ? 'Mostly clear' : code === 2 ? 'Partly cloudy' : code === 3 ? 'Overcast' :
  code <= 48 ? 'Foggy' : code <= 57 ? 'Drizzle' : code <= 67 ? 'Rain' : code <= 77 ? 'Snow' :
  code <= 86 ? 'Showers' : 'Thunderstorms';

const KEY = 'imk:wx', MAX_AGE = 10 * 60 * 1000;
type Wx = { t: number; temp: number; code: number; day: boolean };
const read = (): Wx | null => { try { const w = JSON.parse(sessionStorage.getItem(KEY) || 'null'); return w && Date.now() - w.t < MAX_AGE ? w : null; } catch { return null; } };
const paint = (w: Wx) => { if (wxEl && wxRow) { wxEl.textContent = `${Math.round(w.temp)}°C, ${describe(w.code, w.day)}`; wxRow.hidden = false; if (wxIcon) wxIcon.dataset.kind = kindFor(w.code, w.day); } };

async function weather() {
  const cached = read(); if (cached) { paint(cached); return; }
  try {
    const ctrl = new AbortController(); const stop = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=temperature_2m,weather_code,is_day&timezone=Asia%2FKolkata', { signal: ctrl.signal });
    clearTimeout(stop);
    const c = (await res.json()).current;
    const w: Wx = { t: Date.now(), temp: c.temperature_2m, code: c.weather_code, day: c.is_day === 1 };
    try { sessionStorage.setItem(KEY, JSON.stringify(w)); } catch { /* private mode */ }
    paint(w);
  } catch { /* offline or blocked: the Now row simply stays hidden */ }
}
void weather();
setInterval(() => { if (!document.hidden) void weather(); }, MAX_AGE);
