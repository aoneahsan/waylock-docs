# Packages — waylock-docs

**Last Updated:** 2026-11-07. Kept out of the published guide by the docs plugin's `exclude`.
**Manifest unit:** one, the repository root `package.json`. **Package manager:** Yarn 4.18.1. Only `yarn.lock` may exist.

| Package | Version | Purpose |
|---|---|---|
| `@docusaurus/core`, `faster`, `preset-classic`, `theme-classic`, `theme-common` | 3.10.2 | The site, its theme and the faster bundler |
| `@easyops-cn/docusaurus-search-local` | 0.55.3 | Search with no outside service |
| `@mdx-js/react`, `clsx`, `prism-react-renderer` | 3.1.1 / ^2.1.1 / ^2.4.1 | Docusaurus peers |
| `react`, `react-dom` | ^19.3.1 | Rendering |
| `strata-storage` | ^3.1.4 | Remembers the legal notice was shown; the only code that touches web storage |
| dev `@docusaurus/module-type-aliases`, `plugin-content-docs`, `types` | 3.10.2 | Types |
| dev `typescript`, `@types/node`, `@types/react` | ~7.0.2 / ^26.6.6 / ^19.3.0 | `yarn typecheck` |
