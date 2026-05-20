import { LS_SLOT } from './localStorage'

export function createSaveSlotHandlers(getSaveData, setSlots, onLoad) {
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

  const handleLoad = (i, slots) => {
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

  return { handleSave, handleLoad, handleClear }
}
