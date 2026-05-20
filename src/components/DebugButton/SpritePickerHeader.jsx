import { CategoryButtons } from './CategoryButtons'
import { BackupControls } from './BackupControls'

export function SpritePickerHeader({ category, backups, onActiveSpriteChange, onCreateBackup, onRestoreBackup, onDeleteBackup, onClose }) {
  return (
    <div className="sprite-picker__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
      <CategoryButtons category={category} onActiveSpriteChange={onActiveSpriteChange} />
      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        <BackupControls
          backups={backups}
          onCreateBackup={onCreateBackup}
          onRestoreBackup={onRestoreBackup}
          onDeleteBackup={onDeleteBackup}
        />
        <button className="sprite-picker__close" onClick={onClose}>✕</button>
      </div>
    </div>
  )
}
