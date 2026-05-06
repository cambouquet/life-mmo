import { TILE, DRAW_SCALE } from '../constants.jsx'

// Draws the info panel in bottom-right corner.
// Always shown when debug mode is on, displays hovered tile info
export function drawDebugPanel(ctx, canvas, layers, collMap, hoveredTile) {
  const PAD = 6
  const LH  = 11
  const W   = 160

  let lines = []
  if (hoveredTile) {
    const { c, r } = hoveredTile
    const coll    = collMap[r]?.[c] ?? '?'
    const ground  = layers.ground[r]?.[c]
    const wall    = layers.walls[r]?.[c]
    const obj     = layers.objects[r]?.[c]
    const entity  = layers.entities?.[r]?.[c]

    lines = [
      `tile  ${c}, ${r}`,
      `coll  ${coll}`,
      ground  ? `L0  ss=${ground.ss}  row=${ground.row}  v=${ground.variant}`   : 'L0  —',
      wall    ? `L1  ss=${wall.ss}    row=${wall.row}    v=${wall.variant}`      : 'L1  —',
      obj     ? `L2  ss=${obj.ss}     row=${obj.row}     v=${obj.variant}`       : 'L2  —',
      entity  ? `L3  ss=${entity.ss}  row=${entity.row}  v=${entity.variant}`   : 'L3  —',
    ]
  } else {
    lines = ['tile  —', 'coll  —', 'L0  —', 'L1  —', 'L2  —', 'L3  —']
  }

  const H = lines.length * LH + PAD * 2

  // Position panel bottom-right, above buttons
  const px = canvas.width - W - 70
  const py = canvas.height - H - 70

  ctx.save()
  ctx.font = '9px monospace'
  ctx.fillStyle = 'rgba(6,4,14,0.85)'
  ctx.fillRect(px, py, W, H)
  ctx.strokeStyle = 'rgba(100,180,255,0.4)'
  ctx.lineWidth = 0.5
  ctx.strokeRect(px, py, W, H)

  ctx.fillStyle = '#7ab8ff'
  lines.forEach((line, i) => {
    ctx.fillText(line, px + PAD, py + PAD + LH * i + LH - 2)
  })
  ctx.restore()
}

// Convert a mouse event on the canvas to a tile { c, r }, accounting for zoom level and DPR.
export function mouseTile(e, canvas, pcx, pcy, zoom = DRAW_SCALE) {
  const dpr  = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  // CSS px → canvas px
  const lx = (e.clientX - rect.left) * dpr
  const ly = (e.clientY - rect.top)  * dpr

  // Undo the world transform: translate(cw/2, ch/2) scale(zoom) translate(-pcx,-pcy)
  const wx = (lx - canvas.width  / 2) / zoom + pcx
  const wy = (ly - canvas.height / 2) / zoom + pcy

  return { c: Math.floor(wx / TILE), r: Math.floor(wy / TILE) }
}
