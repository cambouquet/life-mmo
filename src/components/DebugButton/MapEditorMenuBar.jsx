import React from 'react'
import { CategoryIcon } from './MapEditorIcons.jsx'

const MENU_ITEMS = [
  { key: 'tiles', label: 'Tiles', icon: 'tiles' },
  { key: 'animations', label: 'Animations', icon: 'animations' },
]

export function MapEditorMenuBar({ activeMenu, onMenuChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, pointerEvents: 'auto' }}>
      {MENU_ITEMS.map(item => (
        <button
          key={item.key}
          onClick={() => onMenuChange?.(item.key)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 8px',
            background: activeMenu === item.key ? 'rgba(100, 220, 255, 0.25)' : 'rgba(100, 180, 255, 0.08)',
            border: activeMenu === item.key ? '1px solid rgba(100, 220, 255, 0.6)' : '1px solid rgba(100, 180, 255, 0.3)',
            borderRadius: '2px',
            cursor: 'pointer',
            color: '#7ab8ff',
            fontSize: '12px',
          }}
          title={item.label}
        >
          <CategoryIcon type={item.icon} />
        </button>
      ))}
    </div>
  )
}
