# Rootwise brand marks

The **rooted** mark (direction ①): a shoot with two leaves above the soil line and
roots below it — so the logo reads as *rooted growth* (Root‑wise), not a generic
2‑leaf sprout. Same line‑art style as the app.

Colours: sage `#6E8B6A` (mark) · cream `#F7F5EF` (on‑tile) · ink `#26302B` (wordmark).
Wordmark: **Fraunces** (the app's display serif). Lockup: mark + "Rootwise" +
optional "Your nature, by season".

## Files

| File | What |
|---|---|
| `rootwise-mark-a.svg` | **A · branching roots** (recommended) — asymmetric root system |
| `rootwise-mark-b.svg` | **B · taproot & wisps** — one taproot + fine side‑roots |
| `rootwise-favicon-a.svg` | A, cream on a sage rounded tile (favicon) |
| `rootwise-favicon-b.svg` | B, cream on a sage rounded tile (favicon) |
| `preview.html` | open in a browser to compare A vs B at all sizes |

## Wired in

**A (branching roots)** is the chosen mark and is live in the app:
- favicon → `index.html` (`<link rel="icon">`, inline SVG data URI of `rootwise-favicon-a.svg`)
- header mark → `Sprig` in `App.tsx` (same paths as `rootwise-mark-a.svg`, `currentColor`)

Keep these two in sync with `rootwise-mark-a.svg` if the mark is ever adjusted.
