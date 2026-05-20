export function buildHUDProps(facing, moving, logEntries, charColors, charName, playerPos, exploredTiles, worldData, debugActive, activeMapMenu, setActiveMapMenu, hoveredTile, layerEdits, setLayerEdits, highlightColors, setHighlightColors, spriteColorOverrides, setSpriteColorOverrides, setHoverPreview, setPickerState, activeSprite, setActiveSprite, guidance, showDialog, showHoroscope) {
  return {
    facing, moving, logEntries, charColors, charName, playerPos, exploredTiles, worldData, debugActive, activeMapMenu, onMapMenuChange: setActiveMapMenu, hoveredTile,
    layers: worldData?.layers, collMap: worldData?.collMap, layerEdits, onEditSprite: setLayerEdits, highlightColors, onHighlightColorsChange: setHighlightColors,
    spriteColorOverrides, onSpriteColorChange: setSpriteColorOverrides, onHoverPreview: setHoverPreview, onPickerStateChange: setPickerState, activeSprite, onActiveSpriteChange: setActiveSprite, guidance, showDialog, showHoroscope
  }
}

export function buildGameProps(showDialog, showHoroscope, charColors, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, debugActive, layerEdits, highlightColors, spriteColorOverrides, hoverPreview, setHoveredTile, setWorldData, worldDataRef, setLayerEdits, activeSprite) {
  return {
    paused: showDialog || showHoroscope, charColors, playerStateRef, doorUnlockedRef, nameSetRef, colorsSetRef, debugActive, layerEdits, highlightColors, spriteColorOverrides, hoverPreview,
    onHoveredTileChange: setHoveredTile,
    onWorldDataChange: (data) => { setWorldData(data); worldDataRef.current = data },
    onEditSprite: setLayerEdits, activeSprite
  }
}

export function buildModalsProps(showDialog, setShowDialog, showHoroscope, setShowHoroscope, showEditor, showGallery, setShowGallery, charColors, setCharColors, charName, birthData, editorPage, editorLimited, closeEditor, syncCharToStorage, recordings) {
  return { showDialog, setShowDialog, showHoroscope, setShowHoroscope, showEditor, showGallery, setShowGallery, charColors, setCharColors, charName, birthData, editorPage, editorLimited, closeEditor, syncCharToStorage, recordings }
}

export function buildRecordButtonProps(recorder, recordings, handleRecord, handleRecordGate, handleStop) {
  return { status: recorder.status, progress: recorder.progress, recordingCount: recordings.length, onRecord: handleRecord, onRecordGate: handleRecordGate, onStop: handleStop }
}

export function buildDebugLayerPropsHelper(debugActive, setDebugActive, pickerState, setPickerState, hoveredTile, setHoveredTile, spriteColorOverrides, setSpriteColorOverrides, activeSprite, setActiveSprite, showGameTests, setShowGameTests, playerStateRef, worldDataRef, setHoverPreview) {
  return { debugActive, setDebugActive, pickerState, setPickerState, hoveredTile, setHoveredTile, spriteColorOverrides, setSpriteColorOverrides, activeSprite, setActiveSprite, showGameTests, setShowGameTests, playerStateRef, worldDataRef, setHoverPreview }
}
