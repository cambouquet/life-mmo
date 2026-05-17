import React, { useRef, useEffect } from 'react'

function SnapshotScrubber({ history, selectedIndex, setSelectedIndex, isDragging }) {
  const scrubberBarRef = useRef(null)

  const handleScrubberMouseDown = (e) => {
    e.preventDefault()

    const handleMove = (moveE) => {
      if (!scrubberBarRef.current) return
      const rect = scrubberBarRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width, moveE.clientX - rect.left))
      const percent = x / rect.width
      const newIdx = Math.round(percent * (history.length - 1))
      setSelectedIndex(newIdx)
    }

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  return (
    <div
      ref={scrubberBarRef}
      style={{
        height: '4px',
        background: 'rgba(168, 85, 247, 0.1)',
        borderRadius: '2px',
        position: 'relative',
        cursor: 'pointer',
        marginBottom: '2px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          height: '100%',
          background: 'rgba(192, 132, 252, 0.4)',
          borderRadius: '2px',
          width: `${((selectedIndex + 1) / history.length) * 100}%`,
          transition: isDragging ? 'none' : 'width 0.12s',
        }}
      />
      <div
        onMouseDown={handleScrubberMouseDown}
        style={{
          position: 'absolute',
          width: '8px',
          height: '10px',
          background: 'rgba(192, 132, 252, 0.8)',
          borderRadius: '1px',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          left: `${((selectedIndex + 1) / history.length) * 100}%`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'left 0.12s',
        }}
      />
    </div>
  )
}

function SnapshotBoxes({ history, selectedIndex, setSelectedIndex, timelineRef }) {
  return (
    <div
      ref={timelineRef}
      style={{
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
        overflowY: 'hidden',
        paddingBottom: '4px',
        scrollBehavior: 'smooth',
      }}
    >
      {history.map((entry, idx) => (
        <div
          key={idx}
          data-snapshot={idx}
          onClick={() => setSelectedIndex(idx)}
          style={{
            flex: '0 0 32px',
            height: '32px',
            borderRadius: '4px',
            border:
              selectedIndex === idx
                ? '2px solid rgba(192, 132, 252, 0.8)'
                : '1px solid rgba(168, 85, 247, 0.3)',
            background:
              selectedIndex === idx
                ? 'rgba(192, 132, 252, 0.15)'
                : 'rgba(168, 85, 247, 0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            color:
              selectedIndex === idx
                ? '#c084fc'
                : 'rgba(255, 255, 255, 0.4)',
            fontWeight: selectedIndex === idx ? '600' : '400',
            transition: 'all 0.12s',
            whiteSpace: 'nowrap',
          }}
          title={entry.timestamp.toLocaleTimeString()}
          onMouseEnter={(e) => {
            if (selectedIndex !== idx) {
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
            }
          }}
          onMouseLeave={(e) => {
            if (selectedIndex !== idx) {
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'
            }
          }}
        >
          {idx + 1}
        </div>
      ))}
    </div>
  )
}

export function StateTimeline({
  history,
  selectedIndex,
  setSelectedIndex,
  currentEntry,
  timelineRef,
  isDragging,
}) {
  if (history.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            fontSize: '9px',
            color: '#a1a1aa',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          snapshots
        </div>
        <div style={{ fontSize: '8px', color: '#a1a1aa' }}>
          {selectedIndex + 1}/{history.length}
          {currentEntry && ` • ${currentEntry.timestamp.toLocaleTimeString()}`}
        </div>
      </div>

      <SnapshotScrubber
        history={history}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        isDragging={isDragging}
      />

      <SnapshotBoxes
        history={history}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        timelineRef={timelineRef}
      />
    </div>
  )
}
