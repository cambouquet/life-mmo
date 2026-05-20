export function isWideMode(mode) {
  return mode !== 'reading'
}

export function getDateLabel(reading) {
  const { zodiac } = reading
  const now = new Date()
  return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
}
