import React, { useMemo } from 'react';
import pixelData from './pixel_data.json';

// Helper to apply relative shading to a hex color
const applyShading = (hex, originalBrightness) => {
  if (!hex) return '#000000';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const factor = (originalBrightness || 160) / 160; 
  const nr = Math.min(255, Math.floor(r * factor));
  const ng = Math.min(255, Math.floor(g * factor));
  const nb = Math.min(255, Math.floor(b * factor));
  return `rgb(${nr}, ${ng}, ${nb})`;
};

/**
 * CharacterTemplate component - Renders a pixel-perfect character design.
 * Uses a data URI to render a solid bitmap, bypassing SVG sub-pixel gaps.
 */
export const CharacterTemplate = ({ 
  colors, 
  scale = 4,
  className = "" 
}) => {
  const { hair, skin, outfit, eyes } = colors;

  // Render to a tiny hidden canvas and export as DataURL to ensure solid pixels
  const imageDataUrl = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Use the first frame for the editor preview (down facing)
    const previewFrame = pixelData.down[1] || pixelData.down[0]; // Use idle/standing frame
    previewFrame.forEach(p => {
      let fill = p.color;
      if (p.type === 'hair') fill = applyShading(hair, p.b);
      else if (p.type === 'skin') fill = applyShading(skin, p.b);
      else if (p.type === 'outfit') fill = applyShading(outfit, p.b);
      else if (p.type === 'eyes') fill = applyShading(eyes, p.b);
      else if (p.type === 'accessory') fill = applyShading('#ffd700', p.b);
      
      ctx.fillStyle = fill;
      // Normal 1x1 on the canvas image to allow proper pixelated upscaling
      ctx.fillRect(p.x, p.y, 1, 1);
    });
    
    return canvas.toDataURL();
  }, [hair, skin, outfit, eyes]);

  return (
    <img 
      src={imageDataUrl}
      width={32 * scale}
      height={32 * scale}
      className={className}
      style={{ 
        imageRendering: 'pixelated',
        display: 'block'
      }}
      alt="Character Preview"
    />
  );
};
