import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const notes = (await getCollection('notes', (n) => !n.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Kishore Vidyasagar: notes',
    description: 'Short notes on AI, design, work and photography.',
    site: context.site,
    items: notes.map((n) => ({ title: n.data.title, pubDate: n.data.date, description: n.data.summary, link: `/notes/${n.id}/` })),
  });
}
