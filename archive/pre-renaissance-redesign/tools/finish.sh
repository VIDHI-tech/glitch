#!/usr/bin/env bash
# Turn a raw generation into web-ready scrub footage.
#
# Two jobs, in order:
#   1. Grade it so it stops looking synthetic.
#   2. Encode all-intra so every frame is seekable.
#
# Usage: ./finish.sh raw.mp4 [out-basename] [start] [duration]

set -euo pipefail

RAW="${1:?usage: finish.sh raw.mp4 [basename] [start] [duration]}"
OUT="${2:-hero}"
START="${3:-0}"
DUR="${4:-}"

DIR="$(cd "$(dirname "$0")/.." && pwd)"
VID="$DIR/assets/video"
mkdir -p "$VID"

TRIM=(-ss "$START")
[ -n "$DUR" ] && TRIM+=(-t "$DUR")

# Source dimensions, so the punch-in scales back to exactly where it started.
DIMS=$(ffprobe -v error -select_streams v \
  -show_entries stream=width,height -of csv=p=0 "$RAW")
W="${DIMS%%,*}"
H="${DIMS##*,}"

echo "→ source ${W}x${H}"
ffprobe -v error -select_streams v \
  -show_entries stream=r_frame_rate,nb_frames \
  -show_entries format=duration -of default=noprint_wrappers=1 "$RAW"

# --- the grade -------------------------------------------------------------
# Order is load-bearing: punch in -> soften -> grade -> halation -> aberration
# -> resharpen -> grain. Grain goes last so nothing downstream smears it.
#
# crop      : edge warping from the generator lives in the outer few percent.
#             Punching in 4% and scaling back throws it away.
# gblur     : takes the unnaturally hard edges off before we re-sharpen.
# curves    : crushing the blacks is the biggest single "it looks shot" win,
#             because generated footage routinely sits on lifted, milky blacks.
#             A per-channel version was tried here, to warm the shadow
#             terminator the way marble's subsurface scattering really does
#             (light carries about 8.5mm in red against 3.9mm in blue). It
#             lifted the black floor more than the warmth was worth. Reverted.
# halation  : the correction that matters most here. Generators emit almost no
#             highlight bleed. Threshold the highlights, blur them wide, tint
#             the result red-orange — real halation is red, because light
#             scatters off the film base and re-exposes the red layer — then
#             screen it back. On the gold fracture this is the whole ball game.
#             Threshold in RGB, not with lutyuv: lutyuv floors luma but leaves
#             chroma intact, so the masked-out region stays coloured and screen
#             blending it washes magenta across the entire frame.
# rgbashift : one pixel of chromatic aberration. Not consciously visible, and
#             absent from every synthetic image.
# noise     : temporal grain. The t flag is mandatory; without it the grain is
#             frozen across frames and reads as a dirty sensor rather than film.
GRADE="[0:v]crop=iw*0.96:ih*0.96,scale=${W}:${H}:flags=lanczos,\
gblur=sigma=0.3,\
curves=all='0/0 0.12/0.06 0.5/0.5 1/0.99',\
eq=saturation=0.92:contrast=1.04,\
format=gbrp,split=2[base][hl];\
[hl]lutrgb=r='if(gt(val,200),val,0)':g='if(gt(val,200),val,0)':b='if(gt(val,200),val,0)',\
gblur=sigma=16:steps=3,\
colorchannelmixer=rr=1.0:gg=0.45:bb=0.22[glow];\
[base][glow]blend=all_mode=screen:all_opacity=0.42[hal];\
[hal]rgbashift=rh=1:bh=-1,\
unsharp=luma_msize_x=5:luma_msize_y=5:luma_amount=0.35,\
vignette=PI/5.5,\
noise=alls=5:allf=t+u[v]"

# -tune grain throughout. Without it x264's psy optimisation eats the grain the
# grade just added and the footage goes back to looking plastic. It roughly
# doubles the bitrate, which is the price of the grain surviving at all.
echo "→ graded master"
ffmpeg -hide_banner -loglevel error -y "${TRIM[@]}" -i "$RAW" \
  -filter_complex "$GRADE" -map "[v]" \
  -c:v libx264 -preset slow -crf 14 -tune grain -pix_fmt yuv420p -an \
  "$VID/${OUT}-master.mp4"

# --- the web file ----------------------------------------------------------
# keyint=1 makes every frame a keyframe so currentTime seeks land instantly.
# -bf 0 avoids a frame-reordering bug in older Safari decoders.
# +faststart puts the index up front so seeking works before the file has
# finished downloading.
echo "→ all-intra web file"
ffmpeg -hide_banner -loglevel error -y -i "$VID/${OUT}-master.mp4" \
  -c:v libx264 -preset slow -crf 22 -tune grain -bf 0 \
  -x264-params "keyint=1:min-keyint=1:scenecut=0" \
  -movflags +faststart -pix_fmt yuv420p -an \
  "$VID/${OUT}.mp4"

echo "→ poster"
ffmpeg -hide_banner -loglevel error -y -i "$VID/${OUT}-master.mp4" \
  -frames:v 1 -q:v 3 "$VID/${OUT}-poster.jpg"

echo
echo "→ output"
for f in "$VID/${OUT}.mp4" "$VID/${OUT}-poster.jpg"; do
  printf "  %-28s %8s\n" "$(basename "$f")" "$(ls -lh "$f" | awk '{print $5}')"
done
kf=$(ffprobe -v error -select_streams v -skip_frame nokey \
  -show_entries frame=pts -of csv=p=0 "$VID/${OUT}.mp4" | wc -l | tr -d ' ')
nf=$(ffprobe -v error -select_streams v -count_frames \
  -show_entries stream=nb_read_frames -of csv=p=0 "$VID/${OUT}.mp4")
echo "  $kf keyframes / $nf frames"
