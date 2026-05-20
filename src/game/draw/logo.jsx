import { LOGO_CONSTELLATION, LOGO_GLYPHS, LOGO_TEXT } from './logoData.js'

export function drawLogo(ctx) {
  const LW = 72, LH = 26
  ctx.fillStyle = '#060511'
  ctx.fillRect(0, 0, LW, LH)

  const p = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1) }
  const { stars, lines, colors } = LOGO_CONSTELLATION

  ctx.save()
  ctx.globalAlpha = 0.28
  ctx.strokeStyle = colors.line
  ctx.lineWidth = 0.8
  lines.forEach(([a, b]) => {
    ctx.beginPath()
    ctx.moveTo(stars[a][0] + 0.5, stars[a][1] + 0.5)
    ctx.lineTo(stars[b][0] + 0.5, stars[b][1] + 0.5)
    ctx.stroke()
  })
  ctx.restore()
  for (const [x, y] of stars) p(x, y, colors.star)
  p(12, 2, colors.bright)
  p(11, 2, colors.glow); p(13, 2, colors.glow)
  p(12, 1, colors.glow); p(12, 3, colors.glow)
  p(5, 4, colors.glow2)
  p(4, 4, colors.dim); p(6, 4, colors.dim)
  p(5, 3, colors.dim); p(5, 5, colors.dim)

  for (let y = 2; y < LH - 2; y += 3) {
    ctx.fillStyle = '#2a1858'
    ctx.fillRect(23, y, 1, 2)
  }

  function drawStr(str, sx, sy, sc, col) {
    let cx = sx
    for (const ch of str) {
      const rows = LOGO_GLYPHS[ch]
      if (!rows) { cx += sc * 2; continue }
      rows.forEach((row, ry) =>
        [...row].forEach((b, rx) => {
          if (b === '1') { ctx.fillStyle = col; ctx.fillRect(cx + rx * sc, sy + ry * sc, sc, sc) }
        })
      )
      cx += rows[0].length * sc + sc
    }
  }

  LOGO_TEXT.forEach(({ str, x, y, scale, color }) => drawStr(str, x, y, scale, color))
}
