import React, { useRef, useEffect } from 'react'

function getColorForChangeCount(count, isSelected, isAnomalous) {
  if (isSelected) {
    return 'rgba(192, 132, 252, 0.8)'
  }

  if (isAnomalous) {
    return 'rgba(251, 191, 36, 0.6)'
  }

  // Gradient: blue → purple → red
  if (count === 0) return 'rgba(100, 100, 120, 0.3)'
  if (count === 1) return 'rgba(96, 168, 255, 0.5)'
  if (count === 2) return 'rgba(168, 85, 247, 0.5)'
  if (count === 3) return 'rgba(192, 132, 252, 0.5)'
  if (count <= 5) return 'rgba(218, 112, 214, 0.6)'
  return 'rgba(239, 68, 68, 0.6)' // 6+
}

export function StateHeatmap({ history, selectedIndex, setSelectedIndex, onHover }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && selectedIndex >= 0) {
      const selected = containerRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      if (selected) {
        selected.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [selectedIndex])

  if (history.length === 0) {
    return <div style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '11px' }}>No states recorded</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div
        ref={containerRef}
        style={{
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
        }}
      >
        {history.map((node, idx) => {
          const changeCount = node.changedKeys ? node.changedKeys.length : 0
          return (
            <div
              key={idx}
              data-index={idx}
              onClick={() => setSelectedIndex(idx)}
              onMouseEnter={() => onHover?.(idx)}
              onMouseLeave={() => onHover?.(null)}
              title={`${idx + 1}: ${node.timestamp.toLocaleTimeString()} (${changeCount} properties changed)`}
              style={{
                flex: '0 0 5px',
                height: '20px',
                minWidth: '5px',
                background: getColorForChangeCount(
                  changeCount,
                  selectedIndex === idx,
                  node.isAnomalous || false
                ),
                borderRadius: '1px',
                cursor: 'pointer',
                transition: 'all 0.12s',
                opacity: selectedIndex === idx ? 1 : 0.7,
                border: selectedIndex === idx ? '1px solid rgba(192, 132, 252, 0.6)' : 'none',
                transform: 'scaleY(1)',
              }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', fontSize: '8px', color: 'rgba(255, 255, 255, 0.5)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(100, 100, 120, 0.3)' }} />
          <span>no change</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(96, 168, 255, 0.5)' }} />
          <span>1 prop</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(168, 85, 247, 0.5)' }} />
          <span>2 props</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(218, 112, 214, 0.6)' }} />
          <span>3-5 props</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(239, 68, 68, 0.6)' }} />
          <span>6+ props</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: 'rgba(251, 191, 36, 0.6)' }} />
          <span>anomaly</span>
        </div>
      </div>

      <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.4)' }}>
        {history.length} snapshots · showing all states
      </div>
    </div>
  )
}
