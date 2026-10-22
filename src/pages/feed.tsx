import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';

export default function Feed(): React.JSX.Element {
  return <Layout title={translate({id: 'feed.title', message: 'Guide updates'})} description={translate({id: 'feed.description', message: 'Updates to Waylock release and guide information.'})}>
    <main className="container margin-vert--lg waylock-index">
      <h1><Translate id="feed.heading">Guide updates</Translate></h1>
      <p><Translate id="feed.intro">The first public update records Waylock's pre-release status. Subscribe to the RSS feed for later guide changes.</Translate></p>
      <p><a href="/feed.xml"><Translate id="feed.rss">Subscribe to RSS</Translate></a></p>
      <article className="waylock-index-card"><small><Translate id="feed.first.date">21 October 2026 · Release</Translate></small><h2><Link to="/guide/release-status"><Translate id="feed.first.title">Waylock is in development</Translate></Link></h2><p><Translate id="feed.first.body">The Android app is not listed on Google Play yet. The release-status guide records what is still being checked.</Translate></p></article>
    </main>
  </Layout>;
}
