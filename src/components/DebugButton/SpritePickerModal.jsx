import React, { useState, useEffect } from 'react'
import './SpritePickerModal.scss'
import { SPRITESHEETS } from './spritePickerData.js'
import { getCategoryId } from './spritePickerUtils.js'
import { SpritePickerHeader } from './SpritePickerHeader.jsx'
import { SpriteGrid } from './SpriteGrid.jsx'
import { SpriteColorPicker } from './SpriteColorPicker.jsx'

export default function SpritePickerModal({ category, currentSprite, onSelect, onClose, onHoverPreview, spriteColorOverrides = {}, activeSprite, onActiveSpriteChange, onSpriteColorChange }) {
  const ssId = getCategoryId(category)
  const ss = SPRITESHEETS[ssId]
  if (!ss) return null

  const spriteCount = category === 'floor' ? 1 : ss.rows
  const [hoverIndex, setHoverIndex] = useState(null)
  const [backups, setBackups] = useState([])
  const [selectedColorIndex, setSelectedColorIndex] = useState(null)

  const createBackup = () => {
    const backup = { id: Date.now(), timestamp: new Date().toLocaleString() }
    setBackups([backup, ...backups].slice(0, 5))
  }

  const restoreBackup = (backup) => {
    // backup restore implementation
  }

  const deleteBackup = (id) => {
    setBackups(backups.filter(b => b.id !== id))
  }

  useEffect(() => {
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
          <SpritePickerHeader
            category={category}
            backups={backups}
            onActiveSpriteChange={onActiveSpriteChange}
            onCreateBackup={createBackup}
            onRestoreBackup={restoreBackup}
            onDeleteBackup={deleteBackup}
            onClose={onClose}
          />
          <SpriteGrid
            category={category}
            ssId={ssId}
            spriteCount={spriteCount}
            currentSprite={currentSprite}
            spriteColorOverrides={spriteColorOverrides}
            onSelect={onSelect}
            onHoverStart={setHoverIndex}
            onHoverEnd={() => setHoverIndex(null)}
          />
          {category === 'floor' && (
            <SpriteColorPicker
              selectedColorIndex={selectedColorIndex}
              onSelectColor={setSelectedColorIndex}
              spriteColorOverrides={spriteColorOverrides}
              onSpriteColorChange={onSpriteColorChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}
