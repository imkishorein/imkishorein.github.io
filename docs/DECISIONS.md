# Decisions

Settled choices, one entry each, with the reason. Newest at the bottom. To change a decision, add a new entry with "Replaces:" and mark the old title "(superseded YYYY-MM-DD)". Open or undecided items live in `OPEN-ITEMS.md`.

### 2026-10-19: Ideas and decisions live in the repo
The repo is the source of truth for ideas and decisions. Claude Code is the single place for brainstorming and building. The Claude Doc "imkishore.in: Website Plan" is frozen at rev 21 and exported to `WEBSITE-PLAN.md`.
Why: brainstorming in a separate chat meant exporting and re-explaining everything before building. One home removes that step and git gives free history.

### 2026-10-19: Stack and hosting
Astro 7 static site with markdown notes and no backend. Hosting target is Cloudflare Pages (free tier) on the imkishore.in domain. Not deployed yet.
Why: fast, near zero cost, and notes stay as plain files. Recommended in the plan and built on in v1.

### 2026-10-19: Site sections
Home, Work, Notes, Community, Photography, Stuff, About. Notes are quick and short, not long blog posts. Stuff is modelled on hvpandya.com. Community covers Friends of Figma Bangalore.
Why: from Kishore's section ideas (see `IDEAS.md`).

### 2026-10-19: Visual direction
Stamp and postcard design plus Japanese aesthetics. White and green palette: Soft White `#E8E9DF`, Sage Green `#A9B887`, Deep Olive `#2E3D28`. Micro interactions and subtle sound are part of the brief.
Why: Kishore's stated taste and the colour reference screenshot.

### 2026-10-19: Design tokens are declared once
All colours, fonts and other design values are defined in one global place so any font or colour can be swapped there to change the whole site. Enforced by `npm run check:tokens`.
Why: explicit requirement from Kishore. Fonts and palette are not final, so they must be cheap to change.

### 2026-10-19: Fonts are interim (Geist)
Geist Sans, Geist Mono and Geist Pixel are placeholders for v1. The final sans and mono pairing is undecided. Revisit with a type specimen page. Do not change fonts without being asked.
Why: Kishore said not to decide yet and to compare real pairings before committing.

### 2026-10-19: Sound is off by default
Sounds are synthesised in the browser, toggled in the footer, and start muted.
Why: Kishore went with the suggestion.

### 2026-10-19: Placeholders and naming
Contact details, portrait, most Stuff items and community extras are placeholders until Kishore supplies real ones. Naming Salesforce and Agentforce publicly is fine.
Why: Kishore's answers to the v1 scoping questions.

### 2026-10-19: Light mode is the default, switch lives in the nav
Soft White is the primary colour on first load, with Sage Green and Deep Olive as secondary and accent. A Light/Dark switch sits at the top right of every page. Dark mode stays as an opt-in and the choice is saved in `imk:theme`. The site no longer follows the OS colour preference.
Why: the OS preference was serving the dark version, where green becomes the primary colour. Kishore wants the cream palette to lead.

### 2026-10-19: Separators on the grid are dashed rules, not borders (updated 2026-10-19)
Any separator that sits on the page grid is a `.rule-top` or `.rule-bottom` (`.rows` and `.row` already are). Rules are a thicker, dashed, perforation-style mark that knocks the grid out around itself. Their size, dash and halo are tokens in `tokens.css` (`--rule-*`, `--color-rule`). Inside surface cards a plain border is still fine.
Why: solid hairline separators and the solid hairline grid read as the same mark and doubled up wherever they landed near each other. Making rules a different mark means they cannot clash, whatever the content height.

### 2026-10-19: Sound engine and controls
Sound and theme switches both live in the top nav. All sounds go through one master bus (soft low-pass and compressor) with a small random pitch shift. Named sounds: `tick` (links), `switch` (toggles), `thunk` (stamp, hanko, mailto), `rustle` (hover on a note), `on`. Link sounds fire on press for mouse, on release for touch (scrolling stays silent) and on click for keyboard, so a page load cannot cut them off. Hover sounds are mouse only and only play once audio is already running. Shift-click belongs to the hanko only. Switch labels stay fixed and `aria-pressed` carries state.
Why: fixes found in a review (double tick on the theme switch, overlapping sounds on shift-click, link sounds truncated by navigation, confusing screen reader labels) and makes the sound hard to miss. Page-load sounds are not possible because browsers block audio before a user gesture.

### 2026-10-19: Hero is an airmail envelope with a live Bengaluru strip (partly superseded 2026-10-19)
Hero heading is "Hello, I'm Kishore." (replaces "Hello from Bengaluru."). The hero is the front of an airmail envelope: striped sage and olive border, return address and "par avion" top left, stamp and postmark top right, recipient address right, and a "Live from Bengaluru" strip with a ticking clock (IST) and current weather. The postmark shows today's date in IST. Weather is one client request to Open-Meteo for the city centre, cached 10 minutes in sessionStorage, and hidden if it fails. No precise location is used or collected.
Why: Kishore wanted his name to lead and the hero to feel like a real postcard or envelope that is alive and tells visitors he is in Bangalore right now. Replaces the "Hello from Bengaluru" headline in the v1 scaffold.

### 2026-10-19: Hero has no repeated facts and no dead space
Each fact appears once in the hero. Name and role: the FROM line of the address block. Where I am: the live strip ("Now in Bengaluru", clock, weather), plus the postmark as a decorative mark. The stamp reads "India", not Bengaluru. The return-address block, sign-off, long bio and "Also" line are removed from the hero (bio and community live on About and Community). The message column spans two rows beside the stamp and address, so the stamp no longer pushes the headline down.
Why: the first envelope version repeated name and location three times and wasted about a third of the first screen. Refines the envelope hero decision above.

### 2026-10-19: Stamp shows an illustrated portrait (superseded 2026-10-19)
The hero and About stamps show a flat illustration of Kishore (sunglasses, swept hair, dark knit polo, arms crossed, arched window behind), drawn in `PortraitArt.astro` from a reference photo. The photo itself is not stored in the repo. Stamp art uses fixed `--art-deep`, `--art-mid` and `--art-light` tokens so a stamp looks the same in light and dark mode. The landscape stamp remains the default when no art is passed.
Why: Kishore liked the stamp and wanted it to be him, in the same style as the site, rather than a photo.

### 2026-10-19: Stamp portrait is a front-facing avatar
Replaces: 2026-10-19 Stamp shows an illustrated portrait. The first version copied a three-quarter photo (sunglasses, arms crossed) and the likeness was not good enough. The stamp now shows an avatar built from front-facing photos: side-swept dark hair, strong brows, round glasses with a dark upper rim and silver lower rim, a light moustache and small goatee (kept subtle on purpose), open-collar patterned shirt with shoulders narrower than the head is tall. The caption sits in a dark value band that is part of the Stamp component, so it lines up for any art. It is a likeness, not a trace. Photos are not stored in the repo. Art colours stay the fixed `--art-*` tokens.
Why: Kishore wanted an avatar that looks like him, not a copy of one photo.

### 2026-10-19: The postmark is the live clock
Replaces the bottom "Now in Bengaluru" strip from the envelope hero entry. The postmark ring carries the place on top ("BENGALURU, INDIA") and the full date on the bottom ("19 OCTOBER 2026"). The centre is the time with "PM · IST" under it, and the colon blinks once a second to show the clock is live (static under reduced motion). Weather moves to a "Now" row in the address block and stays hidden if the request fails. The stamp caption is "Hello" so no place name repeats. The postmark starts with placeholders and fills in with JS. It is tilted about 7 degrees and made to look hand-struck: wobbly edges, patchy ink, a faint doubled impression and a few stray specks, all from fixed SVG filters so it looks the same every load.
Why: Bengaluru appeared in the postmark, the stamp and the live strip. One mark that carries place, date and time is more on-metaphor and the hero gets shorter.

### 2026-10-19: Envelope border looks hand-printed
The airmail border has uneven stripe widths (set in `--airmail-stripes`), wobbly edges and a little missing ink, and the inner frame line wobbles too. It is done with two fixed-seed SVG filters in `Envelope.astro` on a layer behind the content, so it looks the same on every load and costs no images.
Why: Kishore loves imperfect, hand-made details and the perfect stripes felt too clean next to the worn postmark.

### 2026-10-19: Background grid is a hand-dabbed dot grid
Replaces the square hairline grid. Dots are uneven in position, size, shape and strength, with a few missing, from a 640px tile (`public/dots.svg`, generated once with a fixed seed) used as a mask on a `body::before` layer. The colour is `--color-grid` and the tile size is `--grid-tile`. It stays very faint so it never competes with content. Dashed rules still knock it out around themselves.
Why: Kishore wanted an imperfect, hand-drawn, subtle dotted grid instead of a square one, matching the worn postmark and the hand-printed border.

### 2026-10-19: Every straight line is hand-drawn, and dashed row rules are soft
Replaces the CSS-drawn dashes and borders from the separator entry above (the class names stay: `.rule-top`, `.rule-bottom`, `.rule-solid`, plus `.hand-b` for a soft line under a block and `.hand-l` for a soft vertical line). Lines are small hand-drawn SVGs in `public/line-*.svg` (wobbly pen strokes, hand-struck dashes, three variants each, generated once with fixed seeds) used as masks, so colour still comes from tokens. This covers section and row rules, the address lines and divider, the nav underline, the page kicker tail, list bullets and the footer rule. The dashed row separators (`--color-rule`) are deliberately soft; the dot grid keeps its original strength. The `--rule-weight/-dash/-gap/-halo` tokens are gone, replaced by `--rule-height` and `--rule-tile`.
Why: Kishore loves imperfect, hand-made details and wanted every line to feel drawn, with the dashed underlines under rows kept subtle. An SVG filter on the old lines gave stair-stepped, broken strokes, so the lines are real drawn paths instead.

### 2026-10-19: Years on About are date stamps
The About timeline and Community years use the same perforated date stamp as the notes list, through one shared `DateStamp` component: the start year on top, a hand-drawn line with a dot at each end, then the end year or "NOW" below, or just the year for a single year. For NOW the end dot is the accent colour and pulses softly (still under reduced motion), meaning the range is still running. Start stays on top because ranges read "from, to", even though the list itself is newest first. Note dates were moved onto the same component.
Why: Kishore wanted the years to look like the date stamps on the home page, and one component keeps them identical.
