import { PC } from '../palette.jsx'

// 9px wide x 14px tall — centered in 16x16 tile at ox=x+3, oy=y+1
// Head 7px rounded (corner-cut), Body 7px with arm nubs, split legs
export function drawWarriorSprite(ctx, x, y, facing, frame) {
  x = Math.floor(x); y = Math.floor(y)
  const bob = frame === 1 ? 1 : 0
  const ox = x + 3, oy = y + 1 + bob
  const f = (lx, ly, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(ox+lx, oy+ly, w, h) }
  const d = (lx, ly, c)       => { ctx.fillStyle = c; ctx.fillRect(ox+lx, oy+ly, 1, 1) }

  if (facing === 'down') {
    // HEAD: 7px wide, corners cut for roundness
    f(1, 0, 5, 1, PC.hair)
    f(0, 1, 7, 1, PC.hair)
    d(2, 0, PC.hairLt); d(4, 0, PC.hairLt)
    d(0, 1, PC.hairLt); d(6, 1, PC.hairLt)
    f(0, 2, 7, 3, PC.skin)
    d(0, 2, PC.hair); d(6, 2, PC.hair)
    d(0, 4, PC.skinDk); d(6, 4, PC.skinDk)
    f(0, 2, 1, 3, PC.hair)
    f(6, 2, 1, 3, PC.hair)
    d(1, 2, PC.hair); d(5, 2, PC.hair)
    d(1, 3, PC.eye); d(2, 3, PC.eye)
    d(4, 3, PC.eye); d(5, 3, PC.eye)
    d(1, 3, PC.skinDk); d(4, 3, PC.skinDk)
    d(3, 3, PC.skinDk)
    d(2, 4, PC.mouth); d(3, 4, PC.mouth); d(4, 4, PC.mouth)
    // NECK
    f(2, 5, 3, 1, PC.skin)
    // COLLAR
    f(1, 6, 5, 1, PC.hood)
    d(0, 6, PC.jacket); d(6, 6, PC.jacket)
    // TORSO
    f(0, 7, 7, 4, PC.jacket)
    f(1, 7, 5, 1, PC.jacketLt)
    d(0, 7, PC.jacketLt); d(6, 7, PC.jacketLt)
    f(0, 8, 1, 3, PC.jacket); d(0, 8, PC.jacketLt)
    f(6, 8, 1, 3, PC.jacket); d(6, 8, PC.jacketLt)
    f(2, 8, 3, 3, PC.jacketLt)
    d(3, 8, PC.magic)
    d(2, 9, PC.magic); d(3, 9, PC.magicLt); d(4, 9, PC.magic)
    d(3,10, PC.magic)
    d(0,10, PC.skin); d(0,10, PC.magicLt)
    d(6,10, PC.skin); d(6,10, PC.magicLt)
    // LEGS
    f(0,11, 3, 2, PC.jeans); f(4,11, 3, 2, PC.jeans)
    d(0,11, PC.jacketLt); d(4,11, PC.jacketLt)
    d(3,11, PC.jeansDk); d(3,12, PC.jeansDk)
    // SHOES
    f(0,13, 4, 1, PC.sneak); f(4,13, 4, 1, PC.sneak)
    d(0,13, PC.sneakSole); d(3,13, PC.sneakSole)
    d(4,13, PC.sneakSole); d(7,13, PC.sneakSole)
  }

  if (facing === 'up') {
    // HEAD — back, all hair
    f(1, 0, 5, 1, PC.hair)
    f(0, 1, 7, 1, PC.hair)
    d(2, 0, PC.hairLt); d(4, 0, PC.hairLt)
    d(0, 1, PC.hairLt); d(6, 1, PC.hairLt)
    f(0, 2, 7, 3, PC.hair)
    d(0, 2, PC.hair); d(6, 2, PC.hair)
    f(0, 2, 1, 3, PC.hair); f(6, 2, 1, 3, PC.hair)
    d(2, 3, PC.hairLt); d(4, 3, PC.hairLt)
    d(0, 4, PC.jacket); d(6, 4, PC.jacket)
    // NECK
    f(2, 5, 3, 1, PC.hair)
    // COLLAR
    f(1, 6, 5, 1, PC.hood)
    d(0, 6, PC.jacket); d(6, 6, PC.jacket)
    // TORSO back
    f(0, 7, 7, 4, PC.jacket)
    f(1, 7, 5, 1, PC.jacketLt)
    d(0, 7, PC.jacketLt); d(6, 7, PC.jacketLt)
    f(0, 8, 1, 3, PC.jacket); d(0, 8, PC.jacketLt)
    f(6, 8, 1, 3, PC.jacket); d(6, 8, PC.jacketLt)
    f(2, 8, 3, 3, PC.jacketLt)
    d(3, 8, PC.magic)
    d(2, 9, PC.magic); d(3, 9, PC.magicLt); d(4, 9, PC.magic)
    d(3,10, PC.magic)
    d(0,10, PC.skin); d(6,10, PC.skin)
    // LEGS + SHOES
    f(0,11, 3, 2, PC.jeans); f(4,11, 3, 2, PC.jeans)
    d(0,11, PC.jacketLt); d(4,11, PC.jacketLt)
    d(3,11, PC.jeansDk); d(3,12, PC.jeansDk)
    f(0,13, 4, 1, PC.sneak); f(4,13, 4, 1, PC.sneak)
    d(0,13, PC.sneakSole); d(3,13, PC.sneakSole)
    d(4,13, PC.sneakSole); d(7,13, PC.sneakSole)
  }

  if (facing === 'left') {
    // HEAD profile: face on right side of head block
    f(1, 0, 4, 1, PC.hair)
    f(0, 1, 5, 1, PC.hair); d(1, 1, PC.hairLt)
    f(0, 2, 5, 3, PC.skin)
    d(0, 2, PC.hair); d(4, 2, PC.hair)
    f(0, 2, 1, 3, PC.hair)
    d(0, 4, PC.skinDk); d(4, 4, PC.skinDk)
    d(3, 3, PC.eye); d(4, 3, PC.eye); d(3, 3, PC.skinDk)
    d(4, 4, PC.skinDk)
    d(3, 5, PC.mouth)
    // NECK
    f(1, 5, 2, 1, PC.skin)
    // COLLAR
    f(1, 6, 5, 1, PC.hood)
    d(0, 6, PC.jacket); d(6, 6, PC.jacket)
    // TORSO
    f(0, 7, 7, 4, PC.jacket)
    f(1, 7, 4, 1, PC.jacketLt); d(6, 7, PC.jacketLt); d(6, 8, PC.jacketLt)
    f(1, 8, 3, 3, PC.jacketLt)
    f(0, 8, 1, 3, PC.jacket); d(0, 8, PC.jacketLt)
    d(0,10, PC.skin); d(0,10, PC.magicLt)
    d(2, 9, PC.magic); d(3, 9, PC.magicLt); d(4, 9, PC.magic)
    // LEGS
    f(0,11, 3, 2, PC.jeans); f(3,11, 3, 2, PC.jeansDk)
    d(3,11, PC.jeans); d(3,12, PC.jeans)
    d(0,11, PC.jacketLt)
    // SHOES
    f(0,13, 4, 1, PC.sneak); d(0,13, PC.sneakSole); d(3,13, PC.sneakSole)
    f(3,13, 3, 1, PC.jeansDk)
  }

  if (facing === 'right') {
    // HEAD profile: face on left side of head block (mirror)
    f(2, 0, 4, 1, PC.hair)
    f(2, 1, 5, 1, PC.hair); d(5, 1, PC.hairLt)
    f(2, 2, 5, 3, PC.skin)
    d(2, 2, PC.hair); d(6, 2, PC.hair)
    f(6, 2, 1, 3, PC.hair)
    d(2, 4, PC.skinDk); d(6, 4, PC.skinDk)
    d(2, 3, PC.eye); d(3, 3, PC.eye); d(2, 3, PC.skinDk)
    d(2, 4, PC.skinDk)
    d(3, 5, PC.mouth)
    // NECK
    f(4, 5, 2, 1, PC.skin)
    // COLLAR
    f(1, 6, 5, 1, PC.hood)
    d(0, 6, PC.jacket); d(6, 6, PC.jacket)
    // TORSO
    f(0, 7, 7, 4, PC.jacket)
    f(2, 7, 4, 1, PC.jacketLt); d(0, 7, PC.jacketLt); d(0, 8, PC.jacketLt)
    f(3, 8, 3, 3, PC.jacketLt)
    f(6, 8, 1, 3, PC.jacket); d(6, 8, PC.jacketLt)
    d(6,10, PC.skin); d(6,10, PC.magicLt)
    d(2, 9, PC.magic); d(3, 9, PC.magicLt); d(4, 9, PC.magic)
    // LEGS
    f(4,11, 3, 2, PC.jeans); f(1,11, 3, 2, PC.jeansDk)
    d(3,11, PC.jeans); d(3,12, PC.jeans)
    d(6,11, PC.jacketLt)
    // SHOES
    f(3,13, 4, 1, PC.sneak); d(3,13, PC.sneakSole); d(6,13, PC.sneakSole)
    f(1,13, 3, 1, PC.jeansDk)
  }
}