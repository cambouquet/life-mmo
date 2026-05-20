import { TOTAL_W, TOTAL_H } from './worldConstants.js'
import { buildRoomCells, openDoors, placeMirrors, placeTable } from './mapBuilderHelpers'

export function buildMap(doorOpen = false, door2Open = false) {
  const map = []
  buildRoomCells(map, TOTAL_W, TOTAL_H)
  openDoors(map, doorOpen, door2Open)
  const mirrors = placeMirrors(map)
  const table = placeTable(map, TOTAL_H)
  return { map, ...mirrors, ...table }
}
