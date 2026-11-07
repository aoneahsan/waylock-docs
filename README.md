# Waylock guides

This repository holds the public Waylock guides for `https://waylock-docs.aoneahsan.com/`. It uses Docusaurus 3, TypeScript and Yarn. The initial pages describe planned Android controls and state clearly that Waylock is not yet listed on Google Play.

## Local checks

```bash
corepack enable
yarn install --immutable
yarn typecheck
yarn lint
yarn build
yarn serve
```

The build produces `build/` with prerendered pages, `sitemap.xml`, `feed.xml`, `llms.txt`, and `CNAME`. The build check verifies required routes and their canonical URLs. Unknown paths must return 404.

## Content and release

- Start page: `src/pages/index.tsx`; approved visual reference: the separate Waylock click dummy's `docs-home.html`.
- Task guides: `docs/` and `sidebars.ts`. Keep claims tied to observed app behaviour and the release-status page.
- Site config, SEO and host: `docusaurus.config.ts`, `scripts/postbuild.mjs`, `static/robots.txt`, and `static/CNAME`.
- Public links to Waylock's Privacy Policy, Terms and deletion page point to the marketing host. Verify those pages are live before publishing this site.
- Story Gate 4 covers every page here. `yarn publish:check` refuses a deploy until `scripts/publication.json` records the signed build's version, the first feed date, device proof, hosted deletion proof and live legal links. Those words say the signed APK is on the download page, so they must not go live before it is.

The project owner controls Play submission and DNS. Account deletion will use signed-in self-service on the website and fresh Google confirmation in-app; both require live proof before publication.
