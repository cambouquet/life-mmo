import { useState, useCallback, useRef, useEffect } from 'react'
import { useViewportScale } from '../hooks/useViewportScale.jsx'
import { useCharacterState } from '../hooks/useCharacterState.js'
import { useUIState } from '../hooks/useUIState.js'
import { useGameState } from '../hooks/useGameState.js'
import { useMapEditorState } from '../hooks/useMapEditorState.js'
import { useRecordingScenarios } from '../hooks/useRecordingScenarios.js'
import { useAppInteraction, useMapPersistence, useExploredTiles } from '../hooks/useAppInteraction.js'
import HUD from './HUD/HUD.jsx'
import Game from './Game/Game.jsx'
import RecordButton from './RecordButton/RecordButton.jsx'
import DebugConsole from './HUD/DebugConsole.jsx'
import DebugLayer from './App/DebugLayer.jsx'
import { useRecorder } from '../playback/useRecorder.js'
import { AppModals } from './App/AppModals.jsx'
import { buildDebugConsoleHandlers } from './App/appStateSetup.js'

export default function App() {
  const wrapRef = useViewportScale()
  const gameRef = useRef(null)
  const playerStateRef = useRef(null)
  const worldDataRef = useRef(null)
  const canvasWrapRef = useRef(null)
  const doorUnlockedRef = useRef(false)
  const nameSetRef = useRef(false)
  const colorsSetRef = useRef(false)

  const { charColors, setCharColors, birthData, setBirthData, charName, setCharName, syncCharToStorage, resetChar } = useCharacterState()
  const { showDialog, setShowDialog, showHoroscope, setShowHoroscope, showEditor, setShowEditor, editorPage, setEditorPage, editorLimited, setEditorLimited, showGallery, setShowGallery, showGameTests, setShowGameTests, debugActive, setDebugActive, closeEditor, resetUI } = useUIState()
  const { facing, setFacing, moving, setMoving, logEntries, setLogEntries, guidance, setGuidance, worldData, setWorldData, exploredTiles, setExploredTiles, zoom, setZoom, playerPos, setPlayerPos, resetGame } = useGameState()
  const { activeMapMenu, setActiveMapMenu, hoveredTile, setHoveredTile, hoverPreview, setHoverPreview, pickerState, setPickerState, activeSprite, setActiveSprite, layerEdits, setLayerEdits, spriteColorOverrides, setSpriteColorOverrides, highlightColors, setHighlightColors } = useMapEditorState()

  const [recordings, setRecordings] = useState([])

  nameSetRef.current = !!charName
  colorsSetRef.current = Object.values(charColors).every(v => v !== '#ffffff')
  doorUnlockedRef.current = nameSetRef.current && colorsSetRef.current

  useEffect(() => {
    window.__gameRef = gameRef.current
    window.__exploredTiles = exploredTiles
  }, [exploredTiles])

  useMapPersistence(layerEdits, spriteColorOverrides)
  useExploredTiles(playerPos, setExploredTiles)

  const recorder = useRecorder({
    onReady: (blob, filename) => {
      const url = URL.createObjectURL(blob)
      setRecordings(prev => [...prev, { id: Date.now(), url, blob, filename, ts: Date.now() }])
      setShowGallery(true)
    }
  })

  const handleStateChange = useCallback(({ facing, moving, log, guidance, playerPos: newPlayerPos }) => {
    setFacing(facing)
    setMoving(moving)
    setLogEntries(log)
    setGuidance(guidance ?? null)
    setPlayerPos(newPlayerPos)
  }, [setFacing, setMoving, setLogEntries, setGuidance, setPlayerPos])

  const { handleInteract } = useAppInteraction(showHoroscope, setShowHoroscope, showEditor, setShowEditor, setEditorPage, setShowDialog)
  const { handleRecord, handleRecordGate, handleStop } = useRecordingScenarios(recorder, gameRef, null, setShowEditor, setEditorPage, setCharColors, charColors, charName, birthData)

  const debugConsoleProps = buildDebugConsoleHandlers(playerStateRef, resetChar, resetUI, resetGame, charName, charColors, birthData)

  return (
    <div className={`game-wrap ${debugActive ? 'debug-active' : ''}`} ref={wrapRef} style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
      <HUD facing={facing} moving={moving} logEntries={logEntries} charColors={charColors} charName={charName} playerPos={playerPos} exploredTiles={exploredTiles} worldData={worldData} debugActive={debugActive} activeMapMenu={activeMapMenu} onMapMenuChange={setActiveMapMenu} hoveredTile={hoveredTile} layers={worldData?.layers} collMap={worldData?.collMap} layerEdits={layerEdits} onEditSprite={setLayerEdits} highlightColors={highlightColors} onHighlightColorsChange={setHighlightColors} spriteColorOverrides={spriteColorOverrides} onSpriteColorChange={setSpriteColorOverrides} onHoverPreview={setHoverPreview} onPickerStateChange={setPickerState} activeSprite={activeSprite} onActiveSpriteChange={setActiveSprite} guidance={guidance} showDialog={showDialog} showHoroscope={showHoroscope} />
      <RecordButton status={recorder.status} progress={recorder.progress} recordingCount={recordings.length} onRecord={handleRecord} onRecordGate={handleRecordGate} onStop={handleStop} onOpenGallery={() => setShowGallery(true)} isOpen={showGallery} />
      {!showEditor && (
        <div className="canvas-wrap" ref={canvasWrapRef}>
          <Game ref={gameRef} onStateChange={handleStateChange} onInteract={handleInteract} paused={showDialog || showHoroscope} charColors={charColors} playerStateRef={playerStateRef} doorUnlockedRef={doorUnlockedRef} nameSetRef={nameSetRef} colorsSetRef={colorsSetRef} debugActive={debugActive} layerEdits={layerEdits} highlightColors={highlightColors} spriteColorOverrides={spriteColorOverrides} hoverPreview={hoverPreview} onHoveredTileChange={setHoveredTile} onWorldDataChange={(data) => { setWorldData(data); worldDataRef.current = data }} onEditSprite={setLayerEdits} activeSprite={activeSprite} />
        </div>
      )}
      <AppModals
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        showHoroscope={showHoroscope}
        setShowHoroscope={setShowHoroscope}
        showEditor={showEditor}
        showGallery={showGallery}
        setShowGallery={setShowGallery}
        charColors={charColors}
        setCharColors={setCharColors}
        charName={charName}
        birthData={birthData}
        editorPage={editorPage}
        editorLimited={editorLimited}
        closeEditor={closeEditor}
        syncCharToStorage={syncCharToStorage}
        recordings={recordings}
      />
      <DebugConsole
        onReset={debugConsoleProps.onReset}
        getSaveData={debugConsoleProps.getSaveData}
        onLoad={(slot) => debugConsoleProps.onLoad(slot, syncCharToStorage)}
      />
      <DebugLayer
        debugActive={debugActive}
        setDebugActive={setDebugActive}
        pickerState={pickerState}
        setPickerState={setPickerState}
        hoveredTile={hoveredTile}
        setHoveredTile={setHoveredTile}
        spriteColorOverrides={spriteColorOverrides}
        setSpriteColorOverrides={setSpriteColorOverrides}
        activeSprite={activeSprite}
        setActiveSprite={setActiveSprite}
        showGameTests={showGameTests}
        setShowGameTests={setShowGameTests}
        playerStateRef={playerStateRef}
        worldDataRef={worldDataRef}
        setHoverPreview={setHoverPreview}
      />
    </div>
  )
}
