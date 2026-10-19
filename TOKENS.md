# Tokens and how to change the look

Everything visual comes from two files:

- `src/styles/tokens.css`: palette, colour roles, font roles, type scale, space, shape, motion, sound volume.
- `src/styles/fonts.css`: the only place that names font files.

## Change the colours
Edit the three `--palette-*` values at the top of `tokens.css`. Roles (`--color-bg`, `--color-text`, `--color-accent`...) and dark mode are derived from them.

## Change the fonts
1. Put the new `.woff2` in `public/fonts/`.
2. Edit the `@font-face` blocks in `fonts.css`.
3. Point the roles in `tokens.css`: `--font-sans`, `--font-mono`, `--font-accent`.

Current set: Geist (sans), Geist Mono, Geist Pixel Square. All SIL OFL. These are interim.

## Rules
Components use roles only. `npm run check:tokens` (also run by `npm run build`) fails the build if a raw colour or a font name appears outside the token files.
Exception: `public/favicon.svg` cannot read CSS variables, so it holds its own hex values.

## Sound
Off by default, toggled in the footer. Sounds are synthesised in the browser, so there are no audio files. Volume is `--sound-volume`.
