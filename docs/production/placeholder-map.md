# GLITCH — Placeholder Map (Phase A → Phase B swap list)

Every temporary asset is tagged `data-placeholder="…"` in `index.html` and gets
a dashed cyan outline in `?debug` mode. Swapping any of them must not require
touching the interaction systems.

| # | DOM hook | Placeholder today | Final asset (Phase B) | Swap notes |
|---|----------|-------------------|------------------------|-----------|
| 1 | `#bg` video | archived marble footage (5s, rejected creatively) | new 8s/240f all-intra hero film (plates A+B+C) | drop-in file replace; scrub maps 0–.74 of ch1 |
| 2 | `#goldpaths` | 3 SVG polylines drawn by scroll | baked into final film (carved channels) | keep SVG as an overlay accent or remove |
| 3 | `#grid1` | SVG exam grid | stays DOM by design (owner decision #4) | timing lives in `paintCh1` |
| 4 | `#figure` | abstract human-silhouette SVG cutout | plate C still (unfinished Prigione) as masked image, or baked into film | position: right 12%, bottom 8% |
| 5 | `#dome1` | line-art dome arcs + oculus | graded dome imagery or higher-fidelity SVG | opacity/scale driven .74–.86 |
| 6 | `#tear1` | jagged clip-path gradient strip | keep, restyle with final palette/texture | width driven .86–.94 |
| 7 | `.portal-through` ×2 | CSS-gradient preview of next chapter | live render or still of next chapter's world | clip-path is set by portal painter |
| 8 | portal `canvas` ×2 | procedural gold particles + marble chips | keep procedural (cheap, on-brand); tune density/colors | `makePortal(sec, seed)` |
| 9 | `#rotunda` | gradient + SVG arch line-art | licensed/generated rotunda environment (see asset-sources) | keep depth-1 parallax wrapper |
| 10 | `#deskfield` desks | 24 SVG desk glyphs | modeled/photographed desks or richer SVG | scatter→grid positions in `DESKS` array |
| 11 | `.clockface` ×2 | SVG clocks, scroll-fast hands | keep or replace with photographic clocks | hand rotation in `paintCh2` |
| 12 | `.cert` ×3 | labeled frames ("Cert. A-113") | engraved certificate art | reveal ranges on `data-rv` |
| 13 | `#vermilion` | irregular vermilion polygon | final "does not belong" object (owner to choose) | rebel path in `paintCh2` |
| 14 | `#orbits` | SVG ellipses diagram | refined orbital knowledge diagram | rotation in `paintCh3` |
| 15 | `.card` ×6 | labeled dark cards | designed learning-object cards (may become real product UI) | reveal stages via `data-rv`; hover already final |
| 16 | `#gear` | SVG gear | machined-brass gear art | hidden on mobile |
| 17 | `#token` | vermilion sphere | final learning-token design | orbit math in `paintCh3` |
| 18 | `#constellation` nodes | lettered circles A–I | member portraits/avatars or sculpted busts | positions in `NODE_TARGETS` |
| 19 | `#con-pass` | glowing gold dot | final "knowledge object" | route in `paintCh4` |
| 20 | `#key` | line-art gold key | engraved key art | hover rotate is CSS |
| 21 | ch1 copy beats | FINAL COPY (approved) | — not placeholder | |
| 22 | ch2–ch5 copy | owner-suggested copy, in place | copyedit pass in Phase C | |

## Archived (do not delete)
`assets/archive/original-hero/` — original hero.mp4 family, lighting reference.
