import { drawSpriteSheet } from './spriteSheet.js'
import { drawHalo } from './haloEffect.js'
import { drawVectorWarrior } from './vectorWarrior.js'

export function drawWarriorSprite(ctx, x, y, facing, frame, phase, colors, moving, skipHalo = false) {
  if (!skipHalo) drawHalo(ctx, x, y, phase)
  if (colors) drawVectorWarrior(ctx, x, y, facing, frame, colors, moving)
  else drawSpriteSheet(ctx, x, y, facing, frame)
}

export { applyShading } from './vectorWarrior.js'


