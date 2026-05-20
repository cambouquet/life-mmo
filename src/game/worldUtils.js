import { TILE } from './constants.jsx'

const SS_MIRROR = 0x02
const SS_TABLE = 0x03
const SS_TORCH = 0x04

export function findSprite(grid, ss, row) {
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c]?.ss === ss && grid[r][c]?.row === row)
        return { r, c }
  return null
}

export function findAllSprites(grid, ss) {
  const hits = []
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[r].length; c++)
      if (grid[r][c]?.ss === ss)
        hits.push({ r, c, row: grid[r][c].row })
  return hits
}

export function extractObjectData(obj) {
  const mirror1Pixel = findSprite(obj, SS_MIRROR, 0x00)
  const mirror2Pixel = findSprite(obj, SS_MIRROR, 0x01)
  const tablePixel = findSprite(obj, SS_TABLE, 0x00)
  const torchPixels = findAllSprites(obj, SS_TORCH).sort((a, b) => a.row - b.row)
  return { mirror1Pixel, mirror2Pixel, tablePixel, torchPixels }
}
