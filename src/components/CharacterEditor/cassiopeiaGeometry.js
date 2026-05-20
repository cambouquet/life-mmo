export function polarToXY(cx, cy, angleDeg, r) {
  const a = (angleDeg - 90) * Math.PI / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

export function ringSegPath(cx, cy, r1, r2, startDeg, endDeg) {
  const gap = 0.5
  const s1 = polarToXY(cx, cy, startDeg + gap, r1)
  const e1 = polarToXY(cx, cy, endDeg   - gap, r1)
  const s2 = polarToXY(cx, cy, startDeg + gap, r2)
  const e2 = polarToXY(cx, cy, endDeg   - gap, r2)
  const span = ((endDeg - startDeg) + 360) % 360
  const large = span > 180 ? 1 : 0
  return [
    `M ${s1[0].toFixed(2)} ${s1[1].toFixed(2)}`,
    `A ${r1} ${r1} 0 ${large} 1 ${e1[0].toFixed(2)} ${e1[1].toFixed(2)}`,
    `L ${e2[0].toFixed(2)} ${e2[1].toFixed(2)}`,
    `A ${r2} ${r2} 0 ${large} 0 ${s2[0].toFixed(2)} ${s2[1].toFixed(2)}`,
    'Z',
  ].join(' ')
}

export function getPointerAngle(e, svgEl, cx, cy) {
  const rect    = svgEl.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const x = (clientX - rect.left) / rect.width  * svgEl.viewBox.baseVal.width  - cx
  const y = (clientY - rect.top)  / rect.height * svgEl.viewBox.baseVal.height - cy
  return (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360
}

export function getPointerDist(e, svgEl, cx, cy) {
  const rect    = svgEl.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  const x = (clientX - rect.left) / rect.width  * svgEl.viewBox.baseVal.width  - cx
  const y = (clientY - rect.top)  / rect.height * svgEl.viewBox.baseVal.height - cy
  return Math.sqrt(x * x + y * y)
}
