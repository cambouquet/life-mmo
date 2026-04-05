import { PC } from '../palette.jsx'

// 16x16 sprite - modern urban-magic Novice
// No wand. Magic emanates from bare glowing hands.
// Layout: 0-2 hair | 2-6 face | 6 collar | 7-11 jacket+arms | 11-12 hands | 12-14 jeans | 15 sneakers

export function drawWarriorSprite(ctx, x, y, facing, frame) {
  x = Math.floor(x); y = Math.floor(y)
  const bob = frame === 1 ? 1 : 0
  const r = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, 1, 1) }

  if (facing === 'down') {
    // Hair
    r( 5,  0, 6, 1, PC.hair)
    r( 4,  1, 8, 2, PC.hair)
    r( 3,  2, 2, 2, PC.hair)
    r(11,  2, 2, 2, PC.hair)
    p( 6,  0, PC.hairLt);  p( 8,  0, PC.hairLt)
    // Face
    r( 4,  2, 8, 5, PC.skin)
    p( 6,  3, PC.eye);  p( 9,  3, PC.eye)
    p( 8,  4, PC.skinDk)
    p( 7,  5, PC.mouth);  p( 8,  5, PC.mouth)
    // Collar
    r( 5,  6, 6, 1, PC.hood)
    // Jacket torso + arms
    r( 4,  7+bob, 8, 5, PC.jacket)
    r( 5,  8+bob, 6, 2, PC.jacketLt)
    r( 2,  7+bob, 3, 4, PC.jacket)
    r(11,  7+bob, 3, 4, PC.jacket)
    // Chest rune (cross)
    p( 8,  9+bob, PC.magic)
    p( 7, 10+bob, PC.magic);  p( 8, 10+bob, PC.magic);  p( 9, 10+bob, PC.magic)
    p( 8, 11+bob, PC.magic)
    // Hands (skin) + magic glow at palms
    r( 2, 11+bob, 2, 1, PC.skin)
    r(12, 11+bob, 2, 1, PC.skin)
    p( 2, 12+bob, PC.magicLt)
    p(13, 12+bob, PC.magicLt)
    // Jeans
    r( 4, 12+bob, 3, 3, PC.jeans)
    r( 9, 12+bob, 3, 3, PC.jeans)
    p( 7, 12+bob, PC.jeansDk)
    // Sneakers
    r( 4, 15+bob, 3, 1, PC.sneak)
    r( 9, 15+bob, 3, 1, PC.sneak)
    p( 4, 15+bob, PC.sneakSole);  p( 9, 15+bob, PC.sneakSole)
  }

  if (facing === 'up') {
    // Jacket torso + arms
    r( 4,  7+bob, 8, 5, PC.jacket)
    r( 2,  7+bob, 3, 4, PC.jacket)
    r(11,  7+bob, 3, 4, PC.jacket)
    r( 5,  6+bob, 6, 2, PC.hood)
    // Sigil on back
    p( 7,  9+bob, PC.magic);  p( 8,  9+bob, PC.magic)
    p( 7, 10+bob, PC.magic);  p( 8, 10+bob, PC.magic)
    p( 7, 11+bob, PC.magic);  p( 8, 11+bob, PC.magic)
    // Hands
    r( 2, 11+bob, 2, 1, PC.skin)
    r(12, 11+bob, 2, 1, PC.skin)
    p( 2, 12+bob, PC.magic)
    p(13, 12+bob, PC.magic)
    // Jeans
    r( 4, 12+bob, 3, 3, PC.jeans)
    r( 9, 12+bob, 3, 3, PC.jeans)
    p( 7, 12+bob, PC.jeansDk)
    // Sneakers
    r( 4, 15+bob, 3, 1, PC.sneak)
    r( 9, 15+bob, 3, 1, PC.sneak)
    // Back of head
    r( 3,  0, 10, 5, PC.hair)
    p( 5,  0, PC.hairLt);  p( 9,  0, PC.hairLt)
    p( 6,  1, PC.hairLt);  p( 8,  1, PC.hairLt)
  }

  if (facing === 'left') {
    // Jacket torso + arms
    r( 4,  7+bob, 7, 5, PC.jacket)
    r( 5,  8+bob, 4, 2, PC.jacketLt)
    r( 2,  7+bob, 3, 4, PC.jacket)
    r(10,  7+bob, 2, 4, PC.jacket)
    r( 4,  6+bob, 8, 1, PC.hood)
    // Near hand glowing (forward)
    r( 2, 11+bob, 2, 1, PC.skin)
    p( 1, 11+bob, PC.magicLt)
    p( 1, 10+bob, PC.magic)
    // Far hand (faint)
    p(11, 11+bob, PC.skin)
    // Jeans
    r( 4, 12+bob, 3, 3, PC.jeans)
    r( 7, 12+bob, 3, 3, PC.jeans)
    // Sneakers (near foot forward)
    r( 3, 15+bob, 4, 1, PC.sneak)
    r( 7, 15+bob, 3, 1, PC.sneak)
    p( 3, 15+bob, PC.sneakSole)
    // Hair + face (profile left)
    r( 4,  0, 7, 3, PC.hair)
    r( 3,  1, 2, 3, PC.hair)
    p( 5,  0, PC.hairLt)
    r( 4,  2, 6, 5, PC.skin)
    p( 5,  3, PC.eye)
    p( 6,  4, PC.skinDk)
    p( 6,  5, PC.mouth)
  }

  if (facing === 'right') {
    // Jacket torso + arms
    r( 5,  7+bob, 7, 5, PC.jacket)
    r( 7,  8+bob, 4, 2, PC.jacketLt)
    r(11,  7+bob, 3, 4, PC.jacket)
    r( 4,  7+bob, 2, 4, PC.jacket)
    r( 4,  6+bob, 8, 1, PC.hood)
    // Near hand glowing (forward)
    r(12, 11+bob, 2, 1, PC.skin)
    p(13, 11+bob, PC.magicLt)
    p(14, 11+bob, PC.magic)
    // Far hand (faint)
    p( 4, 11+bob, PC.skin)
    // Jeans
    r( 5, 12+bob, 3, 3, PC.jeans)
    r( 8, 12+bob, 3, 3, PC.jeans)
    // Sneakers (near foot forward)
    r( 9, 15+bob, 4, 1, PC.sneak)
    r( 5, 15+bob, 3, 1, PC.sneak)
    p(12, 15+bob, PC.sneakSole)
    // Hair + face (profile right)
    r( 5,  0, 7, 3, PC.hair)
    r(11,  1, 2, 3, PC.hair)
    p(10,  0, PC.hairLt)
    r( 6,  2, 6, 5, PC.skin)
    p(10,  3, PC.eye)
    p( 9,  4, PC.skinDk)
    p( 9,  5, PC.mouth)
  }
}
