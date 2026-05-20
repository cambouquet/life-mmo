import { useState, useEffect } from 'react'

export function useSpriteHover(category, ssId, onHoverPreview) {
  const [hoverIndex, setHoverIndex] = useState(null)

  useEffect(() => {
    if (hoverIndex !== null) {
      const sprite = category === 'floor' ? { ss: ssId, row: 0, variant: hoverIndex } : { ss: ssId, row: hoverIndex }
      onHoverPreview?.(sprite)
    } else {
      onHoverPreview?.(null)
    }
  }, [hoverIndex, category, ssId, onHoverPreview])

  return { hoverIndex, setHoverIndex }
}
