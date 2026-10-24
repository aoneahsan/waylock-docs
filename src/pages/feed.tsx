import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import publication from '../../scripts/publication.json';

const firstPublicationDate = publication.firstFeedPublicationDate;
const displayDate = firstPublicationDate
  ? new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'})
      .format(new Date(`${firstPublicationDate}T00:00:00Z`))
  : null;

export default function Feed(): React.JSX.Element {
  return <Layout title={translate({id: 'feed.title', message: 'Guide updates'})} description={translate({id: 'feed.description', message: 'Updates to Waylock release and guide information.'})}>
    <main className="container margin-vert--lg waylock-index">
      <h1><Translate id="feed.heading">Guide updates</Translate></h1>
      <p><Translate id="feed.intro">Public guide updates will appear here when this site is released.</Translate></p>
      <p><a href="/feed.xml"><Translate id="feed.rss">Subscribe to RSS</Translate></a></p>
      {displayDate ? <article className="waylock-index-card"><small>{displayDate} · <Translate id="feed.first.category">Release</Translate></small><h2><Link to="/guide/release-status"><Translate id="feed.first.title">Waylock is in development</Translate></Link></h2><p><Translate id="feed.first.body">The Android app is not listed on Google Play yet. The release-status guide records what is still being checked.</Translate></p></article> : <p><Translate id="feed.empty">No public updates yet.</Translate></p>}
    </main>
  </Layout>;
}
