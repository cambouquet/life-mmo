import sheetUrl from '../../assets/sprites/03000_magicienne.png'

// Sheet: 320×256 — 10 cols × 8 rows at 32×32 px per frame
// Row layout: 0=down, 1=left, 2=right, 3=up
// Walk cycle: col 0 (left-step), col 2 (right-step)
const FRAME_W = 32
const FRAME_H = 32
const ROW = { down: 0, right: 1, up: 2, left: 3 }
const WALK_COLS = [0, 2]

const sheet = new Image()
sheet.src = sheetUrl

export function drawWarriorSprite(ctx, x, y, facing, frame, phase, colors) {
  // Use vector character if colors are provided (custom character)
  if (colors) {
    drawVectorWarrior(ctx, x, y, facing, frame, colors)
  } else {
    if (!sheet.complete || sheet.naturalWidth === 0) return
    const row = ROW[facing] ?? ROW.down
    const col = WALK_COLS[frame & 1]
    const bob = (frame & 1) ? 1 : 0

    ctx.save()
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(
      sheet,
      col * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H,
      Math.floor(x) - 8, Math.floor(y) + bob - 16, FRAME_W, FRAME_H
    )
    ctx.restore()
  }

  // Wave ring: 1 per second. phase increments at 4.5/s → divide by 4.5
  const t = (phase / 4.5) % 1
  const brightness = (1 - t) * 0.9
  const inner = Math.max(0, t - 0.22)
  const outer = Math.min(1, t + 0.08)
  const cx = Math.floor(x) + 8
  const cy = Math.floor(y) + 8
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 13)
  grd.addColorStop(0,      'rgba(192,64,255,0)')
  grd.addColorStop(inner,  'rgba(192,64,255,0)')
  grd.addColorStop(t,      `rgba(192,64,255,${brightness.toFixed(2)})`)
  grd.addColorStop(outer,  'rgba(192,64,255,0)')
  grd.addColorStop(1,      'rgba(192,64,255,0)')
  ctx.save()
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.arc(cx, cy, 13, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

import pixelData from '../../components/CharacterEditor/pixel_data.json';

/**
 * Pixel-accurate Vector Warrior drawing function
 * Pre-renders to an offscreen canvas to avoid sub-pixel gaps (vertical lines)
 */
let offscreenPlayerCanvas = null;
let offscreenPlayerCtx = null;

function drawVectorWarrior(ctx, x, y, facing, frame, colors) {
  const { hair, skin, outfit } = colors;
  
  // Create or resize offscreen canvas if needed (1:1 scale)
  if (!offscreenPlayerCanvas) {
    offscreenPlayerCanvas = document.createElement('canvas');
    offscreenPlayerCanvas.width = 32;
    offscreenPlayerCanvas.height = 32;
    offscreenPlayerCtx = offscreenPlayerCanvas.getContext('2d', { alpha: true });
  }
  
  // Clear offscreen to prevent "smearing" or ghosting
  offscreenPlayerCtx.clearRect(0, 0, 32, 32);
  
  // Draw pixels 1:1 to offscreen buffer
  pixelData.forEach(p => {
    let fill = p.color;
    if (p.type === 'hair') fill = hair;
    else if (p.type === 'skin') fill = skin;
    else if (p.type === 'outfit') fill = outfit;
    
    offscreenPlayerCtx.fillStyle = fill;
    // Standard 1x1 fill on the 1:1 canvas
    offscreenPlayerCtx.fillRect(p.x, p.y, 1, 1);
  });

  // Draw the buffer to main canvas
  ctx.save();
  // CRITICAL: Disable smoothing so the 32x32 buffer is scaled up as sharp blocks
  ctx.imageSmoothingEnabled = false; 
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;

  // Render centered on the tile grid position
  ctx.translate(Math.floor(x), Math.floor(y));
  ctx.drawImage(offscreenPlayerCanvas, 0, 0, 32, 32);
  ctx.restore();
}


