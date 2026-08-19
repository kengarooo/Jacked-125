# JACKED @ 125 — iPhone-first PWA

A deployable progressive web app for tracking bodybuilding nutrition, training, measurements, weight trends and six-pack progress.

## What works now
- iPhone/Safari responsive layout with safe-area support
- Installable PWA metadata / manifest
- Offline app shell via service worker
- Food/macros logging
- Daily macro totals
- 4-day home bodybuilding program + 3x/week abs
- Set / rep / weight / RIR logging
- Editable and backdated weigh-ins / measurements
- 7-day weight average and prior-week comparison
- Weight trend chart
- Adjustable calorie / protein / goal-weight targets
- JSON export/import backups
- On-device persistence via localStorage

## Run locally
A service worker requires HTTP(S), so don't just open index.html from Files.

Use any static server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` on a computer. For iPhone testing, deploy to HTTPS or serve on your local network.

## Easiest deploy
This is a static site. It can be deployed as-is to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any HTTPS static host.

No build step is required.

## Install on iPhone
1. Deploy the folder to an HTTPS URL.
2. Open the URL in Safari on iPhone.
3. Tap Share.
4. Tap **Add to Home Screen**.
5. Launch `Jacked 125` from the Home Screen.

## Important data note
This version stores data locally in Safari on the device. Export JSON backups periodically.

If you want multi-device sync or for a coach/AI service to read the same data remotely, add authentication + a database (Supabase is a straightforward option).
