import React from 'react'
import { WheelBackground } from './WheelBackground.jsx'
import { SignRing } from './SignRing.jsx'
import { TimePicker } from './TimePicker.jsx'
import { DatePicker } from './DatePicker.jsx'
import { HousesLayer } from './HousesLayer.jsx'

export function WheelDisplay({ size, style, containerStyle, cx, cy, placements, ascLong, polarToXY, arc, rows, hovered, setHovered, lockedPoint, setLockedPoint, birthTime, onBirthTimeChange, birthDate, onBirthDateChange, houseCusps, getInterpretation, houseTotal }) {
  return (
    <div
      className="house-wheel-container"
      style={{
        position: 'relative',
        padding: '4px 0 0',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        ...containerStyle,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 300 300" style={{ display: 'block', margin: '0 auto', overflow: 'visible', ...style }}>
        <defs>
          <filter id="glow-wheel" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <WheelBackground cx={cx} cy={cy} />
        <SignRing placements={placements} ascLong={ascLong} polarToXY={polarToXY} arc={arc} rows={rows} hovered={hovered} setHovered={setHovered} />
        <TimePicker birthTime={birthTime} onBirthTimeChange={onBirthTimeChange} polarToXY={polarToXY} arc={arc} />
        <DatePicker birthDate={birthDate} onBirthDateChange={onBirthDateChange} polarToXY={polarToXY} arc={arc} />
        <HousesLayer
          placements={placements}
          houseCusps={houseCusps}
          ascLong={ascLong}
          rows={rows}
          hovered={hovered}
          lockedPoint={lockedPoint}
          setHovered={setHovered}
          setLockedPoint={setLockedPoint}
          polarToXY={polarToXY}
          arc={arc}
          getInterpretation={getInterpretation}
          houseTotal={houseTotal}
        />
        <circle cx={cx} cy={cy} r="10" fill="#0e0a1e" />
      </svg>
    </div>
  )
}
