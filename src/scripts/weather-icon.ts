/* Picks which hand-drawn SVG icon (src/components/WeatherIcon.astro) to show, from the Open-Meteo WMO weather code. */
export type WeatherKind = 'sun' | 'moon' | 'partly' | 'moonCloud' | 'overcast' | 'rain' | 'drizzle' | 'snow' | 'storm' | 'fog';

export function kindFor(code: number, day: boolean): WeatherKind {
  if (code <= 1) return day ? 'sun' : 'moon';
  if (code === 2) return day ? 'partly' : 'moonCloud';
  if (code === 3) return 'overcast';
  if (code <= 48) return 'fog';
  if (code <= 57) return 'drizzle';
  if (code <= 67 || (code >= 80 && code <= 82)) return 'rain';
  if (code <= 77 || code === 85 || code === 86) return 'snow';
  return 'storm';
}
