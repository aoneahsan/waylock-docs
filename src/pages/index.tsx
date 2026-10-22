import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';

const guideCards = [
  {
    number: '01',
    title: translate({id: 'home.hold.title', message: 'Hold a delivery stop'}),
    description: translate({id: 'home.hold.description', message: 'Understand a planned position lock and the order around it.'}),
    href: '/guide/route-controls#what-does-holding-a-delivery-stop-do',
  },
  {
    number: '02',
    title: translate({id: 'home.range.title', message: 'Choose a distance range'}),
    description: translate({id: 'home.range.description', message: 'See how a stop can be requested along a stretch of a trip.'}),
    href: '/guide/route-controls#where-can-a-distance-range-stop-go',
  },
  {
    number: '03',
    title: translate({id: 'home.wrongTurn.title', message: 'After a wrong turn'}),
    description: translate({id: 'home.wrongTurn.description', message: 'Learn what the locked route means beside rerouted guidance.'}),
    href: '/guide/route-controls#what-happens-after-a-wrong-turn',
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
          <div className="side-status"><span className="status-dot"/><Translate id="home.status.short">Android app in development</Translate></div>
        </aside>
        <main id="main" className="guide-home-main">
          <section id="overview" className="guide-hero">
            <div className="breadcrumbs"><Translate id="home.crumb.guides">Guides</Translate><span>/</span><Translate id="home.crumb.overview">Overview</Translate></div>
            <div className="hero-grid">
              <div>
                <p className="eyebrow"><Translate id="home.fieldGuide">The Waylock field guide</Translate></p>
                <h1><Translate id="home.heading">Know the route before you go.</Translate></h1>
                <p className="lead"><Translate id="home.intro">These guides explain what Waylock is being built to do and where the Android release stands. A feature is described as available only after it has been checked in the released app.</Translate></p>
                <a className="text-link" href="#availability"><Translate id="home.checkStatus">Check release status</Translate><span aria-hidden="true">↗</span></a>
              </div>
              <div className="route-drawing" aria-hidden="true"><svg viewBox="0 0 380 300"><path className="grid" d="M30 0V300M130 0V300M270 0V300M0 50H380M0 180H380M0 250H380"/><path className="path" d="M35 248 C93 221 75 65 145 90 S225 228 345 38"/><circle cx="35" cy="248" r="12"/><circle cx="145" cy="90" r="12"/><circle cx="345" cy="38" r="12"/></svg><span className="held">03 · <Translate id="home.held">HELD</Translate></span></div>
            </div>
          </section>
          <section id="availability" className="guide-notice">
            <div><span className="notice-label"><Translate id="home.releaseStatus">Release status</Translate></span><h2><Translate id="home.development">Waylock is in development.</Translate></h2><p><Translate id="home.releaseDetail">The Android app is not listed on Google Play yet. Device and service checks are still open. These pages will be updated when the release can be verified.</Translate></p><Link to="/guide/release-status"><Translate id="home.releaseReadMore">Read the release status</Translate> ↗</Link></div>
            <span className="notice-seal" aria-hidden="true">W</span>
          </section>
          <section id="route-controls" className="guide-group">
            <div className="group-heading"><span><Translate id="home.planningIndex">01 / Planning</Translate></span><h2><Translate id="home.routeControls">Route controls</Translate></h2><p><Translate id="home.routeIntro">The app is designed around the stops and route you choose. These guides explain intended controls; live use still needs release verification.</Translate></p></div>
            <div className="guide-cards">{guideCards.map(card => <Link key={card.number} to={card.href}><span>{card.number}</span><h3>{card.title}</h3><p>{card.description}</p><b><Translate id="home.readGuide">Read guide</Translate> ↗</b></Link>)}</div>
          </section>
          <section id="account" className="account-group"><div><span className="group-index"><Translate id="home.accountIndex">02 / Account</Translate></span><h2><Translate id="home.accountHeading">Your account and data</Translate></h2><p><Translate id="home.accountDetail">Read the public legal pages for data handling and the signed-in account deletion path.</Translate></p></div><div className="account-links"><a href="https://waylock.aoneahsan.com/privacy"><Translate id="home.privacy">Privacy Policy</Translate> <span>↗</span></a><a href="https://waylock.aoneahsan.com/terms"><Translate id="home.terms">Terms of Service</Translate> <span>↗</span></a><a href="https://waylock.aoneahsan.com/delete-account"><Translate id="home.deletion">Account deletion</Translate> <span>↗</span></a></div></section>
          <section id="help" className="guide-help"><div><p className="eyebrow"><Translate id="home.helpEyebrow">Still need a hand?</Translate></p><h2><Translate id="home.helpHeading">Ask about Waylock.</Translate></h2><p><Translate id="home.helpDetail">For product or account questions, contact the Waylock team.</Translate></p></div><a href="mailto:aoneahsan@gmail.com">aoneahsan@gmail.com ↗</a></section>
        </main>
      </div>
    </Layout>
  );
}
