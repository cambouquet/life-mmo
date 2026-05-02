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

export function drawWarriorSprite(ctx, x, y, facing, frame, phase, colors, moving, skipHalo = false) {
  // 1. Draw Halo FIRST (so it appears BELOW the character)
  if (!skipHalo) {
    const t = (phase / 4.5) % 1
    const ringBrightness = (1 - t) * 0.9
    const inner = Math.max(0, t - 0.22)
    const outer = Math.min(1, t + 0.08)
    const cx = Math.floor(x) + 9   // body center is at x+9 in the 32px sprite (pixels 9-25, center=17, offset by -8 draw origin)
    const cy = Math.floor(y) + 8

    // Safety check for Gradient
    if (isNaN(cx) || isNaN(cy) || !isFinite(cx) || !isFinite(cy)) {
      return;
    }

    // Fixed white color for the wave halo
    const r = 255, g = 255, b = 255;

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 13)
    grd.addColorStop(0,      `rgba(${r},${g},${b},0)`)
    grd.addColorStop(inner,  `rgba(${r},${g},${b},0)`)
    grd.addColorStop(t,      `rgba(${r},${g},${b},${ringBrightness.toFixed(2)})`)
    grd.addColorStop(outer,  `rgba(${r},${g},${b},0)`)
    grd.addColorStop(1,      `rgba(${r},${g},${b},0)`)
    
    ctx.save()
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(cx, cy, 13, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // 2. Draw Character (so it appears ABOVE the halo)
  if (colors) {
    drawVectorWarrior(ctx, x, y, facing, frame, colors, moving)
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
}

import pixelData from '../../components/CharacterEditor/pixel_data.json';

/**
 * Pixel-accurate Vector Warrior drawing function
 * Pre-renders to an offscreen canvas to avoid sub-pixel gaps (vertical lines)
 */
let offscreenPlayerCanvas = null;
let offscreenPlayerCtx = null;
let lastRenderState = "";

// Helper to apply relative shading to a hex color
export const applyShading = (hex, originalBrightness) => {
  if (!hex) return '#000000';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Normalize brightness around 160. 
  // If original was 80, factor is 0.5 (darker). If original was 200, factor is 1.25 (lighter).
  const factor = (originalBrightness || 160) / 160; 
  
  const nr = Math.min(255, Math.floor(r * factor));
  const ng = Math.min(255, Math.floor(g * factor));
  const nb = Math.min(255, Math.floor(b * factor));
  
  return `rgb(${nr}, ${ng}, ${nb})`;
};

export function drawVectorWarrior(ctx, x, y, facing, frame, colors, moving) {
  const { hair, skin, outfit, eyes, secondary, stick } = colors;
  
  // Create or resize offscreen canvas if needed (1:1 scale)
  if (!offscreenPlayerCanvas) {
    offscreenPlayerCanvas = document.createElement('canvas');
    offscreenPlayerCanvas.width = 32;
    offscreenPlayerCanvas.height = 32;
    offscreenPlayerCtx = offscreenPlayerCanvas.getContext('2d', { alpha: true });
    offscreenPlayerCtx.imageSmoothingEnabled = false;
  }
  
  // Generate a key for the current state to see if we actually need to redraw the buffer
  // This prevents the "blank frame" flicker that happens when clearRect and drawing
  // occur at precisely the wrong time relative to the main canvas draw.
  const currentFrameIndex = moving ? (frame % 8) : 0;
  const stateKey = `${facing}-${currentFrameIndex}-${hair}-${skin}-${outfit}-${eyes}-${secondary}-${stick}`;
  
  if (stateKey !== lastRenderState) {
    // Only update the offscreen buffer if the character state (frame/direction/color) changed
    // We clear with a tiny buffer to avoid any alpha-bleed and immediately redraw.
    offscreenPlayerCtx.clearRect(0, 0, 32, 32);
    
    const dirFrames = pixelData[facing] || pixelData.down;
    // Walk cycle usually starts: 0=LeftStep, 1=Standing, 2=RightStep, 3=Standing
    // So if frame 3 is empty, we fall back to frame 1.
    let currentFrame = dirFrames[currentFrameIndex];
    if (!currentFrame || currentFrame.length < 5) {
      currentFrame = dirFrames[0];
    }

    // Draw pixels 1:1 to offscreen buffer
    const len = currentFrame.length;
    for (let i = 0; i < len; i++) {
      const p = currentFrame[i];
      let fill = p.color;
      
      // APPLY SHADING: Instead of flat color, we scale the selected color by the pixel's original brightness
      if (p.type === 'hair') fill = applyShading(hair, p.b);
      else if (p.type === 'skin') fill = applyShading(skin, p.b);
      else if (p.type === 'outfit') fill = applyShading(outfit, p.b);
      else if (p.type === 'eyes') fill = applyShading(eyes, p.b); 
      else if (p.type === 'secondary') fill = applyShading(secondary, p.b); 
      else if (p.type === 'stick') fill = applyShading(stick, p.b);
      else if (p.type === 'accessory') fill = applyShading('#ffd700', p.b); // Shade the gold staff
      
      offscreenPlayerCtx.fillStyle = fill;
      offscreenPlayerCtx.fillRect(p.x, p.y, 1, 1);
    }
    
    lastRenderState = stateKey;
  }

  // Draw the buffer to main canvas
  ctx.save();
  ctx.imageSmoothingEnabled = false; 

  // Position fixes: Ensure we use Math.round to avoid sub-pixel jitter
  const drawX = Math.round(x) - 8;
  const drawY = Math.round(y) - 16;
  
  ctx.translate(drawX, drawY);
  ctx.drawImage(offscreenPlayerCanvas, 0, 0, 32, 32);
  ctx.restore();
}


