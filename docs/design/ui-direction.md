# UI Direction — Baku Dashboard

Premium editorial, motorsport-magazine tone. The goal is a page that looks
like a livery-drop campaign page, not an admin dashboard — flat color
blocking and type scale carry the hierarchy, not cards/shadows/icons.

## Typography

- **Display / headlines / big numbers**: a heavy condensed grotesk —
  `Big Shoulders Display` (Google Fonts, free, distinctive condensed
  character close to the "editorial wallpaper" reference images without
  copying F1's proprietary typeface). Used for: the "BAKU" hero word, the
  top pick's driver name, the model-score percentage, rank numbers.
- **Body / labels / captions**: `Inter` or `IBM Plex Sans`, used sparingly
  and small — team names, stat captions, the disclaimer line. Never the
  only typeface on the page.
- Numerals throughout use tabular figures so score percentages align in
  the list.

## Color

Base palette unchanged from the original brief — extended with a
team-accent layer:

| Token | Value | Use |
|---|---|---|
| `--color-header-bg` | `#1a1a1a` | Hero block, sticky header |
| `--color-content-bg` | `#f7f5f2` | Body/content area |
| `--color-accent-red` | `#d81e2c` | Primary accent (rules, top-pick score) |
| `--color-text-primary` | `#1a1a1a` | Body text on light bg |
| `--team-accent-{constructorId}` | per-team livery hex | Thin left-border/rule per driver row — not a full colored card, just enough to echo the standings reference without turning the list into a rainbow |

## Layout

1. **Hero** — flat charcoal block. Huge "BAKU" in Big Shoulders Display.
   "Pre-race predictions" subtitle in body type, thin red rule beneath.
   Below that, a stat row (Circuit Length · Laps · Race Distance · Lap
   Record) — real values, not placeholders (see below) — with a faded
   Baku City Circuit outline as background texture, not a photo.
2. **Top pick** — driver name at hero scale, team name small-caps above
   it, model score as the single biggest number on the page. Thin rule
   under the card in that driver's team-accent color.
3. **Rankings (top 5 → full field)** — editorial list, not cards. Rank
   number in the display face at small scale, driver/team on one line,
   score as a thin single-color line (not a rounded pill) that
   animates its width in on mount, percentage right-aligned in tabular
   numerals. Team-accent color as a 3px left border per row.
4. **Ineligible drivers** (rare — see ADR-0001) — same row treatment,
   muted/dotted, "insufficient recent data" in small caps instead of a
   bar. No red/alert coloring — this isn't a race-status event, just a
   quiet state.
5. **Disclaimer** — thin neutral banner strip (echoes the flag-banner
   reference language, deliberately desaturated): small-caps label +
   one line of the required "relative preference, not calibrated chances"
   text.

## Animation

- Score bars: width transitions in on mount, staggered ~40ms per row,
  ease-out.
- Top-pick score: quick count-up tween on load (0 → final %).
- Header: condenses on scroll — hero shrinks, driver name/score pins into
  a slim sticky bar.
- Row hover: background tint + slight rightward shift of the score value.
  No shadow, no lift — the design stays flat by design.
- Loading state: the hero block itself pulses (skeleton = the flat block,
  not a spinner) — consistent with "no generic UI chrome."

## Reference Content (static, editorial — not from the prediction API)

Pulled from the official F1 Azerbaijan GP page. This is display copy for
the hero stat row, independent of `race_date`/`data_through` which come
from the model artifact's own metadata.

| Circuit Length | Laps | Race Distance | Lap Record | First GP |
|---|---|---|---|---|
| 6.003 km | 51 | 306.049 km | 1:43.009 (Leclerc, 2019) | 2016 |

Session schedule (track local time): FP1 Thu 24 Sep 08:30–09:30 · FP2
24 Sep 12:00–13:00 · FP3 Fri 25 Sep 08:30–09:30 · Qualifying 25 Sep
12:00–13:00 · Race Sat 26 Sep 11:00.

## Explicitly avoided

Rounded-2xl cards with soft drop shadows on white, purple/blue gradients,
generic icon-heavy UI, a single system-ui/Inter typeface carrying the
whole page, centered-hero-with-pill-button SaaS template layout.
