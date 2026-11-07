import publication from '../../scripts/publication.json';
import pageDates from '../../scripts/page-dates.json';

/** Formats a stored YYYY-MM-DD day the way every Waylock guide prints a date. */
export function formatGuideDate(day: string): string {
  return new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'})
    .format(new Date(`${day}T00:00:00Z`));
}

/** The day the signed APK and the release-status wording go live. Unset until that day: no feed item, no dated claim. */
export const firstPublicationDate = publication.firstFeedPublicationDate as string | null;
export const signedBuildVersion = publication.signedBuildVersion as string | null;
export const signedBuildVersionCode = publication.signedBuildVersionCode as number | null;

/** The day a page's words last changed: the same ledger the sitemap's lastmod reads. */
export function pageUpdatedOn(path: keyof typeof pageDates): string {
  return formatGuideDate(pageDates[path].updated);
}
