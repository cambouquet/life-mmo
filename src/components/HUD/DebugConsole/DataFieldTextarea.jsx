import React from 'react'

export function DataFieldTextarea({ label, value, onChange, onSave, rows = 7 }) {
  return (
    <div className="debug-data-field">
      <div className="debug-data-label">{label}</div>
      <textarea
        className="debug-data-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        spellCheck={false}
      />
      <button className="debug-data-save" onClick={onSave}>
        save
      </button>
    </div>
  )
}
