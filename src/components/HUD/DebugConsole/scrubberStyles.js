export const BAR_STYLE = {
  height: '4px',
  background: 'rgba(168, 85, 247, 0.1)',
  borderRadius: '2px',
  position: 'relative',
  cursor: 'pointer',
  marginBottom: '2px',
}

export function getFillStyle(selectedIndex, historyLength, isDragging) {
  return {
    position: 'absolute',
    height: '100%',
    background: 'rgba(192, 132, 252, 0.4)',
    borderRadius: '2px',
    width: `${((selectedIndex + 1) / historyLength) * 100}%`,
    transition: isDragging ? 'none' : 'width 0.12s',
  }
}

export function getHandleStyle(selectedIndex, historyLength, isDragging) {
  return {
    position: 'absolute',
    width: '8px',
    height: '10px',
    background: 'rgba(192, 132, 252, 0.8)',
    borderRadius: '1px',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    left: `${((selectedIndex + 1) / historyLength) * 100}%`,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'left 0.12s',
  }
}
