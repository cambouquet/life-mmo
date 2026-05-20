import { TILE, DRAW_SCALE } from '../constants.jsx'
import { formatTileLines, drawPanelBox } from './debugPanel.js'

export function drawDebugPanel(ctx, canvas, layers, collMap, hoveredTile) {
  const lines = formatTileLines(hoveredTile, layers, collMap)
  drawPanelBox(ctx, lines, canvas)
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
