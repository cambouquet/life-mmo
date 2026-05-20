import { SnapshotScrubber } from './SnapshotScrubber.jsx'
import { SnapshotBoxes } from './SnapshotBoxes.jsx'

export function StateTimeline({ history, selectedIndex, setSelectedIndex, currentEntry, timelineRef, isDragging }) {
  if (history.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '9px', color: '#a1a1aa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          snapshots
        </div>
        <div style={{ fontSize: '8px', color: '#a1a1aa' }}>
          {selectedIndex + 1}/{history.length}
          {currentEntry && ` • ${currentEntry.timestamp.toLocaleTimeString()}`}
        </div>
      </div>
      <SnapshotScrubber history={history} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} isDragging={isDragging} />
      <SnapshotBoxes history={history} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} timelineRef={timelineRef} />
    </div>
  )
}
