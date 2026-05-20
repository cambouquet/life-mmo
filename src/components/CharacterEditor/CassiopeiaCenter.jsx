import { CENTER_R, RINGS } from './cassiopeiaData'

export function CassiopeiaCenter({ cx, cy, onRandom }) {
  const btnD = CENTER_R * 2
  return (
    <>
      <line
        x1={cx} y1={cy - RINGS[0].r2 - 2}
        x2={cx} y2={cy - RINGS[RINGS.length - 1].r1 + 2}
        stroke="rgba(168,85,247,0.45)" strokeWidth="1" strokeDasharray="2,2"
        style={{ pointerEvents: 'none' }}
      />
      <foreignObject
        x={cx - CENTER_R} y={cy - CENTER_R}
        width={btnD} height={btnD}
        style={{ overflow: 'visible' }}
      >
        <button
          className="btn-random"
          title="Random palette"
          style={{ width: btnD, height: btnD, borderRadius: '50%', fontSize: 11 }}
          onPointerDown={e => e.stopPropagation()}
          onClick={onRandom}
        >?</button>
      </foreignObject>
    </>
  )
}
