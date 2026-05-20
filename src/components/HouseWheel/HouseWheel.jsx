import React, { useState, useEffect } from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { PLANET_NAMES, PLANET_ORDER } from '../HoroscopeModal/astroConstants.js'
import { createWheelGeometry } from './wheelGeometry.js'
import { WheelInfoPanel } from './WheelInfoPanel.jsx'
import { HOUSE_THEMES, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG, PLANET_SUMMARY } from './houseWheelData.js'
import { WHEEL_RADIUS, computeHouseTally } from './houseWheelGeometry.js'
import { WheelBackground } from './WheelBackground.jsx'
import { SignRing } from './SignRing.jsx'
import { TimePicker } from './TimePicker.jsx'
import { DatePicker } from './DatePicker.jsx'
import { HousesLayer } from './HousesLayer.jsx'
import { getInterpretation } from './wheelInterpretation.js'

export { HOUSE_THEMES }

export function HouseWheelWithInfo({ onHoverInfoChange, ...props }) {
  const [localHoverInfo, setLocalHoverInfo] = useState(null)

  useEffect(() => {
    onHoverInfoChange?.(localHoverInfo)
  }, [localHoverInfo, onHoverInfoChange])

  return <HouseWheel {...props} setHoverInfo={setLocalHoverInfo} />
}

export function HouseWheel({
  placements,
  houseCusps,
  size = 300,
  hideStellium,
  style,
  containerStyle,
  birthTime,
  onBirthTimeChange,
  birthDate,
  onBirthDateChange,
  setHoverInfo,
}) {
  const [hovered, setHovered] = useState(null)
  const [lockedPoint, setLockedPoint] = useState(null)

  useEffect(() => {
    if (setHoverInfo) setHoverInfo(infoContent)
  }, [lockedPoint, hovered, setHoverInfo])

  if (!placements) return null

  const { cx, cy } = WHEEL_RADIUS
  const { polarToXY, arc } = createWheelGeometry(cx, cy)

  const rows = PLANET_ORDER.filter(p => placements[p])
  const ascLong = houseCusps ? houseCusps[0] : 0
  const { houseTotal } = computeHouseTally(placements, PLANET_ORDER, SIGN_META)

  const getInterp = pName => getInterpretation(pName, placements, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG)

  const infoContent = (
    <WheelInfoPanel
      lockedPoint={lockedPoint}
      hovered={hovered}
      placements={placements}
      HOUSE_THEMES={HOUSE_THEMES}
      HOUSE_NAMES={HOUSE_NAMES}
      HOUSE_LONG={HOUSE_LONG}
      SIGN_DESC_LONG={SIGN_DESC_LONG}
      PLANET_SUMMARY={PLANET_SUMMARY}
    />
  )

  return (
    <>
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
            getInterpretation={getInterp}
            houseTotal={houseTotal}
          />

          <circle cx={cx} cy={cy} r="10" fill="#0e0a1e" />
        </svg>
      </div>
      {infoContent && <div style={{ marginTop: '8px' }}>{infoContent}</div>}
    </>
  )
}
