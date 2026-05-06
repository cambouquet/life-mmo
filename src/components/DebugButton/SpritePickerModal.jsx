import React from 'react'
import './SpritePickerModal.scss'
import SPRITESHEETS_DATA from '../../game/config/spritesheets.json'
import spriteColors from '../../game/config/spriteColors.json'

const SPRITESHEETS = {
  0x00: SPRITESHEETS_DATA['0x00'],
  0x01: SPRITESHEETS_DATA['0x01'],
  0x02: SPRITESHEETS_DATA['0x02'],
  0x03: SPRITESHEETS_DATA['0x03'],
  0x04: SPRITESHEETS_DATA['0x04'],
}

const SPRITE_NAMES = {
  '0x00_0': 'floor_a',
  '0x00_1': 'floor_b',
  '0x00_2': 'void',
  '0x00_3': 'floor_red',
  '0x00_4': 'floor_darkred',
  '0x01_0': 'wall_solid',
  '0x01_1': 'wall_top',
  '0x01_2': 'wall_face',
  '0x01_3': 'wall_corner',
  '0x02_0': 'mirror_left',
  '0x02_1': 'mirror_full',
  '0x03_0': 'table',
  '0x04_0': 'torch_d1_top',
  '0x04_1': 'torch_d1_bot',
  '0x04_2': 'torch_d2_top',
  '0x04_3': 'torch_d2_bot',
}

const WALL_LABELS = {
  0: { short: '▓ Solid', full: 'Solid Wall' },
  1: { short: '↑ Top', full: 'Light at Top' },
  2: { short: '⬤ Face', full: 'Light at Face' },
  3: { short: '⬉ Corner', full: 'Light at Corner' },
}

function WallPreview({ row, color }) {
  const size = 24
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size

    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)

    const glowSize = 3
    const glowColor = 'rgba(180, 230, 255, 0.8)'

    if (row === 0) {
      ctx.fillStyle = color
      ctx.fillRect(0, 0, size, size)
    } else if (row === 1) {
      const grad = ctx.createLinearGradient(0, 0, 0, glowSize)
      grad.addColorStop(0, glowColor)
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, size, glowSize)
    } else if (row === 2) {
      const grad = ctx.createLinearGradient(0, 0, glowSize, 0)
      grad.addColorStop(0, glowColor)
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, glowSize, size)
    } else if (row === 3) {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize * 1.5)
      grad.addColorStop(0, glowColor)
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, glowSize * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [row, color])

  return <canvas ref={canvasRef} style={{ width: size, height: size, imageRendering: 'pixelated' }} />
}

export default function SpritePickerModal({ category, currentSprite, onSelect, onClose, onHoverPreview, spriteColorOverrides = {}, activeSprite, onActiveSpriteChange, onSpriteColorChange }) {
  const getCategoryId = (cat) => {
    const map = { floor: 0x00, wall: 0x01, mirror: 0x02, table: 0x03, torch: 0x04 }
    return map[cat]
  }

  const getSpriteColor = (ss, row, variant = 0) => {
    const colorKey = ss === 0x00 ? variant : row
    const overrideKey = ss === 0x00 ? `${ss}_v${variant}` : `${ss}_${row}`

    if (spriteColorOverrides?.[overrideKey]) return spriteColorOverrides[overrideKey]
    if (ss === 0x00) return spriteColors.floor[colorKey] ?? spriteColors.floor[0]
    if (ss === 0x01) return spriteColors.wall[colorKey] ?? spriteColors.wall[0]
    return '#0a0612'
  }

  const ssId = getCategoryId(category)
  const ss = SPRITESHEETS[ssId]
  if (!ss) return null

  const spriteCount = category === 'floor' ? 1 : ss.rows
  const colorCount = category === 'floor' ? spriteColors.floor.length : ss.rows

  const [hoverIndex, setHoverIndex] = React.useState(null)
  const [backups, setBackups] = React.useState([])
  const [showBackupMenu, setShowBackupMenu] = React.useState(false)
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(null)

  const CategoryIcon = ({ type }) => {
    const icons = {
      floor: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}><rect x="2" y="14" width="20" height="8" rx="1"/></svg>,
      wall: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}><rect x="4" y="3" width="4" height="18" rx="1"/><rect x="10" y="3" width="4" height="18" rx="1"/><rect x="16" y="3" width="4" height="18" rx="1"/></svg>,
      table: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}><rect x="5" y="7" width="14" height="8" rx="1"/><rect x="7" y="16" width="3" height="4" rx="1"/><rect x="14" y="16" width="3" height="4" rx="1"/></svg>,
      torch: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}><circle cx="12" cy="6" r="2"/><path d="M12 8 L9 14 L15 14 Z"/><rect x="11" y="14" width="2" height="6" rx="1"/></svg>
    }
    return icons[type]
  }

  const categories = [
    { key: 'floor', label: 'Ground' },
    { key: 'wall', label: 'Wall' },
    { key: 'table', label: 'Object' },
    { key: 'torch', label: 'Entity' }
  ]

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
      const sprite = category === 'floor'
        ? { ss: ssId, row: 0, variant: hoverIndex }
        : { ss: ssId, row: hoverIndex }
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

              const color = getSpriteColor(ssId, index, 0)
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
                const color = getSpriteColor(0x00, 0, index)
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
