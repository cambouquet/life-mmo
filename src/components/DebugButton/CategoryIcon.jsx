import React from 'react'

export function CategoryIcon({ type }) {
  const icons = {
    floor: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}><rect x="2" y="14" width="20" height="8" rx="1"/></svg>,
    wall: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}><rect x="4" y="3" width="4" height="18" rx="1"/><rect x="10" y="3" width="4" height="18" rx="1"/><rect x="16" y="3" width="4" height="18" rx="1"/></svg>,
    table: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}><rect x="5" y="7" width="14" height="8" rx="1"/><rect x="7" y="16" width="3" height="4" rx="1"/><rect x="14" y="16" width="3" height="4" rx="1"/></svg>,
    torch: <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}><circle cx="12" cy="6" r="2"/><path d="M12 8 L9 14 L15 14 Z"/><rect x="11" y="14" width="2" height="6" rx="1"/></svg>
  }
  return icons[type]
}
