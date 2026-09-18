# Tirandor Cartographer — v0.10.1

Local-first D&D cartography editor focused on high/late-medieval map aesthetics, printable maps and GitHub Pages.

## v0.10.1 hotfix

This release restores the full modular editor that existed before v0.10 and keeps the new illustrated sheets as an **additional** library instead of replacing the established application.

### Restored

- all original map tools: selection, pan, rooms/areas, walls, doors, roads, rivers, labels, trees, mountains and settlements;
- layers, visibility/locking, undo/redo, duplication and map settings;
- old 302-object raster atlas from v0.8;
- v0.9 favorites, recent items, tags, search and drag/drop;
- historical/public-domain assets and locally bundled open SVG assets;
- heraldry, composition presets, z-order, manuscript text styles and illustrated terrain from earlier releases;
- IndexedDB project model and existing .dndatlas compatibility.

### Improved assets

The seven redrawn source sheets from v0.10 remain bundled in `assets/sheets/`, but are exposed as a separate **HD assets** tool/library. They do not overwrite old asset IDs.

HD extraction uses cell-safe margins, edge-connected parchment removal and alpha trimming in the browser.

### Cache

Service worker cache was bumped to `v0.10.1` and now includes both the old v0.8 atlas and the seven improved HD sheets.

### CI safeguards

CI now explicitly checks that the modular editor, old raster atlas, old tools and v0.10 HD module are all present before GitHub Pages can deploy.
