import { useState } from 'react'
import './MapEditorPanel.scss'
import { MapEditorMenuBar } from './MapEditorMenuBar.jsx'
import { MapEditorBackupButtons } from './MapEditorBackupButtons.jsx'
import { initializeMapEditorState } from './mapEditorState.js'
import { createMapEditorHandlers } from './mapEditorHandlers.js'

export default function MapEditorPanel({ activeMenu, onMenuChange, layerEdits, onEditSprite, spriteColorOverrides, onSpriteColorChange }) {
  const state = initializeMapEditorState()
  const [floorColors, setFloorColors] = useState(state.floorColors)
  const [wallColors, setWallColors] = useState(state.wallColors)
  const [backups, setBackups] = useState(state.backups)
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  const { handleCreateBackup, handleRestoreBackup, handleDeleteBackup } = createMapEditorHandlers(
    layerEdits, spriteColorOverrides, floorColors, wallColors, backups, setBackups, setShowBackupMenu, onEditSprite, onSpriteColorChange, setFloorColors, setWallColors
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', width: '100%', pointerEvents: 'auto' }}>
      <MapEditorMenuBar activeMenu={activeMenu} onMenuChange={onMenuChange} />
      <MapEditorBackupButtons backups={backups} showBackupMenu={showBackupMenu} setShowBackupMenu={setShowBackupMenu} onCreateBackup={handleCreateBackup} onRestoreBackup={handleRestoreBackup} onDeleteBackup={handleDeleteBackup} />
    </div>
  )
}
