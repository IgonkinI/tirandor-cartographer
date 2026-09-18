# Tirandor Cartographer — v0.7

Local-first D&D cartography editor focused on high/late-medieval visual language, printable maps and GitHub Pages deployment.

## v0.7 — Sourced art + typography

- bundled Old Standard TT and Cormorant SC locally under SIL OFL 1.1;
- Cyrillic-capable map typography for Russian and English campaigns;
- map-level label font and title font selectors;
- per-text-object font override;
- 20 locally bundled detailed SVG assets from Game-icons.net (CC BY 3.0), recolored for parchment maps;
- archival public-domain historical fragments from the Catalan Atlas (1375) and Psalter World Map (c.1265);
- historical assets carry visible source / license metadata in the inspector;
- historical scans render with Multiply blending by default to merge with parchment;
- resize / rotate / opacity / blend controls for sourced art objects;
- service worker cache updated to include local font and SVG packs.

Full provenance: docs/ASSET_SOURCES.md.

## Architecture

No backend and no build step. Static HTML/CSS/JS + IndexedDB + service worker. Projects can be exported as .dndatlas.

## Deployment

Every push to main runs JavaScript syntax checks and deploys to GitHub Pages.
