export function calculateHouseAngles(h, houseCusps, ascLong, GAP_DEG) {
  const hStartRaw = houseCusps && !isNaN(houseCusps[h - 1]) ? houseCusps[h - 1] - ascLong : (h - 1) * 30
  const hEndRaw = houseCusps && !isNaN(houseCusps[h === 12 ? 0 : h]) ? houseCusps[h === 12 ? 0 : h] - ascLong : h * 30
  const startDeg = ((hStartRaw + 360) % 360) + GAP_DEG / 2
  const endDeg = ((hEndRaw < hStartRaw ? hEndRaw + 360 : hEndRaw) % 720) - GAP_DEG / 2
  const midDeg = (startDeg + (endDeg < startDeg ? endDeg + 360 : endDeg)) / 2
  return { startDeg, endDeg, midDeg }
}
