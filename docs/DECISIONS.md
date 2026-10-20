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

### 2026-10-19: Sound engine and controls (switches replaced 2026-10-20)
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

### 2026-10-19: Hero content is written like a real envelope (superseded 2026-10-19)
Replaces the TO / FROM / DOES / NOW form rows. Nothing is said twice: the headline is the greeting, the line under it says what I do ("I design and build enterprise B2B SaaS and AI tools."), a worn rubber stamp says "8+ years" of experience, the return address top left gives role, employer and the community role, and the recipient is the audience, written on ruled address lines ("The people who run the systems that run the world."). The postmark keeps the place, date and live time, and a small "Now" note keeps the weather. The positioning line is still used as the About page heading.
Why: Kishore wanted the one missing fact (8+ years in enterprise B2B SaaS and AI) in the hero, no repeated details, and From and To shown the way a postcard would show them. The 8+ figure settles the earlier 8+ vs 7.5+ question.

### 2026-10-19: Hero is a letter cover: FROM me, TO you
Replaces: Hero content is written like a real envelope. The cover of an airmail letter, laid out like the real thing. FROM is top left and is the headline: "Kishore Vidyasagar." big, with "I design and build enterprise B2B SaaS and AI tools." under it, a small live weather note ("22°C, Partly cloudy here") and "8+ YEARS" written into hand-drawn PIN-code boxes ("8+" shares one box, an empty box is the space, then one letter per box) (label "EXPERIENCE", like the PIN row on an Indian postcard). An earlier rubber-stamp version was replaced by the boxes. TO is bottom right on a ruled address line and is the viewer: a single ruled line, "You, kindly reading". A three-line version split one sentence into fragments and looked odd, and a second "imkishore.in" line was dropped at Kishore's request. Stamp and the live postmark (place, date, time) sit top right. The "Hello, I'm" greeting, role, employer and community lines are gone from the hero; "Hello" survives as the stamp caption. The positioning line is still the About page heading.
Why: Kishore wanted the hero structured like the cover of a real letter: the header text should work as the sender, the recipient should address whoever is on the site right now, and the role, employer and community details should go.

### 2026-10-19: Hero weather note has a hand-drawn animated SVG icon, duotone in the hero
Replaces the pulsing dot, and then an ASCII icon that did not fit the layout or size. A small hand-drawn SVG icon matches the live weather: sun, moon, partly cloudy, cloudy night, overcast, rain, drizzle, snow, storm and fog. There are two looks on the same shapes, chosen by the `variant` prop of `WeatherIcon.astro`: `outline` (wobbly ink outlines, light fills, the first version) and `duotone` (flat shapes in ink and sage, no outlines). Both are kept; the hero uses `duotone`. Colours are tokens, so both follow light and dark mode. Animations: the sun's rays turn and the disc breathes, the moon bobs, clouds drift, rain and snow fall, the bolt flashes, fog slides, stars twinkle. All are off under reduced motion. Animated parts are inline, not `<use>` clones, because CSS animations do not run inside `<use>`; the first version used `<use>` and its rays and stars never moved. Drift and fall distances were also made larger so the motion is visible at icon size. Code 1 reads "Mostly clear". Files: `WeatherIcon.astro`, `src/scripts/weather-icon.ts`.
Why: Kishore wanted a live, playful weather indicator in the postcard's look and palette that sits properly beside the text, a filled variant to compare against the outline, and visible animation.

### 2026-10-20: A postbox in the corner opens WhatsApp
A hand-drawn duotone postbox (ink body, sage details) is fixed to the bottom-right corner of every page (`Postbox.astro`, added in `Base.astro`). It is styled on a round Japanese pillar postbox: cylinder body, flat lid, round plaque with the 〒 mark and 郵便, a hooded slot, a collar and a small hatch. On hover or keyboard focus the hood lifts and a hand-drawn WhatsApp bubble pops out like a letter picked from the box, with a small "Drop a line" label on wider screens. Click opens a `wa.me` deep link in a new tab with a pre-filled message. The number is Kishore's own, set in `site.whatsapp` in `site.ts` (it is public on the site). It uses the thunk sound on press and the paper rustle on hover when sound is on, and the motion is off under reduced motion. On touch screens there is no hover, so a tap goes straight to the chat.
Why: Kishore wanted a playful way for visitors to drop him a message that fits the postcard theme.

### 2026-10-20: Theme and sound controls are hand-drawn icon buttons
Replaces the toggle switches in the nav. Light and dark mode is a hand-drawn Hoi An lantern (scalloped cap, silk ribs, tassels): lit in light mode, the default, with silk that glows from the inside, a pool of light that is brighter than the page (a darker green halo read as a shadow, so it was dropped), a ring of short light rays that shimmer, and a faint wash of light across the nav behind it, and dark and unlit in dark mode. It hangs in the air like a pendulum: the whole lantern swings from its string, the lamp lags a little behind and the tassel lags further, and hovering gives it a push (bigger, quicker swings, eased through a registered `--amp` property). Switching it on makes the glow flare, sends a ring of light out from it and swings it; switching it off makes it swing itself still. The page change itself spreads out from the lantern like light, using a view transition with a circular clip: switching to light, the light page grows out of the lantern; switching to dark, the light page shrinks back into it. (Before this, only dark mode showed a visible glow, a white wash fading out over the dark page, and switching back to light showed almost nothing, because white on cream is invisible.) The wash now disappears at once when the light goes out. Browsers without view transitions, and reduced motion, switch instantly. Unlit it hangs almost still. Sound is a hand-drawn speaker: waves that pulse when on, a cross when off. Both hang from cords tied to the top edge of the page, at the right of the nav, with their centres lined up with the nav text. The whole hanging unit swings from the page top like a pendulum. Both are plain buttons with `aria-pressed` carrying the state (theme pressed means dark, sound pressed means on) and fixed accessible names. Colours are tokens, and sway, glow and wave motion stop under reduced motion. State keys are unchanged: `imk:theme`, `imk:sound`.
Why: Kishore wanted the toggles to match the hand-drawn postcard look, with the lantern drawn from the Hoi An lanterns on his recent trip.

### 2026-10-20: A note is the back of an airmail postcard
Each note page (`src/pages/notes/[id].astro`) is laid out as the back of a postcard. The airmail stripes are the card's frame and stay pinned to the top and bottom of the window while a long note scrolls between them (the tilt was dropped because it clipped the pinned stripes). The message (kicker, title, summary, body, signature) is on the left, a hand-drawn vertical divider splits the card, and a right column stays pinned beside the text. The right column holds, top to bottom: the reactions, the stamp zone, "In this note", and "More in <category>". The stamp zone is the postmark on the left and the date stamp on the right, side by side so they never overlap and share the column's edges. The postmark carries the place, the category and the reading time, and the stamp is the only place the date appears. The contents list starts with the title, is numbered from 00, and marks the section being read as you scroll (scroll-spy), with smooth scrolling and a buffer so targets never land against the window edge (reduced motion turns smooth scrolling off). A small copy-link icon button sits as a suffix of the title, kept with the last word however the title wraps. "More notes" links end in a hand-drawn arrow with a dashed rule under each. Removed on purpose: Newer/Older pager, Status, Words and a separate Posted row (nothing there was useful while every note is a placeholder), and the Write back button (the corner postbox already opens WhatsApp). The contents list only shows when a note has three or more `##` headings.
Why: Kishore wanted the note to give the feel of a postcard or an envelope letter, and wanted the right side to show useful data, with every element aligned and nothing duplicated or overlapping.

### 2026-10-20: Reactions are four hand-drawn objects, stamped like claps
Notes have reactions in `src/components/Reactions.astro`, at the top of the right column. No hearts or thumbs. Four objects from the site's world, in the duotone style of the postbox: an origami crane (Love it), a sprout (Learned something), a hanko seal 印 (Agree) and a paper lantern (Sparked an idea). Each is a raised, pressable tile (hard edge underneath, squashes on press, sinks once chosen). Like claps on Medium, a reaction can be added many times, up to 50 per reaction, and holding a tile repeats. The tile shows a running count, and each press drops a "+N" chip from under the tile (below, not above, because the rubber-stamp cursor covers everything above the pointer; milestones of 10 are bigger). While the mouse is over a tile the hero's wooden stamp replaces the hand cursor and taps down on every counted press. A "Clear" link resets the tally. The names appear in a single caption above the tiles on hover or focus. For now the tally is per browser only: `localStorage` key `imk:react:<note-id>`, an object of counts (an older list format is still read). There are no shared totals because the site has no backend.
Why: Kishore wanted reactions that match the postcard aesthetic instead of the usual heart or thumbs-up, that can be repeated like claps, and that look clickable. Shared totals need a backend, which is an open item.

### 2026-10-20: The note signature is a pen-pressure drawing with a random doodle
The sign-off on a note is `src/components/Signature.astro`, a hand-drawn "Kishore" built from filled strokes with pen pressure (thick downstrokes, hairline upstrokes, tapered ends), slanted, with a tall K, a looped h, an underline swoosh and a dot on the i. It writes itself when it scrolls into view and is shown fully drawn under reduced motion or without JavaScript. After the underline, the pen draws a small doodle. There are six: heart, paper plane, star, sprout, smiley and lantern. One is picked at random on every page load and never the same one twice in a row in the same tab (`sessionStorage` key `imk:doodle`); without JavaScript the heart shows. The signature itself must not change when doodles are added or changed.
Why: Kishore liked the idea of signing the end of the postcard, wanted it to look stylish, not like a beginner's hand, and wanted a different doodle each time so the page feels alive. The drawing is my invention, not his real signature (see `OPEN-ITEMS.md`).

### 2026-10-20: Company logos on About are hand-drawn marks inside each job row
`CompanyMarks.astro` shows one hand-drawn mark per job, in its own column between the date stamp and the role (stamp, logo, role and company, description), not as a separate strip and with no card or border around it. Each mark is redrawn close to the real logo's shapes from the logos Kishore supplied: Salesforce (cloud with lobes top and bottom, name inside, "f" slanted), Zeta (solid rounded tile, name knocked out), Kovai.co (faceted ring "o" with a satellite ring, then ".co"), Hackowls (bold name over the owl head with ring eyes and chevron beak) and Spotknack (tapered wedge with two eyes, then the name). They use only the site's inks, so they follow light and dark mode: brand colours are mapped to sage, olive and muted olive. The paths are generated once with a fixed seed by `scripts/gen-company-marks.mjs` into `src/data/company-marks.ts` (do not edit by hand). Marks match a job by the start of its org name.
Why: Kishore wanted the brands scannable at a glance, matching the hand-drawn look of the site, and as close to the real logos as possible. A first version with five bordered tiles in a separate row, and a second with guessed Hackowls and Spotknack drawings, were replaced after his feedback.

### 2026-10-20: The avatar is the site logo and favicon (superseded 2026-10-20)
The headshot avatar (sage brush circle, glasses, patterned shirt) is cropped to a circle around the face and shown at 2.5rem left of "Kishore Vidyasagar" in the header on every page (`public/kishore-logo.png`), and is the favicon (`public/favicon.svg` with a clipped embedded bitmap, plus a PNG fallback and `apple-touch-icon.png`). The logo tilts slightly on hover and focus, and not under reduced motion. It is a cropped bitmap, not a vector redraw. This replaces the old olive tile favicon.
Why: Kishore wanted the avatar to act as his logo and favicon. The source SVG is a raster image in an SVG wrapper, so the elements could not be edited, only cropped.

### 2026-10-20: About portrait is the full avatar, not the stamp
Replaces the stamp portrait on About. `public/kishore-portrait.webp` is the full avatar with the white background removed, so the sage brush circle and ragged shirt hem sit straight on the page in both themes. The intro is two equal columns, the portrait fills its column with its right edge on the content edge, and it is centred vertically against the text. It stacks under the text on phones. The home hero stamp is unchanged and still uses `kishore-avatar.png`.
Why: Kishore wanted the shared avatar on About, larger and symmetrical with the text.

### 2026-10-20: "What I borrowed and what is mine" removed from the postcard note
The section is gone from `why-this-site-is-a-postcard.md`.
Why: Kishore asked for it to be removed.

### 2026-10-20: The header wordmark is "imkishore.in", lettered by hand in six random styles
Replaces the plain "Kishore Vidyasagar" text in the header. `Wordmark.astro` letters "imkishore.in" (the brand and the domain) in an upright, bouncy hand, deliberately not a slanted signature. There are six styles, one picked at random on every page load and never the same one twice in a row (`imk:wordmark` in sessionStorage): Marker (thin monoline that writes itself, leaf dot, wavy underline, sparkle), Brush (fat strokes on a highlighter swipe, letters drop and bounce), Neon (sage letters in an olive outline, flicker on, twinkling stars), Stitched (dotted thread letters sewn in by a needle), Playful (letters slide in then bob, confetti) and Typed (Geist Pixel that types itself with a block cursor). Styles 1 to 5 share the same hand-drawn letterforms and differ in pen, colour, doodles and motion. Each has its own entrance and hover animation. Colours are tokens, so all follow light and dark mode. Reduced motion shows the chosen style still, and without JavaScript the Marker shows. Two bugs worth remembering: hover animations must not run during the entrance (they replace the entrance animation and left letters invisible), so hover only applies once the entrance has finished and the hidden start states are cleared; and in Typed each letter takes no room until it is typed so the cursor never floats ahead of the text.
Why: Kishore wanted the header to carry his brand as stylish handwriting with animation and doodles, not plain text, and wanted it to feel different on every refresh. Which styles stay is still open (see `OPEN-ITEMS.md`).

### 2026-10-20: The logo and favicon are the rubber-stamp portrait
Replaces: 2026-10-20 The avatar is the site logo and favicon. `public/kishore-logo.png` (header, 2.75rem, no extra ring because the image has its own), `public/favicon.svg` (embedded bitmap) and `public/apple-touch-icon.png` (on Soft White) now use Kishore's rubber-stamp style portrait: a hatched line drawing inside a worn double ring, clipped to a circle with transparent corners. The portrait is white inside the ring, so in dark mode the logo reads as a pale stamp disc. The home hero stamp and About portrait are unchanged. The source image is not stored in the repo.
Why: Kishore preferred this illustration for the logo and favicon.

### 2026-10-20: The hero rubber stamp makes no sound on hover
The soft ink-pad pat that played when the pointer entered the hero is removed. The click-to-stamp thunk stays. The pad sound is still used when hovering a reaction tile on a note.
Why: Kishore asked for it to go.

### 2026-10-20: Mobile audit, page by page, starting with Home
Home was audited at 375px and 320px. Fixes: the page no longer scrolls sideways (`html` and `body` both set `overflow-x: clip`, because the lantern's 15rem glow reached past the right edge; html must clip too or the body's overflow is handed to the viewport); the postbox sits 0.6rem in on phones; the nav is two even rows of three on an equal-column grid; the hero stamp and postmark sit top right above the sender, like a real letter, instead of under the PIN boxes; the date stamp is smaller on phones (shared `DateStamp`, so About years shrink too); the dot in "· soon" stays with the word; the footer has less dead space above it and 6rem below so the postbox never covers the last row. Still open: at 320px the wordmark touches the lantern cord. Other pages are not audited yet.
Why: Kishore saw a lot of positioning and alignment off on phones and asked to tackle it one page at a time.

### 2026-10-20: Tapping the hero stamps on touch
Replaces the touch half of the hero stamp press. The wooden stamp cursor and ink seal were mouse only, so a tap gave only a faint dip and a sound (sound is off by default), which looked broken. Now a tap, or a pen touch, anywhere on the hero lands the stamp: the ink seal is left where the finger was, the postmark is re-struck if the stamp was hit, and the thunk plays if sound is on. A scroll cancels it, links and buttons keep their own tap, and keyboard Enter and Space still press the stamp. The landing is one shared `land()` function used by mouse and touch.
Why: Kishore reported click to stamp did not work on mobile.

### 2026-10-20: Haptics on touch phones, not tied to the sound toggle
Settles the parked 19 Oct haptics idea for stamping and the paper planes only. `haptic()` in `site.ts` uses `navigator.vibrate` on Android and the hidden `<input type="checkbox" switch>` tick on iPhone (iOS 18+, only inside a tap). Patterns (`HAPTICS`): stamp `[14, 55, 34]` (light touch, then the heavier press), plane launch `[10]`, plane hit `[22]`. Runs only when `(pointer: coarse)` and not under reduced motion. It does not follow the sound toggle. iPhone gets the stamp tick only, because the plane fires from a timer with no tap and iOS blocks it; Android needs one tap on the page first. Link clicks, the hanko and the nav labels have no haptics yet.
Why: Kishore asked for haptics on mobile for stamping and the planes. A vibration is felt only when you touch the phone, and a sound-gated version would be invisible since sound is off by default. Replaces the 19 Oct leaning to share the sound toggle.
