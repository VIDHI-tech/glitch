#!/usr/bin/env node
/**
 * Procedural stand-in for the hero morph. Writes rgb24 frames to stdout for ffmpeg.
 *
 * The point is not beauty — it is that every frame is visibly distinct and the
 * motion is monotonic in t, so scrub accuracy and dropped frames are obvious by eye.
 * Shape language deliberately matches the real concept: a rough block whose upper
 * body resolves into a figure while the base stays unhewn, with the gold moving
 * as a cut-line at the boundary rather than as decoration laid on top.
 *
 * Usage: node gen-placeholder.mjs [--w 1280] [--h 720] [--frames 240]
 */

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i === -1 ? d : Number(process.argv[i + 1]);
};

const W = arg('w', 1280);
const H = arg('h', 720);
const FRAMES = arg('frames', 240);

// ---------------------------------------------------------------- noise field

// Hash-based value noise. Deterministic, so the marble grain is locked to the
// stone across frames instead of boiling.
function hash2(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

function fbm(x, y, oct = 4) {
  let sum = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) {
    sum += amp * valueNoise(x * f, y * f);
    amp *= 0.5;
    f *= 2.07;
  }
  return sum;
}

// Marble grain + vein field, precomputed once at full resolution.
const grain = new Float32Array(W * H);
const vein = new Float32Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const nx = x / H, ny = y / H; // aspect-correct
    grain[y * W + x] = fbm(nx * 18, ny * 18, 4);
    // Veins: warped stripes, the classic turbulence trick.
    const warp = fbm(nx * 3, ny * 3, 3) * 2.2;
    vein[y * W + x] = Math.abs(Math.sin((nx * 4 + ny * 1.5 + warp) * Math.PI));
  }
}

// Dust motes drifting in the key light.
const MOTES = 90;
const motes = Array.from({ length: MOTES }, (_, i) => ({
  x: hash2(i, 11),
  y: hash2(i, 23),
  z: 0.35 + hash2(i, 37) * 0.65,   // depth -> size and brightness
  drift: (hash2(i, 51) - 0.5) * 0.06,
  rise: 0.02 + hash2(i, 67) * 0.05,
}));

// ------------------------------------------------------------------- profiles

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// Both shapes are described as a half-width and a centre offset per scanline,
// which makes the morph a straight lerp and keeps the silhouette watertight.
// yn is 0 at the top of the block, 1 at its base.

// The block must stay visibly wider than the figure at every height, otherwise
// there is nothing to carve away and the morph reads as a wobble rather than a
// release. These two functions are tuned as a pair.

function blockProfile(yn) {
  // Quarried block: near-rectangular, with chipped irregularity down the sides.
  const rough = (fbm(yn * 9, 3.1, 3) - 0.5) * 0.020;
  const taper = 0.255 + yn * 0.015;
  return { half: taper + rough, cx: 0.5 + rough * 0.4, gap: 0 };
}

function figureProfile(yn) {
  // Contrapposto figure, one arm raised across the head. Widths as a fraction
  // of frame height so proportions hold at any resolution. Peak width (shoulders
  // plus arm) stays under the block half-width above.
  let half;
  if (yn < 0.07) half = 0.0;                                                  // headroom in the stone
  else if (yn < 0.11) half = lerp(0.012, 0.052, smoothstep(0.07, 0.11, yn));
  else if (yn < 0.20) half = 0.056;                                           // head
  else if (yn < 0.24) half = lerp(0.056, 0.034, smoothstep(0.20, 0.24, yn));  // neck
  else if (yn < 0.32) half = lerp(0.034, 0.145, smoothstep(0.24, 0.32, yn));  // shoulders
  else if (yn < 0.52) half = lerp(0.145, 0.092, smoothstep(0.32, 0.52, yn));  // torso -> waist
  else if (yn < 0.62) half = lerp(0.092, 0.112, smoothstep(0.52, 0.62, yn));  // hips
  else if (yn < 0.80) half = lerp(0.112, 0.086, smoothstep(0.62, 0.80, yn));  // thighs
  else half = lerp(0.086, 0.062, smoothstep(0.80, 1.0, yn));                  // calves

  // Weight on one leg: the centreline drifts, the classical S-curve.
  const cx = 0.5 + Math.sin(yn * Math.PI * 1.15) * 0.028 - 0.011;

  // Raised arm thickens one edge from the shoulder up past the head.
  const arm = smoothstep(0.32, 0.19, yn) * smoothstep(0.07, 0.13, yn) * 0.085;

  // Gap between the legs, opening below the hips.
  const gap = yn > 0.64 ? smoothstep(0.64, 0.76, yn) * 0.030 : 0;

  return { half: half + arm * 0.5, cx: cx + arm * 0.5, gap };
}

// ------------------------------------------------------------------ rendering

const frame = Buffer.alloc(W * H * 3);
const S = H; // shape scale reference

// 5x7 glyphs, digits plus slash, for the frame counter.
const GLYPHS = {
  '0': [0x0e, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0e],
  '1': [0x04, 0x0c, 0x04, 0x04, 0x04, 0x04, 0x0e],
  '2': [0x0e, 0x11, 0x01, 0x02, 0x04, 0x08, 0x1f],
  '3': [0x1f, 0x02, 0x04, 0x02, 0x01, 0x11, 0x0e],
  '4': [0x02, 0x06, 0x0a, 0x12, 0x1f, 0x02, 0x02],
  '5': [0x1f, 0x10, 0x1e, 0x01, 0x01, 0x11, 0x0e],
  '6': [0x06, 0x08, 0x10, 0x1e, 0x11, 0x11, 0x0e],
  '7': [0x1f, 0x01, 0x02, 0x04, 0x08, 0x08, 0x08],
  '8': [0x0e, 0x11, 0x11, 0x0e, 0x11, 0x11, 0x0e],
  '9': [0x0e, 0x11, 0x11, 0x0f, 0x01, 0x02, 0x0c],
  '/': [0x01, 0x02, 0x02, 0x04, 0x08, 0x08, 0x10],
};

function drawText(buf, text, ox, oy, scale, r, g, b) {
  let cx = ox;
  for (const ch of text) {
    const glyph = GLYPHS[ch];
    if (glyph) {
      for (let gy = 0; gy < 7; gy++) {
        for (let gx = 0; gx < 5; gx++) {
          if (!(glyph[gy] & (1 << (4 - gx)))) continue;
          for (let sy = 0; sy < scale; sy++) {
            for (let sx = 0; sx < scale; sx++) {
              const px = cx + gx * scale + sx, py = oy + gy * scale + sy;
              if (px < 0 || px >= W || py < 0 || py >= H) continue;
              const o = (py * W + px) * 3;
              buf[o] = r; buf[o + 1] = g; buf[o + 2] = b;
            }
          }
        }
      }
    }
    cx += 6 * scale;
  }
}

function renderFrame(f) {
  const t = FRAMES === 1 ? 0 : f / (FRAMES - 1);

  // The carve travels top-down. Held flat at the start so the block reads as
  // inert stone before anything happens, then eased so it settles rather than
  // slamming into the final pose.
  const carve = smoothstep(0.12, 0.94, t);
  // Stops around four fifths of the way down: the figure is freed, the base is
  // still the block it came out of.
  const carveY = carve * 0.88 - 0.09;   // boundary position in shape space
  const band = 0.085;                   // thickness of the glowing cut zone

  // Gold ramps in ahead of the carve and fades as the figure resolves.
  const goldEnergy = smoothstep(0.06, 0.30, t) * (1 - smoothstep(0.82, 1.0, t) * 0.45);

  // Slow push-in on the subject.
  const zoom = 1 + t * 0.07;
  const shapeH = 0.80 * zoom;
  const shapeTop = 0.5 - shapeH * 0.52;

  for (let y = 0; y < H; y++) {
    const yv = y / H;

    // Background: cold desaturated falloff, darker at the base.
    const bgGrad = 0.085 - yv * 0.030;

    for (let x = 0; x < W; x++) {
      const xv = x / W;
      const o = (y * W + x) * 3;
      const gi = y * W + x;

      // ---- background + vignette
      const dx = (xv - 0.5) * 1.35, dy = (yv - 0.46) * 1.35;
      const vig = 1 - clamp01(Math.sqrt(dx * dx + dy * dy) * 1.15) * 0.75;
      const bgN = (grain[gi] - 0.5) * 0.016;
      let R = (bgGrad * vig + bgN) * 255;
      let G = (bgGrad * vig * 1.01 + bgN) * 255;
      let B = (bgGrad * vig * 1.09 + bgN) * 255;

      // ---- shape space
      const yn = (yv - shapeTop) / shapeH;

      if (yn >= 0 && yn <= 1) {
        const bp = blockProfile(yn);
        const fp = figureProfile(yn);

        // How far this scanline has been carved: 0 = raw block, 1 = figure.
        // The cut descends, so the head is freed first and the base is still
        // unhewn stone at the end — the Prigioni read, not a finished statue.
        const resolved = smoothstep(carveY + band, carveY - band, yn);
        const cut = 1 - resolved;

        // Profile widths are authored in height-fractions, so convert into the
        // normalised x space or the block comes out landscape on a wide frame.
        const AR = H / W;
        const half = lerp(bp.half, fp.half, resolved) * zoom * AR;
        const cxp = 0.5 + (lerp(bp.cx, fp.cx, resolved) - 0.5) * AR;
        const gap = fp.gap * resolved * zoom * AR;

        const rel = xv - cxp;
        const arel = Math.abs(rel);
        const inside = arel <= half && !(gap > 0 && arel < gap);

        if (inside) {
          // Marble: cool white, key light from upper left, veins in the grain.
          const nl = grain[gi];
          const vn = Math.pow(vein[gi], 2.4);
          const key = 0.62 + (1 - xv) * 0.20 + (1 - yv) * 0.16;
          const edge = smoothstep(half, half * 0.72, arel); // rim falloff
          let lum = key * (0.86 + nl * 0.20) * (0.30 + edge * 0.74);
          lum *= 1 - vn * 0.14;                              // veins darken

          // Unhewn portion stays rougher and duller than the finished figure.
          const roughness = (1 - resolved) * 0.5;
          lum *= 1 - roughness * 0.16 + (nl - 0.5) * roughness * 0.30;

          R = lum * 232;
          G = lum * 231;
          B = lum * 226;

          // ---- gold: cut-line at the carve boundary, plus inscriptions above it
          const atCut = Math.exp(-Math.pow((cut - 0.5) / 0.16, 2));
          let gold = atCut * goldEnergy * 1.15;

          // Inscription rows on already-carved stone. Dashes gated by hash so
          // they read as glyph runs rather than a continuous rule.
          if (resolved > 0.10) {
            const row = Math.floor(yv * H / 13);
            const cell = Math.floor((rel * S) / 9);
            const on = hash2(cell, row) > 0.46 ? 1 : 0;
            const rowPhase = hash2(row, 7);
            const written = smoothstep(rowPhase * 0.55, rowPhase * 0.55 + 0.22, t);
            const rowBand = 1 - Math.abs(((yv * H) % 13) - 5) / 5;
            if (on && rowBand > 0) {
              gold += rowBand * written * resolved * goldEnergy * 0.85;
            }
          }

          if (gold > 0) {
            const gclamped = clamp01(gold);
            R = lerp(R, 255, gclamped * 0.92);
            G = lerp(G, 186, gclamped * 0.92);
            B = lerp(B, 74, gclamped * 0.92);
          }
        } else {
          // Gold bleeds a little onto the air just outside the cut.
          const nearEdge = smoothstep(half + 0.030, half, arel);
          const atCut = Math.exp(-Math.pow((cut - 0.5) / 0.16, 2));
          const bleed = nearEdge * atCut * goldEnergy * 0.55;
          if (bleed > 0) {
            R = lerp(R, 255, bleed);
            G = lerp(G, 186, bleed);
            B = lerp(B, 74, bleed);
          }
        }
      }

      frame[o] = R < 0 ? 0 : R > 255 ? 255 : R;
      frame[o + 1] = G < 0 ? 0 : G > 255 ? 255 : G;
      frame[o + 2] = B < 0 ? 0 : B > 255 ? 255 : B;
    }
  }

  // ---- dust motes, drifting up through the key light
  for (const m of motes) {
    const mx = (m.x + m.drift * t + 1) % 1;
    const my = (m.y - m.rise * t * 2 + 1) % 1;
    const px = Math.floor(mx * W), py = Math.floor(my * H);
    const size = Math.max(1, Math.round(m.z * 2.4));
    const bright = m.z * 150 * (0.4 + 0.6 * (1 - mx));
    for (let sy = -size; sy <= size; sy++) {
      for (let sx = -size; sx <= size; sx++) {
        const qx = px + sx, qy = py + sy;
        if (qx < 0 || qx >= W || qy < 0 || qy >= H) continue;
        const d = Math.sqrt(sx * sx + sy * sy) / (size + 0.6);
        if (d > 1) continue;
        const a = (1 - d) * (1 - d) * 0.55;
        const o = (qy * W + qx) * 3;
        frame[o] = Math.min(255, frame[o] + bright * a);
        frame[o + 1] = Math.min(255, frame[o + 1] + bright * a * 0.98);
        frame[o + 2] = Math.min(255, frame[o + 2] + bright * a * 0.92);
      }
    }
  }

  // ---- scrub telemetry: frame counter and progress rule
  const pad = (n) => String(n).padStart(3, '0');
  drawText(frame, `${pad(f)}/${pad(FRAMES - 1)}`, 28, 26, 3, 255, 190, 80);
  const barW = Math.round(t * (W - 56));
  for (let by = H - 34; by < H - 30; by++) {
    for (let bx = 28; bx < 28 + barW; bx++) {
      const o = (by * W + bx) * 3;
      frame[o] = 255; frame[o + 1] = 190; frame[o + 2] = 80;
    }
  }
  return frame;
}

// --------------------------------------------------------------------- stream

let i = 0;
function pump() {
  while (i < FRAMES) {
    const buf = renderFrame(i);
    i++;
    if (!process.stdout.write(buf)) {
      process.stdout.once('drain', pump);
      return;
    }
    if (i % 30 === 0) process.stderr.write(`  rendered ${i}/${FRAMES}\n`);
  }
  process.stdout.end();
}
process.stderr.write(`Rendering ${FRAMES} frames at ${W}x${H}\n`);
pump();
