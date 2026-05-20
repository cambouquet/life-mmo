import React, { useState } from 'react'
import { LS_SLOT, NUM_SLOTS, readLS } from './localStorage'
import { SaveSlotItem } from './SaveSlotItem.jsx'
import { createSaveSlotHandlers } from './saveSlotHandlers.js'

export function SaveSlots({ getSaveData, onLoad }) {
  const [slots, setSlots] = useState(() => Array.from({ length: NUM_SLOTS }, (_, i) => readLS(LS_SLOT(i))))
  const { handleSave, handleLoad, handleClear } = createSaveSlotHandlers(getSaveData, setSlots, onLoad)

  return (
    <div className="debug-data-field">
      <div className="debug-data-label">save slots</div>
      <div className="debug-slots">
        {Array.from({ length: NUM_SLOTS }, (_, i) => (
          <SaveSlotItem key={i} index={i} slot={slots[i]} onSave={handleSave} onLoad={() => handleLoad(i, slots)} onClear={handleClear} />
        ))}
      </div>
    </div>
  )
}
