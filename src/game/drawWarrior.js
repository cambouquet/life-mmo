import { PC } from './constants.js'

/**
 * Draw the warrior sprite on any canvas context at (x, y).
 * facing: 'down' | 'up' | 'left' | 'right'
 * frame:  0 | 1
 */
export function drawWarriorSprite(ctx, x, y, facing, frame) {
  x = Math.floor(x)
  y = Math.floor(y)
  const bob = frame === 1 ? 1 : 0

  const r = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + ox, y + oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x + ox, y + oy, 1, 1) }

  if (facing === 'down') {
    r(3,  6 + bob, 10, 9, PC.cape)
    r(4,  5 + bob,  8, 2, PC.capeDk)
    r(4,  6 + bob,  8, 7, PC.armor)
    r(5,  6 + bob,  6, 2, PC.armorLt)
    r(5,  8 + bob,  1, 4, PC.armorLt)
    r(4, 12 + bob,  8, 2, PC.belt)
    r(2,  6 + bob,  3, 4, PC.armorLt)
    r(11, 6 + bob,  3, 4, PC.armorLt)
    r(13, 5 + bob,  1, 8, PC.sword)
    r(12, 5 + bob,  1, 1, PC.sword)
    r(12, 9 + bob,  3, 1, PC.swordHlt)
    r(13,10 + bob,  1, 3, PC.swordGrp)
    r(1,  6 + bob,  3, 5, PC.shield)
    r(1,  6 + bob,  3, 1, PC.shieldRim)
    r(1, 10 + bob,  3, 1, PC.shieldRim)
    p(2,  8 + bob,             PC.shieldRim)
    r(4, 13 + bob,  3, 3, PC.armorDk)
    r(9, 13 + bob,  3, 3, PC.armorDk)
    r(4, 15 + bob,  3, 1, PC.boot)
    r(9, 15 + bob,  3, 1, PC.boot)
    r(4,  0,  8, 7, PC.helm)
    r(4,  0,  8, 2, PC.helmLt)
    p(5,  1, PC.armorLt); p(10, 1, PC.armorLt)
    r(5,  4,  6, 1, PC.visor)
    r(5,  5,  6, 2, PC.skin)
    p(6,  5, PC.eye); p(9, 5, PC.eye)
  }

  if (facing === 'up') {
    r(3,  6 + bob, 10, 9, PC.cape)
    r(4,  6 + bob,  8, 7, PC.armor)
    r(4, 12 + bob,  8, 2, PC.belt)
    r(2,  6 + bob,  3, 4, PC.armorLt)
    r(11, 6 + bob,  3, 4, PC.armorLt)
    r(13, 5 + bob,  1, 7, PC.sword)
    r(12, 9 + bob,  3, 1, PC.swordHlt)
    r(1,  6 + bob,  3, 5, PC.shield)
    r(1,  6 + bob,  3, 1, PC.shieldRim)
    r(1, 10 + bob,  3, 1, PC.shieldRim)
    r(4, 13 + bob,  3, 2, PC.armorDk)
    r(9, 13 + bob,  3, 2, PC.armorDk)
    r(4, 15 + bob,  3, 1, PC.boot)
    r(9, 15 + bob,  3, 1, PC.boot)
    r(4,  0,  8, 7, PC.helm)
    r(4,  0,  8, 2, PC.helmLt)
    r(7,  0,  2, 1, '#cc2020')
  }

  if (facing === 'left') {
    r(3,  6 + bob,  9, 9, PC.cape)
    r(4,  6 + bob,  7, 7, PC.armor)
    r(4,  6 + bob,  5, 2, PC.armorLt)
    r(4, 12 + bob,  7, 2, PC.belt)
    r(1,  6 + bob,  4, 5, PC.shield)
    r(1,  6 + bob,  1, 5, PC.shieldRim)
    r(1,  6 + bob,  4, 1, PC.shieldRim)
    r(1, 10 + bob,  4, 1, PC.shieldRim)
    r(11, 8 + bob,  1, 5, PC.sword)
    r(4, 13 + bob,  3, 2, PC.armorDk)
    r(7, 13 + bob,  3, 2, PC.armorDk)
    r(4, 15 + bob,  3, 1, PC.boot)
    r(7, 15 + bob,  3, 1, PC.boot)
    r(4,  0,  7, 7, PC.helm)
    r(4,  0,  7, 2, PC.helmLt)
    r(4,  4,  5, 1, PC.visor)
    r(4,  5,  5, 2, PC.skin)
    p(5,  5, PC.eye)
  }

  if (facing === 'right') {
    r(4,  6 + bob,  9, 9, PC.cape)
    r(5,  6 + bob,  7, 7, PC.armor)
    r(7,  6 + bob,  5, 2, PC.armorLt)
    r(5, 12 + bob,  7, 2, PC.belt)
    r(11, 6 + bob,  4, 5, PC.shield)
    r(14, 6 + bob,  1, 5, PC.shieldRim)
    r(11, 6 + bob,  4, 1, PC.shieldRim)
    r(11,10 + bob,  4, 1, PC.shieldRim)
    r(4,  8 + bob,  1, 5, PC.sword)
    r(5, 13 + bob,  3, 2, PC.armorDk)
    r(8, 13 + bob,  3, 2, PC.armorDk)
    r(5, 15 + bob,  3, 1, PC.boot)
    r(8, 15 + bob,  3, 1, PC.boot)
    r(5,  0,  7, 7, PC.helm)
    r(5,  0,  7, 2, PC.helmLt)
    r(7,  4,  5, 1, PC.visor)
    r(7,  5,  4, 2, PC.skin)
    p(10, 5, PC.eye)
  }
}

/**
 * Draw the head-only portrait on a 12×10 canvas context.
 * expr: 'idle' | 'walk' | 'blink'
 */
export function drawHead(ctx, facing, expr) {
  ctx.fillStyle = '#0a0616'
  ctx.fillRect(0, 0, 12, 10)

  const r = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h) }
  const p = (x, y, c)       => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1) }

  const eye = expr === 'blink'
    ? (x, y) => r(x, y, 2, 1, '#5a3a2a')
    : (x, y) => p(x, y, PC.eye)

  if (facing === 'down') {
    r(2, 1, 8, 7, PC.helm)
    r(2, 1, 8, 2, PC.helmLt)
    p(3, 2, PC.armorLt); p(8, 2, PC.armorLt)
    r(3, 5, 6, 1, PC.visor)
    r(3, 6, 6, 2, PC.skin)
    eye(4, 6); eye(7, 6)
  } else if (facing === 'up') {
    r(2, 1, 8, 7, PC.helm)
    r(2, 1, 8, 2, PC.helmLt)
    r(5, 0, 2, 2, '#cc2020')
  } else if (facing === 'left') {
    r(2, 1, 7, 7, PC.helm)
    r(2, 1, 7, 2, PC.helmLt)
    r(2, 5, 5, 1, PC.visor)
    r(2, 6, 5, 2, PC.skin)
    eye(3, 6)
  } else if (facing === 'right') {
    r(3, 1, 7, 7, PC.helm)
    r(3, 1, 7, 2, PC.helmLt)
    r(5, 5, 5, 1, PC.visor)
    r(5, 6, 5, 2, PC.skin)
    eye(8, 6)
  }
}
