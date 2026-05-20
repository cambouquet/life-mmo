import React from 'react'
import { CharacterTemplate } from './CharacterTemplate'
import { CassiopeiaWheel } from './CassiopeiaWheel.jsx'
import { randomPalette } from './colorUtils.js'

export function CharacterPage({ displayColors, colors, onColorsChange, onPreviewColors, initialName, name, onNameChange, limited, birthDataOutput, trimmedName, colorsRef, onSave, onClose }) {
  return (
    <div className="char-editor-preview">
      <CharacterTemplate colors={displayColors} scale={5} />
      {limited ? (
        <input
          className="char-editor-name-input"
          type="text"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') onSave(colorsRef.current, birthDataOutput, name.trim() || null)
          }}
          placeholder="Your name"
          maxLength={24}
          autoFocus
        />
      ) : (
        <div className="char-editor-preview-label">{initialName || '?'}</div>
      )}
      <CassiopeiaWheel
        colors={colors}
        onChange={next => {
          onColorsChange(next)
          onPreviewColors(null)
        }}
        onPreview={onPreviewColors}
        onRandom={() => {
          const next = { ...colors, ...randomPalette() }
          onColorsChange(next)
          onPreviewColors(null)
        }}
      />
      <div className="char-editor-actions">
        <button className="btn-save" onClick={() => onSave(colors, birthDataOutput, trimmedName)}>
          Embody
        </button>
        <button className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
