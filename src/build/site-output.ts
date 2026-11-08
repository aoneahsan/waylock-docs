import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const host = 'https://waylock-docs.aoneahsan.com';

type Route = {path: string; file: string};
type LedgerEntry = {updated: string; words: string};
type Ledger = Record<string, LedgerEntry>;
type SitePaths = {siteDir: string; outDir: string};

const escapeXml = (text: string): string => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function listRoutes(outDir: string): Route[] {
  const routes: Route[] = [
    {path: '/', file: 'index.html'},
    {path: '/guide/release-status', file: 'guide/release-status.html'},
    {path: '/guide/route-controls', file: 'guide/route-controls.html'},
    {path: '/guide/account-and-data', file: 'guide/account-and-data.html'},
    {path: '/sitemap', file: 'sitemap.html'},
    {path: '/feed', file: 'feed.html'},
  ];
  for (const name of readdirSync(join(outDir, 'guide/tags'))) {
    if (name.endsWith('.html')) routes.push({path: `/guide/tags/${name.slice(0, -5)}`, file: `guide/tags/${name}`});
  }
  routes.push({path: '/guide/tags', file: 'guide/tags.html'});
  routes.push({path: '/guide/compare', file: 'guide/compare.html'});
  for (const name of readdirSync(join(outDir, 'guide/compare'))) {
    if (name.endsWith('.html')) routes.push({path: `/guide/compare/${name.slice(0, -5)}`, file: `guide/compare/${name}`});
  }
  return routes;
}

function fingerprint(html: string): string {
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
}

/** Reads one built route and refuses a wrong canonical or a stray noindex, then returns its words fingerprint. */
function inspectRoute(outDir: string, route: Route): string {
  const file = join(outDir, route.file);
  if (!existsSync(file)) throw new Error(`Missing built route: ${file}`);
  const html = readFileSync(file, 'utf8');
  const canonical = html.match(/<link[^>]*rel=(?:"canonical"|canonical)[^>]*>/)?.[0] ?? '';
  if (!canonical.includes(`href=${host}${route.path}`) && !canonical.includes(`href="${host}${route.path}"`)) throw new Error(`Canonical mismatch: ${route.path}`);
  if (html.includes('noindex')) throw new Error(`Unexpected noindex: ${route.path}`);
  return fingerprint(html);
}

/** Prints the page ledger the current build would need, for updating src/content/page-dates.json after a words change. */
export function printLedger({siteDir, outDir}: SitePaths): void {
  const ledger = readJson<Ledger>(join(siteDir, 'src/content/page-dates.json'));
  const next: Record<string, {updated: string; words: string}> = {};
  for (const route of listRoutes(outDir)) {
    next[route.path] = {updated: ledger[route.path]?.updated ?? 'SET-MEANINGFUL-CONTENT-DATE', words: inspectRoute(outDir, route)};
  }
  process.stdout.write(`${JSON.stringify(next, null, 2)}\n`);
}

function writeSitemap(outDir: string, routes: Array<Route & {changed: string}>): void {
  const urls = routes.filter(route => !route.path.startsWith('/guide/tags')).map(route => `  <url><loc>${escapeXml(host + route.path)}</loc><lastmod>${route.changed}</lastmod></url>`);
  writeFileSync(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
}

function writeNotFound(outDir: string): void {
  const file = join(outDir, '404.html');
  if (!existsSync(file)) throw new Error('404.html missing from built output');
  const notFound = readFileSync(file, 'utf8')
    .replace(/<link\b(?=[^>]*\brel=(?:"canonical"|canonical))[^>]*>/gi, '')
    .replace(/<meta\b(?=[^>]*\bproperty=(?:"og:url"|og:url))[^>]*>/gi, '')
    .replace('</head>', '<meta name="robots" content="noindex"></head>');
  if (!notFound.includes('name="robots" content="noindex"') || /<link\b[^>]*\brel=(?:"canonical"|canonical)/i.test(notFound) || /<meta\b[^>]*\bproperty=(?:"og:url"|og:url)/i.test(notFound)) {
    throw new Error('404.html index/canonical contract failed');
  }
  writeFileSync(file, notFound);
}

function writeFeed({siteDir, outDir}: SitePaths): void {
  const firstDate = readJson<{firstFeedPublicationDate: string | null}>(join(siteDir, 'src/content/publication.json')).firstFeedPublicationDate;
  const firstFeedItem = readJson<{category: string; title: string; body: string}>(join(siteDir, 'src/content/feed-item-en-GB.json'));
  if (firstDate !== null && (!/^\d{4}-\d{2}-\d{2}$/.test(firstDate) ||
      Number.isNaN(Date.parse(`${firstDate}T00:00:00Z`)) ||
      new Date(`${firstDate}T00:00:00Z`).toISOString().slice(0, 10) !== firstDate ||
      new Date(`${firstDate}T00:00:00Z`) > new Date())) {
    throw new Error('Invalid or future firstFeedPublicationDate');
  }
  const published = firstDate ? new Date(`${firstDate}T00:00:00Z`).toUTCString() : null;
  const firstItem = published ? `<item><title>${escapeXml(firstFeedItem.title)}</title><link>${host}/guide/release-status</link><guid isPermaLink="true">${host}/guide/release-status</guid><pubDate>${published}</pubDate><category>${escapeXml(firstFeedItem.category)}</category><description>${escapeXml(firstFeedItem.body)}</description></item>` : '';
  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Waylock guide updates</title><link>${host}/feed</link><description>Dated changes to Waylock's public guides and release status.</description><language>en-GB</language>${published ? `<lastBuildDate>${published}</lastBuildDate>` : ''}<atom:link href="${host}/feed.xml" rel="self" type="application/rss+xml"/>${firstItem}</channel></rss>\n`;
  writeFileSync(join(outDir, 'feed.xml'), rss);
}

/**
 * GitHub Pages answers `/guide/x/` from `guide/x/index.html`, so each page gets a tiny noindexed hop to its clean URL.
 * Without it, the slash variant of a shared link is a 404.
 */
function writeSlashRedirects(outDir: string, routes: Route[]): void {
  for (const route of routes.filter(item => item.path !== '/')) {
    const target = escapeXml(host + route.path);
    mkdirSync(join(outDir, route.path.slice(1)), {recursive: true});
    writeFileSync(join(outDir, route.path.slice(1), 'index.html'),
      `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${target}"><meta http-equiv="refresh" content="0; url=${target}"><title>Waylock guides</title></head><body><a href="${target}">${target}</a></body></html>`);
  }
}

/**
 * Holds every built page to its recorded words and date, then writes sitemap.xml, feed.xml and the noindexed 404.
 * Runs synchronously so a concurrent postBuild hook never reads a half-written file.
 */
export function verifyAndWriteSiteOutput({siteDir, outDir}: SitePaths): void {
  const ledger = readJson<Ledger>(join(siteDir, 'src/content/page-dates.json'));
  const routes = listRoutes(outDir).map(route => {
    const words = inspectRoute(outDir, route);
    const saved = ledger[route.path];
    if (!saved || saved.words !== words || !/^\d{4}-\d{2}-\d{2}$/.test(saved.updated) || new Date(saved.updated) > new Date()) {
      throw new Error(`${route.path}: page words/date differ from src/content/page-dates.json. Current words fingerprint: ${words}`);
    }
    return {...route, changed: saved.updated};
  });
  if (Object.keys(ledger).length !== routes.length) throw new Error('page-dates.json includes a stale or missing route');
  writeSitemap(outDir, routes);
  writeNotFound(outDir);
  writeSlashRedirects(outDir, routes);
  writeFeed({siteDir, outDir});
  if (!existsSync(join(outDir, 'CNAME'))) throw new Error('CNAME missing from built output');
  process.stdout.write(`Verified ${routes.length} routes, sitemap.xml, feed.xml and CNAME.\n`);
}
