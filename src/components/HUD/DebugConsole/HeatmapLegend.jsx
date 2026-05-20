import { HEATMAP_LEGEND } from './heatmapUtils.js'

export function HeatmapLegend() {
  return (
    <>
      <div style={{ display: 'flex', gap: '12px', fontSize: '8px', color: 'rgba(255, 255, 255, 0.5)', flexWrap: 'wrap' }}>
        {HEATMAP_LEGEND.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '1px', background: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.4)' }} />
    </>
  )
}
