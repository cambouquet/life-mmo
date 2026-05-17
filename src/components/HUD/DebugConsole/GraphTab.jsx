import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useStateGraph } from './useStateGraph'

function GraphNode({ node, isSelected, onClick, x, y, trigger, onHover }) {
  const size = 28
  const hasChanges = node.changedKeys.length > 0
  const isUnchangedSequence = node.unchangedSequence > 0

  return (
    <g
      key={node.id}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Connection line to next node */}
      {node.id < 999 && (
        <line
          x1={x + size / 2}
          y1={y + size / 2}
          x2={x + 48 + size / 2}
          y2={y + size / 2}
          stroke={!hasChanges ? 'rgba(192, 132, 252, 0.3)' : 'rgba(100, 100, 120, 0.15)'}
          strokeWidth={!hasChanges ? '1.5' : '1'}
          strokeDasharray={hasChanges ? '2,2' : 'none'}
        />
      )}

      {/* Unchanged sequence label */}
      {isUnchangedSequence && node.unchangedSequence % 5 === 0 && (
        <text
          x={x + size / 2}
          y={y - 8}
          textAnchor="middle"
          fontSize="7"
          fill="rgba(255, 255, 255, 0.25)"
          pointerEvents="none"
        >
          +{node.unchangedSequence}
        </text>
      )}

      {/* Node circle */}
      <circle
        cx={x + size / 2}
        cy={y + size / 2}
        r={size / 2}
        fill={
          isSelected
            ? 'rgba(192, 132, 252, 0.3)'
            : hasChanges
              ? 'rgba(100, 100, 120, 0.06)'
              : 'rgba(168, 85, 247, 0.15)'
        }
        stroke={
          isSelected
            ? 'rgba(192, 132, 252, 0.8)'
            : hasChanges
              ? 'rgba(168, 85, 247, 0.15)'
              : 'rgba(192, 132, 252, 0.5)'
        }
        strokeWidth={isSelected ? '2' : '1'}
        style={{ cursor: 'pointer', transition: 'all 0.12s' }}
        onClick={onClick}
      />

      {/* Node number */}
      <text
        x={x + size / 2}
        y={y + size / 2 + 4}
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill={
          isSelected
            ? '#c084fc'
            : hasChanges
              ? 'rgba(255, 255, 255, 0.2)'
              : 'rgba(192, 132, 252, 0.7)'
        }
        pointerEvents="none"
      >
        {node.index + 1}
      </text>

      {/* Property count badge */}
      {hasChanges && node.changedKeys.length > 0 && (
        <g>
          {/* Badge background */}
          <rect
            x={x + size / 2 - 6}
            y={y - 12}
            width="12"
            height="10"
            rx="2"
            fill={
              node.isAnomalous
                ? 'rgba(251, 191, 36, 0.15)'
                : node.changedKeys.length <= 2
                  ? 'rgba(96, 168, 255, 0.15)'
                  : node.changedKeys.length <= 4
                    ? 'rgba(168, 85, 247, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)'
            }
            stroke={
              node.isAnomalous
                ? 'rgba(251, 191, 36, 0.4)'
                : node.changedKeys.length <= 2
                  ? 'rgba(96, 168, 255, 0.4)'
                  : node.changedKeys.length <= 4
                    ? 'rgba(168, 85, 247, 0.4)'
                    : 'rgba(239, 68, 68, 0.4)'
            }
            strokeWidth="0.5"
            pointerEvents="none"
          />
          {/* Badge text */}
          <text
            x={x + size / 2}
            y={y - 5}
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fill={
              node.isAnomalous
                ? 'rgba(251, 191, 36, 0.8)'
                : node.changedKeys.length <= 2
                  ? 'rgba(96, 168, 255, 0.8)'
                  : node.changedKeys.length <= 4
                    ? 'rgba(168, 85, 247, 0.8)'
                    : 'rgba(239, 68, 68, 0.8)'
            }
            pointerEvents="none"
          >
            {node.changedKeys.length}
          </text>
        </g>
      )}

      {/* Anomaly indicator - unusual change pattern */}
      {node.isAnomalous && (
        <>
          <circle
            cx={x + size / 2}
            cy={y + size / 2}
            r={size / 2 + 4}
            fill="none"
            stroke="rgba(251, 191, 36, 0.5)"
            strokeWidth="2"
            pointerEvents="none"
          />
          <circle
            cx={x + size / 2 + size / 2 + 2}
            cy={y + size / 2 - size / 2 - 2}
            r="3"
            fill="rgba(251, 191, 36, 0.7)"
            pointerEvents="none"
          />
        </>
      )}

      {/* Simple tooltip - just index */}
      <title>Snapshot {node.index + 1}</title>
    </g>
  )
}

export function GraphTab({ history, selectedIndex, setSelectedIndex }) {
  const { nodes, triggers } = useStateGraph(history)
  const [hoveredNodeId, setHoveredNodeId] = useState(null)
  const [isLocked, setIsLocked] = useState(false)
  const svgRef = useRef(null)
  const panelRef = useRef(null)

  const visibleNodes = useMemo(() => {
    if (nodes.length <= 20) return nodes
    const start = Math.max(0, selectedIndex - 10)
    const end = Math.min(nodes.length, selectedIndex + 11)
    return nodes.slice(start, end).map((n, i) => ({ ...n, displayIndex: i + start }))
  }, [nodes, selectedIndex])

  const triggerMap = useMemo(() => {
    const map = {}
    triggers.forEach((t) => {
      map[t.index] = t
    })
    return map
  }, [triggers])

  const width = visibleNodes.length * 48 + 40
  const height = 120

  // Show hovered node if not locked, otherwise show selected
  const displayNodeId = !isLocked && hoveredNodeId !== null ? hoveredNodeId : selectedIndex
  const selectedTrigger = triggerMap[displayNodeId]
  const selectedNode = nodes[displayNodeId]

  // Auto-scroll timeline to show selected node
  useEffect(() => {
    if (svgRef.current && selectedIndex >= 0) {
      const svg = svgRef.current
      const viewBox = svg.viewBox.baseVal
      const nodeX = (visibleNodes.findIndex((n) => n.id === selectedIndex) * 48 + 20 + 14) || 0
      const svgWidth = viewBox.width

      // Center the node in view
      const targetScroll = nodeX - svgWidth / 2
      svg.parentElement.scrollLeft = Math.max(0, targetScroll)
    }
  }, [selectedIndex, visibleNodes])

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
  }, [nodes.length])

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
          <div style={{ overflowX: 'auto', overflowY: 'hidden', scrollBehavior: 'smooth' }}>
            <svg
              ref={svgRef}
            width="100%"
            height={height}
            style={{
              background: 'rgba(15, 15, 20, 0.5)',
              borderRadius: '4px',
              border: '1px solid rgba(168, 85, 247, 0.1)',
            }}
            viewBox={`0 0 ${Math.max(600, width)} ${height}`}
            preserveAspectRatio="xMinYMid meet"
          >
              {visibleNodes.map((node, i) => (
                <GraphNode
                  key={node.id}
                  node={node}
                  isSelected={selectedIndex === node.id}
                  onClick={() => setSelectedIndex(node.id)}
                  x={i * 48 + 20}
                  y={50}
                  trigger={triggerMap[node.id]}
                  onHover={setHoveredNodeId}
                />
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', fontSize: '8px', color: 'rgba(255, 255, 255, 0.5)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'rgba(168, 85, 247, 0.15)',
                  border: '1px solid rgba(192, 132, 252, 0.5)',
                }}
              />
              <span>unchanged</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'rgba(100, 100, 120, 0.06)',
                  border: '1px solid rgba(168, 85, 247, 0.15)',
                }}
              />
              <span>changed</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '7px', fontWeight: '700', color: 'rgba(96, 168, 255, 0.8)', padding: '1px 3px', background: 'rgba(96, 168, 255, 0.15)', borderRadius: '2px', border: '0.5px solid rgba(96, 168, 255, 0.4)' }}>
                1-2
              </div>
              <span>minimal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '7px', fontWeight: '700', color: 'rgba(168, 85, 247, 0.8)', padding: '1px 3px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px', border: '0.5px solid rgba(168, 85, 247, 0.4)' }}>
                3-4
              </div>
              <span>normal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '7px', fontWeight: '700', color: 'rgba(239, 68, 68, 0.8)', padding: '1px 3px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '2px', border: '0.5px solid rgba(239, 68, 68, 0.4)' }}>
                5+
              </div>
              <span>major</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '7px', fontWeight: '700', color: 'rgba(251, 191, 36, 0.8)', padding: '1px 3px', background: 'rgba(251, 191, 36, 0.15)', borderRadius: '2px', border: '0.5px solid rgba(251, 191, 36, 0.4)' }}>
                ⚠
              </div>
              <span>anomaly</span>
            </div>
          </div>

              {/* Snapshot details panel */}
          {displayNodeId >= 0 && selectedNode && (
            <div style={{ padding: '10px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <div style={{ fontSize: '8px', color: '#a1a1aa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Snapshot {displayNodeId + 1}
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
