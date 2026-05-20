export function createTableRectHelpers(ctx, tx, ty) {
  const b = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(tx + ox, ty + oy, w, h) }
  const p = (ox, oy, c) => { ctx.fillStyle = c; ctx.fillRect(tx + ox, ty + oy, 1, 1) }
  return { b, p }
}
