export function dispatchInteractionAction(action, playground, player, world) {
  try {
    switch (action) {
      case 'inspect-player': playground.inspectPlayer(player, world); break
      case 'inspect-world': playground.inspectWorld(world); break
      case 'check-proximity': playground.checkProximity(player, world); break
      case 'verify-state': playground.verifyGameState(player, world); break
      case 'scan-collisions': playground.scanCollisionsAround(player, world); break
      case 'help': playground.help(); break
      case 'clear': playground.clear(); break
      default: playground.log('Unknown interaction', 'error')
    }
  } catch (error) {
    playground.log(`Error: ${error.message}`, 'error')
  }
}
