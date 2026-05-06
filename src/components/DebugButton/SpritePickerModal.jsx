import React from 'react'
import './SpritePickerModal.scss'
import SPRITESHEETS_DATA from '../../game/config/spritesheets.json'
import spriteColors from '../../game/config/spriteColors.json'

const SPRITESHEETS = {
  0x00: SPRITESHEETS_DATA['0x00'],
  0x01: SPRITESHEETS_DATA['0x01'],
  0x02: SPRITESHEETS_DATA['0x02'],
  0x03: SPRITESHEETS_DATA['0x03'],
  0x04: SPRITESHEETS_DATA['0x04'],
}

const SPRITE_NAMES = {
  '0x00_0': 'floor_a',
  '0x00_1': 'floor_b',
  '0x00_2': 'void',
  '0x00_3': 'floor_red',
  '0x00_4': 'floor_darkred',
  '0x01_0': 'wall_solid',
  '0x01_1': 'wall_top',
  '0x01_2': 'wall_face',
  '0x01_3': 'wall_corner',
  '0x02_0': 'mirror_left',
  '0x02_1': 'mirror_full',
  '0x03_0': 'table',
  '0x04_0': 'torch_d1_top',
  '0x04_1': 'torch_d1_bot',
  '0x04_2': 'torch_d2_top',
  '0x04_3': 'torch_d2_bot',
}

const WALL_LABELS = {
  0: { short: '▓ Solid', full: 'Solid Wall' },
  1: { short: '↑ Top', full: 'Light at Top' },
  2: { short: '⬤ Face', full: 'Light at Face' },
  3: { short: '⬉ Corner', full: 'Light at Corner' },
}

function WallPreview({ row, color }) {
  const size = 80
  const canvasRef = React.useRef(null)

  React.useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size

    ctx.fillStyle = color
    ctx.fillRect(0, 0, size, size)

    const glowSize = 12
    const glowColor = 'rgba(180, 230, 255, 0.8)'

    ctx.shadowColor = 'rgba(100, 170, 255, 0.6)'
    ctx.shadowBlur = 12

    if (row === 0) {
      ctx.fillStyle = color
      ctx.fillRect(0, 0, size, size)
    } else if (row === 1) {
      const grad = ctx.createLinearGradient(0, 0, 0, glowSize)
      grad.addColorStop(0, glowColor)
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, size, glowSize)
    } else if (row === 2) {
      const grad = ctx.createLinearGradient(0, 0, glowSize, 0)
      grad.addColorStop(0, glowColor)
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, glowSize, size)
    } else if (row === 3) {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize * 1.5)
      grad.addColorStop(0, glowColor)
      grad.addColorStop(1, 'rgba(180, 230, 255, 0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, glowSize * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [row, color])

  return <canvas ref={canvasRef} style={{ width: size, height: size, imageRendering: 'pixelated' }} />
}

export default function SpritePickerModal({ category, currentSprite, onSelect, onClose, onHoverPreview, spriteColorOverrides = {} }) {
  const getCategoryId = (cat) => {
    const map = { floor: 0x00, wall: 0x01, mirror: 0x02, table: 0x03, torch: 0x04 }
    return map[cat]
  }

  const getSpriteColor = (ss, row, variant = 0) => {
    // For floor (ss=0), use variant for color index
    const colorKey = ss === 0x00 ? variant : row
    const overrideKey = ss === 0x00 ? `${ss}_v${variant}` : `${ss}_${row}`

    if (spriteColorOverrides?.[overrideKey]) return spriteColorOverrides[overrideKey]
    if (ss === 0x00) return spriteColors.floor[colorKey] ?? spriteColors.floor[0]
    if (ss === 0x01) return spriteColors.wall[colorKey] ?? spriteColors.wall[0]
    return '#0a0612'
  }

  const ssId = getCategoryId(category)
  const ss = SPRITESHEETS[ssId]
  if (!ss) return null

  const colorCount = category === 'floor' ? spriteColors.floor.length : ss.rows

  const [hoverIndex, setHoverIndex] = React.useState(null)

  React.useEffect(() => {
    if (hoverIndex !== null) {
      const sprite = category === 'floor'
        ? { ss: ssId, row: 0, variant: hoverIndex }
        : { ss: ssId, row: hoverIndex }
      onHoverPreview?.(sprite)
    } else {
      onHoverPreview?.(null)
    }
  }, [hoverIndex, category, ssId, onHoverPreview])

  return (
    <div className="sprite-picker-overlay" onClick={onClose}>
      <div className="sprite-picker" onClick={(e) => e.stopPropagation()}>
        <div className="sprite-picker__content">
          <div className="sprite-picker__header">
            <h3>{ss.name}</h3>
            <button className="sprite-picker__close" onClick={onClose}>✕</button>
          </div>
          <div className="sprite-picker__grid">
            {Array.from({ length: colorCount }).map((_, index) => {
              const isFloor = category === 'floor'
              const isWall = category === 'wall'
              const isSelected = isFloor
                ? currentSprite?.ss === ssId && currentSprite?.variant === index
                : currentSprite?.ss === ssId && currentSprite?.row === index

              const color = getSpriteColor(ssId, isFloor ? index : 0, isFloor ? index : undefined)
              const label = isWall ? WALL_LABELS[index].short : (index + 1)
              const fullLabel = isWall ? WALL_LABELS[index].full : undefined

              return (
                <button
                  key={index}
                  className={`sprite-picker__item ${isSelected ? 'sprite-picker__item--selected' : ''}`}
                  onClick={() => isFloor
                    ? onSelect({ ss: ssId, row: 0, variant: index })
                    : onSelect({ ss: ssId, row: index })
                  }
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
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
        </div>
      </div>
    </div>
  )
}
