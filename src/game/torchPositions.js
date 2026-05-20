import { LEFT_W, DOOR_R, DOOR_H, MID_START, DOOR2_R, DOOR2_H } from './worldConstants.js'

export const TORCHES = [
  { c: LEFT_W - 1, r: DOOR_R - 1 },
  { c: LEFT_W - 1, r: DOOR_R + DOOR_H },
]

export const TORCHES2 = [
  { c: MID_START, r: DOOR2_R - 1 },
  { c: MID_START, r: DOOR2_R + DOOR2_H },
]
