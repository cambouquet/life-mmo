export const HEATMAP_CONTAINER = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

export const HEATMAP_SCROLL = {
  display: 'flex',
  gap: '1px',
  overflowX: 'auto',
  overflowY: 'hidden',
  padding: '4px',
  background: 'rgba(15, 15, 20, 0.5)',
  borderRadius: '4px',
  border: '1px solid rgba(168, 85, 247, 0.1)',
  scrollBehavior: 'smooth',
  alignItems: 'center',
}

export const EMPTY_STATE = {
  color: 'rgba(255, 255, 255, 0.2)',
  fontSize: '11px',
}

export const LEGEND_TEXT = {
  fontSize: '9px',
  color: 'rgba(255, 255, 255, 0.4)',
}

export function getBarStyle(isSelected, changeCount, color, isAnomalous) {
  return {
    flex: '0 0 5px',
    height: '20px',
    minWidth: '5px',
    background: color,
    borderRadius: '1px',
    cursor: 'pointer',
    transition: 'all 0.12s',
    opacity: isSelected ? 1 : 0.7,
    border: isSelected ? '1px solid rgba(192, 132, 252, 0.6)' : 'none',
  }
}
