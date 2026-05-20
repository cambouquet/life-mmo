export const BOXES_CONTAINER = {
  display: 'flex',
  gap: '4px',
  overflowX: 'auto',
  overflowY: 'hidden',
  paddingBottom: '4px',
  scrollBehavior: 'smooth',
}

export function getBoxStyle(isSelected) {
  return {
    flex: '0 0 32px',
    height: '32px',
    borderRadius: '4px',
    border: isSelected ? '2px solid rgba(192, 132, 252, 0.8)' : '1px solid rgba(168, 85, 247, 0.3)',
    background: isSelected ? 'rgba(192, 132, 252, 0.15)' : 'rgba(168, 85, 247, 0.08)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    color: isSelected ? '#c084fc' : 'rgba(255, 255, 255, 0.4)',
    fontWeight: isSelected ? '600' : '400',
    transition: 'all 0.12s',
    whiteSpace: 'nowrap',
  }
}

export const HOVER_BG = 'rgba(168, 85, 247, 0.15)'
export const HOVER_COLOR = 'rgba(255, 255, 255, 0.6)'
export const DEFAULT_BG = 'rgba(168, 85, 247, 0.08)'
export const DEFAULT_COLOR = 'rgba(255, 255, 255, 0.4)'
