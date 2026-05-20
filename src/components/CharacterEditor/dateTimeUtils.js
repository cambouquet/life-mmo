export function parseDateFromString(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return { day: parseInt(d), month: parseInt(m), year: parseInt(y) }
}

export function parseTimeFromString(timeStr) {
  const [h, m] = timeStr.split(':')
  return { hour: parseInt(h), minute: parseInt(m) }
}

export function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatTime(time) {
  const h = String(time.hour).padStart(2, '0')
  const m = String(time.minute).padStart(2, '0')
  return `${h}:${m}`
}
