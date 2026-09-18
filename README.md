# Tirandor Cartographer — v0.9

Local-first D&D cartography editor focused on high/late-medieval visual language, printable maps and GitHub Pages deployment.

## v0.9 — Asset Library UX + runtime regression fix

### Fixed

- fixed the fatal `Cannot read properties of undefined (reading 'labelFont')` error when creating a project or a new map;
- font defaults now live in the core map model and the v0.7 compatibility helper safely accepts either a map or a settings object;
- app version is now reported as `0.9.0`;
- added a Node runtime smoke test so this specific model-initialization regression is checked in CI, not just JavaScript syntax.

### Asset library next stage

The 302-object illustrated atlas from v0.8 now has a more practical library UI:

- **All / Favorites / Recent** modes;
- multi-select semantic filters: terrain, settlements, buildings, ruins, water, creatures, characters, guilds, magic, cult/religion, artifacts and navigation;
- live keyword search across display name, internal ID, pack and tags;
- three preview densities: compact, normal and large;
- recent history stored locally (up to 30 assets);
- favorites remain local to the browser;
- cards are draggable directly onto the map canvas;
- double-clicking an asset places it in the center of the current viewport;
- regular click selects the asset as the active placement tool;
- drag/drop placement respects the active layer and snapping rules.

### Bundled atlas

The v0.8 atlas still contains 302 illustrated objects across 8 packs:

- Terrain & Landscape — 28
- Special Places & Ruins — 28
- Guilds — 40
- Buildings & Civic — 56
- Creatures & Monsters — 29
- Map Illustrations I — 48
- Map Illustrations II — 55
- Races & Peoples — 18

The atlas is cached by the service worker and works offline.

## Typography

Old Standard TT and Cormorant SC are bundled locally with Cyrillic support.

## Architecture

No backend and no build step. Static HTML/CSS/JS + IndexedDB + service worker. Projects can be exported as `.dndatlas`.

## Deployment

Every push to `main` now runs:

1. JavaScript syntax checks;
2. runtime map-model regression smoke test;
3. bundled atlas checksum verification;
4. GitHub Pages deployment.
