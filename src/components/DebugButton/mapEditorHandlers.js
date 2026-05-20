import { createMapBackup, restoreMapBackup, deleteMapBackup } from './mapEditorState.js'

export function createMapEditorHandlers(
  layerEdits, spriteColorOverrides, floorColors, wallColors, backups, setBackups, setShowBackupMenu, onEditSprite, onSpriteColorChange, setFloorColors, setWallColors
) {
  const handleCreateBackup = () => {
    const newBackups = createMapBackup(layerEdits, spriteColorOverrides, floorColors, wallColors, backups)
    setBackups(newBackups)
  }

  const handleRestoreBackup = (backup) => {
    restoreMapBackup(backup, onEditSprite, onSpriteColorChange, setFloorColors, setWallColors)
    setShowBackupMenu(false)
  }

  const handleDeleteBackup = (id) => {
    const newBackups = deleteMapBackup(id, backups)
    setBackups(newBackups)
  }

  return { handleCreateBackup, handleRestoreBackup, handleDeleteBackup }
}
