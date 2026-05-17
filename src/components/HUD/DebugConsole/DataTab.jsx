import React, { useState, useEffect } from 'react'
import { LS_COLORS, LS_BIRTH, LS_NAME, readLS } from './localStorage'
import { SaveSlots } from './SaveSlots'

export function DataTab({ onReset, getSaveData, onLoad }) {
  const [data, setData] = useState({ name: null, colors: null, birth: null })
  const [editColors, setEditColors] = useState('')
  const [editBirth, setEditBirth] = useState('')
  const [editName, setEditName] = useState('')

  const refresh = () => {
    const name = readLS(LS_NAME)
    const colors = readLS(LS_COLORS)
    const birth = readLS(LS_BIRTH)
    setData({ name, colors, birth })
    setEditName(name ?? '')
    setEditColors(colors ? JSON.stringify(colors, null, 2) : '')
    setEditBirth(birth ? JSON.stringify(birth, null, 2) : '')
  }

  useEffect(() => {
    refresh()
  }, [])

  const save = (key, raw, setter) => {
    try {
      const parsed = JSON.parse(raw)
      localStorage.setItem(key, JSON.stringify(parsed))
      setter(JSON.stringify(parsed, null, 2))
    } catch {
      /* invalid JSON — ignore */
    }
  }

  const saveName = () => {
    const trimmed = editName.trim()
    if (trimmed) localStorage.setItem(LS_NAME, JSON.stringify(trimmed))
    else localStorage.removeItem(LS_NAME)
  }

  const handleReset = () => {
    localStorage.removeItem(LS_NAME)
    localStorage.removeItem(LS_COLORS)
    localStorage.removeItem(LS_BIRTH)
    refresh()
    onReset?.()
  }

  return (
    <div className="debug-data">
      <SaveSlots getSaveData={getSaveData} onLoad={onLoad} />

      <div className="debug-data-field">
        <div className="debug-data-label">name</div>
        <div className="debug-data-row">
          <input
            className="debug-data-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="(not set)"
          />
          <button className="debug-data-save" onClick={saveName}>
            save
          </button>
        </div>
      </div>

      <div className="debug-data-field">
        <div className="debug-data-label">colors</div>
        <textarea
          className="debug-data-textarea"
          value={editColors}
          onChange={(e) => setEditColors(e.target.value)}
          rows={7}
          spellCheck={false}
        />
        <button className="debug-data-save" onClick={() => save(LS_COLORS, editColors, setEditColors)}>
          save
        </button>
      </div>

      <div className="debug-data-field">
        <div className="debug-data-label">birth</div>
        <textarea
          className="debug-data-textarea"
          value={editBirth}
          onChange={(e) => setEditBirth(e.target.value)}
          rows={7}
          spellCheck={false}
        />
        <button className="debug-data-save" onClick={() => save(LS_BIRTH, editBirth, setEditBirth)}>
          save
        </button>
      </div>

      <button className="debug-reset" onClick={handleReset}>
        restart game
      </button>
    </div>
  )
}
