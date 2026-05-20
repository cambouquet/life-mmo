export const TILE_COLORS = {
  floor: 'rgba(70, 110, 150, 0.7)',
  wall: 'rgba(25, 25, 40, 0.9)',
  wallStroke: 'rgba(50, 50, 70, 0.6)',
  mirror: 'rgba(100, 220, 255, 0.9)',
  mirrorStroke: 'rgba(150, 240, 255, 0.6)',
  table: 'rgba(220, 140, 80, 0.85)',
  tableStroke: 'rgba(240, 160, 100, 0.5)',
  door: 'rgba(120, 180, 255, 0.75)',
  doorStroke: 'rgba(150, 200, 255, 0.7)',
  void: 'rgba(10, 10, 20, 0.6)',
}

export const TILE_DEFS = {
  0: { fill: 'floor', border: null },
  1: { fill: 'wall', border: 'wallStroke' },
  3: { fill: 'table', border: 'tableStroke' },
  4: { fill: 'mirror', border: 'mirrorStroke' },
  5: { fill: 'void', border: null },
  6: { fill: 'door', border: 'doorStroke' },
}
