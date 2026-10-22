import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';

const pages = [
  {href: '/', title: translate({id: 'sitemap.overview.title', message: 'Guide overview'}), description: translate({id: 'sitemap.overview.description', message: 'Start with the current status and the route-control guide index.'}), tags: ['overview', 'start'], icon: '⌂'},
  {href: '/guide/release-status', title: translate({id: 'sitemap.release.title', message: 'Release status'}), description: translate({id: 'sitemap.release.description', message: 'Check whether Waylock is available on Google Play.'}), tags: ['release', 'Android'], icon: '◷'},
  {href: '/guide/route-controls', title: translate({id: 'sitemap.routes.title', message: 'Route controls'}), description: translate({id: 'sitemap.routes.description', message: 'Read about the planned stop lock, distance range and locked route.'}), tags: ['routes', 'stops'], icon: '◇'},
  {href: '/guide/account-and-data', title: translate({id: 'sitemap.account.title', message: 'Account and data'}), description: translate({id: 'sitemap.account.description', message: 'Find the Privacy Policy, Terms and deletion request path.'}), tags: ['privacy', 'account'], icon: '□'},
  {href: '/feed', title: translate({id: 'sitemap.updates.title', message: 'Guide updates'}), description: translate({id: 'sitemap.updates.description', message: 'Read the latest published guide status.'}), tags: ['updates', 'feed'], icon: '↗'},
  {href: '/guide/tags', title: translate({id: 'sitemap.topics.title', message: 'All topics'}), description: translate({id: 'sitemap.topics.description', message: 'Browse Waylock guides by topic.'}), tags: ['topics'], icon: '▦'},
  ...['account', 'android', 'navigation', 'privacy', 'release', 'routes', 'stops', 'support'].map(topic => ({href: `/guide/tags/${topic}`, title: translate({id: `sitemap.topic.${topic}`, message: `${topic[0].toUpperCase()}${topic.slice(1)} guides`}), description: translate({id: `sitemap.topic.${topic}.description`, message: `Browse guides tagged ${topic}.`}), tags: [topic, 'topics'], icon: '◇'})),
];

function normalise(value: string): string {return value.toLowerCase().replace(/[^a-z0-9]/g, '');}
function oneEditAway(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0; let j = 0; let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {i++; j++; continue;}
    edits++;
    if (edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {i++; j++;}
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

export default function Sitemap(): React.JSX.Element {
  const [query, setQuery] = useState('');
  const visible = useMemo(() => {
    const needle = normalise(query);
    if (!needle) return pages;
    return pages.filter(page => {
      const haystack = `${page.title} ${page.description} ${page.tags.join(' ')}`.toLowerCase();
      return haystack.includes(query.toLowerCase()) || haystack.split(/\W+/).some(word => oneEditAway(normalise(word), needle));
    });
  }, [query]);
  return <Layout title={translate({id: 'sitemap.meta', message: 'Sitemap'})} description={translate({id: 'sitemap.description', message: 'Find every public Waylock guide and discovery file.'})}>
    <main className="container margin-vert--lg waylock-index">
      <h1><Translate id="sitemap.title">Find a Waylock guide</Translate></h1>
      <p><Translate id="sitemap.intro">Browse the guides and the machine-readable site files.</Translate></p>
      <div className="waylock-index-files"><a href="/sitemap.xml"><Translate id="sitemap.xml">XML sitemap</Translate></a><a href="/feed.xml"><Translate id="sitemap.rss">RSS feed</Translate></a><a href="/llms.txt">llms.txt</a></div>
      <label htmlFor="guide-search"><Translate id="sitemap.search">Search pages</Translate></label>
      <input id="guide-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={translate({id: 'sitemap.placeholder', message: 'Route, account or release'})}/>
      <div className="waylock-index-grid">{visible.map(page => <Link key={page.href} className="waylock-index-card" to={page.href}><span aria-hidden="true">{page.icon}</span><h2>{page.title}</h2><p>{page.description}</p><small>{page.tags.join(' · ')}</small></Link>)}</div>
      {visible.length === 0 && <p><Translate id="sitemap.empty">No guides match that search.</Translate></p>}
    </main>
  </Layout>;
}
