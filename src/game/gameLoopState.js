export function initializeGameLoopState() {
  return {
    torchPhase: 0,
    last: 0,
    prevShift: false,
    prevSpace: false,
    elapsed: 0,
    guidance: null,
    mirrorOpened: false,
    hasMovedToCorridor: false,
    log: [],
    door1: { open: false, progress: 0 },
    door2: { open: false, progress: 0 },
    hoveredTile: null,
    selectedTile: null,
    selectedTiles: [],
    dragStart: null,
    isDragging: false,
    dragMoved: false,
    altHeldDown: false,
    cameraOffsetX: 0,
    cameraOffsetY: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    isPanning: false,
  }
}

export const FieldMap = { floor: 'ground', wall: 'wall', table: 'obj', torch: 'entity' }
