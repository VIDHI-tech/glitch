# Renaissance Section — Asset Register

Status: ASSET BOARD stage. Nothing below is final until owner approval.
Review copies live in `docs/production/renaissance-section/board/`.
Final cutouts will be exported to `assets/renaissance/` only after approval.
Board page: `docs/production/renaissance-section/asset-board.html`
(served at /docs/production/renaissance-section/asset-board.html on localhost).

## Verified candidates

| # | Title | Artist / creator | Date | Source | License (verified on file page 2026-08-28) | Attribution required | Dimensions | Intended use | Status |
|---|-------|------------------|------|--------|--------------------------------------------|----------------------|------------|--------------|--------|
| B1 | Italian Landscape with Umbrella Pines | Hendrik Voogd | 1807 | Rijksmuseum SK-A-4688, via Wikimedia Commons ([file](https://commons.wikimedia.org/wiki/File:Hendrik_Voogd_-_Italian_landscape_with_Umbrella_Pines.jpg)) | Public Domain (CC-PD-Mark; artist d. 1839) | No | 7058×5104 | Background — RECOMMENDED | candidate |
| B2 | Pastoral Landscape | Claude Lorrain | 1638 | Minneapolis Institute of Art, via Commons/Google Art Project ([file](https://commons.wikimedia.org/wiki/File:Claude_Gell%C3%A9e_(called_Le_Lorrain)_-_Pastoral_Landscape_-_Google_Art_Project.jpg)) | Public Domain Mark (artist d. 1682) | No | 5939×4463 | Background alt | candidate |
| B3 | Pastoral Landscape: The Roman Campagna | Claude Lorrain | c. 1639 | The Met 65.181.12, via Commons ([file](https://commons.wikimedia.org/wiki/File:Pastoral_Landscape-_The_Roman_Campagna_MET_DT218105.jpg)) | CC0 1.0 | No | 3811×2820 | Background alt (cleanest license) | candidate |
| S1 | Rebellious Slave (photo "…-2-Louvre") | sculpture: Michelangelo · photo: Yair Haklai | photo 2007 | Louvre, via Commons ([file](https://commons.wikimedia.org/wiki/File:Michelangelo-Buonarroti-Rebellious-Slave-2-Louvre.jpg)) | Public Domain — photographer's own release | No (courtesy credit planned) | 1920×2560 | Statue cutout — RECOMMENDED | candidate |
| S2 | Rebellious Slave JBU21 | photo: Jörg Bittner Unna | 2014 | Louvre, via Commons | CC BY-SA 3.0 | YES + share-alike on derivative | 3264×4896 | Statue fallback only (SA burden) | candidate |
| S3 | Rebellious Slave JBU31 | photo: Jörg Bittner Unna | 2014 | Louvre, via Commons | CC BY-SA 3.0 | YES + share-alike | high res | Statue fallback only | candidate |
| F1 | The Return of Persephone (Persephone figure) | Frederic Leighton | 1891 | Leeds Art Gallery, via Commons ([file](https://commons.wikimedia.org/wiki/File:Frederic_Leighton_-_The_Return_of_Persephone_(1891).jpg)) | Public Domain (artist d. 1896) | No | 1056×1400 ⚠ low res | Female student base — RECOMMENDED, needs upres/repaint | candidate |
| F2 | Birth of Venus (Hora of Spring) | Sandro Botticelli | c. 1485 | Uffizi, via Commons/GAP | PD-Art (PD-old) | No | very high res | Female student alt (mirror; tonally riskier) | candidate |
| M1 | Bacchus and Ariadne (Bacchus figure) | Titian | 1520–23 | National Gallery London, via Commons ([file](https://commons.wikimedia.org/wiki/File:Titian_-_Bacchus_and_Ariadne_-_Google_Art_Project.jpg)) | PD-Art (PD-old-100) | No | 4670×4226 | Male student base — RECOMMENDED | candidate |
| M2 | Creation of Adam (Adam) | Michelangelo | c. 1512 | Sistine Chapel, via Commons | PD-Art | No | high res | Gesture reference only (reclining pose unsuitable) | candidate |
| A1 | The Basket of Apples (single apple crop) | Paul Cézanne | c. 1893 | Art Institute of Chicago 1926.252, via Commons ([file](https://commons.wikimedia.org/wiki/File:Paul_C%C3%A9zanne_-_The_Basket_of_Apples_-_1926.252_-_Art_Institute_of_Chicago.jpg)) | CC0 1.0 + PD | No | 2811×2250 | Apple — RECOMMENDED (or original painted apple) | candidate |

## Notes recorded at sourcing time

- A photograph of a 3-D sculpture carries the photographer's copyright — that is
  why S1 (photographer's own PD release) is preferred over the sharper S2/S3
  (CC BY-SA, which would impose share-alike on the composite).
- Paintings (2-D) photographed faithfully are PD-Art: the underlying works and
  scans above are reusable; each file page was checked individually.
- Modifications planned (to be logged per-asset at export time): background
  cleanup/mirroring/desaturation; statue museum-background removal; figure
  cutouts with painted edge treatment; Persephone upres + modern coral notebook;
  Bacchus drapery toned terracotta + sneaker/bag detail; apple crop, warm
  crimson grade, soft edge.
- Planned exports: `assets/renaissance/background.jpg`,
  `statue-rebellious-slave.png`, `student-female.png`, `student-male.png`,
  `apple.png` — all pending owner approval of this board.
- Footer credit line planned (courtesy, none legally required if the
  recommended PD/CC0 set is used): artwork sources via Wikimedia Commons /
  Rijksmuseum / The Met / AIC open access.

## Rejected at sourcing

- Pinterest / Google Images / wallpaper sites / unverified AI asset sites — per brief.
- Shopify Editions assets in any form — per brief.

## Exports produced (2026-08-28, hero prototype v1)

| Export | Source | Modifications made |
|---|---|---|
| `assets/renaissance/background.jpg` | Voogd, Rijksmuseum (PD) | resized 2600px; used at three depths in CSS (sky, side tree masses via masked crops, darkened foreground foliage band) |
| `assets/renaissance/statue-rebellious-slave.png` | Haklai photo, Louvre (PD) | polygon cutout, 5px feathered painted edge, museum wall removed; CSS bottom fade + light sepia grade in page |
| `assets/renaissance/student-female.png` | Leighton, *Return of Persephone* (PD) | Persephone figure isolated, mirrored to enter left→reach right, 2× LANCZOS upres, Hermes robe/maroon & sky removed by color keys + flood fill, largest-island cleanup |
| `assets/renaissance/student-male.png` | Titian, *Bacchus and Ariadne* (PD-Art) | Bacchus figure isolated with flying rose drape, sky/teal landscape removed, parapet subtracted, feathered edge |
| `assets/renaissance/apple.png` | Cézanne, *Basket of Apples*, AIC (CC0) | single apple crop, circular feathered mask; crimson grade via CSS (hue-rotate −14°, saturate 1.4) |

Modern GLITCH objects (original, code-drawn, no sourcing needed): electric-blue
AI-prompt tablet, coral IDEAS notebook, BUILD BOUNTY ₹1,00,000 ticket.

Prototype route: `/renaissance/` — three.js NOT used (see report); GSAP
ScrollTrigger + Lenis via CDN.

## Section 2 additions (2026-08-29)

| Export | Source | License | Modifications |
|---|---|---|---|
| `assets/renaissance/nobleman.png` | Agnolo Bronzino, *Portrait of a Young Man*, 1530s, The Met 29.100.16, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bronzino_(Agnolo_di_Cosimo_di_Mariano)_-_Portrait_of_a_Young_Man_-_The_Metropolitan_Museum_of_Art.jpg) | Met Open Access (CC0) / PD-Art | figure isolated (polygon + feather + island cleanup); black velvet doublet digitally re-dyed deep ultraviolet (#6D22A8 family), luminance-preserving |
| Purple domino mask + eyelids | original in-page SVG | n/a (original) | drawn over measured eye coordinates; eyelid overlays in sampled skin tone for blink |
| Marble apple, halves, 7 fragments, gold core lattice, mini transform apple | original in-page SVG | n/a (original) | authored from concept refs (chrome-tessellated apple, torn-paper collage, split-half readability) — no reference pixels used |
| Annotations, astrolabe, floor cracks, flecks | original SVG/canvas | n/a (original) | graphite filter, gold/uv accents |

Concept references supplied by owner (NOT embedded, NOT traced): tech-apple
screenshot, torn-paper apple (watermarked), split apple (watermarked).

## Owner-supplied final assets (2026-08-29, processed)

| Export | Source | Processing |
|---|---|---|
| `assets/characters/girl-student-transparent.png` (+.webp) | owner-supplied Gemini render (green bg), original preserved at `assets/characters/src/girl-student-source.png` | full chroma removal, two-pass green despill, 1px rim shave + resoften, Gemini star watermark cleared, QC at zoom over black/white/landscape |
| `assets/characters/boy-student-transparent.png` (+.webp) | owner-supplied Gemini render, original preserved in src/ | same pipeline |
| `assets/renaissance/apple-marble-whole.png` | owner-supplied ChatGPT render (black bg), original in `assets/characters/src/apple-whole-source.png` | dark-key extraction, soft edge |
| `assets/renaissance/apple-body.png` + `apple-frag-1..12.png` | owner-supplied broken-apple render, original in src/ | dark-key + connected-component split into 13 pieces; each piece's authored composition center recorded and used as its layout/animation anchor |

Neither student was mirrored (girl reaches right→placed left; boy reaches left→placed right).
No masks added to students (headphones/glasses are the approved accents).

## Section 2 environment rebuild (2026-08-29 PM)

| Asset | Source | Use |
|---|---|---|
| `assets/renaissance/hall-interior.png` | owner-supplied render (marble hall, dome, masked scholar at table) | full S2 environment — art-frame wrapper (`#envW`, fixed 1414/736 aspect) so blink lids, beams, table shadow, impact FX and dust all share image coordinates |

Removed from S2 per correction: black/purple void bg, marble-vein SVG, tiny
eyebrow label, oversized supporting sentence, orbital astrolabe diagram, fake
Latin annotations, flat-purple nobleman cutout (character now lives inside the
supplied painting; blink lids retargeted to eyes at (912,265)/(1004,261)).
Impact point locked at (45.5%, 81.8%) of the hall image — clear tabletop left
of the shackles. Verification instrument: `?pose=NN` renders any timeline
state at scroll 0 (bypasses the pane's scrolled-capture wedge).

## Golden apple + marble tide (2026-08-29 evening)

| Asset | Source | Processing |
|---|---|---|
| `assets/renaissance/apple-gold.png` | owner-supplied Gemini render (green bg), original at `assets/characters/src/apple-gold-source.png` | chroma removal + despill, Gemini star cleared, QC over black/white/landscape |

Mechanics added: `#tide` marble-hall layer inside the hero, revealed by a
deterministic 3-harmonic wave (`tideLevel`/`waveY`, pure functions of hero
progress — advance + slight retreat, reversible); gold crest shimmer path;
apple is now ONE object with two registered material layers (`#matGold`
gold render / `#matMarble` marble render) clipped by the SAME wave contour in
viewport space (rotation applied on the imgs so clips stay wave-aligned).
S1 recomposed: students z-raised above foliage and enlarged (feet never
clipped), catching corridor at x≈50.5vw with both hands converging, headline
moved left off the statue's face, statue reduced to 64vh. Verification poses:
`?pose1=NN` (Section 1 states at scroll 0), `?pose=NN` (Section 2), `?debug`
(corridor + catch-point overlay).

## Five-defect correction pass (2026-08-29 late)

1. **Apple boundary size/alignment** — the two material renders had different
   canvases (gold 523×621 body-aspect 0.83; marble 1120×1099 aspect 1.02), so
   forcing both into one box distorted the marble and offset the seam. Both are
   now re-rendered onto ONE registered canvas (`apple-gold-n.png` /
   `apple-marble-n.png`, 800×900, body width 620px, body centre x=400, body
   bottom y=780) — bboxes agree within 4px. Apple also enlarged: one size law
   `aSizeS1()` (116px base, +42% as it nears camera → ~18% of viewport height at
   the crossing) shared by S1 and the S2 flight so scale never jumps.
2. **Section 2 rendered twice** — root cause: hero's sticky stage unpinned at
   520vh while `#s2` began at 620vh, leaving a 100vh window with two halls; and
   sticky cannot pin until its top reaches 0, so s2 slid up through the viewport
   over the hero. Fixed with `#s2{margin-top:-100vh}` (pin/unpin now coincident),
   `#s2stage` held `visibility:hidden` until actually pinned, the tide retired
   the instant s2 pins, and the tide hall given envW's pointer transform so the
   swap is pixel-identical. Verified: exactly one hall at every scroll position.
3. **Waterline** — rebuilt as 6 layered harmonics on irrational frequency ratios
   (0.90/1.73/3.11/5.47/9.13/15.7) with a calm envelope, sampled at 96 points,
   soft pale crest instead of a hard gold line: an organic torn/tidal edge.
4. **Marble apple too small in S2** — impact size raised to `min(.185*hallW,
   .34*vh)` and the fragment stage width now DERIVED from it
   (`stage = apple / 0.479`), so whole→broken never changes scale.
5. **Blink misaligned** — eyes re-measured on the hall render at (951,270) and
   (1020,266) (were 912,265 / 1004,261; lids were also ~70% oversized). Lids now
   rx16 ry9 in sampled skin (#B0785A), origin y=259. Verified numerically:
   lid box 867–1005 × 351–381 covers both eye centres.

Also corrected: impact point 0.818→0.838 (measured tabletop) and the contact
offset to `targetW*0.42`, so the apple body bottom meets the table (9px).

## Pen / ink / blink pass (2026-08-29, final)

**Blink re-registered.** Eyes re-measured on a 7× gridded crop of the hall render:
left eye centre **(957, 272)**, right **(1021, 269)** — the previous values
(951,270)/(1020,266) were ~6px off in x and the lids were undersized. Lids now
rx18/ry10.5 and rx20/ry11.5, skin `#B0785A`, close-origin y=259. Verified with
lids forced shut: both sit inside the mask holes.

**Apple size at the table** reduced to `min(.142*hallW, .26*vh)` (was .185/.34)
— "medium". The fragment stage stays bound to it via `stage = apple / 0.479`.

**The scholar's pen (built in-house, no generation credits spent).**
- The painted quill was **inpainted out** of `hall-interior.png` (horizontal
  background interpolation over x572–664, y474–566 + seam blur); the untouched
  original is preserved at `assets/characters/src/hall-interior-original.png`.
  The inkwell remains, now empty.
- An **original vector quill** (`#quill`: feather, barbs, gold nib, red ink tip)
  is positioned in viewport px by JS, `transform-origin` at the nib.
- The **red completion arc** was derived, not drawn by hand: the intact apple
  (`apple-marble-n.png`) was scaled/aligned onto `apple-body.png` (scale 1.069),
  its right silhouette profile extracted, and the run where the body does NOT
  cover that silhouette isolated (y455–710) — i.e. exactly the contour the
  broken-off chunk used to occupy. Emitted as an SVG path in stage viewBox
  (1448×1086) and drawn with `stroke-dasharray` driven by scroll.
- Sequence: quill lifts from the inkwell (s2p .74–.80, arcing) → nib rides the
  drawing head via `getPointAtLength` (.80–.95) → outline complete. Reversible:
  probe returned ink 0 → .13 → .67 → 1 → .13 → 0 with the quill fading back.

**Bug found and fixed while wiring this:** GSAP was overwriting the CSS
`transform:translate(-50%,-50%)` on every `.apiece`, so all 13 fragments had
been rendering offset by half their own size. Centring is now owned by GSAP
(`xPercent/yPercent:-50`), and the body's post-impact recoil was made a rigid
translation shared with `#inkSvg` so the drawn outline stays welded to the
broken edge.

## Hand–quill–apple interaction rebuild (2026-08-29, final)

**Fragments rebuilt from real geometry.** The ChatGPT broken-apple render was
retired as a shard source (its bite cavity is opaque, so alpha could not define
the missing region, and its pieces did not tile the apple). Replaced with an
authored fracture: a bite curve is cut through the INTACT apple
(`apple-marble-n.png`), the body and 6 shards are cut from that same image, and
gold is painted onto the interior fracture faces only (silhouette edges left
clean). Result: `assets/renaissance/shards/{body,shard0..5}.png` +
`_meta.json` with each piece's home position.
Verified: reassembling every piece at its home position differs from the intact
apple by **870 px = 0.27%** — matching veins across every adjoining edge, no
gaps, no overlaps, exact reconstruction by construction. Home is the assembled
state, so the return is exact rather than approximated.

**Arm rig (1 generated asset, 2 credits).** `nano_banana_pro` produced a
Renaissance-painted forearm in matching purple velvet with gold trim and cream
cuff, hand gripping a real quill with a metal nib, on chroma green. Keyed with
the existing pipeline, mirrored (arm must enter from the right), largest-island
cleaned, and its shoulder end given a horizontal alpha falloff so it melts into
his painted robe. Source kept at `assets/characters/src/arm-quill-source.png`.
Rig: elbow pinned at his torso (0.700, 0.700 of the hall), nib at (3.5%, 94.5%)
of the asset, elbow at (96%, 42%). ONE rotational degree of freedom — the arm
is scaled so elbow→nib exactly spans elbow→target, then rotated to aim, so the
hand and quill can never separate and the arm never stretches.

**Gold ink replaces the red debug curve.** The contour is the intact apple's own
right silhouette over the rows where material is missing, drawn with
`stroke-dasharray` and a gold gradient; the nib rides the drawing head via
`getPointAtLength`, so the line can never appear ahead of the pen.

**Timeline re-ordered to the brief:** approach 0–25, strike/break 25–35,
suspended 35–50, he notices and reaches 50–68, draws 70–90, shards return
staggered along the drawing, copy settles 90–100.
Reversibility probe: arm 0→1→0, gold 0→1→0, shardsOut 0→936→0 — exact.

Known remaining: the fingers do not articulate (the grip is baked into the
generated asset, which already shows a correct writing grip); the reach is the
whole arm moving in rather than a separate reach/grip/lift pose set.

## Full-review correction pass (2026-08-29, late)

**Transition — hard split removed.** The wave was a `clip-path` polygon, which
is by definition a hard cut; that was the "hard section boundary". Replaced with
a **blurred SVG mask** (`#tideMask` + `feGaussianBlur`), so the new world seeps
in with a soft, irregular, water-on-sand edge. Two gotchas fixed on the way: a
zero-sized defs `<svg>` and the mask's default region both killed it — the mask
now carries explicit `userSpaceOnUse` bounds sized to the viewport each frame.
The crest became wide soft foam instead of a drawn line.

**Mask-man reveal — no longer accidental.** The hall now RISES into place:
`--tideRise` runs 26vh → 0 as the tide advances, so early in the wash only the
marble floor and table are above the waterline and the scholar composes upward
rather than surfacing cut through the torso.

**Pen-to-apple readability.** Drawing hand raised above the apple stage
(`#armRig` z-index 10 vs stage 8) so the grip and nib are never occluded;
shoulder anchor moved to (0.815, 0.760) for a longer, more legible reach; and
the drawn contour trimmed to the lower arc (y 256–729) so the sleeve never
swings across his face at the high strokes.

Reversibility re-verified end to end: arm 0→1→0, gold 0→1→0,
shard displacement 0→815→0.

## Disrupted-apple restoration + polish (2026-08-29, night)

1. **Disrupted look restored.** The owner's gold-bitten render pieces
   (apple-body + 12 authored fragments, 1448×1086 canvas) are back as the
   break/scatter/return visuals. The cut-shard system remains on disk but is no
   longer displayed. Completion: as the pen's final strokes land (.91–.96) the
   assembled render **crossfades into the intact apple** (`#appleDone`,
   placed at 6.49%/9.48%/59.05% — precomputed alignment of the 800×900 intact
   canvas into the render canvas at scale 1.069, origin (94,103)). The gold
   contour was remapped into render coordinates the same way.
2. **Inkwell blur fixed.** The smeared horizontal inpaint above the inkwell was
   replaced by cloning the architecture band immediately left of the old quill
   (same size, seam-blended) — clean arches now, no haze.
3. **Arm blend fixed.** Root cause: the shoulder fade had been baked TWICE
   (0.80-start then 0.62-start), producing a translucent smudge across his
   chest. Rebaked from source in one pass: fade from 76% width, gamma 1.2, robe
   tint capped at 0.40. Anchor moved to his resting forearm (0.845, 0.800) so
   the faded end hides behind existing painted mass; rig size capped at 30vw
   and the arm is now **placed by its nib** (rotation-aware) so the pen tip
   stays on target even when capped.
4. **Timeline compression bug.** The piece-return stagger overshot time 1.0
   (last tween ended ≈1.16), silently compressing every position — the real
   reason "everything fired early". Stagger clamped (.70 + i*.016, dur .09);
   verified: pieces hold to .85, crossfade .91→.96, reverse exact.
