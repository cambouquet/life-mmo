import { PC } from '../palette.jsx'

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
