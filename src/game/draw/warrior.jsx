import { PC } from '../palette.jsx'

// Compact sprite — character body ~10px wide, 13px tall within 16x16 tile.
// Hair y=1-2 | Face y=3-6 | Collar y=7 | Jacket y=7-10 | Jeans y=11-12 | Kicks y=13

export function drawWarriorSprite(ctx, x, y, facing, frame) {
  x = Math.floor(x); y = Math.floor(y)
  const yb = frame === 1 ? 1 : 0
  const r = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, 1, 1) }

  if (facing === 'down') {
    // Hair
    r( 4, 1+yb, 8, 2, PC.hair)
    p( 3, 2+yb, PC.hair);  p(12, 2+yb, PC.hair)
    p( 6, 1+yb, PC.hairLt); p( 9, 1+yb, PC.hairLt)
    // Face (6px wide)
    r( 5, 3+yb, 6, 4, PC.skin)
    p( 6, 4+yb, PC.eye);   p( 9, 4+yb, PC.eye)
    p( 8, 5+yb, PC.skinDk)
    p( 7, 6+yb, PC.mouth); p( 8, 6+yb, PC.mouth)
    // Collar strip
    r( 6, 7+yb, 4, 1, PC.hood)
    // Jacket body + arms
    r( 4, 7+yb, 8, 4, PC.jacket)
    r( 5, 8+yb, 6, 2, PC.jacketLt)
    r( 3, 7+yb, 2, 3, PC.jacket)
    r(11, 7+yb, 2, 3, PC.jacket)
    // Chest rune
    p( 8, 8+yb, PC.magic)
    p( 7, 9+yb, PC.magic); p( 8, 9+yb, PC.magic); p( 9, 9+yb, PC.magic)
    p( 8,10+yb, PC.magic)
    // Hands + palm glow
    r( 3,10+yb, 2, 1, PC.skin); r(11,10+yb, 2, 1, PC.skin)
    p( 2,10+yb, PC.magicLt);    p(13,10+yb, PC.magicLt)
    // Jeans
    r( 4,11+yb, 3, 2, PC.jeans); r( 9,11+yb, 3, 2, PC.jeans)
    p( 7,11+yb, PC.jeansDk)
    // Sneakers
    r( 4,13+yb, 3, 1, PC.sneak); r( 9,13+yb, 3, 1, PC.sneak)
    p( 4,13+yb, PC.sneakSole);   p( 9,13+yb, PC.sneakSole)
  }

  if (facing === 'up') {
    // Jacket body + arms
    r( 4, 7+yb, 8, 4, PC.jacket)
    r( 3, 7+yb, 2, 3, PC.jacket)
    r(11, 7+yb, 2, 3, PC.jacket)
    r( 6, 7+yb, 4, 1, PC.hood)
    // Sigil on back
    p( 7, 8+yb, PC.magic); p( 8, 8+yb, PC.magic)
    p( 7, 9+yb, PC.magic); p( 8, 9+yb, PC.magic)
    p( 7,10+yb, PC.magic); p( 8,10+yb, PC.magic)
    // Hands
    r( 3,10+yb, 2, 1, PC.skin); r(11,10+yb, 2, 1, PC.skin)
    // Jeans
    r( 4,11+yb, 3, 2, PC.jeans); r( 9,11+yb, 3, 2, PC.jeans)
    // Sneakers
    r( 4,13+yb, 3, 1, PC.sneak); r( 9,13+yb, 3, 1, PC.sneak)
    // Back of head
    r( 4, 1+yb, 8, 5, PC.hair)
    p( 5, 1+yb, PC.hairLt); p( 9, 1+yb, PC.hairLt)
    p( 6, 2+yb, PC.hairLt); p( 8, 2+yb, PC.hairLt)
  }

  if (facing === 'left') {
    // Jacket body + arms
    r( 5, 7+yb, 6, 4, PC.jacket)
    r( 5, 8+yb, 4, 2, PC.jacketLt)
    r( 5, 7+yb, 5, 1, PC.hood)
    r( 3, 7+yb, 2, 4, PC.jacket)   // near arm
    r(10, 7+yb, 2, 3, PC.jacket)   // far arm
    // Near hand + glow (extends left)
    r( 3,10+yb, 2, 1, PC.skin)
    p( 2,10+yb, PC.magicLt); p( 1,10+yb, PC.magic)
    // Jeans
    r( 4,11+yb, 3, 2, PC.jeans); r( 7,11+yb, 3, 2, PC.jeans)
    // Sneakers (near foot forward)
    r( 3,13+yb, 4, 1, PC.sneak); r( 7,13+yb, 3, 1, PC.sneak)
    p( 3,13+yb, PC.sneakSole)
    // Hair + face (profile left)
    r( 4, 1+yb, 7, 2, PC.hair)
    r( 3, 2+yb, 2, 3, PC.hair)
    p( 5, 1+yb, PC.hairLt)
    r( 4, 3+yb, 5, 4, PC.skin)
    p( 5, 4+yb, PC.eye)
    p( 6, 5+yb, PC.skinDk)
    p( 6, 6+yb, PC.mouth)
  }

  if (facing === 'right') {
    // Jacket body + arms
    r( 5, 7+yb, 6, 4, PC.jacket)
    r( 7, 8+yb, 4, 2, PC.jacketLt)
    r( 6, 7+yb, 5, 1, PC.hood)
    r(11, 7+yb, 2, 4, PC.jacket)   // near arm
    r( 4, 7+yb, 2, 3, PC.jacket)   // far arm
    // Near hand + glow (extends right)
    r(11,10+yb, 2, 1, PC.skin)
    p(13,10+yb, PC.magicLt); p(14,10+yb, PC.magic)
    // Jeans
    r( 9,11+yb, 3, 2, PC.jeans); r( 5,11+yb, 3, 2, PC.jeans)
    // Sneakers (near foot forward)
    r( 9,13+yb, 4, 1, PC.sneak); r( 5,13+yb, 3, 1, PC.sneak)
    p(12,13+yb, PC.sneakSole)
    // Hair + face (profile right)
    r( 5, 1+yb, 7, 2, PC.hair)
    r(11, 2+yb, 2, 3, PC.hair)
    p(10, 1+yb, PC.hairLt)
    r( 7, 3+yb, 5, 4, PC.skin)
    p(10, 4+yb, PC.eye)
    p( 9, 5+yb, PC.skinDk)
    p( 9, 6+yb, PC.mouth)
  }
}
