import { ICON_PLAYER, ICON_WORLD, ICON_PROXIMITY, ICON_COLLISIONS, ICON_VERIFY, ICON_HELP, ICON_CLEAR } from './interactionIcons'

export const INTERACTIONS = [
  { id: 'inspect-player', label: 'Inspect Player', description: 'View player position, facing, velocity', icon: ICON_PLAYER },
  { id: 'inspect-world', label: 'Inspect World', description: 'View world structure and object positions', icon: ICON_WORLD },
  { id: 'check-proximity', label: 'Check Proximity', description: 'Find nearby interactive objects', icon: ICON_PROXIMITY },
  { id: 'scan-collisions', label: 'Scan Collisions', description: 'Find collision tiles around player', icon: ICON_COLLISIONS },
  { id: 'verify-state', label: 'Verify Game State', description: 'Full game state health check', icon: ICON_VERIFY },
  { id: 'help', label: 'Help', description: 'Show available interactions', icon: ICON_HELP },
  { id: 'clear', label: 'Clear Log', description: 'Clear interaction history', icon: ICON_CLEAR }
]
