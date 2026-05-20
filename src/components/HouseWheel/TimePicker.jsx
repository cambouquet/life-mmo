import { WHEEL_RADIUS } from './houseWheelGeometry.js'
import { computeHourSegments, computeMinuteSegments } from './wheelPickers.js'
import { HourSegment } from './HourSegment.jsx'
import { MinuteSegment } from './MinuteSegment.jsx'

export function TimePicker({ birthTime, onBirthTimeChange, polarToXY, arc }) {
  const { TIME_H_R1, TIME_H_R2, TIME_M_R1, TIME_M_R2 } = WHEEL_RADIUS
  if (!birthTime || !onBirthTimeChange) return null

  return (
    <>
      {computeHourSegments().map(seg => (
        <HourSegment key={seg.id} seg={seg} isSelected={seg.hour === birthTime.hour} polarToXY={polarToXY} arc={arc}
          TIME_H_R1={TIME_H_R1} TIME_H_R2={TIME_H_R2} onBirthTimeChange={onBirthTimeChange} birthTime={birthTime} />
      ))}
      {computeMinuteSegments().map(seg => (
        <MinuteSegment key={seg.id} seg={seg} isSelected={seg.minute === birthTime.minute} polarToXY={polarToXY} arc={arc}
          TIME_M_R1={TIME_M_R1} TIME_M_R2={TIME_M_R2} onBirthTimeChange={onBirthTimeChange} birthTime={birthTime} />
      ))}
    </>
  )
}
