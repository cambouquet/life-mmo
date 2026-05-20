export function computeHourSegments() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `hour-${i}`,
    hour: i === 0 ? 12 : i,
    index: i,
    startDeg: i * 30,
    endDeg: (i + 1) * 30,
  }))
}

export function computeMinuteSegments() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `min-${i}`,
    minute: i * 5,
    index: i,
    startDeg: i * 30,
    endDeg: (i + 1) * 30,
  }))
}

export function computeMonthSegments() {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return Array.from({ length: 12 }, (_, i) => ({
    id: `month-${i}`,
    month: i + 1,
    index: i,
    label: MONTHS[i],
    startDeg: i * 30,
    endDeg: (i + 1) * 30,
  }))
}

export function computeDaySegments() {
  return Array.from({ length: 31 }, (_, i) => ({
    id: `day-${i}`,
    day: i + 1,
    index: i,
    startDeg: (i / 31) * 360,
    endDeg: ((i + 1) / 31) * 360,
  }))
}
