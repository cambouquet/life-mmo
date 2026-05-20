export function MinuteSegment({ seg, isSelected, polarToXY, arc, TIME_M_R1, TIME_M_R2, onBirthTimeChange, birthTime }) {
  const [mx, my] = polarToXY(seg.startDeg + 15, (TIME_M_R1 + TIME_M_R2) / 2)
  return (
    <g key={seg.id} onClick={() => onBirthTimeChange({ hour: birthTime.hour, minute: seg.minute })} style={{ cursor: 'pointer' }}>
      <path d={arc(seg.startDeg, seg.endDeg, TIME_M_R1, TIME_M_R2)} fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
        stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'} strokeWidth="0.8" />
      {seg.index % 3 === 0 && (
        <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle" fontSize="5" fontWeight={isSelected ? '700' : '500'}
          fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}>{String(seg.minute).padStart(2, '0')}</text>
      )}
    </g>
  )
}
