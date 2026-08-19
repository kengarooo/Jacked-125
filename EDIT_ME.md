# EDITABLE SETTINGS

This version is intentionally kept easy to modify.

## Fastest things to change
Open `config.js`.

You can edit:
- app name
- tagline
- calorie target
- protein target
- goal weight
- physique goal
- current phase
- equipment list
- workout days
- exercises
- sets and rep ranges

## App layout / design
Open `index.html`.

You can change:
- section names
- navigation labels
- colors
- text
- cards
- fields shown in the app

## Offline behavior
`manifest.webmanifest` controls install metadata.
`service-worker.js` controls offline caching.

## Important rule for future edits
Keep the existing data structure compatible so old saved weigh-ins, measurements, food logs, and workouts do not disappear after an update.

When using Codex, tell it:
"Preserve existing localStorage data compatibility and do not rename stored fields unless you add a migration."
