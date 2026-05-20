import { spriteColors } from './spritePickerData.js'
import { getSpriteColor } from './spritePickerUtils.js'

export function SpriteColorPicker({ selectedColorIndex, onSelectColor, spriteColorOverrides, onSpriteColorChange }) {
  return (
    <div className="sprite-picker__colors" style={{ display: 'flex', gap: '3px', flexWrap: 'nowrap', marginLeft: '4px', alignItems: 'center' }}>
      {Array.from({ length: spriteColors.floor.length }).map((_, index) => {
        const color = getSpriteColor(0x00, 0, spriteColorOverrides, index)
        const isSelected = selectedColorIndex === index
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => onSelectColor(isSelected ? null : index)}
              style={{
                width: '24px',
                height: '24px',
                padding: 0,
                background: color,
                border: isSelected ? '2px solid rgba(100, 220, 255, 0.8)' : '1px solid rgba(100, 180, 255, 0.4)',
                borderRadius: '1px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title={`Color ${index + 1}`}
            />
            {isSelected && (
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  onSpriteColorChange?.(prev => ({ ...prev, [`0_v${index}`]: e.target.value }))
                }}
                style={{
                  width: '24px',
                  height: '24px',
                  border: 'none',
                  borderRadius: '1px',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
