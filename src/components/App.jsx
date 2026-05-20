import { useState } from 'react'
import { useViewportScale } from '../hooks/useViewportScale'
import { useAppState, updateRefFlags } from './App/appStateHooks'
import { buildDebugConsoleHandlers } from './App/appStateSetup'
import { AppRenderTree } from './App/AppRenderTree'
import { buildHUDProps, buildGameProps, buildModalsProps, buildRecordButtonProps, buildDebugLayerPropsHelper } from './App/appPropsBuilders'
import { useAppRefs } from './App/useAppRefs'
import { useAppRecorder, useAppStateHandlers, usePersistenceHooks } from './App/appStateSetupHooks'

export default function App() {
  const { character, ui, game, mapEditor } = useAppState()
  const { nameSetRef, colorsSetRef, doorUnlockedRef, ...refs } = useAppRefs(game.exploredTiles)
  const [recordings, setRecordings] = useState([])

  updateRefFlags(character.charName, character.charColors, nameSetRef, colorsSetRef, doorUnlockedRef)
  usePersistenceHooks(mapEditor, game, character)

  const recorder = useAppRecorder(ui.setShowGallery, setRecordings)
  const { handleStateChange, handleInteract, handleRecord, handleRecordGate, handleStop } = useAppStateHandlers(character, game, ui, refs.gameRef, mapEditor, recorder)

  const debugConsoleProps = buildDebugConsoleHandlers(refs.playerStateRef, character.resetChar, ui.resetUI, game.resetGame, character.charName, character.charColors, character.birthData)
  const hudProps = buildHUDProps(game.facing, game.moving, game.logEntries, character.charColors, character.charName, game.playerPos, game.exploredTiles, game.worldData, ui.debugActive, mapEditor.activeMapMenu, mapEditor.setActiveMapMenu, mapEditor.hoveredTile, mapEditor.layerEdits, mapEditor.setLayerEdits, mapEditor.highlightColors, mapEditor.setHighlightColors, mapEditor.spriteColorOverrides, mapEditor.setSpriteColorOverrides, mapEditor.setHoverPreview, mapEditor.setPickerState, mapEditor.activeSprite, mapEditor.setActiveSprite, game.guidance, ui.showDialog, ui.showHoroscope)
  const gameProps = buildGameProps(ui.showDialog, ui.showHoroscope, character.charColors, refs.playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, ui.debugActive, mapEditor.layerEdits, mapEditor.highlightColors, mapEditor.spriteColorOverrides, mapEditor.hoverPreview, mapEditor.setHoveredTile, game.setWorldData, refs.worldDataRef, mapEditor.setLayerEdits, mapEditor.activeSprite)
  const modalsProps = buildModalsProps(ui.showDialog, ui.setShowDialog, ui.showHoroscope, ui.setShowHoroscope, ui.showEditor, ui.showGallery, ui.setShowGallery, character.charColors, character.setCharColors, character.charName, character.birthData, ui.editorPage, ui.editorLimited, ui.closeEditor, character.syncCharToStorage, recordings)
  const recordButtonProps = buildRecordButtonProps(recorder, recordings, handleRecord, handleRecordGate, handleStop)
  const debugLayerProps = buildDebugLayerPropsHelper(ui.debugActive, ui.setDebugActive, mapEditor.pickerState, mapEditor.setPickerState, mapEditor.hoveredTile, mapEditor.setHoveredTile, mapEditor.spriteColorOverrides, mapEditor.setSpriteColorOverrides, mapEditor.activeSprite, mapEditor.setActiveSprite, ui.showGameTests, ui.setShowGameTests, refs.playerStateRef, refs.worldDataRef, mapEditor.setHoverPreview)

  return (
    <AppRenderTree
      wrapRef={refs.wrapRef}
      debugActive={ui.debugActive}
      zoom={game.zoom}
      showEditor={ui.showEditor}
      canvasWrapRef={refs.canvasWrapRef}
      gameRef={refs.gameRef}
      onStateChange={handleStateChange}
      onInteract={handleInteract}
      recorder={recorder}
      recordings={recordings}
      setShowGallery={ui.setShowGallery}
      showGallery={ui.showGallery}
      gameProps={gameProps}
      hudProps={hudProps}
      recordButtonProps={recordButtonProps}
      modalsProps={modalsProps}
      debugConsoleProps={debugConsoleProps}
      debugLayerProps={debugLayerProps}
    />
  )
}
