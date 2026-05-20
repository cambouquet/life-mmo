import { useState } from 'react'
import { LS_MAP_EDITS, LS_SPRITE_COLORS, load } from '../constants/persistence.js'

export function useMapEditorState() {
  const [activeMapMenu, setActiveMapMenu] = useState('tiles')
  const [hoveredTile, setHoveredTile] = useState(null)
  const [hoverPreview, setHoverPreview] = useState(null)
  const [pickerState, setPickerState] = useState({
    pickerOpen: null,
    activeTab: 'tiles',
    selectedSpriteForColor: null,
    ground: null,
    wall: null,
    obj: null,
    entity: null
  })
  const [activeSprite, setActiveSprite] = useState({ category: 'ground', sprite: null })
  const [layerEdits, setLayerEdits] = useState(() => load(LS_MAP_EDITS, {}))
  const [spriteColorOverrides, setSpriteColorOverrides] = useState(() => load(LS_SPRITE_COLORS, {}))
  const [highlightColors, setHighlightColors] = useState({
    selectedFill: 'rgba(100,200,255,0.15)',
    selectedStroke: 'rgba(100,220,255,0.5)',
    hoveredFill: 'rgba(100,200,255,0.15)',
    hoveredStroke: 'rgba(100,220,255,0.4)',
  })

  return {
    activeMapMenu, setActiveMapMenu,
    hoveredTile, setHoveredTile,
    hoverPreview, setHoverPreview,
    pickerState, setPickerState,
    activeSprite, setActiveSprite,
    layerEdits, setLayerEdits,
    spriteColorOverrides, setSpriteColorOverrides,
    highlightColors, setHighlightColors,
  }
}
