import { PC } from '../palette.jsx'

// Small head portrait used in the HUD CharPanel (12×10 canvas)
export function drawHead(ctx, facing, expr) {
  ctx.fillStyle = '#0a0616'
  ctx.fillRect(0, 0, 12, 10)

  const r = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h) }
  const p = (x, y, c)       => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1) }

  const blink = expr === 'blink'
  const eye = blink
    ? (x, y) => r(x, y, 2, 1, PC.skinDk)
    : (x, y) => p(x, y, PC.eye)

  if (facing === 'down') {
    // Hair
    r(2, 0, 8, 3, PC.hair)
    r(1, 1, 2, 2, PC.hair); r(9, 1, 2, 2, PC.hair)
    p(3, 0, PC.hairLt); p(7, 0, PC.hairLt)
    // Face
    r(2, 2, 8, 6, PC.skin)
    eye(3, 4); eye(7, 4)
    p(5, 5, PC.skinDk)    // nose
    p(4, 7, PC.mouth); p(5, 7, PC.mouth)
  } else if (facing === 'up') {
    // Back of head — all hair
    r(1, 0, 10, 8, PC.hair)
    p(3, 0, PC.hairLt); p(7, 0, PC.hairLt)
    p(4, 1, PC.hairLt); p(6, 1, PC.hairLt)
  } else if (facing === 'left') {
    // Hair
    r(2, 0, 7, 3, PC.hair)
    r(1, 1, 2, 3, PC.hair)
    p(3, 0, PC.hairLt)
    // Face profile
    r(2, 2, 6, 6, PC.skin)
    eye(3, 4)
    p(4, 5, PC.skinDk)
    p(4, 7, PC.mouth)
  } else if (facing === 'right') {
    // Hair
    r(3, 0, 7, 3, PC.hair)
    r(9, 1, 2, 3, PC.hair)
    p(8, 0, PC.hairLt)
    // Face profile
    r(4, 2, 6, 6, PC.skin)
    eye(8, 4)
    p(7, 5, PC.skinDk)
    p(7, 7, PC.mouth)
  }
}
