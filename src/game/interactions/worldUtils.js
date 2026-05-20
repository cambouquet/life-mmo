export function inspectWorld(world, logs) {
  if (!world) {
    logs.push({ message: 'World not initialized', type: 'error', timestamp: new Date().toLocaleTimeString() })
    return
  }

  logs.push({ message: '=== World Structure ===', type: 'header', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `Rooms: ${world.ROOMS?.length || 0}`, type: 'info', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `Mirror 1: (${world.MIRROR_CX}, ${world.MIRROR_CY})`, type: 'info', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `Mirror 2: (${world.MIRROR2_CX}, ${world.MIRROR2_CY})`, type: 'info', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `NPC: (${world.NPC_CX}, ${world.NPC_CY})`, type: 'info', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `Collision map: ${world.collMap?.length || 0} rows`, type: 'info', timestamp: new Date().toLocaleTimeString() })
}

export function inspectRoom(player, world, roomIndex, logs) {
  if (!world?.ROOMS?.[roomIndex]) {
    logs.push({ message: `Room ${roomIndex} not found`, type: 'error', timestamp: new Date().toLocaleTimeString() })
    return
  }

  const room = world.ROOMS[roomIndex]
  logs.push({ message: `=== Room ${roomIndex} ===`, type: 'header', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `Position: (${room.x}, ${room.y})`, type: 'info', timestamp: new Date().toLocaleTimeString() })
  logs.push({ message: `Size: ${room.w}x${room.h}`, type: 'info', timestamp: new Date().toLocaleTimeString() })

  if (player) {
    const inRoom = player.x >= room.x && player.x < room.x + room.w &&
                   player.y >= room.y && player.y < room.y + room.h
    logs.push({ message: `Player in room: ${inRoom ? 'YES' : 'NO'}`, type: inRoom ? 'success' : 'info', timestamp: new Date().toLocaleTimeString() })
  }
}
