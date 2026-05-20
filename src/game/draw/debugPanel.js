export function formatTileLines(hoveredTile, layers, collMap) {
  if (!hoveredTile) return ['tile  —', 'coll  —', 'L0  —', 'L1  —', 'L2  —', 'L3  —']

  const { c, r } = hoveredTile
  const coll = collMap[r]?.[c] ?? '?'
  const ground = layers.ground[r]?.[c]
  const wall = layers.walls[r]?.[c]
  const obj = layers.objects[r]?.[c]
  const entity = layers.entities?.[r]?.[c]

  return [
    `tile  ${c}, ${r}`,
    `coll  ${coll}`,
    ground ? `L0  ss=${ground.ss}  row=${ground.row}  v=${ground.variant}` : 'L0  —',
    wall ? `L1  ss=${wall.ss}    row=${wall.row}    v=${wall.variant}` : 'L1  —',
    obj ? `L2  ss=${obj.ss}     row=${obj.row}     v=${obj.variant}` : 'L2  —',
    entity ? `L3  ss=${entity.ss}  row=${entity.row}  v=${entity.variant}` : 'L3  —',
  ]
}

export function drawPanelBox(ctx, lines, canvas, PAD = 6, LH = 11, W = 160) {
  const H = lines.length * LH + PAD * 2
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
