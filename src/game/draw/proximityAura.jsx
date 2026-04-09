/**
 * Draws a radial proximity aura around an interactable entity.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} cx       - center x (world px)
 * @param {number} cy       - center y (world px)
 * @param {number} px       - player center x
 * @param {number} py       - player center y
 * @param {number} radius   - distance at which aura starts appearing
 * @param {string} color    - rgba base e.g. '96,232,255'
 */
export function drawProximityAura(ctx, cx, cy, px, py, radius, color) {
  const dx   = px - cx
  const dy   = py - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const t    = Math.max(0, 1 - dist / radius)
  if (t <= 0) return

  const innerR = 12 + 20 * t
  const outerR = 28 + 40 * t

  ctx.save()

  // Inner bright core
  const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR)
  inner.addColorStop(0,   `rgba(${color}, ${(t * 0.55).toFixed(3)})`)
  inner.addColorStop(0.5, `rgba(${color}, ${(t * 0.2).toFixed(3)})`)
  inner.addColorStop(1,   `rgba(${color}, 0)`)
  ctx.fillStyle = inner
  ctx.beginPath()
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
  ctx.fill()

  // Outer soft halo
  const outer = ctx.createRadialGradient(cx, cy, innerR * 0.5, cx, cy, outerR)
  outer.addColorStop(0,   `rgba(${color}, ${(t * 0.18).toFixed(3)})`)
  outer.addColorStop(1,   `rgba(${color}, 0)`)
  ctx.fillStyle = outer
  ctx.beginPath()
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}
