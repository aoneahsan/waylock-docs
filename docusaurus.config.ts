import {readFileSync} from 'node:fs';
import type {Config} from '@docusaurus/types';
import waylockBuildPlugin from './src/build/plugin';
import {OTHER_PLATFORMS} from './src/data/platforms';

const siteUrl = 'https://waylock-docs.aoneahsan.com';
// Analytics ids come from the deploy shell (FilesHub Waylock vault); this repo is public, so none is committed.
// `yarn publish:check` refuses a deploy whose built pages lack any of the three.
const gaId = process.env.GA_MEASUREMENT_ID;
const analytics = {
  clarityId: process.env.CLARITY_PROJECT_ID ?? '',
  amplitudeKey: process.env.AMPLITUDE_API_KEY ?? '',
};

// The one Appearance control, in the header at every width; src/client/appearance.ts opens the panel.
const icon = (name: string) => readFileSync(new URL(`./src/icons/${name}.svg`, import.meta.url), 'utf8').trim()
  .replace('<svg ', `<svg class="theme-icon-${name}" aria-hidden="true" `);
const themeButton = `<button type="button" class="waylock-theme-button" data-action="theme" aria-label="Appearance" aria-controls="waylock-theme-panel">${icon('moon')}${icon('sun')}</button>`;

const config: Config = {
  title: 'Waylock guides',
  tagline: 'Route controls, release status and account help',
  url: siteUrl,
  baseUrl: '/',
  favicon: 'img/favicon.svg',
  organizationName: 'aoneahsan',
  projectName: 'waylock-docs',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  future: {v4: true, faster: true},
  // Unnamespaced, so Docusaurus reads the plain `theme` key static/appearance-prepaint.js writes before it runs.
  storage: {type: 'localStorage', namespace: false},
  i18n: {defaultLocale: 'en-GB', locales: ['en-GB']},
  markdown: {hooks: {onBrokenMarkdownLinks: 'throw'}},
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'guide',
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: false,
          exclude: [
            'PACKAGES.md',
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            'MANUAL-TASKS.md',
            'story/**',
          ],
        },
        blog: false,
        // src/build/site-output.ts writes sitemap.xml from the page ledger. Plugins' postBuild hooks run concurrently, so this one would race it.
        sitemap: false,
        theme: {customCss: ['./src/css/custom.css', './src/css/appearance.css']},
        ...(gaId ? {gtag: {trackingID: gaId, anonymizeIP: true}} : {}),
      },
    ],
  ],
  customFields: {analytics},
  clientModules: ['./src/client/legal-notice.ts', './src/client/analytics.ts', './src/client/appearance.ts'],
  plugins: [waylockBuildPlugin],
  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexPages: true,
        indexBlog: false,
        docsRouteBasePath: '/guide',
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 12,
      },
    ],
  ],
  themeConfig: {
    // The Appearance panel (src/client/appearance.ts) is the one theme control; it drives data-theme for Infima.
    // Docusaurus keeps reading the stored theme the pre-paint script writes; its own toggle renders nothing
    // (src/theme/ColorModeToggle), so the Appearance button stays the one control.
    colorMode: {defaultMode: 'light', disableSwitch: false, respectPrefersColorScheme: false},
    navbar: {
      title: 'WAYLOCK · GUIDES',
      logo: {alt: 'Waylock', src: 'img/favicon.svg'},
      items: [
        {to: '/guide/release-status', label: 'Release status', position: 'left'},
        {to: '/guide/route-controls', label: 'Route controls', position: 'left'},
        {
          type: 'dropdown',
          label: 'Get Waylock',
          position: 'right',
          items: [
            ...OTHER_PLATFORMS.map(platform => ({label: platform.name, href: platform.href})),
            {label: 'All apps', to: '/apps'},
          ],
        },
        {type: 'html', position: 'right', className: 'waylock-theme-item', value: themeButton},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'Get Waylock', items: [
          ...OTHER_PLATFORMS.map(platform => ({label: platform.name, href: platform.href})),
          {label: 'All apps', to: '/apps'},
        ]},
        {title: 'Guides', items: [
          {label: 'Overview', to: '/'},
          {label: 'Release status', to: '/guide/release-status'},
          {label: 'Route controls', to: '/guide/route-controls'},
          {label: 'Sitemap', to: '/sitemap'},
          {label: 'Updates', to: '/feed'},
        ]},
        {title: 'Waylock', items: [
          {label: 'Privacy Policy', href: 'https://waylock.aoneahsan.com/privacy'},
          {label: 'Terms of Service', href: 'https://waylock.aoneahsan.com/terms'},
          {label: 'Account deletion', href: 'https://waylock.aoneahsan.com/delete-account'},
          {label: 'White-label', to: '/guide/white-label'},
        ]},
      ],
      copyright: 'Waylock guides',
    },
    metadata: [
      {name: 'theme-color', content: '#15392f'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:image', content: `${siteUrl}/img/waylock-guides-og.png`},
      {property: 'og:image', content: `${siteUrl}/img/waylock-guides-og.png`},
    ],
  },
  headTags: [
    // Blocking, before Docusaurus's own colour script: every appearance axis lands before first paint.
    {tagName: 'script', attributes: {src: '/appearance-prepaint.js'}},
    {
      tagName: 'meta',
      attributes: {name: 'yandex-verification', content: 'bfb02722189028cf'},
    },
    {tagName: 'link', attributes: {rel: 'alternate', type: 'application/rss+xml', title: 'Waylock guide updates', href: `${siteUrl}/feed.xml`}},
  ],
};

export default config;
