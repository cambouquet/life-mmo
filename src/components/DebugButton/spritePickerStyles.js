export function categoryButtonStyle(isActive) {
  return {
    width: '24px',
    height: '24px',
    padding: 0,
    background: isActive ? 'rgba(100, 220, 255, 0.2)' : 'rgba(100, 180, 255, 0.05)',
    border: isActive ? '1px solid rgba(100, 220, 255, 0.6)' : '1px solid rgba(100, 180, 255, 0.3)',
    borderRadius: '1px',
    cursor: 'pointer',
    color: '#7ab8ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }
}

export const backupButtonStyle = {
  width: '24px',
  height: '24px',
  padding: 0,
  background: 'rgba(100, 220, 100, 0.1)',
  border: '1px solid rgba(100, 220, 100, 0.3)',
  color: '#7ab8ff',
  borderRadius: '1px',
  cursor: 'pointer',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}

export function restoreButtonStyle(hasBackups) {
  return {
    width: '24px',
    height: '24px',
    padding: 0,
    background: hasBackups ? 'rgba(100, 180, 255, 0.1)' : 'rgba(100, 100, 100, 0.05)',
    border: '1px solid rgba(100, 180, 255, 0.2)',
    color: '#7ab8ff',
    borderRadius: '1px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }
}
