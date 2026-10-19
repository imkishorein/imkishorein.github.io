# imkishore.in

Astro static site. Notes are markdown files.

    npm install
    npm run dev        # http://localhost:4321
    npm run build      # checks tokens, outputs dist/

## Edit content
- `src/data/site.ts`: name, bio, email, links, nav, timeline, stuff. Placeholders are marked.
- `src/content/notes/*.md`: one file per note (title, date, category, summary). `placeholder: true` shows a mark, `draft: true` hides it from production.

## Pages
Home, Notes, Stuff, About are live. Work, Community and Photography are "coming soon" stubs.

## Deploy (Cloudflare Pages)
Push to GitHub, create a Pages project, build command `npm run build`, output directory `dist`, then add imkishore.in as a custom domain.

See `TOKENS.md` for the design token system.
