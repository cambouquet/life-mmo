export function verifyGameState(player, world, logs) {
  logs.push({ message: '=== Game State Verification ===', type: 'header', timestamp: new Date().toLocaleTimeString() })

  const checks = [
    { name: 'Player initialized', ok: !!player },
    { name: 'World initialized', ok: !!world },
    { name: 'Player has position', ok: player?.x !== undefined && player?.y !== undefined },
    { name: 'Player has facing', ok: !!player?.facing },
    { name: 'World has rooms', ok: !!world?.ROOMS?.length },
    { name: 'World has collision map', ok: !!world?.collMap },
    { name: 'Mirrors configured', ok: world?.MIRROR_CX !== undefined && world?.MIRROR2_CX !== undefined },
    { name: 'NPC configured', ok: world?.NPC_CX !== undefined }
  ]

  let passed = 0
  checks.forEach(check => {
    logs.push({ message: `${check.ok ? '✓' : '✗'} ${check.name}`, type: check.ok ? 'success' : 'error', timestamp: new Date().toLocaleTimeString() })
    if (check.ok) passed++
  })

  logs.push({ message: `Status: ${passed}/${checks.length} checks passed`, type: passed === checks.length ? 'success' : 'warning', timestamp: new Date().toLocaleTimeString() })
}
