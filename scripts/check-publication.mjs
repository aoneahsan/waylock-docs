import {readFileSync} from 'node:fs';

const gate = JSON.parse(readFileSync(new URL('./publication.json', import.meta.url), 'utf8'));
const required = [
  'routeControlsStoryGate4',
  'accountDataStoryGate4',
  'signedDeviceRouteProof',
  'hostedDeletionAndStatusProof',
  'websiteLegalLinksLive',
];
const pending = required.filter(key => gate[key] !== true);
if (gate.status !== 'approved' || pending.length !== 0 || !/^\d{4}-\d{2}-\d{2}$/.test(gate.firstFeedPublicationDate ?? '')) {
  throw new Error(`Docs publication held: ${pending.join(', ') || gate.status}. Record exact proof and Story Gate 4 before deployment.`);
}
const published = new Date(`${gate.firstFeedPublicationDate}T00:00:00Z`);
if (Number.isNaN(published.getTime())) throw new Error('Invalid firstFeedPublicationDate');
const feed = readFileSync(new URL('../build/feed.xml', import.meta.url), 'utf8');
const feedPage = readFileSync(new URL('../build/feed.html', import.meta.url), 'utf8');
const displayDate = new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(published);
if (!feed.includes(`<pubDate>${published.toUTCString()}</pubDate>`) || !feedPage.includes(displayDate)) {
  throw new Error('Feed date differs from approved first publication date');
}
