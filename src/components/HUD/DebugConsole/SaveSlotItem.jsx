import React from 'react'

export function SaveSlotItem({ index, slot, onSave, onLoad, onClear }) {
  return (
    <div className="debug-slot">
      <div className="debug-slot-info">
        <span className="debug-slot-num">{index + 1}</span>
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
        <button className="debug-slot-btn debug-slot-btn--save" onClick={() => onSave(index)}>save</button>
        <button className="debug-slot-btn debug-slot-btn--load" onClick={() => onLoad(index)} disabled={!slot}>load</button>
        <button className="debug-slot-btn debug-slot-btn--clear" onClick={() => onClear(index)} disabled={!slot}>×</button>
      </div>
    </div>
  )
}
