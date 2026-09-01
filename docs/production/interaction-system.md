# GLITCH — Interaction System (Phase A)

Principles extracted from Shopify Editions Winter '26 (measured live, not
copied): Lenis-style eased motion, sticky pinned chapters, pointer-spring
parallax on cutout layers (`translate(…) transition 400ms cubic-bezier`),
CSS-var-driven particle field for the threshold, a framed roman-numeral chapter
TOC, one playful accent object per world, HTML copy over theatrical visuals.
Reinterpreted for GLITCH below — no Shopify artwork, layout or branding reused.

## 1. Mouse parallax
`pointermove` → normalized target (±4px base) → eased follower (0.08/frame) →
CSS vars `--mx/--my` on `:root`. Layer wrappers `.plx[data-depth="1|2|3"]`
multiply: bg ×1 (≈2–4px), mid ×3 (≈6–12px), fg ×6 (≈12–24px). Wrappers only —
child reveal transforms never conflict. Off on touch and reduced-motion.

## 2. Scroll reveal
`.rv` elements: `data-rv="in out"` against chapter-local progress; initial
state composed from `--rv-y/--rv-s/--rv-r/--rv-b` (translate/scale/rotate/blur)
per element; `.on` transitions to identity. Class toggling + CSS transitions
means the reverse plays automatically on scroll-up. Each chapter has ≥3 staged
reveal groups (e.g. ch3 cards at .08/.30/.52).

## 3. Portal transition (reusable, ×2)
`makePortal(section, seed)` — canvas gold-particle field (deterministic
`hash(i,seed)` positions; twinkle from a time clock; density peaks mid-p via
`sin(πp)`), a few pale marble-chip rectangles among the gold, one thin cyan
aberration polyline along the tear's left lip, and an irregular vertical tear:
a jagged polygon `clip-path` on the `.portal-through` layer whose half-width
grows with p — the next chapter's world is literally visible through the
opening. Fully scrubbed: scroll back and the threshold closes.

## 4. Playful accent objects
- ch2: **vermilion irregular polygon** — sits still while the room organizes,
  then rotates and walks against the grid (the one thing that won't align).
- ch3: **vermilion learning token** riding a full orbit across the chapter +
  a **mechanical gear** that only turns as you scroll.
- ch4: **gold passed object** traveling node-to-node along the constellation
  spine (knowledge moving between people, literally).
- ch5: **gold key** that tilts toward the lock on hover.
All meaningful, none decorative; each is `data-placeholder` for Phase B art.

## 5. Micro-interactions
CTA lift+glow on hover/focus; nav rail labels slide out on hover/focus;
learning cards (focusable, `tabindex=0`) get gold border + deep shadow on
hover/focus; key rotates on hover. All `:focus-visible` outlined.

## 6. Reversibility
No one-way state anywhere: painters are pure functions of p; reveals/copy are
class toggles with symmetric transitions; the only fire-once effect (wordmark
micro-glitch) re-arms whenever its beat re-enters. Scroll up = story rewinds.

## 7. Chapter navigation
Fixed rail: roman numeral I–V, label on hover/focus, `aria-current` on the
active chapter, global progress hairline, click → native smooth
`scrollIntoView` (instant under reduced-motion). Bottom compact bar on mobile.
`<nav aria-label="Chapters">` + real `<button>`s = keyboard operable.

## Accessibility
Semantic copy in HTML; decorative SVG `aria-hidden`; placeholders labeled via
`data-placeholder`; reduced-motion = static readable page; no scroll-jacking;
no layout shift (all pinned stages are fixed-height; animations are
transform/opacity only).

## Performance notes
- transform/opacity + clip-path only; no layout-triggering properties in loops.
- Painters run only for sections intersecting the viewport.
- Canvas exists only in the two portals (≤170 particles desktop, 90 mobile).
- Video seek gated at Δ>0.008s (all-intra file, every frame a keyframe).
- Single rAF loop; SVG attribute writes bounded (~24 desks, 9 nodes, 14 lines).
- Lazy media: only ch1 has heavy media; later chapters are SVG/CSS (bytes, not
  megabytes), so nothing else needs network lazy-loading yet — revisit in
  Phase B when real footage lands in ch2+.
