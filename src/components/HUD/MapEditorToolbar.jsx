import { useMapBackups } from '../../hooks/useMapBackups'
import { MAP_MENU_ITEMS } from './mapEditorMenuItems'
import { MapMenuButton } from './MapMenuButton'
import { MapBackupButtons } from './MapBackupButtons'

export function MapEditorToolbar({ activeMapMenu, onMapMenuChange, onPickerStateChange, layerEdits, spriteColorOverrides, onEditSprite, onSpriteColorChange }) {
  const { backups, createBackup: hookCreateBackup, restoreBackup: hookRestoreBackup, deleteBackup } = useMapBackups()

  const createBackup = () => hookCreateBackup(layerEdits, spriteColorOverrides)
  const restoreBackup = (backup) => {
    onEditSprite(() => JSON.parse(JSON.stringify(backup.layerEdits)))
    onSpriteColorChange(() => JSON.parse(JSON.stringify(backup.spriteColorOverrides)))
  }

  return (
    <div className="menu-bar__map-editor">
      {MAP_MENU_ITEMS.map(item => (
        <MapMenuButton key={item.key} item={item} activeMapMenu={activeMapMenu} onMapMenuChange={onMapMenuChange} onPickerStateChange={onPickerStateChange} />
      ))}
      <MapBackupButtons backups={backups} createBackup={createBackup} restoreBackup={restoreBackup} deleteBackup={deleteBackup} />
    </div>
  )
}
