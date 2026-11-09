# Waylock guides

This repository holds the public Waylock guides for `https://waylock-docs.aoneahsan.com/`. It uses Docusaurus 3, TypeScript and Yarn. The pages describe planned Android controls and state that Waylock is in Play internal testing without a public install path.

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
- Site config, SEO and host: `docusaurus.config.ts`, `src/build/` (a local plugin: page-ledger checks, `sitemap.xml`, `feed.xml`, 404 and the `waylock:*` commands), `static/robots.txt`, and `static/CNAME`.
- Public links to Waylock's Privacy Policy, Terms and deletion page point to the marketing host. Verify those pages are live before publishing this site.
- Story Gate 4 covers every page here. `yarn publish:check` requires the approved release facts and live website links. Device and deletion proof later determine when cautious wording can change. The public guides do not link to an APK while Waylock is in Play internal testing.
- After a words change, `yarn build` names the page that moved; `yarn ledger` prints the fingerprints for `src/content/page-dates.json`.

The project owner controls Play submission and DNS. Account deletion will use signed-in self-service on the website and fresh Google confirmation in-app; both require live proof before publication.
