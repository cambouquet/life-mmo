import React from 'react'
import './SpritePickerModal.scss'
import { SPRITESHEETS, WALL_LABELS, CATEGORIES, spriteColors } from './spritePickerData.js'
import { getCategoryId, getSpriteColor } from './spritePickerUtils.js'
import { WallPreview } from './WallPreview.jsx'
import { CategoryIcon } from './CategoryIcon.jsx'

export default function SpritePickerModal({ category, currentSprite, onSelect, onClose, onHoverPreview, spriteColorOverrides = {}, activeSprite, onActiveSpriteChange, onSpriteColorChange }) {
  const ssId = getCategoryId(category)
  const ss = SPRITESHEETS[ssId]
  if (!ss) return null

  const spriteCount = category === 'floor' ? 1 : ss.rows
  const [hoverIndex, setHoverIndex] = React.useState(null)
  const [backups, setBackups] = React.useState([])
  const [showBackupMenu, setShowBackupMenu] = React.useState(false)
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(null)

  const createBackup = () => {
    const backup = { id: Date.now(), timestamp: new Date().toLocaleString() }
    const newBackups = [backup, ...backups].slice(0, 5)
    setBackups(newBackups)
  }

  const restoreBackup = (backup) => {
    setShowBackupMenu(false)
  }

  const deleteBackup = (id) => {
    setBackups(backups.filter(b => b.id !== id))
  }

  React.useEffect(() => {
    if (hoverIndex !== null) {
      const sprite = category === 'floor' ? { ss: ssId, row: 0, variant: hoverIndex } : { ss: ssId, row: hoverIndex }
      onHoverPreview?.(sprite)
    } else {
      onHoverPreview?.(null)
    }
  }, [hoverIndex, category, ssId, onHoverPreview])

  return (
    <div className="sprite-picker-overlay" onClick={onClose}>
      <div className="sprite-picker" onClick={(e) => e.stopPropagation()}>
        <div className="sprite-picker__content">
          <div className="sprite-picker__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {categories.map(cat => (
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
                onClick={createBackup}
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
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'rgba(6, 4, 14, 0.95)',
                    border: '1px solid rgba(100, 180, 255, 0.4)',
                    borderRadius: '2px',
                    marginTop: '4px',
                    zIndex: 1000,
                    minWidth: '140px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}>
                    {backups.map(backup => (
                      <div key={backup.id} style={{ display: 'flex', gap: '2px', padding: '3px', borderBottom: '1px solid rgba(100, 180, 255, 0.1)' }}>
                        <button
                          onClick={() => restoreBackup(backup)}
                          style={{
                            flex: 1,
                            background: 'rgba(100, 220, 100, 0.1)',
                            border: '1px solid rgba(100, 220, 100, 0.2)',
                            color: '#7ab8ff',
                            padding: '2px 3px',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontSize: '8px',
                            textAlign: 'left',
                          }}
                        >
                          {backup.timestamp.split(' ')[1]}
                        </button>
                        <button
                          onClick={() => deleteBackup(backup.id)}
                          style={{
                            background: 'rgba(255, 100, 100, 0.1)',
                            border: '1px solid rgba(255, 100, 100, 0.2)',
                            color: '#ff6464',
                            padding: '2px 3px',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontSize: '8px',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="sprite-picker__close" onClick={onClose}>✕</button>
            </div>
          </div>
          <div className="sprite-picker__grid">
            {Array.from({ length: spriteCount }).map((_, index) => {
              const isFloor = category === 'floor'
              const isWall = category === 'wall'
              const isSelected = isFloor
                ? currentSprite?.ss === ssId && currentSprite?.row === 0
                : currentSprite?.ss === ssId && currentSprite?.row === index

              const color = getSpriteColor(ssId, index, spriteColorOverrides)
              const label = isWall ? WALL_LABELS[index].short : (index + 1)
              const fullLabel = isWall ? WALL_LABELS[index].full : undefined

              return (
                <button
                  key={index}
                  className={`sprite-picker__item ${isSelected ? 'sprite-picker__item--selected' : ''}`}
                  onClick={() => isFloor
                    ? onSelect({ ss: ssId, row: 0, variant: 0 })
                    : onSelect({ ss: ssId, row: index })
                  }
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  title={fullLabel}
                >
                  {isWall && isFloor === false ? (
                    <WallPreview row={index} color={color} />
                  ) : (
                    <div className="sprite-picker__preview" style={{ backgroundColor: color }} />
                  )}
                  <div className="sprite-picker__desc">{label}</div>
                </button>
              )
            })}
          </div>
          {category === 'floor' && (
            <div className="sprite-picker__colors" style={{ display: 'flex', gap: '3px', flexWrap: 'nowrap', marginLeft: '4px', alignItems: 'center' }}>
              {Array.from({ length: spriteColors.floor.length }).map((_, index) => {
                const color = getSpriteColor(0x00, 0, spriteColorOverrides, index)
                const isSelected = selectedColorIndex === index
                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => setSelectedColorIndex(isSelected ? null : index)}
                      style={{
                        width: '24px',
                        height: '24px',
                        padding: 0,
                        background: color,
                        border: isSelected ? '2px solid rgba(100, 220, 255, 0.8)' : '1px solid rgba(100, 180, 255, 0.4)',
                        borderRadius: '1px',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      title={`Color ${index + 1}`}
                    />
                    {isSelected && (
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          onSpriteColorChange?.(prev => ({ ...prev, [`0_v${index}`]: e.target.value }))
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          border: 'none',
                          borderRadius: '1px',
                          cursor: 'pointer',
                          padding: 0,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
