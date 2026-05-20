import { CATEGORIES } from './spritePickerData'
import { CategoryIcon } from './CategoryIcon'
import { categoryButtonStyle } from './spritePickerStyles'

export function CategoryButtons({ category, onActiveSpriteChange }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {CATEGORIES.map(cat => (
        <button
          key={cat.key}
          onClick={() => onActiveSpriteChange?.({ category: cat.key, sprite: null })}
          style={categoryButtonStyle(category === cat.key)}
          title={cat.label}
        >
          <CategoryIcon type={cat.key} />
        </button>
      ))}
    </div>
  )
}
