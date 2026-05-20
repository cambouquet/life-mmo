import { WALL_LABELS } from './spritePickerData.js'
import { getSpriteColor } from './spritePickerUtils.js'
import { WallPreview } from './WallPreview.jsx'

export function SpriteGrid({ category, ssId, spriteCount, currentSprite, spriteColorOverrides, onSelect, onHoverStart, onHoverEnd }) {
  return (
    <div className="sprite-picker__grid">
      {Array.from({ length: spriteCount }).map((_, index) => {
        const isFloor = category === 'floor'
        const isWall = category === 'wall'
        const isSelected = isFloor
          ? currentSprite?.ss === ssId && currentSprite?.row === 0
          : currentSprite?.ss === ssId && currentSprite?.row === index

        const color = getSpriteColor(ssId, index, spriteColorOverrides)
        const label = isWall ? WALL_LABELS[index].short : (index + 1)
        const fullLabel = isWall ? WALL_LABELS[index].full : undefined

        return (
          <button
            key={index}
            className={`sprite-picker__item ${isSelected ? 'sprite-picker__item--selected' : ''}`}
            onClick={() => isFloor
              ? onSelect({ ss: ssId, row: 0, variant: 0 })
              : onSelect({ ss: ssId, row: index })
            }
            onMouseEnter={() => onHoverStart(index)}
            onMouseLeave={() => onHoverEnd()}
            title={fullLabel}
          >
            {isWall && isFloor === false ? (
              <WallPreview row={index} color={color} />
            ) : (
              <div className="sprite-picker__preview" style={{ backgroundColor: color }} />
            )}
            <div className="sprite-picker__desc">{label}</div>
          </button>
        )
      })}
    </div>
  )
}
