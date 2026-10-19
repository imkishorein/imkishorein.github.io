# imkishore.in

Kishore Vidyasagar's personal site. Senior UX Designer at Salesforce (Agentforce Vibes), Bengaluru, Figma Community Lead Bangalore. Astro 7 static site, markdown notes, no backend. Hosting target: Cloudflare Pages (free), custom domain imkishore.in.

Kishore is a designer who vibe-codes, not a professional developer. Prefer working code with minimal boilerplate and explain the why briefly. Be direct, peer-level, and ask a question when the request is ambiguous instead of assuming.

## Source of truth for ideas
`docs/WEBSITE-PLAN.md` is an export of the living Claude Doc "imkishore.in: Website Plan" (exported 19 Oct 2026, rev 21). It holds the goals, reference-site analysis, stack and hosting reasoning, information architecture, the full ideas log, font pairing research, LinkedIn source material for About and the v1 build notes. Read it before making design or content decisions. Never overwrite or reinterpret Kishore's ideas in it. The live doc may be newer: https://claude.ai/code/artifact/800b2d43-ef2c-46c4-beda-2b8b76714b24

## Commands
- `npm install` then `npm run dev` (http://localhost:4321)
- `npm run build` runs `check:tokens` first, then `astro build` to `dist/`
- `npm run check:tokens` lints for raw colours and font names outside the token files

## Hard rules
1. Design tokens are declared once. All colours, fonts, type scale, spacing, shape, motion and sound volume live in `src/styles/tokens.css`. The only file that names font files is `src/styles/fonts.css`. Components use semantic roles (`--color-bg`, `--color-text`, `--font-sans`...) and never raw hex or font names. Swapping a font or recolouring must be a change in those two files only. `check:tokens` enforces this and fails the build.
   - Only exception: `public/favicon.svg` cannot read CSS variables and keeps its own hex values.
2. Writing style for anything user-facing: no em dashes, no Oxford commas, human and direct tone, no corporate filler.
3. Sound is off by default and synthesised with Web Audio (no audio files). Volume comes from `--sound-volume`. State keys in localStorage: `imk:theme`, `imk:sound`.
4. Respect `prefers-reduced-motion` for every new animation.
5. Do not invent facts about Kishore. Anything not confirmed is marked placeholder. See `docs/OPEN-ITEMS.md`.

## Design direction
Stamp and postcard metaphor plus Japanese aesthetics. White and green palette: Soft White `#E8E9DF`, Sage Green `#A9B887`, Deep Olive `#2E3D28` (only these three raw values appear, in `tokens.css`). Hairline grid background, botanical feel, small widely spaced uppercase nav, one large bold heading per page. Dark mode is derived from the palette with `light-dark()` and `color-mix`, with a `data-theme` override.

Reference sites: hvpandya.com (Stuff page, notes) and charmiekapoor.com. Micro interactions are a core part of the brief: nav underline draw, stamp press and re-postmark, tilting date stamps, hidden shift-click hanko seal.

## Structure
- `src/data/site.ts`: name, bio, links, nav (with Japanese sublabels), timeline, community roles, stuff list
- `src/content/notes/*.md`: notes (fields in `src/content.config.ts`: title, date, category, summary, placeholder, draft)
- `src/pages`: Home, Notes, Stuff, About are live. Work, Community, Photography are "coming soon" stubs.
- `src/components`: Postmark, Stamp (CSS mask perforation), Nav, Controls, Footer, PageHead, NoteRow, ComingSoon
- `src/scripts/site.ts`: theme toggle, sound synth, stamp interactions, hanko easter egg
- `TOKENS.md`: how to change colours and fonts

## Fonts (interim, undecided)
Geist Sans for text, Geist Mono for small metadata, Geist Pixel Square for stamps and labels. Self-hosted from the `geist` package (OFL). Kishore explicitly has not decided the final pairing. Do not change fonts without being asked. A type specimen comparison page is the planned way to decide.

## Gotchas learned the hard way
- Stamp paper uses `--color-surface-sunken` so the perforation reads against the card.
- Mask gradients use `transparent` and `black` keywords, not hex, to pass the token lint.
- Postmark must sit inside a wrapper `div.pm` because Astro scoped CSS does not reach a child component root.
- Muted text is an 80% olive mix. Going lighter fails contrast.
- Playwright `mouse.click` ignores modifier keys. Hold Shift with `keyboard.down('Shift')` when testing the hanko.
