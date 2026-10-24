import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {discovery, sitemapPages} from '../content/discovery';

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
    if (!needle) return sitemapPages;
    return sitemapPages.filter(page => {
      const haystack = `${page.title} ${page.description} ${page.tags.join(' ')}`.toLowerCase();
      return haystack.includes(query.toLowerCase()) || haystack.split(/\W+/).some(word => oneEditAway(normalise(word), needle));
    });
  }, [query]);
  return <Layout title={discovery.sitemap.title} description={discovery.sitemap.description}>
    <main className="container margin-vert--lg waylock-index">
      <h1>{discovery.sitemap.title}</h1>
      <p>{discovery.sitemap.intro}</p>
      <div className="waylock-index-files"><a href="/sitemap.xml"><Translate id="sitemap.xml">XML sitemap</Translate></a><a href="/feed.xml"><Translate id="sitemap.rss">RSS feed</Translate></a><a href="/llms.txt">llms.txt</a></div>
      <label htmlFor="guide-search">{discovery.sitemap.search}</label>
      <input id="guide-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={discovery.sitemap.searchHint}/>
      <div className="waylock-index-grid">{visible.map(page => <Link key={page.href} className="waylock-index-card" to={page.href}><span aria-hidden="true">{page.icon}</span><h2>{page.title}</h2><p>{page.description}</p></Link>)}</div>
      {visible.length === 0 && <p>{discovery.sitemap.empty}</p>}
    </main>
  </Layout>;
}
