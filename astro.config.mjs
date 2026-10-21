import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://imkishore.in',
  integrations: [mdx(), sitemap()],
  build: { inlineStylesheets: 'always' },
});
