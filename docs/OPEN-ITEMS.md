# Open items

## Needs real content from Kishore
- [x] WhatsApp number for the postbox: Kishore supplied +91 8220676721 on 2026-10-20 (`site.whatsapp` in `src/data/site.ts`). The pre-filled message is still mine to reword.
- [ ] Contact email (currently placeholder hello@imkishore.in), GitHub, Instagram and Figma links
- [ ] Portrait: a front-facing illustrated avatar now stands in (hand-drawn SVG from two of Kishore's photos, `PortraitArt.astro`). Review the likeness. A real photo could still be added to About later.
- [ ] Stuff list. Camera gear is real (Sony A6700, Tamron 17-70 f/2.8, Sigma 56 f/1.4). The rest is placeholder.
- [ ] Friends of Figma Bangalore photos, numbers and reflections for Community
- [ ] Real notes. All three notes are placeholders, including the long one drafted from the repo docs (`why-this-site-is-a-postcard.md`, written in his voice, marked `placeholder: true`).
- [ ] Real signature: the one on notes is an invented hand. Draw it once on paper or a tablet, send an image, and trace it with the same pen-pressure approach (`Signature.astro`). The six doodles can stay or change.
- [ ] Work case studies (Work page is a stub)
- [ ] Photography selects (Photography page is a stub)

## Needs Kishore's review
- [ ] About page prose and "How I work" were drafted from his LinkedIn text
- [x] "8+ years" figure: Kishore confirmed 8+ on 2026-10-19 (hero rubber stamp and About).
- [ ] Japanese nav labels (葉書 postcard, 仕事 work, メモ notes, 仲間 community, 写真 photography, 道具 stuff, 私 about, 印 seal). Standard words, not checked by a native reader.
- [ ] Sound volume and character were never heard by ear, only tested for errors (including the new reaction sounds)
- [ ] Note page was only checked at desktop widths. Check phone width, dark mode, the pinned right column on short screens, and the copy-link button in a real browser (the test browser blocked the clipboard).
- [ ] Hero: Japanese label 航空便 (airmail) not checked by a native reader. Weather comes from Open-Meteo at city-centre coordinates (12.97, 77.59): confirm you are happy with a third-party request.

## Mobile audit
- [x] Home at 375px and 320px (see `DECISIONS.md`)
- [x] 320px: wordmark and lantern no longer touch (smaller wordmark and logo below 23rem). The Typed wordmark is now small on phones.
- [ ] Audit Notes, a note page, About, Stuff, and the coming-soon pages at phone width
- [ ] Check dark mode on phones, and real devices (iPhone Safari for the overflow fix and the haptics, Android for vibration). Only tested in the browser emulator.
- [ ] Haptics were never felt on a real phone. Tune the patterns by hand.
- [ ] Hero stamp dip may be too subtle on touch (4px). Bigger if it reads weak.
- [ ] Phone menu and footer were only checked in the emulator, light mode mostly. Check dark mode, a real iPhone (safe area under the postbox, home bar) and the tap targets of the lantern and speaker by thumb.
- [ ] On phones the plane drifts slightly if you scroll while it flies (the postbox now scrolls with the page).
- [ ] Seal hanko stamp positions are random in the left half of the page. Check they never cover something important.

## Decisions still open
- [ ] Header wordmark: which of the six styles to keep (Marker, Brush, Neon, Stitched, Playful, Typed), or keep the random mix. Check them at phone width and in dark mode (only checked on desktop in light mode). Typed looks smaller than the others at the same header height.
- [ ] Reaction totals shared between visitors. Today reactions are per browser only. Needs a small backend (Cloudflare Pages Function with free KV storage); the cap would then be per visitor.
- [ ] Reaction meanings (Love it, Learned something, Agree, Sparked an idea) and the crane and seal icons were not confirmed as final; the crane is the weakest drawing.
- [ ] Final font pairing. Interim is Geist. Second font was dictated as "Monopixel": Geist Pixel vs Geist Mono was never explicitly confirmed. Revisit with a specimen page against other sans + mono pairings.
- [ ] OG image for link previews

## Deployment
- [x] Push to GitHub (https://github.com/imkishorein/imkishore.in-site, `main`)
- [ ] Cloudflare Pages project: build `npm run build`, output `dist`
- [ ] Point imkishore.in DNS at Pages and add as custom domain
- [ ] Set up the Pages Git integration so pushes deploy

## Ideas parked
- Type specimen page to compare font pairings live
- Stuff page modelled on hvpandya.com
- More postcard/stamp pieces per section, per-note stamps
- Haptics on link clicks, the hanko and nav labels (stamp and paper planes are done, see `DECISIONS.md`). Open: which of these get it.

## Workflow setup
- [ ] Push this repo to a private GitHub repo so cloud sessions, phone and teleport use the same files
- [ ] Check that a local Claude Code session sees the claude.ai connectors (Docs, Figma, Drive) and personal skills. A cloud session does.
- [ ] Try `/brainstorm`, `/idea` and `/decide` in a fresh session and tune the skills
