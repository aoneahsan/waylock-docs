import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import {GuideByline} from '../components/ReleaseFacts';

const guideCards = [
  {
    number: '01',
    title: translate({id: 'home.hold.title', message: 'Hold a delivery stop'}),
    description: translate({id: 'home.hold.description', message: 'Keep a chosen stop in its position while reviewing an estimated order for the other stops.'}),
    href: '/guide/route-controls#how-would-i-keep-a-delivery-stop-in-position',
  },
  {
    number: '02',
    title: translate({id: 'home.range.title', message: 'Choose a distance range'}),
    description: translate({id: 'home.range.description', message: 'Look for a matching trip stop within a range measured from the origin or a previous stop.'}),
    href: '/guide/route-controls#how-would-i-choose-a-stop-within-a-distance-range',
  },
  {
    number: '03',
    title: translate({id: 'home.wrongTurn.title', message: 'Respond to a wrong turn'}),
    description: translate({id: 'home.wrongTurn.description', message: 'Review your chosen route as an overlay while Google Navigation SDK may reroute guidance, then choose a way back or a new route when stopped.'}),
    href: '/guide/route-controls#what-would-happen-after-a-wrong-turn',
  },
];

export default function Home(): React.JSX.Element {
  return (
    <Layout title={translate({id: 'home.meta.title', message: 'Know the route before you go'})} description={translate({id: 'home.meta.description', message: 'Waylock guides explain planned route controls and the current Android release status.'})}>
      <div className="guide-shell">
        <aside className="guide-home-sidebar" aria-label={translate({id: 'home.navigation.label', message: 'Guide navigation'})}>
          <p className="side-heading"><Translate id="home.startHere">Start here</Translate></p>
          <nav>
            <a aria-current="page" href="#overview"><Translate id="home.nav.overview">Overview</Translate></a>
            <a href="#availability"><Translate id="home.nav.availability">Availability</Translate></a>
            <a href="#route-controls"><Translate id="home.nav.routeControls">Route controls</Translate></a>
            <a href="#account"><Translate id="home.nav.account">Account and data</Translate></a>
            <a href="#help"><Translate id="home.nav.help">Get help</Translate></a>
          </nav>
          <div className="side-status"><span className="status-dot"/><Translate id="home.status.short">Android app: signed APK</Translate></div>
        </aside>
        <main id="main" className="guide-home-main">
          <section id="overview" className="guide-hero">
            <div className="breadcrumbs"><Translate id="home.crumb.guides">Guides</Translate><span>/</span><Translate id="home.crumb.overview">Overview</Translate></div>
            <div className="hero-grid">
              <div>
                <p className="eyebrow"><Translate id="home.fieldGuide">The Waylock field guide</Translate></p>
                <h1><Translate id="home.heading">Know the route before you go</Translate></h1>
                <GuideByline path="/"/>
                <p className="lead"><Translate id="home.intro">You may need one delivery stop to stay in place, or a clear choice after a wrong turn. These guides explain Waylock's planned route controls and where its Android release stands.</Translate></p>
                <a className="text-link" href="#availability"><Translate id="home.checkStatus">Check release status</Translate><span aria-hidden="true">↗</span></a>
              </div>
              <div className="route-drawing" aria-hidden="true"><svg viewBox="0 0 380 300"><path className="grid" d="M30 0V300M130 0V300M270 0V300M0 50H380M0 180H380M0 250H380"/><path className="path" d="M35 248 C93 221 75 65 145 90 S225 228 345 38"/><circle cx="35" cy="248" r="12"/><circle cx="145" cy="90" r="12"/><circle cx="345" cy="38" r="12"/></svg><span className="held">03 · <Translate id="home.held">HELD</Translate></span></div>
            </div>
          </section>
          <section id="availability" className="guide-notice">
            <div><span className="notice-label"><Translate id="home.releaseStatus">Release status</Translate></span><h2><Translate id="home.development">Is Waylock available yet?</Translate></h2><p><Translate id="home.releaseDetail" values={{downloadPage: <a href="https://waylock.aoneahsan.com/download"><Translate id="home.downloadPage">download page</Translate></a>}}>{'Yes, as a signed APK for Android 8.0 or newer on the {downloadPage}. Waylock is not on Google Play yet. These guides change when a release does. Device checks on the route controls remain open, so until those checks pass, these guides describe planned controls rather than steps you can rely on.'}</Translate></p><Link to="/guide/release-status"><Translate id="home.releaseReadMore">Read the current release status</Translate> ↗</Link></div>
            <span className="notice-seal" aria-hidden="true">W</span>
          </section>
          <section id="route-controls" className="guide-group">
            <div className="group-heading"><span><Translate id="home.planningIndex">01 / Planning</Translate></span><h2><Translate id="home.routeControls">Which route control do you want to understand?</Translate></h2><p><Translate id="home.routeIntro" values={{routeControls: <Link to="/guide/route-controls"><Translate id="home.routeIntroLink">route controls</Translate></Link>}}>{'Start with {routeControls}. Three choices are planned:'}</Translate></p></div>
            <div className="guide-cards">{guideCards.map(card => <Link key={card.number} to={card.href}><span>{card.number}</span><h3>{card.title}</h3><p>{card.description}</p><b><Translate id="home.readGuide">Read guide</Translate> ↗</b></Link>)}</div>
            <p className="guide-cards-note"><Translate id="home.routeLimits">The controls still need device and released-app verification. Check an estimated order and its constraints before setting off. Times are estimates.</Translate></p>
          </section>
          <section id="account" className="account-group"><div><span className="group-index"><Translate id="home.accountIndex">02 / Account</Translate></span><h2><Translate id="home.accountHeading">Where are account and data details?</Translate></h2><p><Translate id="home.accountDetail" values={{accountData: <Link to="/guide/account-and-data"><Translate id="home.accountGuide">Account and data</Translate></Link>, privacy: <a href="https://waylock.aoneahsan.com/privacy"><Translate id="home.accountPrivacy">Privacy Policy</Translate></a>, terms: <a href="https://waylock.aoneahsan.com/terms"><Translate id="home.accountTerms">Terms of Service</Translate></a>, deletion: <a href="https://waylock.aoneahsan.com/delete-account"><Translate id="home.accountDeletion">account deletion page</Translate></a>, plans: <a href="https://waylock.aoneahsan.com/plans"><Translate id="home.accountPlans">website</Translate></a>}}>{"{accountData} links to Waylock's {privacy}, {terms} and {deletion}. The deletion flow requires you to sign in and confirm with Google again, whether you use the website after uninstalling or the Android app. A requested deletion waits 7 days, and you can cancel it during that wait. Both paths still need live verification. Plans are bought on the {plans} through Polar, not in the app."}</Translate></p></div><div className="account-links"><a href="https://waylock.aoneahsan.com/privacy"><Translate id="home.privacy">Privacy Policy</Translate> <span>↗</span></a><a href="https://waylock.aoneahsan.com/terms"><Translate id="home.terms">Terms of Service</Translate> <span>↗</span></a><a href="https://waylock.aoneahsan.com/delete-account"><Translate id="home.deletion">Account deletion</Translate> <span>↗</span></a></div></section>
          <section id="help" className="guide-help"><div><h2><Translate id="home.helpHeading">Need help with Waylock?</Translate></h2><p><Translate id="home.helpDetail" values={{email: <a href="mailto:aoneahsan@gmail.com">aoneahsan@gmail.com</a>}}>{'For an ordinary product, account or legal question, email {email}. Account deletion will use the signed-in flow, not email. Choose the guide that matches your next step.'}</Translate></p></div></section>
        </main>
      </div>
    </Layout>
  );
}
