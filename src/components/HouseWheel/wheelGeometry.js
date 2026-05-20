export function createWheelGeometry(cx, cy) {
  function polarToXY(angleDeg, r) {
    const a = (angleDeg - 90) * Math.PI / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }

  function arc(startDeg, endDeg, r1, r2) {
    if ([startDeg, endDeg, r1, r2].some(isNaN)) return ''
    const s1 = polarToXY(startDeg, r1), e1 = polarToXY(endDeg, r1)
    const s2 = polarToXY(startDeg, r2), e2 = polarToXY(endDeg, r2)
    const delta = (endDeg - startDeg + 360) % 360
    const large = delta > 180 ? 1 : 0
    return `M ${s1[0]} ${s1[1]} A ${r1} ${r1} 0 ${large} 1 ${e1[0]} ${e1[1]} L ${e2[0]} ${e2[1]} A ${r2} ${r2} 0 ${large} 0 ${s2[0]} ${s2[1]} Z`
  }

  return { polarToXY, arc }
}
