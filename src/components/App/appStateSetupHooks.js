import { useCallback } from 'react'
import { useRecorder } from '../../playback/useRecorder'
import { useAppInteraction, useMapPersistence, useExploredTiles } from '../../hooks/useAppInteraction'
import { useRecordingScenarios } from '../../hooks/useRecordingScenarios'

export function useAppRecorder(setShowGallery, setRecordings) {
  return useRecorder({
    onReady: (blob, filename) => {
      setRecordings(prev => [...prev, { id: Date.now(), url: URL.createObjectURL(blob), blob, filename, ts: Date.now() }])
      setShowGallery(true)
    }
  })
}

export function useAppStateHandlers(character, game, ui, gameRef, mapEditor, recorder) {
  const { setFacing, setMoving, setLogEntries, setGuidance, setPlayerPos } = game
  const { setShowHoroscope, setShowEditor, setEditorPage, setShowDialog } = ui

  const handleStateChange = useCallback(({ facing, moving, log, guidance, playerPos }) => {
    setFacing(facing); setMoving(moving); setLogEntries(log); setGuidance(guidance ?? null); setPlayerPos(playerPos)
  }, [setFacing, setMoving, setLogEntries, setGuidance, setPlayerPos])

  const { handleInteract } = useAppInteraction(ui.showHoroscope, setShowHoroscope, ui.showEditor, setShowEditor, setEditorPage, setShowDialog)
  const { charColors, charName, birthData, setCharColors } = character
  const { handleRecord, handleRecordGate, handleStop } = useRecordingScenarios(recorder, gameRef, null, setShowEditor, setEditorPage, setCharColors, charColors, charName, birthData)

  return { handleStateChange, handleInteract, handleRecord, handleRecordGate, handleStop }
}

export function usePersistenceHooks(mapEditor, game, character) {
  useMapPersistence(mapEditor.layerEdits, mapEditor.spriteColorOverrides)
  useExploredTiles(game.playerPos, game.setExploredTiles)
}
