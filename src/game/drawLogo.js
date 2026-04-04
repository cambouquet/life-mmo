/**
 * Draw the logo onto a 48×26 canvas context.
 */
export function drawLogo(ctx) {
  const LW = 48, LH = 26
  ctx.fillStyle = '#070512'
  ctx.fillRect(0, 0, LW, LH)

  const p = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1) }

  // 5 stars, 4 constellation lines
  const S = [[2,12],[6,4],[12,8],[10,20],[18,14]]
  ctx.save()
  ctx.globalAlpha = 0.3
  ctx.strokeStyle = '#9060d8'
  ctx.lineWidth = 1
  ;[[0,1],[1,2],[2,4],[2,3]].forEach(([a, b]) => {
    ctx.beginPath()
    ctx.moveTo(S[a][0] + 0.5, S[a][1] + 0.5)
    ctx.lineTo(S[b][0] + 0.5, S[b][1] + 0.5)
    ctx.stroke()
  })
  ctx.restore()

  for (const [x, y] of S) p(x, y, '#7050b8')
  // bright anchor star
  p(6, 4, '#ffffff')
  p(5, 4, '#b898e8'); p(7, 4, '#b898e8')
  p(6, 3, '#b898e8'); p(6, 5, '#b898e8')

  // dotted separator
  for (let y = 2; y < LH - 2; y += 3) {
    ctx.fillStyle = '#2a1850'
    ctx.fillRect(22, y, 1, 2)
  }

  // 3×5 pixel font glyphs
  const G = {
    L: ['10','10','10','10','11'],
    I: ['1','1','1','1','1'],
    F: ['11','10','11','10','10'],
    E: ['11','10','11','10','11'],
    M: ['101','111','101','101','101'],
    O: ['11','11','11','11','11'],
  }

  function drawStr(str, sx, sy, sc, col) {
    let cx = sx
    for (const ch of str) {
      const rows = G[ch]
      if (!rows) { cx += 3; continue }
      rows.forEach((row, ry) =>
        [...row].forEach((b, rx) => {
          if (b === '1') {
            ctx.fillStyle = col
            ctx.fillRect(cx + rx * sc, sy + ry * sc, sc, sc)
          }
        })
      )
      cx += rows[0].length * sc + sc
    }
  }

  drawStr('LIFE', 24,  3, 2, '#c8a8f0')
  drawStr('MMO',  24, 19, 1, '#6a48a0')
}
