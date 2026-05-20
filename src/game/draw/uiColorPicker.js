export function drawColorPicker(ctx, colors) {
  const { width: W, height: H } = ctx.canvas
  const labels = Object.keys(colors)
  const spacing = 70
  const cx = W / 2
  const startX = cx - ((labels.length - 1) * spacing) / 2
  const ly = H - 100

  labels.forEach((key, i) => {
    const lx = startX + i * spacing
    ctx.fillStyle = colors[key]
    ctx.beginPath()
    ctx.arc(lx, ly, 25, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.fillStyle = '#c084fc'
    ctx.font = 'bold 12px "Courier New"'
    ctx.fillText(key.toUpperCase(), lx, ly + 50)
  })
}
