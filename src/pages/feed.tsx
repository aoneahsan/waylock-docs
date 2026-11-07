import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {discovery} from '../content/discovery';
import {firstPublicationDate, formatGuideDate} from '../content/publication';

const displayDate = firstPublicationDate ? formatGuideDate(firstPublicationDate) : null;

export default function Feed(): React.JSX.Element {
  return <Layout title={discovery.feed.title} description={discovery.feed.description}>
    <main className="container margin-vert--lg waylock-index">
      <h1>{discovery.feed.title}</h1>
      <p>{displayDate ? discovery.feed.introDated : discovery.feed.intro}</p>
      <p><a href="/feed.xml">{discovery.feed.rss}</a></p>
      {displayDate ? <article className="waylock-index-card"><small>{displayDate} · {discovery.feed.category}</small><h2><Link to="/guide/release-status">{discovery.feed.firstTitle}</Link></h2><p>{discovery.feed.firstBody}</p></article> : <p>{discovery.feed.empty}</p>}
    </main>
  </Layout>;
}
