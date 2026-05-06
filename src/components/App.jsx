import { useState, useCallback, useRef, useEffect } from 'react'
import { useViewportScale }  from '../hooks/useViewportScale.jsx'
import HUD                   from './HUD/HUD.jsx'
import Game                  from './Game/Game.jsx'
import HoroscopeModal        from './HoroscopeModal/HoroscopeModal.jsx'
import DialogModal           from './DialogModal/DialogModal.jsx'
import GuidanceVoice         from './GuidanceVoice/GuidanceVoice.jsx'
import CharacterEditor       from './CharacterEditor/CharacterEditor.jsx'
import RecordButton          from './RecordButton/RecordButton.jsx'
import VideoGallery          from './VideoGallery/VideoGallery.jsx'
import DebugConsole          from './HUD/DebugConsole.jsx'
import MapEditButton         from './DebugButton/MapEditButton.jsx'
import MapEditorPanel        from './DebugButton/MapEditorPanel.jsx'
import SpritePickerModal     from './DebugButton/SpritePickerModal.jsx'
import { useRecorder }       from '../playback/useRecorder.js'
import { PlaybackEngine }    from '../playback/PlaybackEngine.js'
import { mirrorVisit }       from '../playback/scenarios/mirrorVisit.js'
import { gateRun }           from '../playback/scenarios/gateRun.js'

const LS_COLORS = 'life-mmo-colors-v3'
const LS_BIRTH  = 'life-mmo-birth'
const LS_NAME   = 'life-mmo-name'
const LS_MAP_EDITS = 'life-mmo-map-edits-v2'
const LS_SPRITE_COLORS = 'life-mmo-sprite-colors-v2'

const DEFAULT_COLORS = { hair: '#ffffff', skin: '#ffffff', eyes: '#ffffff', outfit: '#ffffff', stick: '#ffffff' }
const DEFAULT_BIRTH = {
  date: '1988-01-27',
  time: '03:55',
  city: { name: 'Paris XIII', country: 'FR', lat: 48.83, lng: 2.36, tz: 1 }
}

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}

export default function App() {
  const [facing,        setFacing]        = useState('down')
  const [moving,        setMoving]        = useState(false)
  const [logEntries,    setLogEntries]    = useState([
    '<em>System:</em> Move with WASD.',
    'The torches flicker in the dark.',
    '<em>?</em> enters the dungeon.',
  ])
  const [guidance,      setGuidance]      = useState(null)
  const [showDialog,    setShowDialog]    = useState(false)
  const [showHoroscope, setShowHoroscope] = useState(false)
  const [showEditor,    setShowEditor]    = useState(false)
  const [editorPage,    setEditorPage]    = useState(0)
  const [editorLimited, setEditorLimited] = useState(false)
  const [showGallery,   setShowGallery]   = useState(false)
  const [recordings,    setRecordings]    = useState([])
  const [charColors,    setCharColors]    = useState(() => load(LS_COLORS, DEFAULT_COLORS))
  const [birthData,     setBirthData]     = useState(() => load(LS_BIRTH,  DEFAULT_BIRTH))
  const [charName,      setCharName]      = useState(() => load(LS_NAME,   null))
  const [debugActive,   setDebugActive]   = useState(false)
  const [hoveredTile,   setHoveredTile]   = useState(null)
  const [hoverPreview,  setHoverPreview]  = useState(null)
  const [pickerState,   setPickerState]   = useState({ pickerOpen: null, activeTab: 'tiles', selectedSpriteForColor: null, ground: null, wall: null, obj: null, entity: null })
  const [activeSprite,  setActiveSprite]  = useState({ category: 'ground', sprite: null })
  const [worldData,     setWorldData]     = useState(null)
  const [layerEdits,    setLayerEdits]    = useState(() => load(LS_MAP_EDITS, {}))
  const [spriteColorOverrides, setSpriteColorOverrides] = useState(() => load(LS_SPRITE_COLORS, {}))
  const [highlightColors, setHighlightColors] = useState({
    selectedFill: 'rgba(100,200,255,0.15)',
    selectedStroke: 'rgba(100,220,255,0.5)',
    hoveredFill: 'rgba(100,200,255,0.15)',
    hoveredStroke: 'rgba(100,220,255,0.4)',
  })
  const [exploredTiles, setExploredTiles] = useState(new Set())
  const [zoom, setZoom] = useState(1)
  const [playerPos, setPlayerPos] = useState(null)

  const wrapRef          = useViewportScale()
  const gameRef          = useRef(null)
  const uiOverlayRef     = useRef(null)
  const engineRef        = useRef(null)
  const playerStateRef   = useRef(null)
  const doorUnlockedRef  = useRef(false)
  const nameSetRef       = useRef(!!charName)
  const colorsSetRef     = useRef(Object.values(charColors).every(v => v !== '#ffffff'))

  // Keep refs in sync each render
  nameSetRef.current   = !!charName
  colorsSetRef.current = Object.values(charColors).every(v => v !== '#ffffff')
  doorUnlockedRef.current = nameSetRef.current && colorsSetRef.current


  // Save layer edits and sprite colors to both localStorage and backend
  useEffect(() => {
    localStorage.setItem(LS_MAP_EDITS, JSON.stringify(layerEdits))
    localStorage.setItem(LS_SPRITE_COLORS, JSON.stringify(spriteColorOverrides))

    // Save to backend if there are edits
    if (Object.keys(layerEdits).length > 0 || Object.keys(spriteColorOverrides).length > 0) {
      fetch('/api/map/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layerEdits, spriteColorOverrides }),
      }).catch(err => console.error('Failed to save map edits:', err))
    }
  }, [layerEdits, spriteColorOverrides])

  const recorder      = useRecorder({
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

    // Track explored tiles
    if (newPlayerPos) {
      const TILE = 16
      const tileR = Math.floor(newPlayerPos.y / TILE)
      const tileC = Math.floor(newPlayerPos.x / TILE)
      const tileKey = `${tileR},${tileC}`
      setExploredTiles(prev => new Set(prev).add(tileKey))
    }
  }, [])

  const handleInteract = useCallback((target) => {
    if (showHoroscope) setShowHoroscope(false)
    else if (showEditor) {
      setShowEditor(false)
      setEditorPage(0)
    }
    else if (target === 'mirror1') {
      console.action('Opening Mirror (limited)')
      setEditorLimited(true)
      setShowEditor(true)
      setEditorPage(0)
    }
    else if (target === 'mirror2') {
      console.action('Opening Mirror')
      setEditorLimited(false)
      setShowEditor(true)
      setEditorPage(0)
    }
    else if (target === 'npc' || !showDialog) setShowDialog(true)
  }, [showHoroscope, showDialog, showEditor])

  const handleRecord = useCallback(async () => {
    let stream
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: false })
    } catch (err) {
      console.error('[record] screen capture denied:', err?.message)
      return
    }
    console.action('▶ Record started — scenario: mirrorVisit')
    if (!recorder.start(stream)) return

    const engine = new PlaybackEngine({
      getPlayerPos:  () => gameRef.current?.playerPos() ?? { x: 0, y: 0 },
      onOpenEditor:  () => { 
        console.action('⬡ Mirror opened')
        setShowEditor(true) 
        setEditorPage(0)
        recorder.updateOverlay({ showEditor: true })
      },
      onCloseEditor: () => { 
        console.action('⬡ Mirror closed')
        setShowEditor(false) 
        setEditorPage(0)
        recorder.updateOverlay({ showEditor: false })
      },
      onScrollEditor: (p) => {
        setEditorPage(p)
      },
      onColorChange: (key, value) => {
        console.action(`🎨 Color changed — ${key}: ${value}`)
        setCharColors(prev => {
          const next = { ...prev, [key]: value }
          recorder.updateOverlay({ charColors: next })
          return next
        })
      },
      onComplete: () => {
        console.action('✓ Scenario complete — converting in 1.5s')
        setTimeout(() => {
          const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
          recorder.stop(`mirror-visit_${ts}.mp4`)
        }, 1500)
      },
    })

    engineRef.current = engine
    engine.run(mirrorVisit)
  }, [recorder, charColors, birthData])

  const handleRecordGate = useCallback(async () => {
    let stream
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: false })
    } catch (err) {
      console.error('[record] screen capture denied:', err?.message)
      return
    }
    console.action('▶ Record started — scenario: gateRun')
    if (!recorder.start(stream)) return

    const engine = new PlaybackEngine({
      getPlayerPos:  () => gameRef.current?.playerPos() ?? { x: 0, y: 0 },
      onOpenEditor:  () => {
        console.action('⬡ Mirror opened')
        setShowEditor(true)
        setEditorPage(0)
        recorder.updateOverlay({ showEditor: true })
      },
      onCloseEditor: () => {
        console.action('⬡ Mirror closed')
        setShowEditor(false)
        setEditorPage(0)
        recorder.updateOverlay({ showEditor: false })
      },
      onScrollEditor: (p) => {
        setEditorPage(p)
      },
      onColorChange: (key, value) => {
        console.action(`🎨 Color changed — ${key}: ${value}`)
        setCharColors(prev => {
          const next = { ...prev, [key]: value }
          recorder.updateOverlay({ charColors: next })
          return next
        })
      },
      onSetName: (name) => {
        console.action(`✏ Name set — ${name}`)
        setCharName(name)
        try { localStorage.setItem(LS_NAME, JSON.stringify(name)) } catch {}
      },
      onSaveMirror: (colors, name) => {
        console.action('💾 Mirror saved')
        setCharColors(prev => {
          const merged = { ...prev, ...colors }
          try { localStorage.setItem(LS_COLORS, JSON.stringify(merged)) } catch {}
          recorder.updateOverlay({ charColors: merged, showEditor: false })
          return merged
        })
        setCharName(name)
        try { localStorage.setItem(LS_NAME, JSON.stringify(name)) } catch {}
        setShowEditor(false)
        setEditorPage(0)
        setEditorLimited(false)
      },
      onComplete: () => {
        console.action('✓ Scenario complete — converting in 1.5s')
        setTimeout(() => {
          const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
          recorder.stop(`gate-run_${ts}.mp4`)
        }, 1500)
      },
    })

    engineRef.current = engine
    engine.run(gateRun)
  }, [recorder])

  const handleStop = useCallback(() => {
    console.action('■ Recording stopped by user')
    engineRef.current?.abort()
    engineRef.current = null
    recorder.cancel()
    setShowEditor(false)
  }, [recorder])

  return (
    <div className={`game-wrap ${debugActive ? 'debug-active' : ''}`} ref={wrapRef} style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
      <HUD facing={facing} moving={moving} logEntries={logEntries} charColors={charColors} charName={charName} playerPos={playerPos} exploredTiles={exploredTiles} worldData={worldData} />
      {!showEditor && (
        <div className="canvas-wrap">
        <Game
          ref={gameRef}
          onStateChange={handleStateChange}
          onInteract={handleInteract}
          paused={showDialog || showHoroscope}
          charColors={charColors}
          playerStateRef={playerStateRef}
          doorUnlockedRef={doorUnlockedRef}
          nameSetRef={nameSetRef}
          colorsSetRef={colorsSetRef}
          debugActive={debugActive}
          layerEdits={layerEdits}
          highlightColors={highlightColors}
          spriteColorOverrides={spriteColorOverrides}
          hoverPreview={hoverPreview}
          onHoveredTileChange={setHoveredTile}
          onWorldDataChange={setWorldData}
          onEditSprite={setLayerEdits}
          activeSprite={activeSprite}
        />
        <div className="ui-overlay" ref={uiOverlayRef}>
          {!showDialog && !showHoroscope && <GuidanceVoice text={guidance} />}

          {showDialog && (
            <DialogModal
              onClose={() => setShowDialog(false)}
              onHoroscope={() => { setShowDialog(false); setShowHoroscope(true) }}
            />
          )}

          {showHoroscope && <HoroscopeModal birthData={birthData} onClose={() => setShowHoroscope(false)} />}
        </div>
        </div>
      )}

      {showEditor && (
        <CharacterEditor
          initialColors={charColors}
          initialBirthData={birthData}
          initialName={charName}
          scrollPage={editorPage}
          limited={editorLimited}
          onClose={() => {
            console.action('Closing Mirror')
            setShowEditor(false)
            setEditorPage(0)
            setEditorLimited(false)
          }}
          onChange={(next) => {
            const keys = Object.keys(next)
            const changed = keys.find(k => next[k] !== charColors[k])
            if (changed) console.action(`Changing ${changed} to ${next[changed]}`)
            setCharColors(next)
          }}
          onSave={(colors, data, name) => {
            console.action('Saving character data')
            setCharColors(colors)
            setBirthData(data)
            setCharName(name)
            try { localStorage.setItem(LS_NAME, JSON.stringify(name)) } catch {}
            try { localStorage.setItem(LS_COLORS, JSON.stringify(colors)) } catch {}
            try { if (data) localStorage.setItem(LS_BIRTH, JSON.stringify(data)) } catch {}
            setShowEditor(false)
            setEditorPage(0)
            setEditorLimited(false)
          }}
        />
      )}
      <DebugConsole
        onReset={() => {
          playerStateRef.current = null
          setCharColors(DEFAULT_COLORS)
          setBirthData(DEFAULT_BIRTH)
          setCharName(null)
          setShowEditor(false)
          setEditorPage(0)
          setEditorLimited(false)
          setShowDialog(false)
          setShowHoroscope(false)
          setGuidance(null)
          setLogEntries([
            '<em>System:</em> Move with WASD.',
            'The torches flicker in the dark.',
            '<em>?</em> enters the dungeon.',
          ])
        }}
        getSaveData={() => ({
          name:    charName,
          colors:  charColors,
          birth:   birthData,
          pos:     playerStateRef.current ? { x: playerStateRef.current.x, y: playerStateRef.current.y, facing: playerStateRef.current.facing } : null,
          savedAt: Date.now(),
        })}
        onLoad={(slot) => {
          if (slot.colors) { localStorage.setItem('life-mmo-colors-v3', JSON.stringify(slot.colors)); setCharColors(slot.colors) }
          if (slot.birth)  { localStorage.setItem('life-mmo-birth',     JSON.stringify(slot.birth));  setBirthData(slot.birth) }
          if (slot.name != null) { localStorage.setItem('life-mmo-name', JSON.stringify(slot.name));  setCharName(slot.name) }
          if (slot.pos)    { playerStateRef.current = slot.pos }
          setShowEditor(false)
          setEditorPage(0)
          setEditorLimited(false)
          setShowDialog(false)
          setShowHoroscope(false)
        }}
      />
      {debugActive && pickerState.pickerOpen && (
        <SpritePickerModal
          category={pickerState.pickerOpen}
          currentSprite={
            pickerState.activeTab === 'tiles' ? (
              pickerState.pickerOpen === 'floor' ? pickerState.ground :
              pickerState.pickerOpen === 'wall' ? pickerState.wall :
              pickerState.pickerOpen === 'table' ? pickerState.obj :
              pickerState.pickerOpen === 'torch' ? pickerState.entity :
              null
            ) : (
              pickerState.selectedSpriteForColor
            )
          }
          spriteColorOverrides={spriteColorOverrides}
          activeSprite={activeSprite}
          onActiveSpriteChange={(newActive) => {
            setActiveSprite(newActive)
            if (newActive.sprite === null) {
              setPickerState(prev => ({ ...prev, pickerOpen: newActive.category }))
            }
          }}
          onSelect={(sprite) => {
            if (pickerState.activeTab === 'colors') {
              setPickerState(prev => ({ ...prev, selectedSpriteForColor: sprite, pickerOpen: null }))
            } else {
              setActiveSprite({ category: pickerState.pickerOpen, sprite })
              setPickerState(prev => ({ ...prev, pickerOpen: null }))
            }
          }}
          onClose={() => {
            setPickerState(prev => ({ ...prev, pickerOpen: null }))
            setHoverPreview(null)
          }}
          onHoverPreview={setHoverPreview}
          onSpriteColorChange={setSpriteColorOverrides}
        />
      )}
      {debugActive && (
        <MapEditorPanel
          hoveredTile={hoveredTile}
          layers={worldData?.layers}
          collMap={worldData?.collMap}
          layerEdits={layerEdits}
          onEditSprite={setLayerEdits}
          highlightColors={highlightColors}
          onHighlightColorsChange={setHighlightColors}
          spriteColorOverrides={spriteColorOverrides}
          onSpriteColorChange={setSpriteColorOverrides}
          onHoverPreview={setHoverPreview}
          onPickerStateChange={setPickerState}
          activeSprite={activeSprite}
          onActiveSpriteChange={setActiveSprite}
        />
      )}
      <div className="record-wrap-with-tools">
        <RecordButton
          status={recorder.status}
          progress={recorder.progress}
          recordingCount={recordings.length}
          onRecord={handleRecord}
          onRecordGate={handleRecordGate}
          onStop={handleStop}
          onOpenGallery={() => setShowGallery(true)}
        />
        <MapEditButton
          active={debugActive}
          onToggle={() => setDebugActive(!debugActive)}
        />
      </div>
      {showGallery && (
        <VideoGallery
          videos={recordings}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  )
}
