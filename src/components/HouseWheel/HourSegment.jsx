export function HourSegment({ seg, isSelected, polarToXY, arc, TIME_H_R1, TIME_H_R2, onBirthTimeChange, birthTime }) {
  const [hx, hy] = polarToXY(seg.startDeg + 15, (TIME_H_R1 + TIME_H_R2) / 2)
  return (
    <g key={seg.id} onClick={() => onBirthTimeChange({ hour: seg.hour, minute: birthTime.minute })} style={{ cursor: 'pointer' }}>
      <path d={arc(seg.startDeg, seg.endDeg, TIME_H_R1, TIME_H_R2)} fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
        stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'} strokeWidth="0.8" />
      <text x={hx} y={hy} textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight={isSelected ? '700' : '500'}
        fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}>{seg.hour}</text>
    </g>
  )
}
