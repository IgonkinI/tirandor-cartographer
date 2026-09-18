# Tirandor Cartographer v0.9

Static local-first prototype for fantasy map making.

## Included in this build

- Fixed the missing `labelFont` problem by normalizing map settings for every project.
- New working static client with home screen and editor.
- Local project storage in browser (`localStorage`).
- Import/export of `.dndatlas` JSON project files.
- PNG export.
- Canvas editor with pan/zoom, object selection and dragging.
- Text labels with medieval-style font presets.
- Integrated illustrated asset sheets:
  - terrain / landscapes
  - ruins / special places
  - guilds
  - buildings
  - creatures
  - races
  - mixed medieval cartographic illustrations
- Asset previews are extracted locally from source sheets and background-trimmed in browser.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `assets/sheets/*.png`

## Notes

This build is fully static and suitable for GitHub Pages.
