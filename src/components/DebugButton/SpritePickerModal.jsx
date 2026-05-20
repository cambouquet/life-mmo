import React, { useState, useEffect } from 'react'
import './SpritePickerModal.scss'
import { SPRITESHEETS } from './spritePickerData.js'
import { getCategoryId } from './spritePickerUtils.js'
import { createBackupHandlers } from './spritePickerBackup.js'
import { SpritePickerHeader } from './SpritePickerHeader.jsx'
import { SpriteGrid } from './SpriteGrid.jsx'
import { SpriteColorPicker } from './SpriteColorPicker.jsx'
import { useSpriteHover } from './useSpriteHover.js'

export default function SpritePickerModal({ category, currentSprite, onSelect, onClose, onHoverPreview, spriteColorOverrides = {}, onActiveSpriteChange, onSpriteColorChange }) {
  const ssId = getCategoryId(category)
  const ss = SPRITESHEETS[ssId]
  if (!ss) return null

  const spriteCount = category === 'floor' ? 1 : ss.rows
  const [backups, setBackups] = useState([])
  const [selectedColorIndex, setSelectedColorIndex] = useState(null)
  const { hoverIndex, setHoverIndex } = useSpriteHover(category, ssId, onHoverPreview)
  const { createBackup, restoreBackup, deleteBackup } = createBackupHandlers(setBackups)

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
