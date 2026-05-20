import { LS_COLORS, LS_BIRTH, LS_NAME, readLS } from './localStorage'

export function createDataTabHandlers(setData, setEditName, setEditColors, setEditBirth, onReset) {
  const refresh = () => {
    const name = readLS(LS_NAME)
    const colors = readLS(LS_COLORS)
    const birth = readLS(LS_BIRTH)
    setData({ name, colors, birth })
    setEditName(name ?? '')
    setEditColors(colors ? JSON.stringify(colors, null, 2) : '')
    setEditBirth(birth ? JSON.stringify(birth, null, 2) : '')
  }

  const save = (key, raw, setter) => {
    try {
      const parsed = JSON.parse(raw)
      localStorage.setItem(key, JSON.stringify(parsed))
      setter(JSON.stringify(parsed, null, 2))
    } catch {
      /* invalid JSON — ignore */
    }
  }

  const saveName = (editName) => {
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

  return { refresh, save, saveName, handleReset }
}
