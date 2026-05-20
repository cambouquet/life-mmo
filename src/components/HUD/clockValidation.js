export function validateHour(value) {
  let h = parseInt(value) || 12
  if (h < 1) h = 12
  if (h > 12) h = h % 12 || 12
  return h
}

export function validateMinute(value) {
  let m = parseInt(value) || 0
  if (m < 0) m = 0
  if (m > 59) m = 59
  return m
}
