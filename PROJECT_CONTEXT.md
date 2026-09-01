# Marble Scroll Project — Complete Context & Implementation Log

**Project**: Interactive scroll-driven website with parallax, 3D CSS transforms, and deterministic reversible animations. Six sections spanning hero, educational content, and courses.

**Location**: `/Users/vidhipalnesto/marble-scroll/renaissance/index.html` (1174+ lines)

**Assets**: `/Users/vidhipalnesto/marble-scroll/assets/renaissance/` (images, videos, keyed frames)

---

## SECTIONS OVERVIEW

### Section 1: Marble Scroll Hero (parallax with cursor-driven motion)
- **Status**: ✅ Implemented parallax (350-700ms interpolation with damping, gamma curve shaping)
- **Layers**: sky (6-8px), trees (±11-14px), students (24-32px), apple (28-35px)
- **Technical**: Normalized cursor input `u = (cx - vw/2) / (vw/2)`, gamma curve `shape(u) = sign(u) * |u|^0.6`, frame-independent damping with `TAU_FOLLOW = 0.135`, `TAU_SETTLE = 0.42`
- **Key Bug Fixed**: Parallax was insensitive to small cursor movements. **Solution**: Gamma curve + 25% amplitude boost.
- **CSS**: Layers use `translate:calc(var(--mx)*A) calc(var(--my)*B)` pattern where `--mx` and `--my` are RAF-updated CSS vars
- **JS State**: `const PX = { tx: 0, ty: 0, cx: 0, cy: 0, home: true, last: 0 }` tracks damped position

### Section 2: What is Glitch? (hall parallax + animated shards)
- **Status**: ✅ Depth-separated parallax (background + foreground at different rates)
- **Technique**: Hall split into `hall-bg.png` (background) and `hall-fg.png` (foreground: man + table) via color/saturation thresholding
- **Apple Shards**: Animation with scroll-driven GSAP ScrollTrigger; shards return to center for reassembly, whole apple swaps in at `.935` progress
- **Key Bug Fixed**: Shards and whole apple were both visible during reassembly. **Solution**: Retimed shard return to home at `.672 + i*.0112` (all assembled by ~.891), swap at `.935`
- **Parallax Layers**: Comments say "FROM THE CHANNEL" in Section 2 — **user requested removal** when they saw the shards disruption; commented out (not deleted)

### Section 3: Our Mission (laptop on statue lap + content layout)
- **Status**: ✅ Laptop placed on marble statue lap with proper 3D perspective and occlusion
- **Laptop Model**: Two marble slabs (lid + base) with hinge, gold vein texture, perspective-corrected
- **3D Geometry**:
  - Yaw rotation: `+188 * turn` (right edge recedes, left comes forward)
  - Deck pitch: `rotateX(66 + 18*fe)` so keys stay hidden but base slab remains visible
  - Lid opening: `A += (96 - A) * easeIO(fly)` to ~96° (perpendicular)
  - Scale: `0.96` of lap width
- **Occluder Mask**: `lap-occluder.png` traced from campus statue (forearm, hand, robe fold) applied via `mask-image` on `#lapMask` so real photo shows through in front; laptop sits cleanly on his lap without pasted overlay look
- **As of 2026-09-01**: Occluder is **FOLD-ONLY** (arm removed so hand is hidden by laptop naturally)
- **Edge Thickness**: 
  - `--rim = 1.6% of laptop width` (was 4.8%, read as tray lip)
  - `--drim = 1.25x --rim` (deck slab edge)
  - Shaded gradient (light → mid → dark) not flat fill
  - **NO rim HTML elements** (`#lidRimL/R/T/B`, `#deckRimL/R/Back`) — removed; edges are now purely CSS background gradients
- **deckFront**: Band under keyboard — **removed entirely** (CSS + HTML)
- **Content Layout**: Heading "OUR MISSION" at top center (user requested move from right side), subheading at left, 3 bullets at right, paragraph "Post-AI, the rules…" **removed**

### Section 4: Cohort (film carousel + course frames)
- **Status**: ✅ Four video frames in horizontal scroll-driven carousel
- **Frames**: `.filmW` wrapper, staggered entrance from bottom via GSAP ScrollTrigger (similar to Section 2 apple shards)
- **Key Bug Fixed**: GSAP was clearing `translate` on `.filmW` and `.maleW` (animated in scroll timeline). **Solution**: Wrapped animated elements in inner divs (`#femP`, `#maleP`) that GSAP never touches; parallax translate moved to inner layer

### Section 5: Courses (framed videos, 4-across layout)
- **Status**: ✅ Brown cassetta frame (aged gilt, ca. 1630, Met 461445), 4 frames in row, bottom-up entrance animation
- **Frame Image**: `frame-antique.png` (2497×2155px after keying)
- **Keying Method**: Flood-fill on "near-white AND neutral" (min > 236, max-min < 14) to isolate white ground; gilding excluded because it's pale
- **Color Aging**: Warm shift via channel reduction (r×1.02, g×0.94, b×0.76) + luminance-dependent darkening to simulate centuries of oxidation
- **9-Slice**: `border-image-slice: 496 490 490 504` (frame carving holds at all sizes)
- **Layout**: `grid-template-columns: repeat(2, 1fr)` for 4 frames (2×2)
- **Animation**: Staggered scroll-driven entrance like Section 4 (bottom → top), one-by-one appearance
- **Background**: SVG noise/turbulence texture on `#s5wall` (user requested rough texture)
- **Videos**: `course-1.mp4` (Mona Lisa, 960px, crf 27); courses 2-6 need video wiring

---

## CRITICAL JAVASCRIPT CONCEPTS

### Parallax Engine (Section 1 & 2)
```javascript
const PX = { tx: 0, ty: 0, cx: 0, cy: 0, home: true, last: 0 };
const TAU_FOLLOW = 0.135;  // fast damping
const TAU_SETTLE = 0.42;   // slow settle
const shape = (u) => Math.sign(u) * Math.pow(Math.abs(u), 0.6);  // gamma curve

// Frame-independent damping in RAF ticker
gsap.ticker.add((t) => {
  const dt = Math.min(0.05, PX.last ? t - PX.last : 0.016);
  const tau = PX.home ? TAU_SETTLE : TAU_FOLLOW;
  const eased = Math.exp(-tau / dt);
  
  PX.tx += (PX.cx - PX.tx) * (1 - eased);
  PX.ty += (PX.cy - PX.ty) * (1 - eased);
  
  root.style.setProperty('--mx', PX.tx.toFixed(3));
  root.style.setProperty('--my', PX.ty.toFixed(3));
  
  PX.last = t;
});
```

### Occluder Mask (Section 3)
```javascript
function maskHand(fly) {
  const blend = easeOut2(seg(fly, 0.35, 1));
  const grad = `radial-gradient(circle at ${(cx-lapL+8).toFixed(0)}px ${(cy-lapT+12+36*fly).toFixed(0)}px, transparent 0%, black 48px)`;
  lapMask.style.maskImage = grad;
  lapMask.style.maskRepeat = 'no-repeat';
  lapMask.style.maskSize = '400% 400%';
  lapMask.style.maskPosition = 'center';
}
```

### Scroll-Driven Timelines (Sections 2, 4, 5)
- GSAP ScrollTrigger with `scrub: true` for reversible animation
- Pixel-diff reversibility check: forward scroll → backward scroll yields 0–0.057% frame difference at test positions

---

## KEY LEARNINGS & FIXES

### Laptop Screen Clipping (Section 3)
**Problem**: Laptop screen edges were cut off by `mask-image: repeat` default  
**Fix**: Set `mask-repeat: no-repeat; mask-size: 400% 400%; mask-position: center;` with oversized mask container

### Laptop Thickness Not Visible
**Problem**: No slab edges on lid/deck; screen looked like a flat sheet  
**Fix**: Initially added `.lidRim` / `.deckRim` elements with 3D rotateX/rotateY transforms. **Later removed** (2026-09-01) because they were too thick (4.8% width = 23px on 490px laptop = tray lip). Now edges are purely CSS gradients at 1.6% width.

### Keyboard Keys Visible When Edge-On
**Problem**: Laptop base showed underside when rotated away  
**Fix**: (1) Hide #deckPlane and #deckFront when not facing us, (2) adjust pitch `rotateX(66 + 18*fe)` to hide keys but show base, (3) yaw at `+188*turn` for correct left-forward perspective

### Parallax Insensitive to Small Cursor Moves
**Problem**: Linear mapping produced fractional-pixel shifts, no perceptible response  
**Fix**: Apply gamma curve `shape(u) = sign(u) * |u|^0.6` and boost all amplitudes ~25%

### GSAP Clearing Translate
**Problem**: Elements in scroll-driven timelines had `translate` property cleared  
**Fix**: Wrap animated elements with inner divs that GSAP never touches; move parallax translate to inner layer

### Laptop Over "What is Glitch" Table
**Problem**: Laptop entrance tied to Section 2 hand variable, appeared during S2→S3 transition  
**Fix**: Tie entrance to Section 3 progress: `const ent = easeOut2(seg(p3, 0.015, 0.15))`

### Apple Double-Rendering
**Problem**: Both shards in flight and whole apple visible simultaneously  
**Fix**: Retimed shard return to home at `.672 + i*.0112` (all assembled by ~.891) with swap at `.935`

### Courses Frames Too Bright
**Problem**: Original CSS had bright gold gradients (Met 459778)  
**Fix**: Replaced with Met 461445 (ca. 1630 cassetta, oak, brown-red bole, aged gilt). Custom keying on "near-white AND neutral" (not brightness alone). Warm color shift + luminance-dependent darkening.

### Lap Occluder Confusion
**User asked**: "Why you even using lap-occluder.png?"  
**Clarification**: It's NOT decorative. It's a mask I traced from the campus photo marking the statue's forearm, hand, and robe fold. Applied as a mask so the **real photo shows through in front** of the laptop — his arm and fingers cross over the laptop instead of the laptop sitting flat on him. Alternative: drop it entirely for clean laptop-on-lap without overlap.  
**Decision** (2026-09-01): Keep occluder but **FOLD-ONLY** — arm removed, hand is hidden by laptop naturally.

---

## DETERMINISTIC REVERSIBILITY

All scroll-driven animations are **frame-rate-independent** and **deterministically reversible**.

**Verification** (2026-09-01):
- Scroll forward to positions 17450, 18400, 19500 → capture screenshots (FF)
- Scroll backward from 19500 to 17450 → capture screenshots (FR)
- Pixel-diff comparison: 17450=0%, 18400=0.057%, 19500=0.057%

This proves the scroll state machine is fully reversible.

---

## CURRENT STATE (2026-09-01)

### Completed
✅ Section 1: Cursor-driven parallax with gamma curve, all layers responding to small movements  
✅ Section 2: Depth-separated hall parallax, apple shards with deterministic reassembly  
✅ Section 3: Laptop on statue lap, correct 3D angle (yaw +188°, keys hidden, base shows), thin honest edges (1.6%), occluder fold-only  
✅ Section 4: Four video frames with staggered scroll-driven entrance  
✅ Section 5: Brown cassetta frames (ca. 1630), 4 across, bottom-up entrance animation, rough texture background  
✅ No console errors, all animations reversible (0–0.057% pixel diff on reverse)

### Pending
- [ ] Wire videos for courses 2–6 (currently only course-1.mp4 active in first frame)
- [ ] Mobile responsiveness check (captured at 375×812 mobile; layout verified)
- [ ] Browser pane unusable (reports 0×0 viewport); inspection via headless puppeteer rig only

---

## TECHNICAL STACK

- **HTML/CSS/JS**: Vanilla, no frameworks (except GSAP for scroll timelines)
- **GSAP**: ScrollTrigger for scroll-driven animations with `scrub: true`
- **3D Transforms**: `perspective`, `rotateX`, `rotateY`, `translateZ`
- **CSS Variables**: `--mx`, `--my` for parallax; `--rim`, `--drim` for edge thickness
- **Masks**: `mask-image` with radial-gradient (punched occlusion)
- **Border Images**: 9-slice keying for frame scaling
- **Verification Rig**: Puppeteer headless captures at 1890×985 (desktop) and 375×812 (mobile)

---

## FILE PATHS

- **Main**: `/Users/vidhipalnesto/marble-scroll/renaissance/index.html`
- **Laptop Lid**: `/Users/vidhipalnesto/marble-scroll/assets/renaissance/laptop-lid.png`
- **Laptop Deck**: `/Users/vidhipalnesto/marble-scroll/assets/renaissance/laptop-deck.png`
- **Frame (Antique)**: `/Users/vidhipalnesto/marble-scroll/assets/renaissance/frame-antique.png`
- **Occluder Mask**: `/Users/vidhipalnesto/marble-scroll/assets/renaissance/lap-occluder.png`
- **Course Video 1**: `/Users/vidhipalnesto/marble-scroll/assets/courses/course-1.mp4`
- **Build/Keying**: `/private/tmp/.../scratchpad/rig/` (puppeteer, image processing scripts)

---

## HOW TO CONTINUE

1. **Next Chat Invocation**: Use the command below to load this context
2. **Pending Work**: Video wiring (courses 2–6), mobile testing, any additional parallax/layout tweaks
3. **Key Contacts**: 
   - User email: `tabhishek6380@gmail.com`
   - Work memory: `/Users/vidhipalnesto/.claude/projects/-Users-vidhipalnesto/memory/`
   - Section 3 details: `marble-scroll-section3.md`
