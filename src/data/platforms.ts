/**
 * Every place Waylock is released — the ONLY place a store or surface URL lives in this docs site
 * (standard aoneahsan-cccs-platform-links). Each surface passed its release proof on `verified`:
 * the website and this site answered 200. The Android app is in internal testing, so it is not listed.
 */
export type PlatformId = 'web' | 'docs';

export interface Platform {
  id: PlatformId;
  /** Store or surface name (a proper name, not copy). */
  name: string;
  href: string;
  /** What this surface is for, in Waylock's words. */
  title: string;
  text: string;
  cta: string;
  primary?: boolean;
  verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {id: 'web', name: 'Waylock website', href: 'https://waylock.aoneahsan.com', title: 'The website', text: 'What Waylock is for, its plans, and your account.', cta: 'Open the website', primary: true, verified: '2026-11-20'},
  {id: 'docs', name: 'Guides', href: 'https://waylock-docs.aoneahsan.com', title: 'These guides', text: 'The planned route controls and where the Android release stands.', cta: 'Read the guides', verified: '2026-11-20'},
];

export const APPS_PAGE = {
  title: 'Get Waylock',
  description: 'Every place Waylock is released: the website and these guides.',
  lead: 'Waylock for Android is in internal testing, so it is not listed here yet. Read about it on the website, and keep these guides a tab away.',
} as const;

/** This site is the docs surface. */
export const CURRENT_SURFACE: PlatformId = 'docs';
export const OTHER_PLATFORMS: readonly Platform[] = PLATFORMS.filter((platform) => platform.id !== CURRENT_SURFACE);
export const PRIMARY_PLATFORM: Platform = PLATFORMS.find((platform) => platform.primary) ?? PLATFORMS[0];
export function platformHref(id: PlatformId): string {
  const found = PLATFORMS.find((platform) => platform.id === id);
  if (!found) throw new Error(`Unknown platform: ${id}`);
  return found.href;
}
/** `/apps` changes only when this list does: its sitemap date is the newest proof date. */
export const APPS_LASTMOD: string = PLATFORMS.map((platform) => platform.verified).sort().at(-1) ?? '2026-11-20';
