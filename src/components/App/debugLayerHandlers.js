export function getCurrentSprite(pickerState) {
  if (pickerState.activeTab === 'tiles') {
    if (pickerState.pickerOpen === 'floor') return pickerState.ground
    if (pickerState.pickerOpen === 'wall') return pickerState.wall
    if (pickerState.pickerOpen === 'table') return pickerState.obj
    if (pickerState.pickerOpen === 'torch') return pickerState.entity
    return null
  }
  return pickerState.selectedSpriteForColor
}

export function createSpritePickerHandlers(setActiveSprite, setPickerState, setHoverPreview) {
  return {
    onActiveSpriteChange: (newActive) => {
      setActiveSprite(newActive)
      if (newActive.sprite === null) {
        setPickerState(prev => ({ ...prev, pickerOpen: newActive.category }))
      }
    },
    onSelect: (sprite, pickerState) => {
      if (pickerState.activeTab === 'colors') {
        setPickerState(prev => ({ ...prev, selectedSpriteForColor: sprite, pickerOpen: null }))
      } else {
        setActiveSprite({ category: pickerState.pickerOpen, sprite })
        setPickerState(prev => ({ ...prev, pickerOpen: null }))
      }
    },
    onClose: () => {
      setPickerState(prev => ({ ...prev, pickerOpen: null }))
      setHoverPreview(null)
    }
  }
}

export function createInteractionHandlers() {
  const keyMap = { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD' }
  return {
    onMovePlayer: (direction) => {
      const event = new KeyboardEvent('keydown', { code: keyMap[direction] })
      window.dispatchEvent(event)
    },
    onInteract: () => {
      const event = new KeyboardEvent('keydown', { code: 'KeyE' })
      window.dispatchEvent(event)
    }
  }
}
