import React, { useState, useEffect } from 'react'
import { LS_COLORS, LS_BIRTH, LS_NAME } from './localStorage'
import { SaveSlots } from './SaveSlots'
import { DataFieldInput } from './DataFieldInput.jsx'
import { DataFieldTextarea } from './DataFieldTextarea.jsx'
import { createDataTabHandlers } from './dataTabHandlers.js'

export function DataTab({ onReset, getSaveData, onLoad }) {
  const [data, setData] = useState({ name: null, colors: null, birth: null })
  const [editColors, setEditColors] = useState('')
  const [editBirth, setEditBirth] = useState('')
  const [editName, setEditName] = useState('')

  const { refresh, save, saveName, handleReset } = createDataTabHandlers(setData, setEditName, setEditColors, setEditBirth, onReset)

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="debug-data">
      <SaveSlots getSaveData={getSaveData} onLoad={onLoad} />
      <DataFieldInput label="name" value={editName} onChange={setEditName} onSave={saveName} />
      <DataFieldTextarea label="colors" value={editColors} onChange={setEditColors} onSave={() => save(LS_COLORS, editColors, setEditColors)} />
      <DataFieldTextarea label="birth" value={editBirth} onChange={setEditBirth} onSave={() => save(LS_BIRTH, editBirth, setEditBirth)} />
      <button className="debug-reset" onClick={handleReset}>
        restart game
      </button>
    </div>
  )
}
