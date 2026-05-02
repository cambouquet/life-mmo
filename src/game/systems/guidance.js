import { TILE, LEFT_W } from '../constants.jsx'

const TORCH_PX_X   = (LEFT_W - 1) * TILE
const TRIGGER_PX_X = TORCH_PX_X - TILE * 1.5

// Pure function — returns the guidance string (or null) for this frame.
export function resolveGuidance(player, elapsed, mirrorOpened, hasMovedToCorridor) {
  const px = player.x + TILE / 2

  if (px > TRIGGER_PX_X)                        return { text: 'Ready to know more?',        movedToCorridor: true  }
  if (hasMovedToCorridor && px <= TRIGGER_PX_X) return { text: 'Take your time...',           movedToCorridor: true  }
  if (!mirrorOpened && elapsed >= 20)            return { text: 'Do you know who you are?',   movedToCorridor: false }
  return { text: null, movedToCorridor: hasMovedToCorridor }
}
