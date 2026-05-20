import React from 'react'
import HUD from '../HUD/HUD.jsx'
import Game from '../Game/Game.jsx'
import RecordButton from '../RecordButton/RecordButton.jsx'
import DebugConsole from '../HUD/DebugConsole.jsx'
import DebugLayer from './DebugLayer.jsx'
import { AppModals } from './AppModals.jsx'

export function AppRenderTree({
  wrapRef, debugActive, zoom, showEditor, canvasWrapRef, gameRef, onStateChange, onInteract,
  recorder, recordings, setShowGallery, showGallery,
  gameProps, hudProps, recordButtonProps, modalsProps, debugConsoleProps, debugLayerProps
}) {
  return (
    <div className={`game-wrap ${debugActive ? 'debug-active' : ''}`} ref={wrapRef} style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
      <HUD {...hudProps} />
      <RecordButton {...recordButtonProps} onOpenGallery={() => setShowGallery(true)} isOpen={showGallery} />
      {!showEditor && (
        <div className="canvas-wrap" ref={canvasWrapRef}>
          <Game ref={gameRef} onStateChange={onStateChange} onInteract={onInteract} {...gameProps} />
        </div>
      )}
      <AppModals {...modalsProps} />
      <DebugConsole {...debugConsoleProps} />
      <DebugLayer {...debugLayerProps} />
    </div>
  )
}
