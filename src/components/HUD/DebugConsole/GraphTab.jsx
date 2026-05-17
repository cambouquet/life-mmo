import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useStateGraph } from './useStateGraph'
import { StateHeatmap } from './StateHeatmap'

export function GraphTab({ history, selectedIndex, setSelectedIndex }) {
  const { nodes, triggers } = useStateGraph(history)
  const [isLocked, setIsLocked] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [now, setNow] = useState(new Date())
  const panelRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const triggerMap = useMemo(() => {
    const map = {}
    triggers.forEach((t) => {
      map[t.index] = t
    })
    return map
  }, [triggers])

  // Show hovered node if hovering (even if locked), otherwise show selected
  const displayIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex
  const selectedTrigger = triggerMap[displayIndex]
  const selectedNode = displayIndex >= 0 ? nodes[displayIndex] : null

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!panelRef.current || !panelRef.current.contains(document.activeElement)) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(nodes.length - 1, prev + 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes.length, setSelectedIndex])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      tabIndex={0}
    >
      {/* Fixed timeline section */}
      <div style={{ padding: '12px 12px 8px 12px', flexShrink: 0, borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
        <div style={{ fontSize: '9px', color: '#a1a1aa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          state timeline
        </div>
        {nodes.length === 0 ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '12px' }}>No state changes recorded</div>
        ) : (
          <StateHeatmap
            history={nodes}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onHover={setHoveredIndex}
          />
        )}
      </div>

      {/* Scrollable content section */}
      <div
        ref={panelRef}
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', overflow: 'auto', flex: 1 }}
      >
        {nodes.length > 0 && (
          <>

          {/* Snapshot details panel */}
          {displayIndex >= 0 && selectedNode && (
            <div style={{ padding: '10px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <div style={{ fontSize: '8px', color: '#a1a1aa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Snapshot {displayIndex + 1}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.35)' }}>
                    {selectedNode.timestamp.toLocaleTimeString()}
                  </div>
                  <button
                    onClick={() => setIsLocked(!isLocked)}
                    style={{
                      padding: '3px 6px',
                      fontSize: '7px',
                      background: isLocked ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: '0.5px solid rgba(192, 132, 252, 0.3)',
                      borderRadius: '2px',
                      color: isLocked ? '#c084fc' : 'rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.15s',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = isLocked ? 'rgba(192, 132, 252, 0.3)' : 'rgba(255, 255, 255, 0.08)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = isLocked ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    {isLocked ? '🔒 locked' : 'unlock'}
                  </button>
                </div>
              </div>

              {/* Anomaly section */}
              {selectedNode.isAnomalous && (
                <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(251, 191, 36, 0.2)' }}>
                  <div style={{ fontSize: '8px', color: 'rgba(251, 191, 36, 0.8)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠️ Anomaly detected
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(251, 191, 36, 0.7)', lineHeight: '1.4' }}>
                    {selectedNode.changedKeys.length} properties changed (2x+ neighbors' average)
                  </div>
                </div>
              )}

              {/* Trigger section */}
              {selectedTrigger ? (
                <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
                  <div style={{ fontSize: '8px', color: 'rgba(192, 132, 252, 0.8)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Triggered by
                  </div>
                  <div style={{ fontSize: '11px', color: '#c084fc', fontFamily: 'monospace', lineHeight: '1.4' }}>
                    {selectedTrigger.trigger}
                  </div>
                </div>
              ) : selectedNode.unchangedSequence > 0 ? (
                <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
                  <div style={{ fontSize: '8px', color: 'rgba(100, 100, 120, 0.7)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
                    No change
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>
                    State is identical to previous {selectedNode.unchangedSequence} snapshot
                    {selectedNode.unchangedSequence > 1 ? 's' : ''}.
                  </div>
                </div>
              ) : null}

              {/* Changed properties section */}
              {selectedNode.changedKeys.length > 0 && (
                <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
                  <div style={{ fontSize: '8px', color: 'rgba(192, 132, 252, 0.7)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Properties changed ({selectedNode.changedKeys.length})
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {selectedNode.changedKeys.map((key) => (
                      <span
                        key={key}
                        style={{
                          padding: '3px 8px',
                          background: 'rgba(192, 132, 252, 0.2)',
                          borderRadius: '3px',
                          fontSize: '9px',
                          color: '#c084fc',
                          fontFamily: 'monospace',
                          border: '1px solid rgba(192, 132, 252, 0.3)',
                        }}
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional state properties */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Snapshot age:</span>
                  <span style={{ color: '#c084fc', fontFamily: 'monospace' }}>
                    {selectedNode ? (() => {
                      const totalSeconds = Math.floor((now - selectedNode.timestamp) / 1000)
                      const minutes = Math.floor(totalSeconds / 60)
                      const seconds = totalSeconds % 60
                      return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
                    })() : '0s'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Index:</span>
                  <span style={{ color: '#c084fc', fontFamily: 'monospace' }}>{displayIndex + 1} / {history.length}</span>
                </div>
                {selectedNode.unchangedSequence > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>Held unchanged:</span>
                    <span style={{ color: '#c084fc', fontFamily: 'monospace' }}>{selectedNode.unchangedSequence} snapshot{selectedNode.unchangedSequence > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* State data details */}
              {displayIndex >= 0 && displayIndex < history.length && history[displayIndex]?.parsed && (
                <div data-state-data>
                  <div style={{ fontSize: '8px', color: 'rgba(192, 132, 252, 0.7)', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>
                    State data
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9px' }}>
                    {Object.entries(history[displayIndex].parsed).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: 'rgba(255, 255, 255, 0.4)', minWidth: '80px' }}>{key}:</span>
                        <span style={{ color: '#c084fc', fontFamily: 'monospace', textAlign: 'right', wordBreak: 'break-word' }}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
        )}
      </div>
    </div>
  )
}
