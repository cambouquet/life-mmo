import React, { useMemo } from 'react';
import pixelData from './pixel_data.json';

/**
 * CharacterTemplate component - Renders a pixel-perfect character design.
 * Uses a data URI to render a solid bitmap, bypassing SVG sub-pixel gaps.
 */
export const CharacterTemplate = ({ 
  colors, 
  scale = 4,
  className = "" 
}) => {
  const { hair, skin, outfit } = colors;

  // Render to a tiny hidden canvas and export as DataURL to ensure solid pixels
  const imageDataUrl = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    pixelData.forEach(p => {
      let fill = p.color;
      if (p.type === 'hair') fill = hair;
      else if (p.type === 'skin') fill = skin;
      else if (p.type === 'outfit') fill = outfit;
      ctx.fillStyle = fill;
      // Normal 1x1 on the canvas image to allow proper pixelated upscaling
      ctx.fillRect(p.x, p.y, 1, 1);
    });
    
    return canvas.toDataURL();
  }, [hair, skin, outfit]);

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
