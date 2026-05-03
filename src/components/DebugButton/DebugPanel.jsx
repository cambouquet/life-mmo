import './DebugPanel.scss'

export default function DebugPanel({ hoveredTile, layers, collMap }) {
  if (!hoveredTile || !layers) return null

  const { c, r } = hoveredTile
  const coll = collMap[r]?.[c] ?? '?'
  const ground = layers.ground[r]?.[c]
  const wall = layers.walls[r]?.[c]
  const obj = layers.objects[r]?.[c]
  const entity = layers.entities?.[r]?.[c]

  return (
    <div className="debug-panel">
      <div className="debug-line">tile {c},{r} coll {coll}</div>
      <div className="debug-line">L0 {ground ? `ss=${ground.ss}` : '—'}</div>
      <div className="debug-line">L1 {wall ? `ss=${wall.ss}` : '—'}</div>
      <div className="debug-line">L2 {obj ? `ss=${obj.ss}` : '—'}</div>
      <div className="debug-line">L3 {entity ? `ss=${entity.ss}` : '—'}</div>
    </div>
  )
}
