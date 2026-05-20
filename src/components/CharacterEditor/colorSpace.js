export function hslToHsv(h, s, l) {
  s /= 100
  l /= 100
  const v = l + s * Math.min(l, 1 - l)
  const sv = v === 0 ? 0 : 2 * (1 - l / v)
  return [h, sv * 100, v * 100]
}

export function hsvToHsl(h, sv, v) {
  sv /= 100
  v /= 100
  const l = v * (1 - sv / 2)
  const sl = (l === 0 || l === 1) ? 0 : (v - l) / Math.min(l, 1 - l)
  return [h, sl * 100, l * 100]
}
