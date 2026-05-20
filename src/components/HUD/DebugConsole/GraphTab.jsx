import { useMemo, useState, useRef, useEffect } from 'react'
import { useStateGraph } from './useStateGraph'
import { StateHeatmap } from './StateHeatmap'
import { SnapshotHeader } from './SnapshotHeader.jsx'
import { AnomalySection, TriggerSection, ChangedKeysSection, SnapshotStats } from './SnapshotInfo.jsx'
import { StateDataDisplay } from './StateDataDisplay.jsx'
import { useGraphKeyboard } from './useGraphKeyboard'
import { TAB_CONTAINER, HEADER_SECTION, TIMELINE_LABEL, EMPTY_MESSAGE, PANEL, SNAPSHOT_CARD } from './graphTabStyles'

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

  useGraphKeyboard(panelRef, nodes.length, setSelectedIndex)

  const displayIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex
  const selectedTrigger = triggerMap[displayIndex]
  const selectedNode = displayIndex >= 0 ? nodes[displayIndex] : null

  return (
    <div style={TAB_CONTAINER} tabIndex={0}>
      <div style={HEADER_SECTION}>
        <div style={TIMELINE_LABEL}>state timeline</div>
        {nodes.length === 0 ? (
          <div style={EMPTY_MESSAGE}>No state changes recorded</div>
        ) : (
          <StateHeatmap history={nodes} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} onHover={setHoveredIndex} />
        )}
      </div>

      <div ref={panelRef} style={PANEL}>
        {nodes.length > 0 && displayIndex >= 0 && selectedNode && (
          <div style={SNAPSHOT_CARD}>
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
