import sheetUrl from '../../assets/sprites/03000_magicienne.png'

import pixelData from '../../components/CharacterEditor/pixel_data.json';

const CV = 32

export function drawHead(ctx, facing, expr, colors) {
  ctx.clearRect(0, 0, CV, CV)

  if (colors) {
    drawVectorHead(ctx, colors, facing);
    return
  }
}

// Helper to calculate perceived brightness
function getBrightness(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b);
}

// Helper to apply relative shading to a hex color
const applyShading = (hex, originalBrightness) => {
  if (!hex) return '#000000';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Normalize around 160 (mid-bright) for dark shades.
  // For lighter skin tones, we normalize higher to preserve highlight detail.
  const factor = (originalBrightness || 160) / 160; 
  
  const nr = Math.min(255, Math.floor(r * factor));
  const ng = Math.min(255, Math.floor(g * factor));
  const nb = Math.min(255, Math.floor(b * factor));
  
  return `rgb(${nr}, ${ng}, ${nb})`;
};

/**
 * Pixel-accurate Head drawing function for the HUD
 * Uses the same pixelData extraction logic as the warrior
 */
function drawVectorHead(ctx, colors, facing) {
  const { hair, skin, outfit } = colors;
  
  const dirFrames = pixelData[facing] || pixelData.down;
  const standFrame = dirFrames[1];

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // 1. Isolate Core Character Head Pixels (Pure Character, No Accessories)
  let headPixels = standFrame.filter(p => {
    // Only look at the top part of the sprite (head region + hat)
    if (p.y > 22) return false;

    // RULE 1: Remove accessory (The staff/weapon)
    if (p.type === 'accessory') return false;

    // RULE 2: Specific cleaning for the staff's trail in rotations
    // Even if tagged, let's keep the head centered around x=11..21
    if (facing === 'right' && p.x > 21) return false; 
    if (facing === 'left' && p.x < 11) return false;
    
    return true;
  });

  if (headPixels.length > 0) {
    // 2. Exact Bounding Box for centering
    const minX = Math.min(...headPixels.map(p => p.x));
    const maxX = Math.max(...headPixels.map(p => p.x));
    const minY = Math.min(...headPixels.map(p => p.y));
    const maxY = Math.max(...headPixels.map(p => p.y));
    
    const headW = maxX - minX + 1;
    const headH = maxY - minY + 1;
    
    // 3. Center it in the 32x32 HUD window
    const targetCenterX = 16;
    const targetCenterY = 16;
    
    const offsetX = targetCenterX - Math.floor(minX + headW / 2);
    const offsetY = targetCenterY - Math.floor(minY + headH / 2);

    headPixels.forEach(p => {
      let fill = p.color;
      
      // Calculate shading using the same logic as the warrior
      if (p.type === 'hair') fill = applyShading(hair, p.b);
      else if (p.type === 'skin') {
          // Normalize skin slightly higher to avoid overly dark portraits
          const skinFactor = (p.b || 200) / 200;
          const sr = parseInt(skin.slice(1, 3), 16);
          const sg = parseInt(skin.slice(3, 5), 16);
          const sb = parseInt(skin.slice(5, 7), 16);
          fill = `rgb(${Math.min(255, sr * skinFactor)}, ${Math.min(255, sg * skinFactor)}, ${Math.min(255, sb * skinFactor)})`;
      }
      else if (p.type === 'outfit') fill = applyShading(outfit, p.b);
      else if (p.type === 'eyes') fill = p.color;
      else if (p.type === 'accessory') fill = applyShading('#ffd700', p.b);
      
      ctx.fillStyle = fill;
      ctx.fillRect(p.x + offsetX, p.y + offsetY, 1, 1);
    });
  }

  ctx.restore();
}

