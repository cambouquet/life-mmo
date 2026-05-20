export function createAppHandlers(
  setFacing, setMoving, setLogEntries, setGuidance, setPlayerPos,
  showHoroscope, setShowHoroscope, showEditor, setShowEditor, setEditorPage, setShowDialog,
  recorder, gameRef, setShowEditor2, setCharColors, charColors, charName, birthData
) {
  const handleStateChange = ({ facing, moving, log, guidance, playerPos: newPlayerPos }) => {
    setFacing(facing)
    setMoving(moving)
    setLogEntries(log)
    setGuidance(guidance ?? null)
    setPlayerPos(newPlayerPos)
  }

  return { handleStateChange }
}
