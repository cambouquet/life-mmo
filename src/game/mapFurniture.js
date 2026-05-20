import { LEFT_W, MID_START, MID_W, RIGHT_START } from './worldConstants.js'

export function placeMirrors(map) {
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
  return { mirrorC, mirrorR, mirror2C, mirror2R }
}

export function placeTable(map, rows) {
  const tableC = RIGHT_START + 3
  const tableR = Math.floor(rows / 2) - 2
  map[tableR][tableC] = 3
  map[tableR][tableC + 1] = 3
  return { tableC, tableR }
}
