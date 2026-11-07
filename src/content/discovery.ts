import {translate} from '@docusaurus/Translate';
import firstFeedItem from './feed-item-en-GB.json';

// Approved reader words for the sitemap, feed and topic pages. src/content/publication.json holds their fingerprints.
export const discovery = {
  sitemap: {
    title: translate({id: 'discovery.sitemap.title', message: 'Find a Waylock guide'}),
    description: translate({id: 'discovery.sitemap.description', message: 'Find the release-status, route-control and account guides, or browse them by topic.'}),
    intro: translate({id: 'discovery.sitemap.intro', message: 'Start with the guide for your next question. The Android app is a signed APK on the download page and is not on Google Play yet, so check release status before relying on any planned route control.'}),
    search: translate({id: 'discovery.sitemap.search', message: 'Search pages'}),
    searchHint: translate({id: 'discovery.sitemap.searchHint', message: 'Route, account or release'}),
    empty: translate({id: 'discovery.sitemap.empty', message: 'No guides match that search.'}),
  },
  feed: {
    title: translate({id: 'discovery.feed.title', message: 'Guide updates'}),
    description: translate({id: 'discovery.feed.description', message: "Dated changes to Waylock's public guides and release status."}),
    intro: translate({id: 'discovery.feed.intro', message: 'No guide update has a date yet. When a guide changes, this page will link the dated change to its guide so you can inspect what was verified at that point.'}),
    introDated: translate({id: 'discovery.feed.introDated', message: 'A dated guide update appears below. Open its source guide for the current release position; the item records the change at its publication date, and the guide may change later.'}),
    rss: translate({id: 'discovery.feed.rss', message: 'Subscribe to RSS'}),
    empty: translate({id: 'discovery.feed.empty', message: 'No public updates yet.'}),
    category: translate({id: 'discovery.feed.category', message: firstFeedItem.category}),
    firstTitle: translate({id: 'discovery.feed.firstTitle', message: firstFeedItem.title}),
    firstBody: translate({id: 'discovery.feed.firstBody', message: firstFeedItem.body}),
  },
  topics: {
    title: translate({id: 'discovery.topics.title', message: 'Browse guide topics'}),
    description: translate({id: 'discovery.topics.description', message: 'Choose a topic to reach the Waylock guide that answers it.'}),
    intro: translate({id: 'discovery.topics.intro', message: 'One guide may appear under several topics. Start with release for current availability, routes for planned controls, or account for data and support.'}),
  },
};

export const topicCopy = {
  account: {
    label: translate({id: 'discovery.topic.account.label', message: 'Account'}),
    title: translate({id: 'discovery.topic.account.title', message: 'Account guides'}),
    description: translate({id: 'discovery.topic.account.description', message: 'Find Waylock account and data information.'}),
    intro: translate({id: 'discovery.topic.account.intro', message: 'The account and data guide links to the Privacy Policy, Terms of Service and signed-in deletion page.'}),
    card: translate({id: 'discovery.topic.account.card', message: 'Account and data information.'}),
    sitemapCard: translate({id: 'discovery.topic.account.sitemapCard', message: 'Open the account and data guide.'}),
  },
  android: {
    label: translate({id: 'discovery.topic.android.label', message: 'Android'}),
    title: translate({id: 'discovery.topic.android.title', message: 'Android guides'}),
    description: translate({id: 'discovery.topic.android.description', message: "Check Waylock's current Android status."}),
    intro: translate({id: 'discovery.topic.android.intro', message: 'Waylock is a signed APK on the download page. Read the release-status guide before looking for a verified Google Play listing.'}),
    card: translate({id: 'discovery.topic.android.card', message: 'Current Android release status.'}),
    sitemapCard: translate({id: 'discovery.topic.android.sitemapCard', message: 'Open the current Android release-status guide.'}),
  },
  navigation: {
    label: translate({id: 'discovery.topic.navigation.label', message: 'Navigation'}),
    title: translate({id: 'discovery.topic.navigation.title', message: 'Navigation guides'}),
    description: translate({id: 'discovery.topic.navigation.description', message: 'Read about planned route controls and verification limits.'}),
    intro: translate({id: 'discovery.topic.navigation.intro', message: 'A locked route is planned as a visible overlay while Google Navigation SDK may reroute guidance, so the route-controls guide explains the intended choices even though device proof remains open.'}),
    card: translate({id: 'discovery.topic.navigation.card', message: 'Planned locked-route choices after a wrong turn.'}),
    sitemapCard: translate({id: 'discovery.topic.navigation.sitemapCard', message: 'Open the planned route-controls guide.'}),
  },
  privacy: {
    label: translate({id: 'discovery.topic.privacy.label', message: 'Privacy'}),
    title: translate({id: 'discovery.topic.privacy.title', message: 'Privacy guides'}),
    description: translate({id: 'discovery.topic.privacy.description', message: "Find Waylock's data and deletion links."}),
    intro: translate({id: 'discovery.topic.privacy.intro', message: 'The account and data guide points to the Privacy Policy and signed-in deletion page. The deletion flow has not yet passed a live test.'}),
    card: translate({id: 'discovery.topic.privacy.card', message: 'Legal and signed-in deletion links.'}),
    sitemapCard: translate({id: 'discovery.topic.privacy.sitemapCard', message: 'Open the account and data guide for legal and deletion links.'}),
  },
  release: {
    label: translate({id: 'discovery.topic.release.label', message: 'Release'}),
    title: translate({id: 'discovery.topic.release.title', message: 'Release guides'}),
    description: translate({id: 'discovery.topic.release.description', message: "Check Waylock's current Android availability."}),
    intro: translate({id: 'discovery.topic.release.intro', message: 'The release-status guide records the checks still needed before a public Google Play listing can be confirmed.'}),
    card: translate({id: 'discovery.topic.release.card', message: 'What remains before a verified Play listing.'}),
    sitemapCard: translate({id: 'discovery.topic.release.sitemapCard', message: 'Open the current release-status guide.'}),
  },
  routes: {
    label: translate({id: 'discovery.topic.routes.label', message: 'Routes'}),
    title: translate({id: 'discovery.topic.routes.title', message: 'Route guides'}),
    description: translate({id: 'discovery.topic.routes.description', message: "Read about Waylock's planned route controls."}),
    intro: translate({id: 'discovery.topic.routes.intro', message: 'The route-controls guide covers a stop lock, a distance range and the locked-route overlay. These controls still need device verification.'}),
    card: translate({id: 'discovery.topic.routes.card', message: 'Planned route and stop controls.'}),
    sitemapCard: translate({id: 'discovery.topic.routes.sitemapCard', message: 'Open the planned route-controls guide.'}),
  },
  stops: {
    label: translate({id: 'discovery.topic.stops.label', message: 'Stops'}),
    title: translate({id: 'discovery.topic.stops.title', message: 'Stop guides'}),
    description: translate({id: 'discovery.topic.stops.description', message: 'Read about planned stop order and distance-range choices.'}),
    intro: translate({id: 'discovery.topic.stops.intro', message: 'The route-controls guide explains how a stop lock is intended to hold one planned position while other stops can change order, and how a trip stop is chosen within a distance range. Device proof remains open.'}),
    card: translate({id: 'discovery.topic.stops.card', message: 'Planned stop lock and distance range.'}),
    sitemapCard: translate({id: 'discovery.topic.stops.sitemapCard', message: 'Open the planned stop-lock and distance-range guide.'}),
  },
  support: {
    label: translate({id: 'discovery.topic.support.label', message: 'Support'}),
    title: translate({id: 'discovery.topic.support.title', message: 'Support guides'}),
    description: translate({id: 'discovery.topic.support.description', message: "Find Waylock's account and support contact information."}),
    intro: translate({id: 'discovery.topic.support.intro', message: 'The account and data guide gives the published support address. Account deletion uses the planned signed-in page rather than an email request.'}),
    card: translate({id: 'discovery.topic.support.card', message: 'The published Waylock contact path.'}),
    sitemapCard: translate({id: 'discovery.topic.support.sitemapCard', message: 'Open the account and data guide for the support contact.'}),
  },
} as const;

export type TopicKey = keyof typeof topicCopy;
export const topicKeys = Object.keys(topicCopy) as TopicKey[];
export function isTopicKey(value: string): value is TopicKey {
  return Object.hasOwn(topicCopy, value);
}

export const sitemapPages = [
  {href: '/', title: translate({id: 'discovery.sitemap.overview.title', message: 'Guide overview'}), description: translate({id: 'discovery.sitemap.overview.description', message: "Start with Waylock's current status and the route-control guide index."}), tags: ['overview', 'start'], icon: '⌂'},
  {href: '/guide/release-status', title: translate({id: 'discovery.sitemap.release.title', message: 'Release status'}), description: translate({id: 'discovery.sitemap.release.description', message: 'Check where the signed APK stands and what remains before Google Play.'}), tags: ['release', 'Android'], icon: '◷'},
  {href: '/guide/route-controls', title: translate({id: 'discovery.sitemap.routes.title', message: 'Route controls'}), description: translate({id: 'discovery.sitemap.routes.description', message: 'Read about the planned stop lock, distance range and locked route.'}), tags: ['routes', 'stops'], icon: '◇'},
  {href: '/guide/account-and-data', title: translate({id: 'discovery.sitemap.account.title', message: 'Account and data'}), description: translate({id: 'discovery.sitemap.account.description', message: 'Find the legal pages, support contact and signed-in deletion path.'}), tags: ['privacy', 'account'], icon: '□'},
  {href: '/guide/compare', title: translate({id: 'discovery.sitemap.compare.title', message: 'Moving from another app'}), description: translate({id: 'discovery.sitemap.compare.description', message: 'How twenty other route and road trip apps differ from Waylock, and where to start here.'}), tags: ['routes', 'compare'], icon: '↔'},
  {href: '/feed', title: translate({id: 'discovery.sitemap.feed.title', message: 'Guide updates'}), description: translate({id: 'discovery.sitemap.feed.description', message: 'Read dated guide changes once a public update exists.'}), tags: ['updates', 'feed'], icon: '↗'},
  {href: '/guide/tags', title: translate({id: 'discovery.sitemap.topics.title', message: 'All topics'}), description: translate({id: 'discovery.sitemap.topics.description', message: 'Browse the published guides by topic.'}), tags: ['topics'], icon: '▦'},
  ...topicKeys.map(key => ({href: `/guide/tags/${key}`, title: topicCopy[key].title, description: topicCopy[key].sitemapCard, tags: [key, 'topics'], icon: '◇'})),
];
