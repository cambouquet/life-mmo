import React from 'react'

export function DataFieldInput({ label, value, onChange, onSave, placeholder = '(not set)' }) {
  return (
    <div className="debug-data-field">
      <div className="debug-data-label">{label}</div>
      <div className="debug-data-row">
        <input
          className="debug-data-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button className="debug-data-save" onClick={onSave}>
          save
        </button>
      </div>
    </div>
  )
}
