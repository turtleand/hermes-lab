import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

const SITE = 'https://hermes.turtleand.com';
const feedUrl = new URL('/rss.xml', SITE).href;

export async function GET() {
  const topics = (await getCollection('topics', ({ data }) => !data.draft)).sort((a, b) =>
    a.data.title.localeCompare(b.data.title)
  );

  return rss({
    title: 'Turtleand Hermes Lab',
    description: 'Hermes Agent field notes, troubleshooting guides, and voice-first workflows from Turtleand.',
    site: SITE,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
    customData: [
      '<language>en</language>',
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: topics.map((topic) => ({
      title: topic.data.title,
      description: topic.data.summary,
      link: `topics/${topic.id}/`,
      categories: [topic.data.module, topic.data.subtopic, topic.data.status].filter(Boolean),
      customData: '<dc:creator>Turtleand</dc:creator>',
    })),
  });
}
