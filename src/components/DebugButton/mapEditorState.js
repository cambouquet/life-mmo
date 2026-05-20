import spriteColors from '../../game/config/spriteColors.json'
import { loadBackups, saveBackups } from './mapEditorData.js'

export function initializeMapEditorState() {
  return {
    floorColors: spriteColors.floor,
    wallColors: spriteColors.wall,
    backups: loadBackups(),
  }
}

export function createMapBackup(layerEdits, spriteColorOverrides, floorColors, wallColors, backups) {
  const backup = {
    id: Date.now(),
    timestamp: new Date().toLocaleString(),
    layerEdits: JSON.parse(JSON.stringify(layerEdits)),
    spriteColorOverrides: JSON.parse(JSON.stringify(spriteColorOverrides)),
    floorColors: [...floorColors],
    wallColors: [...wallColors],
  }
  const newBackups = [backup, ...backups].slice(0, 5)
  saveBackups(newBackups)
  return newBackups
}

export function restoreMapBackup(backup, onEditSprite, onSpriteColorChange, setFloorColors, setWallColors) {
  onEditSprite(() => JSON.parse(JSON.stringify(backup.layerEdits)))
  onSpriteColorChange(() => JSON.parse(JSON.stringify(backup.spriteColorOverrides)))
  setFloorColors([...backup.floorColors])
  spriteColors.floor = [...backup.floorColors]
  setWallColors([...backup.wallColors])
  spriteColors.wall = [...backup.wallColors]
}

export function deleteMapBackup(id, backups) {
  const newBackups = backups.filter(b => b.id !== id)
  saveBackups(newBackups)
  return newBackups
}
