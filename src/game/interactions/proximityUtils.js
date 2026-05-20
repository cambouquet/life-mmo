export function checkProximity(player, world, logs) {
  if (!player || !world) {
    logs.push({ message: 'Missing player or world data', type: 'error', timestamp: new Date().toLocaleTimeString() })
    return
  }

  const px = player.x + 8
  const py = player.y + 8

  const proximities = []

  const dist1 = Math.hypot(world.MIRROR_CX - px, world.MIRROR_CY - py)
  const dist2 = Math.hypot(world.MIRROR2_CX - px, world.MIRROR2_CY - py)
  const distNpc = Math.hypot(world.NPC_CX - px, world.NPC_CY - py)

  if (dist1 < 50) proximities.push({ target: 'Mirror 1', distance: dist1.toFixed(1), proximity: 'CLOSE' })
  if (dist2 < 50) proximities.push({ target: 'Mirror 2', distance: dist2.toFixed(1), proximity: 'CLOSE' })
  if (distNpc < 50) proximities.push({ target: 'NPC', distance: distNpc.toFixed(1), proximity: 'CLOSE' })

  if (proximities.length === 0) {
    logs.push({ message: 'No nearby interactive objects', type: 'info', timestamp: new Date().toLocaleTimeString() })
  } else {
    proximities.forEach(p => {
      logs.push({ message: `${p.target}: ${p.distance}px (${p.proximity})`, type: 'highlight', timestamp: new Date().toLocaleTimeString() })
    })
  }

  return proximities
}
