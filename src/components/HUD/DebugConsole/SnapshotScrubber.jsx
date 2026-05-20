import { useRef } from 'react'
import { createScrubberHandler } from './scrubberHandler'
import { BAR_STYLE, getFillStyle, getHandleStyle } from './scrubberStyles'

export function SnapshotScrubber({ history, selectedIndex, setSelectedIndex, isDragging }) {
  const scrubberBarRef = useRef(null)
  const handleScrubberMouseDown = createScrubberHandler(scrubberBarRef, history, setSelectedIndex)

  return (
    <div ref={scrubberBarRef} style={BAR_STYLE}>
      <div style={getFillStyle(selectedIndex, history.length, isDragging)} />
      <div onMouseDown={handleScrubberMouseDown} style={getHandleStyle(selectedIndex, history.length, isDragging)} />
    </div>
  )
}
