import {createHash} from 'node:crypto';
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const host = 'https://waylock-docs.aoneahsan.com';
const build = new URL('../build/', import.meta.url).pathname;
const routes = [
  {path: '/', file: 'index.html'},
  {path: '/guide/release-status', file: 'guide/release-status.html'},
  {path: '/guide/route-controls', file: 'guide/route-controls.html'},
  {path: '/guide/account-and-data', file: 'guide/account-and-data.html'},
  {path: '/sitemap', file: 'sitemap.html'},
  {path: '/feed', file: 'feed.html'},
];
const tagsDir = join(build, 'guide/tags');
for (const name of readdirSync(tagsDir)) {
  if (name.endsWith('.html')) routes.push({path: `/guide/tags/${name.slice(0, -5)}`, file: `guide/tags/${name}`});
}
routes.push({path: '/guide/tags', file: 'guide/tags.html'});
const escapeXml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const ledger = JSON.parse(readFileSync(new URL('./page-dates.json', import.meta.url), 'utf8'));
const fingerprint = html => {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) throw new Error('Built page has no main content');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=(?:"description"|description))[^>]*>/i)?.[0] ?? '';
  const description = descriptionTag.match(/\bcontent=(?:"([^"]*)"|([^\s>]*))/i)?.[1] ?? '';
  const words = `${title} ${description} ${main}`
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[#\w]+;/g, ' ')
    .replace(/\s+/g, ' ').trim();
  return createHash('sha256').update(words).digest('hex').slice(0, 16);
};
const nextLedger = {};
for (const route of routes) {
  const file = join(build, route.file);
  if (!existsSync(file)) throw new Error(`Missing built route: ${file}`);
  const html = readFileSync(file, 'utf8');
  const canonical = html.match(/<link[^>]*rel=(?:"canonical"|canonical)[^>]*>/)?.[0] ?? '';
  if (!canonical.includes(`href=${host}${route.path}`) && !canonical.includes(`href="${host}${route.path}"`)) throw new Error(`Canonical mismatch: ${route.path}`);
  if (html.includes('noindex')) throw new Error(`Unexpected noindex: ${route.path}`);
  const words = fingerprint(html);
  const saved = ledger[route.path];
  if (process.argv.includes('--print-ledger')) {
    nextLedger[route.path] = {updated: saved?.updated ?? 'SET-MEANINGFUL-CONTENT-DATE', words};
    continue;
  }
  if (!saved || saved.words !== words || !/^\d{4}-\d{2}-\d{2}$/.test(saved.updated) || new Date(saved.updated) > new Date()) {
    throw new Error(`${route.path}: page words/date differ from scripts/page-dates.json. Current words fingerprint: ${words}`);
  }
  route.changed = saved.updated;
}
if (process.argv.includes('--print-ledger')) {
  process.stdout.write(`${JSON.stringify(nextLedger, null, 2)}\n`);
  process.exit(0);
}
if (Object.keys(ledger).length !== routes.length) throw new Error('page-dates.json includes a stale or missing route');
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + routes.map(route => `  <url><loc>${escapeXml(host + route.path)}</loc><lastmod>${route.changed}</lastmod></url>`).join('\n') + '\n</urlset>\n';
writeFileSync(join(build, 'sitemap.xml'), xml);
const notFoundFile = join(build, '404.html');
if (!existsSync(notFoundFile)) throw new Error('404.html missing from built output');
const notFound = readFileSync(notFoundFile, 'utf8')
  .replace(/<link\b(?=[^>]*\brel=(?:"canonical"|canonical))[^>]*>/gi, '')
  .replace(/<meta\b(?=[^>]*\bproperty=(?:"og:url"|og:url))[^>]*>/gi, '')
  .replace('</head>', '<meta name="robots" content="noindex"></head>');
if (!notFound.includes('name="robots" content="noindex"') || /<link\b[^>]*\brel=(?:"canonical"|canonical)/i.test(notFound) || /<meta\b[^>]*\bproperty=(?:"og:url"|og:url)/i.test(notFound)) {
  throw new Error('404.html index/canonical contract failed');
}
writeFileSync(notFoundFile, notFound);
const publication = JSON.parse(readFileSync(new URL('./publication.json', import.meta.url), 'utf8'));
const firstFeedItem = JSON.parse(readFileSync(new URL('../src/content/feed-item-en-GB.json', import.meta.url), 'utf8'));
const firstDate = publication.firstFeedPublicationDate;
if (firstDate !== null && (!/^\d{4}-\d{2}-\d{2}$/.test(firstDate) ||
    Number.isNaN(Date.parse(`${firstDate}T00:00:00Z`)) ||
    new Date(`${firstDate}T00:00:00Z`).toISOString().slice(0, 10) !== firstDate ||
    new Date(`${firstDate}T00:00:00Z`) > new Date())) {
  throw new Error('Invalid or future firstFeedPublicationDate');
}
const published = firstDate ? new Date(`${firstDate}T00:00:00Z`).toUTCString() : null;
const firstItem = published ? `<item><title>${escapeXml(firstFeedItem.title)}</title><link>${host}/guide/release-status</link><guid isPermaLink="true">${host}/guide/release-status</guid><pubDate>${published}</pubDate><category>${escapeXml(firstFeedItem.category)}</category><description>${escapeXml(firstFeedItem.body)}</description></item>` : '';
const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Waylock guide updates</title><link>${host}/feed</link><description>Release and guide updates for Waylock.</description><language>en-GB</language>${published ? `<lastBuildDate>${published}</lastBuildDate>` : ''}<atom:link href="${host}/feed.xml" rel="self" type="application/rss+xml"/>${firstItem}</channel></rss>\n`;
writeFileSync(join(build, 'feed.xml'), rss);
if (!existsSync(join(build, 'CNAME'))) throw new Error('CNAME missing from built output');
process.stdout.write(`Verified ${routes.length} routes, sitemap.xml, feed.xml and CNAME.\n`);
