// Moved — import directly from draw/logo.js
export { drawLogo } from './draw/logo.js'

  const LW = 72, LH = 26
  ctx.fillStyle = '#060511'
  ctx.fillRect(0, 0, LW, LH)

  const p = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1) }

  // ── Constellation (six stars, five lines) ──────────────────────────────────
  const S = [[2,13],[5,4],[10,19],[14,8],[19,13],[12,2]]
  ctx.save()
  ctx.globalAlpha = 0.28
  ctx.strokeStyle = '#9060d8'
  ctx.lineWidth = 0.8
  ;[[0,1],[1,5],[5,3],[3,4],[2,4]].forEach(([a, b]) => {
    ctx.beginPath()
    ctx.moveTo(S[a][0] + 0.5, S[a][1] + 0.5)
    ctx.lineTo(S[b][0] + 0.5, S[b][1] + 0.5)
    ctx.stroke()
  })
  ctx.restore()
  for (const [x, y] of S) p(x, y, '#5030a0')
  // Bright anchor — top star
  p(12, 2, '#ffffff')
  p(11, 2, '#c0a0ff'); p(13, 2, '#c0a0ff')
  p(12, 1, '#c0a0ff'); p(12, 3, '#c0a0ff')
  // Medium star
  p(5, 4, '#d8c8ff')
  p(4, 4, '#7050b8'); p(6, 4, '#7050b8')
  p(5, 3, '#7050b8'); p(5, 5, '#7050b8')

  // ── Dotted separator ───────────────────────────────────────────────────────
  for (let y = 2; y < LH - 2; y += 3) {
    ctx.fillStyle = '#2a1858'
    ctx.fillRect(23, y, 1, 2)
  }

  // ── 3×5 pixel font ─────────────────────────────────────────────────────────
  const G = {
    T: ['111','010','010','010','010'],
    H: ['101','101','111','101','101'],
    E: ['11', '10', '11', '10', '11' ],
    L: ['10', '10', '10', '10', '11' ],
    I: ['1',  '1',  '1',  '1',  '1'  ],
    F: ['11', '10', '11', '10', '10' ],
    G: ['110','100','101','101','110'],
    A: ['010','101','111','101','101'],
    M: ['101','111','101','101','101'],
    O: ['010','101','101','101','010'],
  }

  function drawStr(str, sx, sy, sc, col) {
    let cx = sx
    for (const ch of str) {
      const rows = G[ch]
      if (!rows) { cx += sc * 2; continue }
      rows.forEach((row, ry) =>
        [...row].forEach((b, rx) => {
          if (b === '1') { ctx.fillStyle = col; ctx.fillRect(cx + rx * sc, sy + ry * sc, sc, sc) }
        })
      )
      cx += rows[0].length * sc + sc
    }
  }

  // "THE" small / muted
  drawStr('THE',  26,  2, 1, '#6a48a0')
  // "LIFE" large / bright
  drawStr('LIFE', 26,  9, 2, '#c8a8f0')
  // "GAME" small / muted
  drawStr('GAME', 26, 21, 1, '#6a48a0')
}
