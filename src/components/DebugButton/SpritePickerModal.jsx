import './SpritePickerModal.scss'

const SPRITE_CATALOG = {
  floor: {
    name: 'Floor',
    spritesheet: 0x00,
    options: [
      { name: 'floor_a', row: 0, desc: 'Checkerboard even' },
      { name: 'floor_b', row: 1, desc: 'Checkerboard odd' },
      { name: 'void', row: 2, desc: 'Void gap' },
    ]
  },
  wall: {
    name: 'Wall',
    spritesheet: 0x01,
    options: [
      { name: 'wall_solid', row: 0, desc: 'Side walls' },
      { name: 'wall_top', row: 1, desc: 'Top edge' },
      { name: 'wall_face', row: 2, desc: 'Bottom edge' },
      { name: 'wall_corner', row: 3, desc: 'Corner' },
    ]
  },
  mirror: {
    name: 'Mirror',
    spritesheet: 0x02,
    options: [
      { name: 'mirror_left', row: 0, desc: 'Limited (left room)' },
      { name: 'mirror_full', row: 1, desc: 'Full (mid room)' },
    ]
  },
  table: {
    name: 'Table',
    spritesheet: 0x03,
    options: [
      { name: 'table', row: 0, desc: 'Divination table' },
    ]
  },
  torch: {
    name: 'Torch',
    spritesheet: 0x04,
    options: [
      { name: 'torch_d1_top', row: 0, desc: 'Door 1 top' },
      { name: 'torch_d1_bot', row: 1, desc: 'Door 1 bottom' },
      { name: 'torch_d2_top', row: 2, desc: 'Door 2 top' },
      { name: 'torch_d2_bot', row: 3, desc: 'Door 2 bottom' },
    ]
  },
}

export default function SpritePickerModal({ category, onSelect, onClose }) {
  const sprites = SPRITE_CATALOG[category]
  if (!sprites) return null

  return (
    <div className="sprite-picker-overlay" onClick={onClose}>
      <div className="sprite-picker" onClick={(e) => e.stopPropagation()}>
        <div className="sprite-picker__header">
          <h3>{sprites.name}</h3>
          <button className="sprite-picker__close" onClick={onClose}>✕</button>
        </div>
        <div className="sprite-picker__grid">
          {sprites.options.map((sprite) => (
            <button
              key={sprite.name}
              className="sprite-picker__item"
              onClick={() => onSelect(sprite)}
              title={sprite.desc}
            >
              <div className="sprite-picker__preview">
                <img
                  src={`/src/assets/sprites/ss${sprites.spritesheet.toString(16).padStart(2, '0')}_*.png`}
                  alt={sprite.name}
                  style={{
                    objectPosition: `0 ${sprite.row * -16}px`,
                    backgroundColor: '#06040e'
                  }}
                />
              </div>
              <div className="sprite-picker__name">{sprite.name}</div>
              <div className="sprite-picker__desc">{sprite.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
