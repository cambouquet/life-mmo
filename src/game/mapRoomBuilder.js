import { LEFT_W, MID_W, MID_START, RIGHT_START, RIGHT_W } from './worldConstants.js'

export function buildRoomCells(map, cols, rows) {
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
}
