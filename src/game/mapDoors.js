import { DOOR_C, DOOR_R, DOOR_H, DOOR2_C, DOOR2_R, DOOR2_H, GAP_W } from './worldConstants.js'

export function openDoors(map, doorOpen, door2Open) {
  if (doorOpen) {
    for (let dr = 0; dr < DOOR_H; dr++) {
      for (let dc = 0; dc <= GAP_W + 1; dc++) {
        map[DOOR_R + dr][DOOR_C + dc] = 6
      }
    }
  }
  if (door2Open) {
    for (let dr = 0; dr < DOOR2_H; dr++) {
      for (let dc = 0; dc <= GAP_W + 1; dc++) {
        map[DOOR2_R + dr][DOOR2_C + dc] = 6
      }
    }
  }
}
