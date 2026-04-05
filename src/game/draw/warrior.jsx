import { PC } from '../palette.jsx'

export function drawWarriorSprite(ctx, x, y, facing, frame) {
  x = Math.floor(x); y = Math.floor(y)
  const bob = frame === 1 ? 1 : 0
  const r = (ox, oy, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, w, h) }
  const p = (ox, oy, c)       => { ctx.fillStyle = c; ctx.fillRect(x+ox, y+oy, 1, 1) }

  if (facing === 'down') {
    // Cape
    r(3,  6+bob,10, 9, PC.cape)
    r(4,  5+bob, 8, 2, PC.capeDk)
    r(12, 9+bob, 1, 5, PC.capeMid)   // right fold shadow
    // Armor body
    r(4,  6+bob, 8, 7, PC.armor)
    r(5,  6+bob, 6, 2, PC.armorLt)
    r(5,  8+bob, 1, 4, PC.armorLt)
    p(8,  9+bob, PC.armorRim)         // center sheen
    // Belt
    r(4, 12+bob, 8, 2, PC.belt)
    p(7, 12+bob, '#d4a020')           // buckle
    // Shoulders
    r(2,  6+bob, 3, 4, PC.armorLt);  r(11, 6+bob, 3, 4, PC.armorLt)
    p(2,  6+bob, PC.armorRim);        p(13, 6+bob, PC.armorRim)
    // Sword
    r(13, 5+bob, 1, 8, PC.sword)
    p(13, 6+bob, PC.swordHi)          // blade fuller
    r(12, 5+bob, 1, 1, PC.sword)
    r(12, 9+bob, 3, 1, PC.swordHlt)
    r(13,10+bob, 1, 3, PC.swordGrp)
    // Shield
    r(1,  6+bob, 3, 5, PC.shield)
    r(1,  6+bob, 3, 1, PC.shieldRim); r(1, 10+bob, 3, 1, PC.shieldRim)
    p(2,  8+bob, PC.shieldRim)
    // Legs + boots
    r(4, 13+bob, 3, 3, PC.armorDk);  r(9, 13+bob, 3, 3, PC.armorDk)
    r(4, 15+bob, 3, 1, PC.boot);     r(9, 15+bob, 3, 1, PC.boot)
    // Helm
    r(4, 0, 8, 7, PC.helm)
    r(4, 0, 8, 2, PC.helmLt)
    r(5, 0, 6, 1, PC.helmRim)         // shiny top rim
    p(5, 1, PC.armorLt); p(10, 1, PC.armorLt)
    // Face
    r(5, 4, 6, 1, PC.visor)
    r(5, 5, 6, 2, PC.skin)
    p(6, 5, PC.eye); p(9, 5, PC.eye)
  }

  if (facing === 'up') {
    // Cape
    r(3, 6+bob,10, 9, PC.cape)
    r(5, 9+bob, 1, 5, PC.capeMid)    // left fold
    r(10,9+bob, 1, 5, PC.capeMid)    // right fold
    // Armor
    r(4, 6+bob, 8, 7, PC.armor)
    r(4,12+bob, 8, 2, PC.belt)
    // Shoulders
    r(2, 6+bob, 3, 4, PC.armorLt);  r(11,6+bob, 3, 4, PC.armorLt)
    // Sword + shield (back view)
    r(13,5+bob, 1, 7, PC.sword);    r(12,9+bob, 3, 1, PC.swordHlt)
    r(1, 6+bob, 3, 5, PC.shield)
    r(1, 6+bob, 3, 1, PC.shieldRim); r(1,10+bob, 3, 1, PC.shieldRim)
    // Legs + boots
    r(4,13+bob, 3, 2, PC.armorDk);  r(9,13+bob, 3, 2, PC.armorDk)
    r(4,15+bob, 3, 1, PC.boot);     r(9,15+bob, 3, 1, PC.boot)
    // Helm
    r(4, 0, 8, 7, PC.helm)
    r(4, 0, 8, 2, PC.helmLt)
    r(5, 0, 6, 1, PC.helmRim)        // shiny rim
    r(7, 0, 2, 1, '#cc2020')         // plume
  }

  if (facing === 'left') {
    // Cape
    r(3, 6+bob, 9, 9, PC.cape)
    r(8, 9+bob, 1, 5, PC.capeMid)    // fold
    // Armor
    r(4, 6+bob, 7, 7, PC.armor)
    r(4, 6+bob, 5, 2, PC.armorLt)
    r(4,12+bob, 7, 2, PC.belt)
    // Shield
    r(1, 6+bob, 4, 5, PC.shield)
    r(1, 6+bob, 1, 5, PC.shieldRim)
    r(1, 6+bob, 4, 1, PC.shieldRim); r(1,10+bob, 4, 1, PC.shieldRim)
    // Sword
    r(11,8+bob, 1, 5, PC.sword)
    // Legs + boots
    r(4,13+bob, 3, 2, PC.armorDk);  r(7,13+bob, 3, 2, PC.armorDk)
    r(4,15+bob, 3, 1, PC.boot);     r(7,15+bob, 3, 1, PC.boot)
    // Helm
    r(4, 0, 7, 7, PC.helm)
    r(4, 0, 7, 2, PC.helmLt)
    r(4, 0, 7, 1, PC.helmRim)        // shiny rim
    // Face
    r(4, 4, 5, 1, PC.visor)
    r(4, 5, 5, 2, PC.skin)
    p(5, 5, PC.eye)
    p(7, 5, PC.skinDk)               // nose
  }

  if (facing === 'right') {
    // Cape
    r(4,  6+bob, 9, 9, PC.cape)
    r(7,  9+bob, 1, 5, PC.capeMid)   // fold
    // Armor
    r(5,  6+bob, 7, 7, PC.armor)
    r(7,  6+bob, 5, 2, PC.armorLt)
    r(5, 12+bob, 7, 2, PC.belt)
    // Shield
    r(11, 6+bob, 4, 5, PC.shield)
    r(14, 6+bob, 1, 5, PC.shieldRim)
    r(11, 6+bob, 4, 1, PC.shieldRim); r(11,10+bob, 4, 1, PC.shieldRim)
    // Sword
    r(4,  8+bob, 1, 5, PC.sword)
    p(4,  8+bob, PC.swordHi)          // fuller
    // Legs + boots
    r(5,13+bob, 3, 2, PC.armorDk);  r(8,13+bob, 3, 2, PC.armorDk)
    r(5,15+bob, 3, 1, PC.boot);     r(8,15+bob, 3, 1, PC.boot)
    // Helm
    r(5, 0, 7, 7, PC.helm)
    r(5, 0, 7, 2, PC.helmLt)
    r(5, 0, 7, 1, PC.helmRim)        // shiny rim
    // Face
    r(7, 4, 5, 1, PC.visor)
    r(7, 5, 4, 2, PC.skin)
    p(10, 5, PC.eye)
    p(8,  5, PC.skinDk)              // nose
  }
}
