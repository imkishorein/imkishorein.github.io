# imkishore.in: Website Plan

Oct 19, 2026 · @Kishore

## Goal and scope

Rebuild imkishore.in as one public place for everything about Kishore: a personal site that also works as a portfolio.

- Portfolio and showcase of work
- Writing: random thoughts, tips and tricks for working with AI, experience of working with AI, quick notes
- Hobbies
- Photography gear used for work
- Tools used, both software and hardware
- Side projects and anything related

Constraints: keep hosting cost low. No existing hosting today; the domain is owned but unused for a while.

Reference site: [hvpandya.com](https://hvpandya.com/), valued for being simple and functional, with hidden UI easter eggs and a good selection of fonts.

## Reference: what makes hvpandya.com work

The site is tiny structurally: five nav items (Work, Notes, Talks, Manual, Stuff), a one-line positioning statement, an illustrated portrait, latest notes tagged by category, a short projects list and contact.

Notes are mixed across career, leadership and AI experiments, and the projects double as notes. "Manual" (working with me) and "Stuff" (what I use) are the two pages that give the site its personality.

Not visible from a text fetch: fonts and easter eggs. Action: open devtools on his site and note the font families and how the interactions are wired. That is the reference spec.

## Recommended stack

**Astro with MDX and content collections.** It ships static HTML with almost no JS by default, so the site is fast and cheap. Notes are written as markdown files, which keeps friction low for a "random thoughts" site. Easter eggs and interactive bits are small islands of vanilla JS or React, so JS is only paid for where used. RSS, image optimization (important for photography) and sitemap come through first-party integrations.

Styling: Tailwind only if liked. Plain CSS with custom properties as tokens is probably cleaner here.

Fonts: self-host via Fontsource so nothing leaks to Google and loading stays controlled. One serif or grotesk for headings and a mono for accents.

Why not the alternatives: Next.js is overkill for a static site, Framer or Webflow gets expensive and caps interaction control, and Notion-based sites feel generic and slow.

## Hosting and cost

**Cloudflare Pages.** Free for a static site like this, unlimited bandwidth, global CDN, and it deploys on every git push. Vercel and Netlify are fine too, but their free tiers have bandwidth caps that matter if a photo-heavy page gets shared widely.

The only real recurring cost is the .in renewal, typically under ₹1,000 a year (approximate). If the registrar is clunky, point the nameservers to Cloudflare and manage DNS there.

Analytics: Cloudflare Web Analytics (free, no cookie banner needed).

Photos: if the gallery grows past a few hundred images, move originals to Cloudflare R2 rather than bloating the repo.

## Information architecture

- **Home:** one-line positioning, portrait, latest notes, selected work, projects, contact.
- **Work:** case studies. Check Salesforce confidentiality policy before publishing anything. Anonymized or process-focused write-ups are safer than screenshots.
- **Notes:** thoughts, AI tips and experiences, quick notes. Categories like his (AI, Design, Life) and short posts allowed, not just essays.
- **Projects:** vibe-coded projects, each with a short story and a live link.
- **Photography:** a curated gallery plus a gear sub-section.
- **Stuff:** software, hardware and photography gear in one "what I use" page, modeled on his.
- **About or Manual:** hobbies, how I work, how to reach me.

## Build plan

1. **Weekend 1, foundation.** Astro scaffold, domain pointed at Cloudflare Pages, design tokens, fonts, nav, layout, dark mode. Ship an empty but live site.
2. **Weekend 2, content model.** Notes collection with categories, RSS, OG images, Stuff page, About. Write 3 real notes. Do not launch with zero content.
3. **Weekend 3, Work and Projects.** Two case studies at most, plus projects.
4. **Weekend 4, Photography.** Gallery with optimized images and the gear section.
5. **Polish.** Easter eggs go last. Pick two or three that mean something (a keyboard shortcut, a hover state, a hidden page), not ten.

Process: use Claude Code for scaffolding and components. Design the home page and type system in Figma first for an hour, then let the agent build against it.

## The honest part

The stack is the easy 10%. Personal sites die from two things: perfectionism before launch and nothing to say after. Ship the ugly-but-live version by week 2, and commit to a cadence that can be sustained, like one short note every two weeks.

Copying his structure is fine, but copying his voice or illustration style would read as derivative. The edge here is the combo of enterprise developer tooling, AI and photography, which almost nobody else has. Lean on that in the positioning line.

## Open questions

- [ ] Where is imkishore.in registered right now?
- [ ] Are there existing case studies, or will they be written from scratch?
- [ ] Write in markdown files in a repo, or use a CMS-style editor?

## Reference websites

- [hvpandya.com](https://hvpandya.com/)
- [charmiekapoor.com](https://www.charmiekapoor.com/)

## Ideas log

Running list of new ideas for the site. Add each one here as it comes up.

### 19 Oct 2026: section ideas

**Notes**

- Very quick, short notes on something experimented with or learned. Not detailed blog posts.
- Topics can span work, photography, random thoughts and AI.

**Community**

- Share thoughts, musings and achievements from the community building done with Friends of Figma.
- Photos from events hosted, people met, leaders met and what was learned from them.
- Reflections, and a way to show that something great was built outside work.

**Stuff**

- Modeled on Hardik Pandya's "Stuff" page: everything in use, including gadgets, photography tools, design tools and work-related tools.

**About**

- Work experience, achievements so far and career trajectory: where it started and where it is now.
- Values, how I work and working with me.

**Micro interactions and sound**

- Micro interactions and animations across the site, with subtle sound effects.

**Color inspiration**

- Instagram profile that explains interesting color combinations: [@uxui\_shrut](https://www.instagram.com/uxui_shrut)

**Color theme**

- Use a white and green palette, combined with the stamp, postcard and Japanese aesthetic above.
- Palette from the reference screenshot: Soft White #E8E9DF, Sage Green #A9B887, Deep Olive #2E3D28.
- The reference design pairs the palette with a light grid-lined background, botanical imagery, small widely spaced uppercase navigation and one large bold heading.

**Visual aesthetic**

- Love stamp and postcard based designs and Japanese aesthetics. Prefer the site to have that feel.

**Typography**

- Initial inspiration: [Geist](https://vercel.com/font) from Vercel, with its Sans, Mono and Pixel styles.
- Direction: a sans paired with a very good mono typeface. Open to researching other combinations.
- Geist is licensed under OFL. It is available via npm, Google Fonts or a .zip with woff2 and variable files.

**Font pairing research (19 Oct 2026)**

Goal: a sans and a mono that look different from each other, stay functional and suit a professional portfolio.

What the research says:

- Clean neo-grotesks such as Inter and Geist are so common in product design that they can read as default rather than designed. Softer grotesks like Mona Sans, Hanken Grotesk, General Sans and Switzer are trending as an alternative.
- Geist Sans with Geist Mono is cohesive but comes from one family, so it will not look different. Geist Pixel works better as a rare accent for headings or easter eggs.
- Monospace works best as an accent for labels, dates, metadata and code, not long prose.

| Sans | Mono | Why it could work | License and cost |
| --- | --- | --- | --- |
| Mona Sans | Commit Mono | Industrial grotesque with weight, width and slant axes for expressive headings, paired with a deliberately neutral mono | Both OFL, free |
| Hanken Grotesk | Geist Mono | Warmer geometric sans against a crisper, more contemporary mono | Google Fonts and Geist (OFL), free |
| Instrument Sans | Geist Mono | A pairing seen on live portfolio sites | Google Fonts and Geist (OFL), free |
| General Sans or Switzer | Fragment Mono | Swiss-leaning sans with a Helvetica-derived mono (Fragment Mono has a single regular weight plus italic) | Fontshare ITF Free Font License for the sans, OFL for the mono |
| Hanken Grotesk or Geist Sans | Berkeley Mono | Premium option, widely seen as the most coveted paid mono | Paid. Web fonts are a separate module from the base license |

**Status:** undecided. No font direction has been chosen. The table above is a set of findings to revisit later.

**Interim choice (19 Oct 2026):** start with fonts from Vercel's Geist family, a sans plus a mono or pixel style, as placeholders for the first build. The final decision comes later. Dictated as "Jost" and "Monopixel", read here as Geist Sans and Geist Pixel. To be confirmed whether the second font is Geist Mono or Geist Pixel.

**Cautions:**

- Fontshare fonts: sources disagree on whether self-hosting the files is allowed. Read the license on the font page before using them, or load them through the Fontshare API.
- Berkeley Mono: the trial license prohibits web use. Catalog pricing lists web fonts as a separate module (from $45 on the Developer tier) and the Developer tier lists commercial use as no, so confirm the right tier if the portfolio brings in paid work.
- Most sources are roundups and opinion pieces, and the pairings have not been seen rendered together yet. Judge them on a real specimen page, not on lists.

**Possible next step:** build a one-page type specimen in the actual layout (heading, body, labels, a note excerpt) and compare a few pairings in light and dark mode.

**About source material: LinkedIn snapshot (19 Oct 2026)**

From screenshots of the LinkedIn profile, as raw material for the Home, About and Community pages.

- **Name:** Kishore Vidyasagar, Bengaluru.
- **Headline:** Designer + Builder @ Salesforce | Enterprise UX | Figma Community Lead, Bangalore.
- **Opening line of About:** "I design for the people who run the systems that run the world."
- **Positioning:** Senior UX Designer at the intersection of Enterprise SaaS, AI and Platform Engineering. 8+ years across startups, unicorns and global companies. Has designed for SREs, platform teams, banking operations and now Salesforce Developers and Admins building AI-powered applications.
- **Specialities:** Developer Tools, Observability, Identity and Access Management, Conversational AI, Design Systems, data-dense interfaces. Strength is systems thinking.
- **Top skills:** Design Strategy, Design Systems, Enterprise UX, Design Research, User Experience.
- **Closing line of About:** if you are building AI-powered, platform or enterprise products that need both systems thinking and human-centered design, we will get along well.

**Career trajectory**

- **Salesforce, Senior UX Designer, Platforms and AI (Apr 2025 to present).** Agentforce for Setup: conversational AI for Salesforce Admins, leading UX for an agentic interface framework where admins configure orgs in natural language. Agentforce Vibes: pro-code experiences that let Salesforce Developers build apps with natural language.
- **Zeta (3 yrs 4 mos).** Principal UX Designer, Platforms and AI (Jan 2025 to Apr 2025): conversational AI experience for SREs to monitor, diagnose and debug with AI agents. Senior UX Designer, Platforms Engineering (Jul 2023 to Dec 2024): Olympus Watch (monitoring and observability for banks), Weave (continuous deployment with audit and compliance) and the Galaxy Design System (Enterprise Data Grid, saved table views, table settings). UX Designer II, Identity Management (Jan 2022 to Jun 2023): authentication and authorisation flows for banking back-office tools and Access Control Servers, plus Galaxy.
- **Kovai.co (3 yrs 3 mos).** Product Designer (Mar 2019 to Dec 2021): BizTalk360, Document360 and Serverless360, covering wireframes, journeys, research, marketing design and some UI development. UI Developer (Oct 2018 to Mar 2019).
- **Hackowls Software LLP, UI Developer (Apr 2018 to Oct 2018).** Websites and mobile apps for small and medium businesses.
- **Spotknack, Co-Founder and Head of Product Development (Dec 2016 to Apr 2018).** Co-founded during the pre-final year of engineering and bootstrapped it into a revenue-generating private limited company. Moved from services to a product-led model and built a skill-based hiring platform with gamification and leaderboards. Pitched to EDII-TN and placed in the Top 10 startups, then raised seed funding. Mentored a student intern team.

**Community (Figma)**

- Community Lead, Bangalore Chapter (Mar 2023 to present).
- Community Advocate, Coimbatore Chapter (Nov 2020 to Feb 2023).
- Featured event: DesignMyx'23 with Myntra Design and Friends of Figma Bangalore.

**Notes on this material**

- The About text says 8+ years while earlier notes said 7.5+. The career dates support 8+ from Oct 2018, and nearly 10 years if Spotknack counts. Pick one number for the site.
- The Spotknack story (engineering student to bootstrapped founder to designer and builder) is a strong About narrative and fits the "Designer + Builder" headline.

**Design tokens (requirement)**

- Define design tokens and font tokens once, as a global declaration, not locally in each component or page.
- Goal: any font or color can be swapped in one place to change the look and feel of the whole site. This applies to the interim fonts and the palette above, which are not final.

**v1 scaffold built (19 Oct 2026)**

- Stack: Astro with markdown notes. Static build, no framework runtime.
- Live pages: Home (postcard hero with stamp and postmark), Notes (list and note pages, RSS), Stuff, About. Stubs for Work, Community and Photography.
- Tokens: `src/styles/tokens.css` holds palette, colour roles, font roles, type scale, space, motion and sound volume. `src/styles/fonts.css` is the only file that names fonts. `npm run check:tokens` fails the build if raw colours or font names leak elsewhere. Dark mode is derived from the same palette.
- Fonts in use: Geist, Geist Mono and Geist Pixel (interim, font direction still undecided).
- Interactions: nav underline draw and Japanese sublabel on hover, date stamps tilt on hover, click the hero stamp to re-postmark, theme toggle, sound toggle (off by default, synthesised sounds, volume set by a token), hidden: shift-click anywhere leaves a hanko seal.
- Japanese labels used: 葉書 postcard, 仕事 work, メモ notes, 仲間 community, 写真 photography, 道具 stuff, 私 about, 印 seal. Worth a quick check by a Japanese reader.
- Placeholders to replace: email, GitHub, Instagram and Figma links, portrait (stamp shows a drawn landscape), Stuff items other than the camera gear, both seed notes, short bio.
- Drafted by me from the LinkedIn material, so review the wording: About paragraphs, "How I work", and the 8+ years figure.
- Not done yet: deployment to Cloudflare Pages, real photos, case studies, Community content, OG image.
