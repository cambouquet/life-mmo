export function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const val = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * val).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function randomPalette() {
  const h1 = Math.floor(Math.random() * 360)
  const h2 = (h1 + 120 + Math.floor(Math.random() * 60)) % 360
  const h3 = (h1 + 240 + Math.floor(Math.random() * 60)) % 360
  return {
    hair:   hslToHex(h1, 70 + Math.random() * 25, 40 + Math.random() * 20),
    outfit: hslToHex(h2, 55 + Math.random() * 30, 25 + Math.random() * 20),
    eyes:   hslToHex(h3, 80 + Math.random() * 15, 55 + Math.random() * 15),
  }
}
