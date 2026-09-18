# Tirandor Cartographer — v0.8

Local-first D&D cartography editor focused on high/late-medieval visual language, printable maps and GitHub Pages deployment.

## v0.8 — Bundled illustrated atlas

The asset library now includes **302 illustrated objects** extracted from the user-supplied medieval-style sheets and bundled for offline use.

Asset packs:

- Terrain & Landscape — 28
- Special Places & Ruins — 28
- Guilds — 40
- Buildings & Civic — 56
- Creatures & Monsters — 29
- Map Illustrations I — 48
- Map Illustrations II — 55
- Races & Peoples — 18

New library capabilities:

- local WebP sprite atlas with offline service-worker caching;
- category selector and Russian/English keyword search;
- favorites stored locally in the browser;
- preview cards for every asset;
- place, move, resize, rotate, opacity and blend-mode controls;
- new `sheetAsset` object type preserved in `.dndatlas` exports;
- two alternate illustrated-map packs instead of discarding near-duplicate source sheets.

The v0.7 historical/public-domain and CC BY asset library remains available alongside the new bundled packs.

## Typography

Old Standard TT and Cormorant SC remain bundled locally with Cyrillic support.

## Architecture

No backend and no build step. Static HTML/CSS/JS + IndexedDB + service worker. Projects can be exported as `.dndatlas`.

## Deployment

Every push to `main` runs JavaScript syntax checks, verifies the bundled atlas checksum, and deploys to GitHub Pages.
