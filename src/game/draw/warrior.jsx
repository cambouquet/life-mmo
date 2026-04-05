import { PC } from '../palette.jsx'

// 7px wide × 14px tall figure, centered in 16×16 tile at ox=x+4, oy=y+1
export function drawWarriorSprite(ctx, x, y, facing, frame) {
  x = Math.floor(x); y = Math.floor(y)
  const bob = frame === 1 ? 1 : 0
  const ox = x + 4, oy = y + 1 + bob
  const r = (lx, ly, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(ox+lx, oy+ly, w, h) }
  const p = (lx, ly, c)       => { ctx.fillStyle = c; ctx.fillRect(ox+lx, oy+ly, 1, 1) }

  if (facing === 'down') {
    // head (5px wide, rows 0-4)
    r(1, 0, 5, 1, PC.hair)        // hair top
    r(0, 1, 7, 1, PC.hair)        // hair sides wide
    r(1, 2, 5, 3, PC.skin)        // face 5×3
    p(1, 2, PC.hair); p(5, 2, PC.hair)  // hair frames
    p(2, 2, PC.eye);  p(4, 2, PC.eye)   // eyes row 2
    p(3, 3, PC.skinDk)                  // nose
    p(2, 4, PC.mouth); p(3, 4, PC.mouth) // mouth
    p(0, 1, PC.hairLt); p(6, 1, PC.hairLt) // hair glint

    // neck
    r(2, 5, 3, 1, PC.skin)

    // collar
    r(1, 6, 5, 1, PC.hood)

    // body (5px wide, rows 7-10)
    r(0, 7, 7, 4, PC.jacket)
    r(0, 7, 1, 4, PC.jacketLt)  // left rim
    r(6, 7, 1, 4, PC.jacketLt)  // right rim
    r(1, 7, 5, 1, PC.jacketLt)  // shoulder highlight

    // magic rune (chest centre)
    p(2, 8, PC.magic); p(3, 8, PC.magicLt); p(4, 8, PC.magic)
    p(3, 9, PC.magicLt)

    // hands
    p(0, 9, PC.skin); p(6, 9, PC.skin)

    // legs (split, rows 11-12)
    r(0,11, 3, 2, PC.jeans)
    r(4,11, 3, 2, PC.jeans)
    p(3,11, PC.jeansDk)

    // feet (row 13)
    r(0,13, 3, 1, PC.sneak)
    r(4,13, 3, 1, PC.sneak)
    p(0,13, PC.sneakSole); p(4,13, PC.sneakSole)
  }

  if (facing === 'up') {
    // back of head: all hair
    r(1, 0, 5, 1, PC.hair)
    r(0, 1, 7, 1, PC.hair)
    r(1, 2, 5, 3, PC.hair)
    p(2, 2, PC.hairLt); p(4, 2, PC.hairLt)

    // neck
    r(2, 5, 3, 1, PC.hair)

    // collar
    r(1, 6, 5, 1, PC.hood)

    // back jacket with sigil
    r(0, 7, 7, 4, PC.jacket)
    r(0, 7, 1, 4, PC.jacketLt)
    r(6, 7, 1, 4, PC.jacketLt)
    r(1, 7, 5, 2, PC.jacketLt)
    p(2, 8, PC.magic); p(3, 8, PC.magicLt); p(4, 8, PC.magic)
    p(3, 9, PC.magic)

    // hands
    p(0, 9, PC.skin); p(6, 9, PC.skin)

    // legs + feet
    r(0,11, 3, 2, PC.jeans); r(4,11, 3, 2, PC.jeans); p(3,11, PC.jeansDk)
    r(0,13, 3, 1, PC.sneak); r(4,13, 3, 1, PC.sneak)
    p(0,13, PC.sneakSole); p(4,13, PC.sneakSole)
  }

  if (facing === 'left') {
    // head profile facing left
    r(1, 0, 4, 1, PC.hair)
    r(0, 1, 5, 1, PC.hair)
    r(0, 2, 1, 3, PC.hair)       // back hair fall
    r(1, 2, 4, 3, PC.skin)       // face
    p(1, 3, PC.eye)              // eye (near side)
    p(2, 4, PC.skinDk)           // nose
    p(2, 5, PC.mouth)

    // neck
    r(1, 5, 2, 1, PC.skin)

    // collar
    r(1, 6, 5, 1, PC.hood)

    // body
    r(0, 7, 6, 4, PC.jacket)
    r(5, 7, 1, 4, PC.jacketLt)   // far-side rim
    r(1, 7, 4, 1, PC.jacketLt)   // shoulder

    // near arm forward
    r(0, 8, 1, 3, PC.jacket)
    p(0, 9, PC.skin); p(0, 9, PC.magicLt)

    // rune
    p(2, 8, PC.magic); p(3, 8, PC.magic); p(2, 9, PC.magic)

    // legs (near leg forward)
    r(0,11, 3, 2, PC.jeans); r(3,11, 2, 2, PC.jeansDk)
    r(0,13, 3, 1, PC.sneak)
    p(0,13, PC.sneakSole)
  }

  if (facing === 'right') {
    // mirror of left
    r(2, 0, 4, 1, PC.hair)
    r(2, 1, 5, 1, PC.hair)
    r(6, 2, 1, 3, PC.hair)       // back hair fall
    r(2, 2, 4, 3, PC.skin)
    p(5, 3, PC.eye)
    p(4, 4, PC.skinDk)
    p(4, 5, PC.mouth)

    r(1, 5, 2, 1, PC.skin)

    r(1, 6, 5, 1, PC.hood)

    r(1, 7, 6, 4, PC.jacket)
    r(1, 7, 1, 4, PC.jacketLt)
    r(2, 7, 4, 1, PC.jacketLt)

    r(6, 8, 1, 3, PC.jacket)
    p(6, 9, PC.skin); p(6, 9, PC.magicLt)

    p(3, 8, PC.magic); p(4, 8, PC.magic); p(4, 9, PC.magic)

    r(4,11, 3, 2, PC.jeans); r(2,11, 2, 2, PC.jeansDk)
    r(4,13, 3, 1, PC.sneak)
    p(6,13, PC.sneakSole)
  }
}
