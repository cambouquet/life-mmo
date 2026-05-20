import { useState } from 'react'

const LS_MAP_BACKUPS = 'life-mmo-map-backups'

function loadBackups() {
  try {
    const data = localStorage.getItem(LS_MAP_BACKUPS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveBackups(backups) {
  localStorage.setItem(LS_MAP_BACKUPS, JSON.stringify(backups))
}

export function useMapBackups() {
  const [backups, setBackups] = useState(loadBackups)

  const createBackup = (layerEdits, spriteColorOverrides) => {
    const backup = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      layerEdits: JSON.parse(JSON.stringify(layerEdits)),
      spriteColorOverrides: JSON.parse(JSON.stringify(spriteColorOverrides))
    }
    const newBackups = [backup, ...backups].slice(0, 5)
    setBackups(newBackups)
    saveBackups(newBackups)
  }

  const restoreBackup = (backup, onRestore) => {
    onRestore(backup.layerEdits, backup.spriteColorOverrides)
  }

  const deleteBackup = (id) => {
    const newBackups = backups.filter(b => b.id !== id)
    setBackups(newBackups)
    saveBackups(newBackups)
  }

  return { backups, createBackup, restoreBackup, deleteBackup }
}
