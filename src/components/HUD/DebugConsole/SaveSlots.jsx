import React, { useState } from 'react'
import { LS_SLOT, NUM_SLOTS, readLS } from './localStorage'

export function SaveSlots({ getSaveData, onLoad }) {
  const [slots, setSlots] = useState(() => Array.from({ length: NUM_SLOTS }, (_, i) => readLS(LS_SLOT(i))))

  const handleSave = (i) => {
    const data = getSaveData?.()
    if (!data) return
    localStorage.setItem(LS_SLOT(i), JSON.stringify(data))
    setSlots((prev) => {
      const next = [...prev]
      next[i] = data
      return next
    })
  }

  const handleLoad = (i) => {
    const slot = slots[i]
    if (!slot) return
    onLoad?.(slot)
  }

  const handleClear = (i) => {
    localStorage.removeItem(LS_SLOT(i))
    setSlots((prev) => {
      const next = [...prev]
      next[i] = null
      return next
    })
  }

  return (
    <div className="debug-data-field">
      <div className="debug-data-label">save slots</div>
      <div className="debug-slots">
        {Array.from({ length: NUM_SLOTS }, (_, i) => {
          const slot = slots[i]
          return (
            <div key={i} className="debug-slot">
              <div className="debug-slot-info">
                <span className="debug-slot-num">{i + 1}</span>
                {slot ? (
                  <>
                    <span className="debug-slot-name">{slot.name ?? '(unnamed)'}</span>
                    {slot.savedAt && (
                      <span className="debug-slot-date">
                        {new Date(slot.savedAt).toLocaleString([], {
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="debug-slot-empty">empty</span>
                )}
              </div>
              <div className="debug-slot-actions">
                <button className="debug-slot-btn debug-slot-btn--save" onClick={() => handleSave(i)}>
                  save
                </button>
                <button
                  className="debug-slot-btn debug-slot-btn--load"
                  onClick={() => handleLoad(i)}
                  disabled={!slot}
                >
                  load
                </button>
                <button
                  className="debug-slot-btn debug-slot-btn--clear"
                  onClick={() => handleClear(i)}
                  disabled={!slot}
                >
                  ×
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
