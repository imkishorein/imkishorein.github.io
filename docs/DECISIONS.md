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
