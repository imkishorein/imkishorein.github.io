# imkishore.in

Kishore Vidyasagar's personal site. Senior UX Designer at Salesforce (Agentforce Vibes), Bengaluru, Figma Community Lead Bangalore. Astro 7 static site, markdown notes, no backend. Hosting target: Cloudflare Pages (free), custom domain imkishore.in.

Kishore is a designer who vibe-codes, not a professional developer. Prefer working code with minimal boilerplate and explain the why briefly. Be direct, peer-level, and ask a question when the request is ambiguous instead of assuming.

## How we work
Claude Code in this repo is the one place for brainstorming and building. Ideas and decisions live in `docs/`, not in chat and not in the Claude Doc.
- `docs/IDEAS.md`: append-only dated log of Kishore's ideas. Read the relevant part when a topic comes up. Never rewrite, reorder or reinterpret existing entries.
- `docs/DECISIONS.md`: settled choices with the reason. Loaded below.
- `docs/OPEN-ITEMS.md`: what is still needed or undecided. Loaded below.
- `docs/WEBSITE-PLAN.md`: frozen export of the original Claude Doc (rev 21, 19 Oct 2026). Background only. Do not edit.
- Skills: `/brainstorm` to think out loud with no code changes, `/idea` to log an idea, `/decide` to log a decision.

Rule: if it is not in `docs/`, it did not happen. Before a brainstorm ends, offer to log new ideas and decisions. Do not log without Kishore's yes unless he said "log it". When a decision changes a hard rule or the design direction below, update this file in the same change, after asking.

@docs/DECISIONS.md
@docs/OPEN-ITEMS.md

## Commands
- `npm install` then `npm run dev` (http://localhost:4321)
- `npm run build` runs `check:tokens` first, then `astro build` to `dist/`
- `npm run check:tokens` lints for raw colours and font names outside the token files

## Hard rules
1. Design tokens are declared once. All colours, fonts, type scale, spacing, shape, motion and sound volume live in `src/styles/tokens.css`. The only file that names font files is `src/styles/fonts.css`. Components use semantic roles (`--color-bg`, `--color-text`, `--font-sans`...) and never raw hex or font names. Swapping a font or recolouring must be a change in those two files only. `check:tokens` enforces this and fails the build.
   - Only exception: `public/favicon.svg` cannot read CSS variables and keeps its own hex values.
2. Writing style for anything user-facing: no em dashes, no Oxford commas, human and direct tone, no corporate filler.
3. Sound is off by default and synthesised with Web Audio (no audio files), through one master bus. Sounds are named (`tick`, `switch`, `thunk`, `rustle`, `on`) and attached with `data-sound` (press) or `data-sound-hover` (mouse hover). Volume comes from `--sound-volume`. State keys in localStorage: `imk:theme`, `imk:sound`.
4. Respect `prefers-reduced-motion` for every new animation.
5. Do not invent facts about Kishore. Anything not confirmed is marked placeholder. See `docs/OPEN-ITEMS.md`.

## Design direction
Stamp, postcard and airmail envelope metaphor plus Japanese aesthetics. White and green palette: Soft White `#E8E9DF`, Sage Green `#A9B887`, Deep Olive `#2E3D28` (only these three raw values appear, in `tokens.css`). Hand-dabbed dot grid background (uneven, very faint, `public/dots.svg` used as a mask coloured by `--color-grid`), botanical feel, small widely spaced uppercase nav, one large bold heading per page. Light is the default (Soft White primary, Sage and Olive as accents) and ignores the OS preference. Dark mode is opt-in via the Light/Dark switch in the top nav, derived from the palette with `light-dark()` and `color-mix`, and set through `data-theme`.

Reference sites: hvpandya.com (Stuff page, notes) and charmiekapoor.com. Micro interactions are a core part of the brief: nav underline draw, stamp press and re-postmark, tilting date stamps, hidden shift-click hanko seal.

## Structure
- `src/data/site.ts`: name, bio, links, nav (with Japanese sublabels), timeline, community roles, stuff list
- `src/content/notes/*.md`: notes (fields in `src/content.config.ts`: title, date, category, summary, placeholder, draft)
- `src/pages`: Home, Notes, Stuff, About are live. Work, Community, Photography are "coming soon" stubs.
- `src/components`: Envelope (hero, airmail envelope with a live postmark), PinBoxes (hand-drawn PIN-code boxes, used for "8+ years"), PortraitArt (illustrated stamp portrait), Postmark, Stamp (CSS mask perforation), DateStamp (small date stamp for notes and About years), Nav (includes the theme switch), Controls (theme and sound switches, rendered in Nav), Footer, PageHead, NoteRow, ComingSoon
- `src/scripts/live.ts`: live postmark date and time (Asia/Kolkata) and the hero "Now" weather row from Open-Meteo. Cached in sessionStorage `imk:wx`.
- `src/scripts/weather-icon.ts`: picks the hand-drawn animated SVG weather icon (`WeatherIcon.astro`) from the Open-Meteo weather code and day or night. Animations are off under reduced motion.
- `src/scripts/site.ts`: theme switch, sound synth, stamp interactions, hanko easter egg
- `TOKENS.md`: how to change colours and fonts

## Fonts (interim, undecided)
Geist Sans for text, Geist Mono for small metadata, Geist Pixel Square for stamps and labels. Self-hosted from the `geist` package (OFL). Kishore explicitly has not decided the final pairing. Do not change fonts without being asked. A type specimen comparison page is the planned way to decide.

## Gotchas learned the hard way
- Stamp paper uses `--color-surface-sunken` so the perforation reads against the card.
- Mask gradients use `transparent` and `black` keywords, not hex, to pass the token lint.
- Postmark must sit inside a wrapper `div.pm` because Astro scoped CSS does not reach a child component root.
- Muted text is an 80% olive mix. Going lighter fails contrast.
- Playwright `mouse.click` ignores modifier keys. Hold Shift with `keyboard.down('Shift')` when testing the hanko.
