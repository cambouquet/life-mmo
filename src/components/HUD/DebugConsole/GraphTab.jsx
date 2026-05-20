import { useMemo, useState, useRef, useEffect } from 'react'
import { useStateGraph } from './useStateGraph'
import { StateHeatmap } from './StateHeatmap'
import { SnapshotHeader } from './SnapshotHeader.jsx'
import { AnomalySection, TriggerSection, ChangedKeysSection, SnapshotStats } from './SnapshotInfo.jsx'
import { StateDataDisplay } from './StateDataDisplay.jsx'

export function GraphTab({ history, selectedIndex, setSelectedIndex }) {
  const { nodes, triggers } = useStateGraph(history)
  const [isLocked, setIsLocked] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [now, setNow] = useState(new Date())
  const panelRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const triggerMap = useMemo(() => {
    const map = {}
    triggers.forEach((t) => { map[t.index] = t })
    return map
  }, [triggers])

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

  const displayIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex
  const selectedTrigger = triggerMap[displayIndex]
  const selectedNode = displayIndex >= 0 ? nodes[displayIndex] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} tabIndex={0}>
      <div style={{ padding: '12px 12px 8px 12px', flexShrink: 0, borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
        <div style={{ fontSize: '9px', color: '#a1a1aa', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          state timeline
        </div>
        {nodes.length === 0 ? (
          <div style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '12px' }}>No state changes recorded</div>
        ) : (
          <StateHeatmap history={nodes} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} onHover={setHoveredIndex} />
        )}
      </div>

      <div ref={panelRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', overflow: 'auto', flex: 1 }}>
        {nodes.length > 0 && displayIndex >= 0 && selectedNode && (
          <div style={{ padding: '10px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.15)' }}>
            <SnapshotHeader displayIndex={displayIndex} selectedNode={selectedNode} isLocked={isLocked} setIsLocked={setIsLocked} />
            <AnomalySection selectedNode={selectedNode} />
            <TriggerSection selectedTrigger={selectedTrigger} selectedNode={selectedNode} />
            <ChangedKeysSection selectedNode={selectedNode} />
            <SnapshotStats selectedNode={selectedNode} now={now} history={history} displayIndex={displayIndex} />
            <StateDataDisplay displayIndex={displayIndex} history={history} />
          </div>
        )}
      </div>
    </div>
  )
}
