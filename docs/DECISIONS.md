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

### 2026-10-19: Separators on the grid are dashed rules, not borders
Any separator that sits on the page grid is a `.rule-top` or `.rule-bottom` (`.rows` and `.row` already are). Rules are a thicker, dashed, perforation-style mark that knocks the grid out around itself. Their size, dash and halo are tokens in `tokens.css` (`--rule-*`, `--color-rule`). Inside surface cards a plain border is still fine.
Why: solid hairline separators and the solid hairline grid read as the same mark and doubled up wherever they landed near each other. Making rules a different mark means they cannot clash, whatever the content height.

### 2026-10-19: Sound engine and controls
Sound and theme switches both live in the top nav. All sounds go through one master bus (soft low-pass and compressor) with a small random pitch shift. Named sounds: `tick` (links), `switch` (toggles), `thunk` (stamp, hanko, mailto), `rustle` (hover on a note), `on`. Link sounds fire on press for mouse, on release for touch (scrolling stays silent) and on click for keyboard, so a page load cannot cut them off. Hover sounds are mouse only and only play once audio is already running. Shift-click belongs to the hanko only. Switch labels stay fixed and `aria-pressed` carries state.
Why: fixes found in a review (double tick on the theme switch, overlapping sounds on shift-click, link sounds truncated by navigation, confusing screen reader labels) and makes the sound hard to miss. Page-load sounds are not possible because browsers block audio before a user gesture.
