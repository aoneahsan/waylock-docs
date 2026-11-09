import publication from './publication.json';
import pageDates from './page-dates.json';

/** Formats a stored YYYY-MM-DD day the way every Waylock guide prints a date. */
export function formatGuideDate(day: string): string {
  return new Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'})
    .format(new Date(`${day}T00:00:00Z`));
}

/** First public docs update date; the release status may later change without changing this historical date. */
export const firstPublicationDate = publication.firstFeedPublicationDate as string | null;
export const signedBuildVersion = publication.signedBuildVersion as string | null;
export const signedBuildVersionCode = publication.signedBuildVersionCode as number | null;

/** The day a page's words last changed: the same ledger the sitemap's lastmod reads. */
export function pageUpdatedOn(path: keyof typeof pageDates): string {
  return formatGuideDate(pageDates[path].updated);
}
