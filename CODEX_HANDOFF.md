# Codex handoff prompt

Continue development of this `Jacked @ 125` iPhone-first PWA without removing current working features.

## Product goal
A bodybuilding coaching tracker for a 5'1" woman currently around 150 lb whose long-term goal is roughly 125 lb, muscular/lean, with visible abs. The app should prioritize muscle retention/growth, progressive overload, protein adherence, waist/weight trends, and sustainable fat loss rather than aggressive scale loss.

## Existing equipment / program context
- Pair of 12 lb dumbbells
- Pair of 8 lb dumbbells
- One 25 lb dumbbell
- One 8 lb kettlebell
- Bench
- 4 lifting days/week
- Abs 3x/week
- Initial targets: 1,750 kcal, 140 g protein, goal ~125 lb (editable)

## Keep these existing features
- iPhone responsive design + iOS safe areas
- PWA manifest and service worker
- Food/macros logging
- Workout logging: exercise, weight, reps, sets, RIR
- Editable/backdated weigh-ins and measurements
- 7-day averages
- Weight trend chart
- Data export/import
- Adjustable targets

## Next features to implement, in order
1. Migrate persistence to IndexedDB so larger datasets/photos are safe.
2. Add progress-photo capture/upload using `<input type="file" accept="image/*" capture="environment">`; store locally first.
3. Add a weekly check-in screen: average weight, waist, hunger 1–10, energy 1–10, sleep, training performance, menstrual-cycle note, adherence.
4. Add an automatic coaching summary. Do not auto-change calories. Suggest a review only after at least 14–21 days of data.
5. Add exercise progressive-overload charts and PR detection.
6. Add reusable custom foods / favorite meals.
7. Add food search/barcode scanning through a reputable API while preserving manual entry.
8. Optional cloud sync: Supabase Auth + Postgres. Keep all secrets in environment variables and add row-level security.
9. Add a privacy page and delete-account/data controls if cloud sync is added.
10. Add unit tests for all trend/macro calculations and basic end-to-end tests for iPhone-size viewports.

## Safety / coaching behavior
- Never promise a six-pack by a certain weight/date.
- Do not recommend crash diets or very low calories.
- Use trends, not single-day weight changes.
- Preserve protein and resistance training during cuts.
- The coaching screen should clearly distinguish informational guidance from medical advice.


## EDITABILITY / PRESERVATION RULE
Treat this folder as the user's canonical base format.

- Keep the iPhone-first PWA layout unless explicitly asked to redesign it.
- Prefer changing `config.js` for goals, targets, equipment, and workout programming.
- Preserve existing localStorage data compatibility.
- If stored field names must change, add a migration.
- Do not remove editable/backdated weigh-ins or measurements.
- Make future feature changes incrementally so the user can keep this same app over time.
