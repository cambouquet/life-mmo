export const TILE = 16
export const COLS = 20
export const ROWS = 14
export const W = COLS * TILE
export const H = ROWS * TILE
export const SCALE = 1

export const LEFT_W = 16
export const GAP_W = 2
export const MID_W = 14
export const RIGHT_W = 14
export const ROOM_H = 14
export const MID_START = LEFT_W + GAP_W
export const RIGHT_START = MID_START + MID_W + GAP_W
export const TOTAL_W = LEFT_W + GAP_W + MID_W + GAP_W + RIGHT_W
export const TOTAL_H = ROOM_H

export const DOOR_C = LEFT_W - 1
export const DOOR_R = Math.floor(ROOM_H / 2) - 1
export const DOOR_H = 2

export const DOOR2_C = MID_START + MID_W - 1
export const DOOR2_R = DOOR_R
export const DOOR2_H = DOOR_H
