export function MapMenuButton({ item, activeMapMenu, onMapMenuChange, onPickerStateChange }) {
  return (
    <button
      key={item.key}
      onClick={() => {
        onMapMenuChange?.(item.key)
        if (item.category) {
          onPickerStateChange?.(prev => ({ ...prev, pickerOpen: item.category, activeTab: 'tiles' }))
        } else if (item.tab) {
          onPickerStateChange?.(prev => ({ ...prev, activeTab: item.tab }))
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
        background: activeMapMenu === item.key ? 'rgba(100, 220, 255, 0.25)' : 'rgba(100, 180, 255, 0.08)',
        border: activeMapMenu === item.key ? '1px solid rgba(100, 220, 255, 0.6)' : '1px solid rgba(100, 180, 255, 0.3)',
        borderRadius: '2px',
        cursor: 'pointer',
        color: '#7ab8ff',
        fontSize: '12px',
        minHeight: '20px',
        pointerEvents: 'auto',
      }}
      title={item.label}
    >
      {item.key === 'tiles' ? '▦' : '▶'}
    </button>
  )
}
