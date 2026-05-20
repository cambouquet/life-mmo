import { useState } from 'react'
import { CATEGORIES } from './spritePickerData.js'
import { CategoryIcon } from './CategoryIcon.jsx'
import { SpriteBackupMenu } from './SpriteBackupMenu.jsx'

export function SpritePickerHeader({ category, backups, onActiveSpriteChange, onCreateBackup, onRestoreBackup, onDeleteBackup, onClose }) {
  const [showBackupMenu, setShowBackupMenu] = useState(false)

  return (
    <div className="sprite-picker__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
      <div style={{ display: 'flex', gap: '3px' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => onActiveSpriteChange?.({ category: cat.key, sprite: null })}
            style={{
              width: '24px',
              height: '24px',
              padding: 0,
              background: category === cat.key ? 'rgba(100, 220, 255, 0.2)' : 'rgba(100, 180, 255, 0.05)',
              border: category === cat.key ? '1px solid rgba(100, 220, 255, 0.6)' : '1px solid rgba(100, 180, 255, 0.3)',
              borderRadius: '1px',
              cursor: 'pointer',
              color: '#7ab8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title={cat.label}
          >
            <CategoryIcon type={cat.key} />
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        <button
          onClick={onCreateBackup}
          style={{
            width: '24px',
            height: '24px',
            padding: 0,
            background: 'rgba(100, 220, 100, 0.1)',
            border: '1px solid rgba(100, 220, 100, 0.3)',
            color: '#7ab8ff',
            borderRadius: '1px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title="Backup"
        >
          ✓
        </button>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowBackupMenu(!showBackupMenu)}
            style={{
              width: '24px',
              height: '24px',
              padding: 0,
              background: backups.length > 0 ? 'rgba(100, 180, 255, 0.1)' : 'rgba(100, 100, 100, 0.05)',
              border: '1px solid rgba(100, 180, 255, 0.2)',
              color: '#7ab8ff',
              borderRadius: '1px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title={`${backups.length} backup(s)`}
          >
            ↩
          </button>
          {showBackupMenu && backups.length > 0 && (
            <SpriteBackupMenu backups={backups} onRestore={onRestoreBackup} onDelete={onDeleteBackup} />
          )}
        </div>
        <button className="sprite-picker__close" onClick={onClose}>✕</button>
      </div>
    </div>
  )
}
