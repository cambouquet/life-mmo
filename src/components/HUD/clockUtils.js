export function calculateClockAngles(now) {
  const hours = now.getHours() % 12
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const hourAngle = (hours * 30) + (minutes * 0.5)
  const minuteAngle = (minutes * 6) + (seconds * 0.1)
  return { hourAngle, minuteAngle }
}

export function getHandCoordinates(angle, length) {
  const rad = (angle - 90) * Math.PI / 180
  return {
    x2: 50 + length * Math.cos(rad),
    y2: 50 + length * Math.sin(rad),
  }
}

export function getNumeralPosition(index) {
  const angle = (index * 30 - 90) * Math.PI / 180
  return {
    x: 50 + 35 * Math.cos(angle),
    y: 50 + 35 * Math.sin(angle),
  }
}
