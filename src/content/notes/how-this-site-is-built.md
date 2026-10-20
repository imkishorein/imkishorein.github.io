---
title: How this site is built
date: 2026-10-19
category: Work
tags: [Astro, Design tokens, Build log]
summary: Astro, one global token file and two swappable fonts.
placeholder: true
---
The site is built with Astro and ships almost no JavaScript. Notes are plain markdown files in a folder.

Colours, fonts, type scale, spacing and motion all live in one token file. Components only use roles like `--color-bg` or `--font-accent`, so changing the look is a one-file edit.

Hosting is a static build on Cloudflare Pages, which keeps the cost close to the price of the domain.

This note is a placeholder, so rewrite it in your own words.
