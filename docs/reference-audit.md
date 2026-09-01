# Reference Audit — Shopify Editions Winter '26
Inspected live (browser pane, JS-console probes) + two owner recordings.
Date: 2026-08-29. All findings below are evidence-based, not assumed.

## Confirmed technologies (with evidence)

| Technology | Verdict | Evidence |
|---|---|---|
| WebGL (three.js/R3F, bundled) | CONFIRMED for hero + effect canvases | 2 `<canvas>` elements return live `webgl/webgl2` contexts; `window.THREE` undefined → bundled (matches Shopify's published note re: three.js + React Three Fiber); 18 hashed JS bundles, no library names exposed |
| Lenis smooth scroll | CONFIRMED | `html.lenis` class present at runtime |
| GSAP | NOT exposed | `window.gsap` undefined — either bundled or custom rAF; not verifiable, not required evidence |
| PNG cutout collage | CONFIRMED as the dominant layer system | **314 of 345 `<img>`s are transparent PNGs** (5 webp, 16 jpg, 10 svg), served from cdn.shopify.com |
| Video | Present but secondary | 12 `<video>` elements, lazy, play-on-visibility loops (~7s), never scroll-scrubbed |
| Sticky/pinned sections | CONFIRMED | 15 `position: sticky/fixed` containers; page ≈ 44 viewport-heights |
| Lottie / scroll-jacking | NOT found | no lottie resources; native scrolling with Lenis interpolation |

## DOM & layer architecture
- Page = sequence of id-anchored sections (`#sidekick`, `#agentic`, …) with pinned
  hero/chapter stages and normal-flow product sections between them.
- Composition per chapter: background environment (canvas or full-bleed art) →
  midground cutout props → foreground character PNGs → DOM copy/UI on top.
  Copy is always semantic HTML above the visuals.
- Characters/props are individual transparent PNGs (hence 314) — every major
  object is its own layer, which is what makes per-layer parallax possible.

## Animation architecture & scroll mapping
- Pinned chapter = tall track + sticky viewport stage; local progress =
  scrolled distance / track height (standard ScrollTrigger-style mapping).
- All motion is a pure function of progress → fully reversible up-scroll
  (verified by scrubbing in both directions; no one-way states observed).
- Lenis interpolates scroll (≈0.1 lerp feel), giving the "buttery" scrub.
- Within a chapter: headline moves at a different rate than the portrait
  (type exits upward while portrait holds), video/props slide in on their own
  offsets — parallax through differential progress mapping, not 3D scenes.

## Pointer parallax (measured in earlier session + recordings)
- Cutout layers carry pointer-driven `translate(x,y)` with ~400ms cubic-bezier
  spring (measured inline style `translate(108px,-31px)` mid-gesture).
- Depth ordering: background ≈ few px, props more, characters most (~tens of px),
  accent objects strongest. Recording shows continuous small drift with damping
  and slow return to neutral, plus portrait micro-tilt. Faces never deform.
- Idle life: figures bob slowly with no input; star/glitter field twinkles
  independently (CSS vars `--random-delay/--random-scale/--random-duration`
  per particle — a CSS-driven particle field, not canvas).

## Transition / reveal methods observed
1. **Glitter/particle threshold** between hero and chapters (CSS particle field
   + masked layer parting).
2. **Torn-paper edge** (2:02 recording, Sidekick end): the dark scene ends in an
   irregular torn-parchment mask over the next section — a static ragged-alpha
   edge scrolled naturally, cheap and extremely effective.
3. Two scenes coexist in-viewport during every reveal; no hard cuts.

## Responsive behaviour
- Mobile keeps the same chapters with recomposed layouts (fewer/smaller props,
  weaker or no pointer effects, touch-safe); videos stay play-on-visible.

## Timestamped breakdown — owner recording 2 (Sidekick chapter, 31s)
- 0–6s: pinned composition: starfield WebGL bg, masked portrait right, giant
  headline BEHIND portrait, gold astrolabe left, TOC persists left. Pointer
  drift on portrait/props; periodic natural blink.
- 6–18s: scroll: headline exits upward faster than portrait; serif editorial
  line fades in mid-left; video card slides up from bottom-left; portrait holds
  anchor while sleeves/laptop props shift at their own depths.
- 18–31s: chapter ends via torn-paper edge revealing ivory next-section ground;
  reverse scroll replays everything backward exactly.

## Reusable implementation principles for GLITCH (what we adopt)
1. Transparent-PNG cutout per story object; copy stays DOM.        [adopted]
2. Pinned tracks + progress-pure timelines (GSAP ScrollTrigger).   [adopted]
3. Lenis for scroll interpolation.                                  [adopted]
4. Per-layer springed pointer vars, strongest on accents.          [adopted]
5. Idle bob + twinkle so the scene lives before scroll.            [adopted]
6. Headline behind/around character, exiting at its own rate.      [adopted S2]
7. Torn-paper edge as a section-exit device.                       [planned S2→S3]
8. WebGL only where a particle/lighting effect demands it — our current
   fragment choreography uses pre-rendered pieces + CSS 3D; three.js remains
   unnecessary until a specific effect requires it.                [decision]

## Stack decision (evidence-based)
GSAP ScrollTrigger + Lenis + DOM/CSS-3D layers + pre-rendered PNG assets.
No three.js at this stage: the reference's WebGL serves its starfield/particle
hero; our equivalent surfaces (flecks canvas, fragment depth) are achieved with
lighter techniques at the same perceived quality. Revisit only for a shader
effect that cannot be faked (e.g. refractive gold).
