import React, { useState, useEffect } from 'react'
import { WheelInfoPanel } from './WheelInfoPanel.jsx'
import { HOUSE_THEMES, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG, PLANET_SUMMARY } from './houseWheelData.js'
import { setupWheelData, getWheelInterpretation } from './wheelSetup.js'
import { WheelDisplay } from './WheelDisplay.jsx'

export { HOUSE_THEMES }

export function HouseWheelWithInfo({ onHoverInfoChange, ...props }) {
  const [localHoverInfo, setLocalHoverInfo] = useState(null)

  useEffect(() => {
    onHoverInfoChange?.(localHoverInfo)
  }, [localHoverInfo, onHoverInfoChange])

  return <HouseWheel {...props} setHoverInfo={setLocalHoverInfo} />
}

export function HouseWheel({ placements, houseCusps, size = 300, style, containerStyle, birthTime, onBirthTimeChange, birthDate, onBirthDateChange, setHoverInfo }) {
  const [hovered, setHovered] = useState(null)
  const [lockedPoint, setLockedPoint] = useState(null)

  const wheelData = setupWheelData(placements, houseCusps, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG)
  if (!wheelData) return null

  const { cx, cy, polarToXY, arc, rows, ascLong, houseTotal } = wheelData
  const getInterp = pName => getWheelInterpretation(pName, placements, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG)

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

  useEffect(() => {
    if (setHoverInfo) setHoverInfo(infoContent)
  }, [lockedPoint, hovered, setHoverInfo])

  return (
    <>
      <WheelDisplay
        size={size}
        style={style}
        containerStyle={containerStyle}
        cx={cx}
        cy={cy}
        placements={placements}
        ascLong={ascLong}
        polarToXY={polarToXY}
        arc={arc}
        rows={rows}
        hovered={hovered}
        setHovered={setHovered}
        lockedPoint={lockedPoint}
        setLockedPoint={setLockedPoint}
        birthTime={birthTime}
        onBirthTimeChange={onBirthTimeChange}
        birthDate={birthDate}
        onBirthDateChange={onBirthDateChange}
        houseCusps={houseCusps}
        getInterpretation={getInterp}
        houseTotal={houseTotal}
      />
      {infoContent && <div style={{ marginTop: '8px' }}>{infoContent}</div>}
    </>
  )
}
