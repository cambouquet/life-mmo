import { MIRROR_APPROACH_X, MIRROR_APPROACH_Y, DOOR_APPROACH_X, DOOR_Y, THROUGH_GATE_X, THROUGH_GATE_Y } from './gateRunCoords.js'
import { randomPalette } from '../colorUtils.js'
import { randomName } from '../nameUtils.js'

export async function gateRun(engine) {
  const palette = randomPalette()
  const name = randomName()
  await engine.wait(300)
  await engine.moveTo(MIRROR_APPROACH_X, MIRROR_APPROACH_Y, 8)
  await engine.face('up')
  await engine.wait(600)
  await engine.openMirror()
  await engine.setName(name)
  await engine.wait(500)
  await engine.changeColor('hair',   palette.hair)
  await engine.changeColor('outfit', palette.outfit)
  await engine.changeColor('eyes',   palette.eyes)
  await engine.wait(700)
  await engine.saveMirror(palette, name)
  await engine.wait(800)
  await engine.moveTo(DOOR_APPROACH_X, DOOR_Y, 10)
  await engine.face('right')
  await engine.wait(600)
  await engine.moveTo(THROUGH_GATE_X, THROUGH_GATE_Y, 10)
  await engine.wait(800)
}
