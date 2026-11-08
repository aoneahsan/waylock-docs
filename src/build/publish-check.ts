import {readFileSync} from 'node:fs';
import {join} from 'node:path';

type Gate = {
  status?: string;
  firstFeedPublicationDate?: string | null;
  signedBuildVersion?: string | null;
  signedBuildVersionCode?: number | null;
  utilityApprovedWords?: Record<string, string>;
} & Record<string, unknown>;

const required = [
  'routeControlsStoryGate4',
  'accountDataStoryGate4',
  'utilityStoryGate4',
  'websiteLegalLinksLive',
];

/**
 * Refuses a deploy unless Story Gate 4, the signed build's facts, the feed date and the live linked pages are all real.
 * Device and deletion proof never hold the cautious wording back; recorded proof makes that wording the failure.
 */
export async function checkPublication({siteDir, outDir}: {siteDir: string; outDir: string}): Promise<void> {
  const gate = JSON.parse(readFileSync(join(siteDir, 'src/content/publication.json'), 'utf8')) as Gate;
  const pending = required.filter(key => gate[key] !== true);
  for (const [flag, line] of [['signedDeviceRouteProof', 'Device proof is still missing.'],
    ['hostedDeletionAndStatusProof', 'has not yet passed a live deletion test']] as const) {
    const claimed = ['release-status', 'route-controls', 'account-and-data']
      .some(page => readFileSync(join(siteDir, `docs/${page}.md`), 'utf8').includes(line));
    if (gate[flag] === true && claimed) throw new Error(`Proof is recorded for ${flag}, but the guides still say: ${line}`);
  }
  if (gate.status !== 'approved' || pending.length !== 0 || !/^\d{4}-\d{2}-\d{2}$/.test(gate.firstFeedPublicationDate ?? '')) {
    throw new Error(`Docs publication held: ${pending.join(', ') || gate.status}. Record exact proof and Story Gate 4 before deployment.`);
  }
  const published = new Date(`${gate.firstFeedPublicationDate}T00:00:00Z`);
  if (Number.isNaN(published.getTime()) || published.toISOString().slice(0, 10) !== gate.firstFeedPublicationDate || published > new Date()) {
    throw new Error('Invalid or future firstFeedPublicationDate');
  }
  const dates = JSON.parse(readFileSync(join(siteDir, 'src/content/page-dates.json'), 'utf8')) as Record<string, {updated: string; words: string}>;
  if (!gate.signedBuildVersion || !Number.isInteger(gate.signedBuildVersionCode)) {
    throw new Error('Record signedBuildVersion and signedBuildVersionCode from the signed build before deployment');
  }
  if (dates['/guide/release-status'].updated < (gate.firstFeedPublicationDate as string)) {
    throw new Error('/guide/release-status: last-updated date is older than its first publication date');
  }
  for (const path of Object.keys(dates).filter(path => path === '/sitemap' || path === '/feed' || path.startsWith('/guide/tags'))) {
    if (gate.utilityApprovedWords?.[path] !== dates[path].words) {
      throw new Error(`${path}: utility-page words differ from exact Story Gate 4 approval`);
    }
  }
  for (const [path, key] of [
    ['/guide/route-controls', 'routeControlsApprovedWords'],
    ['/guide/account-and-data', 'accountDataApprovedWords'],
  ] as const) {
    if (gate[key] !== dates[path]?.words) throw new Error(`${path}: rendered words differ from exact Story Gate 4 approval`);
  }
  const feed = readFileSync(join(outDir, 'feed.xml'), 'utf8');
  const feedPage = readFileSync(join(outDir, 'feed.html'), 'utf8');
  const displayDate = new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(published);
  if (!feed.includes(`<pubDate>${published.toUTCString()}</pubDate>`) || !feedPage.includes(displayDate)) {
    throw new Error('Feed date differs from approved first publication date');
  }
  // /account is a signed-in page and stays noindex by design; the public pages must be indexable.
  const signedIn = new Set(['/account']);
  for (const path of ['/privacy', '/terms', '/delete-account', '/download', '/plans', '/account']) {
    const url = `https://waylock.aoneahsan.com${path}`;
    const response = await fetch(url, {signal: AbortSignal.timeout(10000)});
    const html = await response.text();
    const indexBlocked = /<meta[^>]+(?:noindex|nofollow)/i.test(html) && !signedIn.has(path);
    if (!response.ok || new URL(response.url).origin !== 'https://waylock.aoneahsan.com' ||
        indexBlocked || /REVIEW CANDIDATE|DO NOT PUBLISH/i.test(html) || !html.includes('<main')) {
      throw new Error(`${url}: live linked page is unavailable or still a review page`);
    }
  }
}
