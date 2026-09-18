# Tirandor Cartographer v0.10

Static local-first fantasy cartography editor focused on high/late-medieval visual language.

## v0.10

- Replaced the weakest automatically cropped sprite assets with seven new high-quality illustrated source sheets.
- The new sheets have cleaner separation, larger safe margins and more consistent medieval-map rendering.
- Added a new static client entrypoint (`app.js`) that works directly from GitHub Pages.
- Added project home screen, project creation, local persistence, `.dndatlas` import/export and PNG export.
- Added canvas pan/zoom, object selection, object dragging and text labels.
- Asset previews and map objects are extracted locally from the source sheets and background-trimmed in the browser.
- Added font presets aimed at medieval cartography and manuscript-like labels.
- The previous v0.8 atlas and v0.9 modules remain in the repository for compatibility while the v0.10 client becomes the active entrypoint.

## Improved illustrated packs

The project now bundles seven new source sheets:

- terrain / landscapes
- ruins / special places
- guilds
- buildings
- creatures
- races
- mixed medieval cartographic illustrations

Files live in `assets/sheets/`.

## CI

Pull requests now run syntax checks for the new `app.js`, the legacy modules, the runtime model regression test, the v0.8 atlas checksum and presence checks for all v0.10 asset sheets.

GitHub Pages deploys only after the test job succeeds on `main`.
