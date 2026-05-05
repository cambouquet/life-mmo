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

export default function SpritePickerModal({ category, currentSprite, onSelect, onClose, spriteColorOverrides = {} }) {
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

  return (
    <div className="sprite-picker-overlay" onClick={onClose}>
      <div className="sprite-picker" onClick={(e) => e.stopPropagation()}>
        <div className="sprite-picker__header">
          <h3>{ss.name}</h3>
          <button className="sprite-picker__close" onClick={onClose}>✕</button>
        </div>
        <div className="sprite-picker__grid">
          {Array.from({ length: ss.rows }).map((_, row) => {
            const spriteName = SPRITE_NAMES[`${ssId.toString(16).padStart(2, '0')}_${row}`] || `row_${row}`
            const isSelected = currentSprite?.ss === ssId && currentSprite?.row === row
            return (
              <button
                key={row}
                className={`sprite-picker__item ${isSelected ? 'sprite-picker__item--selected' : ''}`}
                onClick={() => onSelect({ ss: ssId, row, name: spriteName })}
              >
                <div className="sprite-picker__preview" style={{ backgroundColor: getSpriteColor(ssId, row) }} />
                <div className="sprite-picker__name">{spriteName}</div>
                <div className="sprite-picker__desc">Row {row}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
