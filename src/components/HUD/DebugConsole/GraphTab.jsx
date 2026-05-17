import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useStateGraph } from './useStateGraph'
import { StateHeatmap } from './StateHeatmap'

export function GraphTab({ history, selectedIndex, setSelectedIndex }) {
  const { nodes, triggers } = useStateGraph(history)
  const [isLocked, setIsLocked] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const panelRef = useRef(null)

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
      ref={panelRef}
      style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', height: '100%', overflow: 'auto' }}
      tabIndex={0}
    >
      <div style={{ fontSize: '9px', color: '#a1a1aa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        state timeline
      </div>

      {nodes.length === 0 ? (
        <div style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '12px' }}>No state changes recorded</div>
      ) : (
        <>
          <StateHeatmap
            history={nodes}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onHover={setHoveredIndex}
          />

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
                <div>
                  <div style={{ fontSize: '8px', color: 'rgba(192, 132, 252, 0.7)', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Properties changed
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
            </div>
          )}
        </>
      )}
    </div>
  )
}
