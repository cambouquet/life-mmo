import { TILE, LEFT_W, TOTAL_H, MID_W, MID_START, ROOM_H, TORCHES, TORCHES2 } from './constants.jsx'
import { loadMapLayers } from './mapLoader.js'
import { buildCollisionMap } from './collisionMap.js'
import { extractObjectData } from './worldUtils.js'
import { buildDoorPositions, buildRoomBounds, buildObjectPositions } from './worldPositions.js'

export function buildWorld(playerStateRef) {
  const layers = loadMapLayers()
  const obj = layers.objects

  const { mirror1Pixel, mirror2Pixel, tablePixel, torchPixels } = extractObjectData(obj)

  const mirrorC = mirror1Pixel?.c ?? Math.floor(LEFT_W / 2) - 1
  const mirrorR = mirror1Pixel?.r ?? 1
  const mirror2C = mirror2Pixel?.c ?? MID_START + Math.floor(MID_W / 2) - 1
  const mirror2R = mirror2Pixel?.r ?? 1
  const tableC = tablePixel?.c ?? (MID_START + MID_W + 11 + 3)
  const tableR = tablePixel?.r ?? (Math.floor(ROOM_H / 2) - 2)

  const torchesFromPng = torchPixels.map(t => ({ c: t.c, r: t.r, row: t.row }))
  const TORCHES_LIVE = torchesFromPng.filter(t => t.row <= 0x01)
  const TORCHES2_LIVE = torchesFromPng.filter(t => t.row >= 0x02)

  const doorPos = buildDoorPositions()
  const ROOMS = buildRoomBounds()
  const objPos = buildObjectPositions(mirrorC, mirrorR, mirror2C, mirror2R, tableC, tableR)

  const map = buildCollisionMap(layers, false, false)

  const pcStartX = objPos.MIRROR_CX - 9
  const pcStartY = Math.floor(TOTAL_H / 2) * TILE
  const saved = playerStateRef?.current
  const player = {
    x: saved?.x ?? pcStartX,
    y: saved?.y ?? pcStartY,
    w: TILE,
    h: TILE,
    frame: 0,
    frameTick: 0,
    facing: saved?.facing ?? 'up',
    moving: false,
    jumpHeight: 0,
    jumpVel: 0,
    jumping: false,
  }

  return {
    layers,
    map,
    player,
    ...doorPos,
    ROOMS,
    ...objPos,
    TORCHES: TORCHES_LIVE.length ? TORCHES_LIVE : TORCHES,
    TORCHES2: TORCHES2_LIVE.length ? TORCHES2_LIVE : TORCHES2,
    TILE,
  }
}
