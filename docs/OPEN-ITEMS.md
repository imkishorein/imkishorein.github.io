# Open items

## Needs real content from Kishore
- [ ] Contact email (currently placeholder hello@imkishore.in), GitHub, Instagram and Figma links
- [ ] Portrait: a front-facing illustrated avatar now stands in (hand-drawn SVG from two of Kishore's photos, `PortraitArt.astro`). Review the likeness. A real photo could still be added to About later.
- [ ] Stuff list. Camera gear is real (Sony A6700, Tamron 17-70 f/2.8, Sigma 56 f/1.4). The rest is placeholder.
- [ ] Friends of Figma Bangalore photos, numbers and reflections for Community
- [ ] Real notes. Both seed notes are placeholders.
- [ ] Work case studies (Work page is a stub)
- [ ] Photography selects (Photography page is a stub)

## Needs Kishore's review
- [ ] About page prose and "How I work" were drafted from his LinkedIn text
- [ ] "8+ years" figure on About came from his LinkedIn summary. His profile elsewhere says 7.5+. Pick one.
- [ ] Japanese nav labels (葉書 postcard, 仕事 work, メモ notes, 仲間 community, 写真 photography, 道具 stuff, 私 about, 印 seal). Standard words, not checked by a native reader.
- [ ] Sound volume and character were never heard by ear, only tested for errors
- [ ] Hero: Japanese label 航空便 (airmail) not checked by a native reader. Weather comes from Open-Meteo at city-centre coordinates (12.97, 77.59): confirm you are happy with a third-party request.

## Decisions still open
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
- Haptics on link clicks and Easter eggs (phones only, see `IDEAS.md`). Open: share the Sound toggle or add its own, and which Easter eggs get it.

## Workflow setup
- [ ] Push this repo to a private GitHub repo so cloud sessions, phone and teleport use the same files
- [ ] Check that a local Claude Code session sees the claude.ai connectors (Docs, Figma, Drive) and personal skills. A cloud session does.
- [ ] Try `/brainstorm`, `/idea` and `/decide` in a fresh session and tune the skills
