import { useMemo } from 'react'
import pixelData from './pixel_data.json'
import { renderCharacterCanvas } from './characterTemplateHelpers'

export const CharacterTemplate = ({ colors, scale = 4, className = "" }) => {
  const imageDataUrl = useMemo(() => renderCharacterCanvas(pixelData, colors),
    [colors.hair, colors.skin, colors.outfit, colors.eyes, colors.secondary, colors.stick])

  return (
    <img src={imageDataUrl} width={32 * scale} height={32 * scale} className={className}
      style={{ imageRendering: 'pixelated', display: 'block' }} alt="Character Preview" />
  )
}
