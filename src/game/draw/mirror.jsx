import { drawGlassBase, drawGlassEdges, drawHighlights, drawGlowHalo } from './mirrorGlass.js'
import { drawReflection } from './mirrorReflection.js'

export function drawMirror(ctx, x, y, phase, reflection, small = false) {
  const W = small ? 16 : 24
  const H = small ? 24 : 40
  const drawX = x + (small ? 8 : 4)
  const drawY = y + (small ? -4 : -12)

  drawGlassBase(ctx, drawX, drawY, W, H)
  drawReflection(ctx, drawX, drawY, W, H, reflection, phase)
  drawGlassEdges(ctx, drawX, drawY, W, H)
  drawHighlights(ctx, drawX, drawY)
  drawGlowHalo(ctx, drawX, drawY, W, H, phase)
}
