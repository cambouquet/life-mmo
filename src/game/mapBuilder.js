import { LEFT_W, MID_W, MID_START, RIGHT_START, RIGHT_W, ROOM_H, DOOR_C, DOOR_R, DOOR_H, DOOR2_C, DOOR2_R, DOOR2_H, GAP_W, TOTAL_W } from './worldConstants.js'

export function buildMap(doorOpen = false, door2Open = false) {
  const cols = TOTAL_W
  const rows = TOTAL_H
  const map = []

  for (let r = 0; r < rows; r++) {
    map[r] = []
    for (let c = 0; c < cols; c++) {
      const inLeft = c < LEFT_W
      const inMid = c >= MID_START && c < MID_START + MID_W
      const inRight = c >= RIGHT_START && c < RIGHT_START + RIGHT_W

      if (inLeft) {
        const edge = r === 0 || r === rows - 1 || c === 0 || c === LEFT_W - 1
        map[r][c] = edge ? 1 : 0
      } else if (inMid) {
        const lc = c - MID_START
        const edge = r === 0 || r === rows - 1 || lc === 0 || lc === MID_W - 1
        map[r][c] = edge ? 1 : 0
      } else if (inRight) {
        const lc = c - RIGHT_START
        const edge = r === 0 || r === rows - 1 || lc === 0 || lc === RIGHT_W - 1
        map[r][c] = edge ? 1 : 0
      } else {
        map[r][c] = 5
      }
    }
  }

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

  const mirrorC = Math.floor(LEFT_W / 2) - 1
  const mirrorR = 1
  for (let dr = 0; dr <= 1; dr++) {
    map[mirrorR + dr][mirrorC] = 4
    map[mirrorR + dr][mirrorC + 1] = 4
  }

  const mirror2C = MID_START + Math.floor(MID_W / 2) - 1
  const mirror2R = 1
  for (let dr = 0; dr <= 1; dr++) {
    map[mirror2R + dr][mirror2C] = 4
    map[mirror2R + dr][mirror2C + 1] = 4
  }

  const tableC = RIGHT_START + 3
  const tableR = Math.floor(rows / 2) - 2
  map[tableR][tableC] = 3
  map[tableR][tableC + 1] = 3

  return { map, mirrorC, mirrorR, mirror2C, mirror2R, tableC, tableR }
}
