import { useRef, useEffect } from 'react'
import { getColorForChangeCount } from './heatmapUtils.js'
import { HeatmapLegend } from './HeatmapLegend.jsx'
import { HEATMAP_CONTAINER, HEATMAP_SCROLL, EMPTY_STATE, LEGEND_TEXT, getBarStyle } from './heatmapStyles'

export function StateHeatmap({ history, selectedIndex, setSelectedIndex, onHover }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && selectedIndex >= 0) {
      const selected = containerRef.current.querySelector(`[data-index="${selectedIndex}"]`)
      if (selected) selected.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [selectedIndex])

  if (history.length === 0) return <div style={EMPTY_STATE}>No states recorded</div>

  return (
    <div style={HEATMAP_CONTAINER}>
      <div ref={containerRef} style={HEATMAP_SCROLL}>
        {history.map((node, idx) => {
          const changeCount = node.changedKeys ? node.changedKeys.length : 0
          const isSelected = selectedIndex === idx
          const color = getColorForChangeCount(changeCount, isSelected, node.isAnomalous || false)
          return (
            <div key={idx} data-index={idx} onClick={() => setSelectedIndex(idx)} onMouseEnter={() => onHover?.(idx)}
              onMouseLeave={() => onHover?.(null)} title={`${idx + 1}: ${node.timestamp.toLocaleTimeString()} (${changeCount} properties changed)`}
              style={getBarStyle(isSelected, changeCount, color, node.isAnomalous || false)} />
          )
        })}
      </div>
      <HeatmapLegend />
      <div style={LEGEND_TEXT}>{history.length} snapshots · showing all states</div>
    </div>
  )
}
