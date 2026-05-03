import './SpritePickerModal.scss'
import SPRITESHEETS_DATA from '../../game/config/spritesheets.json'

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

export default function SpritePickerModal({ category, onSelect, onClose }) {
  const getCategoryId = (cat) => {
    const map = { floor: 0x00, wall: 0x01, mirror: 0x02, table: 0x03, torch: 0x04 }
    return map[cat]
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
            return (
              <button
                key={row}
                className="sprite-picker__item"
                onClick={() => onSelect({ ss: ssId, row, name: spriteName })}
              >
                <div className="sprite-picker__preview" style={{ backgroundSize: `${ss.tileSize}px ${ss.tileSize}px` }}>
                  <img
                    src={`/src/assets/sprites/${ss.file}`}
                    alt={spriteName}
                    style={{
                      objectPosition: `0 ${row * -ss.tileSize}px`,
                      backgroundColor: '#06040e',
                      width: ss.tileSize,
                      height: ss.tileSize,
                    }}
                  />
                </div>
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
