import { useCharacterState } from '../../hooks/useCharacterState.js'
import { useUIState } from '../../hooks/useUIState.js'
import { useGameState } from '../../hooks/useGameState.js'
import { useMapEditorState } from '../../hooks/useMapEditorState.js'

export function useAppState() {
  const character = useCharacterState()
  const ui = useUIState()
  const game = useGameState()
  const mapEditor = useMapEditorState()
  return { character, ui, game, mapEditor }
}

export function updateRefFlags(charName, charColors, nameSetRef, colorsSetRef, doorUnlockedRef) {
  nameSetRef.current = !!charName
  colorsSetRef.current = Object.values(charColors).every(v => v !== '#ffffff')
  doorUnlockedRef.current = nameSetRef.current && colorsSetRef.current
}
