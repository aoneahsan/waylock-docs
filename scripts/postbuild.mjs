import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const host = 'https://waylock-docs.aoneahsan.com';
const build = new URL('../build/', import.meta.url).pathname;
const routes = [
  {path: '/', file: 'index.html', changed: '2026-10-21'},
  {path: '/guide/release-status', file: 'guide/release-status.html', changed: '2026-10-21'},
  {path: '/guide/route-controls', file: 'guide/route-controls.html', changed: '2026-10-21'},
  {path: '/guide/account-and-data', file: 'guide/account-and-data.html', changed: '2026-10-21'},
  {path: '/sitemap', file: 'sitemap.html', changed: '2026-10-21'},
  {path: '/feed', file: 'feed.html', changed: '2026-10-21'},
];
const tagsDir = join(build, 'guide/tags');
for (const name of readdirSync(tagsDir)) {
  if (name.endsWith('.html')) routes.push({path: `/guide/tags/${name.slice(0, -5)}`, file: `guide/tags/${name}`, changed: '2026-10-21'});
}
routes.push({path: '/guide/tags', file: 'guide/tags.html', changed: '2026-10-21'});
const escapeXml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
for (const route of routes) {
  const file = join(build, route.file);
  if (!existsSync(file)) throw new Error(`Missing built route: ${file}`);
  const html = readFileSync(file, 'utf8');
  const canonical = html.match(/<link[^>]*rel=(?:"canonical"|canonical)[^>]*>/)?.[0] ?? '';
  if (!canonical.includes(`href=${host}${route.path}`) && !canonical.includes(`href="${host}${route.path}"`)) throw new Error(`Canonical mismatch: ${route.path}`);
  if (html.includes('noindex')) throw new Error(`Unexpected noindex: ${route.path}`);
}
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + routes.map(route => `  <url><loc>${escapeXml(host + route.path)}</loc><lastmod>${route.changed}</lastmod></url>`).join('\n') + '\n</urlset>\n';
writeFileSync(join(build, 'sitemap.xml'), xml);
const published = new Date('2026-10-21T00:00:00Z').toUTCString();
const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Waylock guide updates</title><link>${host}/feed</link><description>Release and guide updates for Waylock.</description><language>en-GB</language><lastBuildDate>${published}</lastBuildDate><atom:link href="${host}/feed.xml" rel="self" type="application/rss+xml"/><item><title>Waylock is in development</title><link>${host}/guide/release-status</link><guid isPermaLink="true">${host}/guide/release-status</guid><pubDate>${published}</pubDate><category>Release</category><description>The Android app is not listed on Google Play yet. Read the current release status.</description></item></channel></rss>\n`;
writeFileSync(join(build, 'feed.xml'), rss);
if (!existsSync(join(build, 'CNAME'))) throw new Error('CNAME missing from built output');
process.stdout.write(`Verified ${routes.length} routes, sitemap.xml, feed.xml and CNAME.\n`);
