import { drawWarriorSprite } from './warrior.jsx'

// x, y = top-left of the mirror (MIRROR_C * TILE, (MIRROR_R - 1) * TILE)
// reflection = { facing, frame, colors, moving, alpha, y } — null when player is far
export function drawMirror(ctx, x, y, phase, reflection) {
  const W = 24, H = 40

  const b = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, 1, 1) }

  // Draw at modified x,y to center it slightly over tiles
  const drawX = x + 4
  const drawY = y - 12

  // Glass base
  ctx.fillStyle = '#0d0b1e'
  ctx.fillRect(drawX, drawY, W, H)

  // Glass surface gradient
  ctx.save()
  ctx.globalAlpha = 0.82
  const mg = ctx.createLinearGradient(drawX, drawY, drawX + 10, drawY + H)
  mg.addColorStop(0,   '#6868c0')
  mg.addColorStop(0.4, '#302880')
  mg.addColorStop(1,   '#0e0c2a')
  ctx.fillStyle = mg
  ctx.fillRect(drawX, drawY, W, H)
  ctx.restore()

  // Player reflection — clipped to glass
  if (reflection && reflection.alpha > 0.02) {
    ctx.save()
    // Define the clipping region for the glass area
    const clipX = drawX + 1
    const clipY = drawY + 1
    const clipW = W - 2
    const clipH = H - 2

    ctx.beginPath()
    ctx.rect(clipX, clipY, clipW, clipH)
    ctx.clip()
    
    ctx.globalAlpha = reflection.alpha * 0.72

    // 1. ORIENTATION & LINEAR SYMMETRY
    // Vertically: Looking at the mirror (UP) shows your front (DOWN).
    // Horizontally: Looking to the RIGHT in the mirror shows your reflection looking to the its RIGHT (which is our LEFT).
    // In a mirror, the horizontal direction should be swapped before applying the linear symmetry flip.
    let reflFacing = reflection.facing
    if (reflection.facing === 'up') reflFacing = 'down'
    else if (reflection.facing === 'down') reflFacing = 'up'
    else if (reflection.facing === 'left') reflFacing = 'right'
    else if (reflection.facing === 'right') reflFacing = 'left'

    // 2. POSITIONING & SYMMETRY PIVOT
    const mirrorWorldWallLine = y + 32 
    const glassBottom = drawY + H
    
    const playerFeetLine = reflection.y + 8 
    const distFromMirror  = playerFeetLine - mirrorWorldWallLine
    
    // VERTICAL: Waist position in the glass relative to depth.
    const reflY = glassBottom - distFromMirror - 8

    // HORIZONTAL: Fixed alignment with the player center.
    // The player's screen center is reflection.x.
    // We added 12 before but it was still too far left. Let's try 16, 
    // which is exactly half of the 32px (2-tile) block width.
    const reflX = reflection.x + 16

    // 3. HORIZONTAL LINEAR SYMMETRY (The Flip)
    if (isFinite(reflX) && isFinite(reflY)) {
      ctx.save()
      
      // Pivot around the shifted horizontal center.
      ctx.translate(reflX, 0)
      ctx.scale(-1, 1)
      ctx.translate(-reflX, 0)
      
      drawWarriorSprite(ctx, reflX, reflY, reflFacing, reflection.frame, phase, reflection.colors, reflection.moving)
      
      ctx.restore()
    }
    
    // IMPORTANT: Restore clipping and state BEFORE drawing anything else
    ctx.restore()

    // Subtle blue-glass tint over the reflection (also clipped to glass)
    ctx.save()
    ctx.globalAlpha = 0.20
    const tint = ctx.createLinearGradient(drawX, drawY, drawX + 10, drawY + H)
    tint.addColorStop(0, 'rgba(80,80,200,1)')
    tint.addColorStop(1, 'rgba(8,6,32,1)')
    ctx.fillStyle = tint
    ctx.fillRect(clipX, clipY, clipW, clipH)
    ctx.restore()
  }

  // Silver edge catch — light from above-left
  ctx.save()
  ctx.globalAlpha = 0.45
  ctx.fillStyle = '#c8c8e8'
  ctx.fillRect(drawX, drawY, W, 1) // top
  ctx.fillStyle = '#b0b0d8'
  ctx.fillRect(drawX, drawY, 1, H) // left
  ctx.restore()

  // Reflection highlight cluster
  const p2 = (ox, oy, c) => { ctx.fillStyle = c; ctx.fillRect(drawX+ox, drawY+oy, 1, 1) }
  p2(2, 2, '#ffffff')
  p2(3, 2, '#e0e0ff'); p2(2, 3, '#e0e0ff')
  p2(4, 2, '#c0c0f0'); p2(2, 4, '#c0c0f0')
  p2(3, 3, '#c8c8f8')

  // Soft violet ambient glow
  const gx = Math.round(drawX + W / 2)
  const gy = Math.round(drawY + H / 2)
  if (!isNaN(gx) && !isNaN(gy)) {
    ctx.save()
    ctx.globalAlpha = 0.18 + Math.sin(phase) * 0.07
    const grd = ctx.createRadialGradient(gx, gy, 2, gx, gy, 22)
    grd.addColorStop(0, 'rgba(140,80,255,1)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grd
    ctx.fillRect(drawX - 8, drawY - 8, W + 16, H + 16)
    ctx.restore()
  }
}
