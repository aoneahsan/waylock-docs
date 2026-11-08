import type {Config} from '@docusaurus/types';
import waylockBuildPlugin from './src/build/plugin';

const siteUrl = 'https://waylock-docs.aoneahsan.com';
const gaId = process.env.GA_MEASUREMENT_ID;

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
        theme: {customCss: './src/css/custom.css'},
        ...(gaId ? {gtag: {trackingID: gaId, anonymizeIP: true}} : {}),
      },
    ],
  ],
  clientModules: ['./src/client/legal-notice.ts'],
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
    colorMode: {defaultMode: 'light', respectPrefersColorScheme: true},
    navbar: {
      title: 'WAYLOCK · GUIDES',
      logo: {alt: 'Waylock', src: 'img/favicon.svg'},
      items: [
        {to: '/guide/release-status', label: 'Release status', position: 'left'},
        {to: '/guide/route-controls', label: 'Route controls', position: 'left'},
        {href: 'https://waylock.aoneahsan.com/', label: 'About Waylock ↗', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
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
    {tagName: 'link', attributes: {rel: 'alternate', type: 'application/rss+xml', title: 'Waylock guide updates', href: `${siteUrl}/feed.xml`}},
  ],
};

export default config;
