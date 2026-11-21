# Packages — waylock-docs

**Last Updated:** 2026-11-21. Kept out of the published guide by the docs plugin's `exclude`.
**Manifest unit:** one, the repository root `package.json`. **Package manager:** Yarn 4.18.1. Only `yarn.lock` may exist.
**Node:** 26.13.1 LTS (`.nvmrc`, `engines.node >=26.13.1`, since 2026-11-16); `.yarnrc.yml` keeps `npmMinimalAgeGate: 0`.

| Package | Version | Purpose |
|---|---|---|
| `@docusaurus/core`, `faster`, `preset-classic`, `theme-classic`, `theme-common` | 3.10.2 | The site, its theme and the faster bundler |
| `@docusaurus/plugin-client-redirects` | 3.10.2 | Sends `/docs/developers`, the address the Waylock API names, to `/guide/developers` |
| `@easyops-cn/docusaurus-search-local` | 0.55.3 | Search with no outside service |
| `@mdx-js/react`, `clsx`, `prism-react-renderer` | 3.1.1 / ^2.1.1 / ^2.4.1 | Docusaurus peers |
| `react`, `react-dom` | ^19.3.1 | Rendering |
| `strata-storage` | ^3.1.4 | Remembers the legal notice was shown; the only code that touches web storage |
| dev `@docusaurus/module-type-aliases`, `plugin-content-docs`, `types` | 3.10.2 | Types |
| dev `typescript`, `@types/node`, `@types/react` | ~7.0.2 / ^26.6.6 / ^19.3.0 | `yarn typecheck` |

2026-11-16: Node 26.13.1 pin added and `npmMinimalAgeGate: 0` set; `ncu -u` found every package at latest stable. `yarn typecheck`, `yarn lint` and `yarn build` green on Node 26.13.1.
