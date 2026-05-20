import { useState } from 'react'

export function useGameState() {
  const [facing, setFacing] = useState('down')
  const [moving, setMoving] = useState(false)
  const [logEntries, setLogEntries] = useState([
    '<em>System:</em> Move with WASD.',
    'The torches flicker in the dark.',
    '<em>?</em> enters the dungeon.',
  ])
  const [guidance, setGuidance] = useState(null)
  const [worldData, setWorldData] = useState(null)
  const [exploredTiles, setExploredTiles] = useState(new Set())
  const [zoom, setZoom] = useState(1)
  const [playerPos, setPlayerPos] = useState(null)

  const resetGame = () => {
    setFacing('down')
    setMoving(false)
    setLogEntries([
      '<em>System:</em> Move with WASD.',
      'The torches flicker in the dark.',
      '<em>?</em> enters the dungeon.',
    ])
    setGuidance(null)
    setPlayerPos(null)
    setExploredTiles(new Set())
  }

  return {
    facing, setFacing,
    moving, setMoving,
    logEntries, setLogEntries,
    guidance, setGuidance,
    worldData, setWorldData,
    exploredTiles, setExploredTiles,
    zoom, setZoom,
    playerPos, setPlayerPos,
    resetGame
  }
}
