# GLITCH — Site Architecture (Phase A prototype, 2026-08-28)

Single static `index.html`, vanilla JS, no framework, no GSAP, native scrolling
only (no scroll-jacking). One rAF loop drives everything; every animated value
is a **pure function of scroll position** (plus a shimmer clock for particles),
which is what makes the whole narrative reversible on scroll-up.

## Page model

| # | Section id | Height | Kind | Content |
|---|-----------|--------|------|---------|
| I  | `ch1` | 560vh | pinned scrub | The First Tool — marble film + layered SVG (gold paths, grid, figure, dome, tear) |
| —  | `portal1` | 160vh | pinned canvas | threshold → Chapter II (rotunda visible through the tear) |
| II | `ch2` | 420vh | pinned scene | The Old Classroom — rotunda, desks scatter→grid, clocks, certificates, vermilion rebel |
| —  | `portal2` | 160vh | pinned canvas | threshold → Chapter III |
| III| `ch3` | 420vh | pinned scene | The Glitch — orbital diagram, learning cards, token orbit, gear |
| IV | `ch4` | 380vh | pinned scene | The Community — constellation of nodes, gold links, passed token |
| V  | `ch5` | 120vh | flowing | The Invitation — key, thesis, CTA |

Total ≈ 2220vh (~22 screens). Each pinned section = `.track` (tall) containing
a `position: sticky` `.stage` (100svh). Local progress
`p = (scrollY − track.top) / (track.height − vh)`, clamped 0–1.

## Chapter 1 story mapping (video is 0–0.74; DOM epilogue 0.74–1.0)

1. Block (0–.07) → 2. First cut (.07–.18) → 3. Acceleration (.18–.34, gold SVG
paths draw) → 4. System grid (.34–.48) → 5. Release (.48–.62) → 6. Unfinished
figure (.62–.74) → 7. Dome closes over (.74–.86) → 8. Tear opens through it
(.86–.94, figure lifts, "no longer trapped") → 9. GLITCH wordmark + CTA
(.90–1.0). The video scrub covers phases 1–6; the dome/portal epilogue is DOM
layers so it survives any footage swap.

## Runtime systems (see interaction-system.md)

- pointer parallax → CSS vars `--mx/--my` on `:root`, wrappers `.plx[data-depth]`
- copy beats → `.copy[data-in][data-out]` against chapter-local p
- reveals → `.rv[data-rv="in out"]` class toggle (CSS transitions both ways)
- painters → `paintCh1/2/3/4`, `portal.paint(p,t)`, `paintNav`, only for
  sections currently intersecting the viewport
- chapter nav → fixed rail (right on desktop, bottom on mobile), buttons
  scrollIntoView, `aria-current`, global progress bar

## Modes

- **Mobile (≤760px):** parallax off, copy in lower third over scrims, nav as
  bottom bar, grid −30 %, gear hidden, portal particle count 90 (vs 170).
- **Reduced motion:** no rAF loop; each chapter parked at a representative
  readable state; copy beats still follow scroll (no transitions); nav works.
- **Thrifty network:** `hero-lite.mp4` served instead of the all-intra master.
- **Debug (`?debug`):** live per-chapter progress readout + dashed cyan
  outlines on every `[data-placeholder]`.

## Phase B swap points

Final footage/art replaces, without touching the systems: the ch1 video file,
`#figure` silhouette, `#dome1` line-art, `#rotunda` environment, card artwork
in ch3, node avatars in ch4. All are tagged `data-placeholder` in the DOM.
