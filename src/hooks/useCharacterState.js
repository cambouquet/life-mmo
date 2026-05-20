import { useState } from 'react'
import { LS_COLORS, LS_BIRTH, LS_NAME, DEFAULT_COLORS, DEFAULT_BIRTH, load } from '../constants/persistence.js'

export function useCharacterState() {
  const [charColors, setCharColors] = useState(() => load(LS_COLORS, DEFAULT_COLORS))
  const [birthData, setBirthData] = useState(() => load(LS_BIRTH, DEFAULT_BIRTH))
  const [charName, setCharName] = useState(() => load(LS_NAME, null))

  const syncCharToStorage = (colors, data, name) => {
    if (colors) {
      setCharColors(colors)
      try { localStorage.setItem(LS_COLORS, JSON.stringify(colors)) } catch {}
    }
    if (data) {
      setBirthData(data)
      try { localStorage.setItem(LS_BIRTH, JSON.stringify(data)) } catch {}
    }
    if (name !== undefined) {
      setCharName(name)
      try { localStorage.setItem(LS_NAME, JSON.stringify(name)) } catch {}
    }
  }

  const resetChar = () => {
    setCharColors(DEFAULT_COLORS)
    setBirthData(DEFAULT_BIRTH)
    setCharName(null)
  }

  return { charColors, setCharColors, birthData, setBirthData, charName, setCharName, syncCharToStorage, resetChar }
}
