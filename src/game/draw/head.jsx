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
    : (x, y) => { p(x, y, PC.eyeWhite); p(x+1, y, PC.eye) }

  if (facing === 'down') {
    // Hair
    r(2, 0, 8, 1, PC.hair)
    r(1, 1, 10, 2, PC.hair)
    p(3, 0, PC.hairLt); p(7, 0, PC.hairLt)
    p(4, 1, PC.hairSheen); p(7, 1, PC.hairSheen)
    // Face
    r(2, 2, 8, 7, PC.skin)
    r(3, 2, 6, 1, PC.skinLt)   // forehead highlight
    p(2, 2, PC.hair); p(9, 2, PC.hair)
    eye(3, 4); eye(7, 4)
    p(5, 5, PC.skinDk)           // nose
    r(4, 7, 3, 1, PC.mouth); p(5, 7, PC.mouthDk)
    p(2, 8, PC.skinDk); p(9, 8, PC.skinDk) // jaw shadow
  } else if (facing === 'up') {
    // Back of head — all hair
    r(1, 0, 10, 9, PC.hair)
    p(3, 0, PC.hairLt); p(7, 0, PC.hairLt)
    p(5, 1, PC.hairSheen)
    p(4, 3, PC.hairLt); p(6, 3, PC.hairLt)
  } else if (facing === 'left') {
    // Hair
    r(2, 0, 7, 3, PC.hair)
    r(1, 1, 2, 4, PC.hair)
    p(4, 0, PC.hairLt); p(2, 1, PC.hairSheen)
    // Face profile
    r(2, 2, 7, 7, PC.skin)
    r(3, 2, 4, 1, PC.skinLt)
    eye(4, 4)
    p(5, 5, PC.skinDk)    // nose bump
    r(4, 7, 2, 1, PC.mouth)
    // Ear
    p(2, 5, PC.skin); p(1, 5, PC.skinDk)
  } else if (facing === 'right') {
    // Hair
    r(3, 0, 7, 3, PC.hair)
    r(9, 1, 2, 4, PC.hair)
    p(6, 0, PC.hairLt); p(9, 1, PC.hairSheen)
    // Face profile
    r(3, 2, 7, 7, PC.skin)
    r(5, 2, 4, 1, PC.skinLt)
    eye(6, 4)
    p(5, 5, PC.skinDk)
    r(6, 7, 2, 1, PC.mouth)
    // Ear
    p(9, 5, PC.skin); p(10, 5, PC.skinDk)
  }
}

