import React from 'react';
import {firstPublicationDate, formatGuideDate, pageUpdatedOn, signedBuildVersion, signedBuildVersionCode} from '../content/publication';

type GuideBylineProps = {path: Parameters<typeof pageUpdatedOn>[0]};

/** The approved byline, dated from the page ledger so the page and its lastmod never disagree. */
export function GuideByline({path}: GuideBylineProps): React.JSX.Element {
  return <p className="guide-byline">By the Waylock team · Last updated: {pageUpdatedOn(path)}</p>;
}

/** The dated half of the Play sentence. It stays silent until someone has checked the listing on a recorded day. */
export function PlayCheckedOn(): React.JSX.Element | null {
  return firstPublicationDate ? <>{` as of ${formatGuideDate(firstPublicationDate)}`}</> : null;
}

/** Names the build only when the signed build's version is recorded. publish:check refuses a deploy without it. */
export function BuildStatus(): React.JSX.Element {
  const identity = signedBuildVersion && signedBuildVersionCode
    ? `The current Android build identifies itself as version ${signedBuildVersion} (code ${signedBuildVersionCode}), but its route controls`
    : "The current Android build's route controls";
  return <>{identity} still need device checks before these guides can give steps, and Play submission remains open.</>;
}
