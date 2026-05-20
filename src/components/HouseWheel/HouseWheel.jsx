import React, { useState, useEffect } from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { ELEMENT_COLOR, PLANET_GLYPHS, PLANET_NAMES, PLANET_ORDER } from '../HoroscopeModal/astroConstants.js'
import { createWheelGeometry } from './wheelGeometry.js'
import { WheelInfoPanel } from './WheelInfoPanel.jsx'
import { SIGN_NAMES, PLANET_RINGS, HOUSE_THEMES, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG, PLANET_SUMMARY } from './houseWheelData.js'
import { WHEEL_RADIUS, computeHouseTally } from './houseWheelGeometry.js'

export { HOUSE_THEMES }

// ── Main component ────────────────────────────────────────────────────────────
// Props:
//   placements — object from enrichPlacements() (has .longitude, .sign, .degrees, .house)
//   houseCusps — array[12] of ecliptic longitudes from getPlacidusHouses()
//   size       — optional SVG size in px (default 300)
export function HouseWheelWithInfo({ onHoverInfoChange, ...props }) {
  const [localHoverInfo, setLocalHoverInfo] = useState(null)

  useEffect(() => {
    onHoverInfoChange?.(localHoverInfo)
  }, [localHoverInfo, onHoverInfoChange])

  return <HouseWheel {...props} setHoverInfo={setLocalHoverInfo} />
}

export function HouseWheel({ placements, houseCusps, size = 300, hideStellium, style, containerStyle, birthTime, onBirthTimeChange, birthDate, onBirthDateChange, setHoverInfo }) {
  const [hovered,     setHovered]     = useState(null)
  const [lockedPoint, setLockedPoint] = useState(null)

  useEffect(() => {
    if (setHoverInfo) setHoverInfo(infoContent)
  }, [lockedPoint, hovered, setHoverInfo])

  if (!placements) return null

  const { cx, cy, BASE_R, HOUSE_R1, HOUSE_R2, SIGN_R1, SIGN_R2, TIME_H_R1, TIME_H_R2, TIME_M_R1, TIME_M_R2, DATE_M_R1, DATE_M_R2, DATE_D_R1, DATE_D_R2, DATE_Y_R1, DATE_Y_R2, INNER_R, GAP_DEG } = WHEEL_RADIUS
  const { polarToXY, arc } = createWheelGeometry(cx, cy)

  const rows = PLANET_ORDER.filter(p => placements[p])
  const ascLong = houseCusps ? houseCusps[0] : 0
  const { houseTally, houseTotal, maxHouseCount, maxHouseEl } = computeHouseTally(placements, PLANET_ORDER, SIGN_META)


  const infoContent = <WheelInfoPanel
    lockedPoint={lockedPoint}
    hovered={hovered}
    placements={placements}
    HOUSE_THEMES={HOUSE_THEMES}
    HOUSE_NAMES={HOUSE_NAMES}
    HOUSE_LONG={HOUSE_LONG}
    SIGN_DESC_LONG={SIGN_DESC_LONG}
    PLANET_SUMMARY={PLANET_SUMMARY}
  />

  return (
    <>
    <div className="house-wheel-container" style={{
      position: 'relative',
      padding: '4px 0 0',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
      ...containerStyle,
    }}>
      <svg width={size} height={size} viewBox="0 0 300 300"
           style={{ display:'block', margin:'0 auto', overflow:'visible', ...style }}>
        <defs>
          <filter id="glow-wheel" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* orbit guide tracks */}
        {ORBITS.map(o => (
          <circle key={o.id} cx={cx} cy={cy} r={o.r}
            fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        ))}

        {/* centre deco */}
        <circle cx={cx} cy={cy} r="30"
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5" strokeDasharray="2,2" />
        <circle cx={cx} cy={cy} r="4" fill="rgba(255,255,255,0.15)" />

        {/* sign ring */}
        {SIGN_NAMES.map((signName, sigIdx) => {
          const signCol  = ELEMENT_COLOR[SIGN_META[signName]?.element] ?? '#fff'
          const sStart   = (((sigIdx * 30) - ascLong + 360) % 360) + GAP_DEG / 2
          const sEnd     = sStart + 30 - GAP_DEG
          const sMid     = sStart + 15
          const [sx, sy] = polarToXY(sMid, (SIGN_R1 + SIGN_R2) / 2)
          const isHov    = hovered?.type === 'sign' && hovered.id === signName
          const signPlanets = rows.filter(pn => placements[pn]?.sign === signName)
          return (
            <g key={signName}
               onMouseEnter={() => setHovered({ type:'sign', id:signName, label:signName, desc:SIGN_DESC_LONG[signName], color:signCol, planets:signPlanets })}
               onMouseLeave={() => setHovered(null)}
               style={{ cursor:'default' }}>
              <path d={arc(sStart, sEnd, SIGN_R1, SIGN_R2)}
                fill={isHov ? `${signCol}66` : `${signCol}33`}
                stroke={isHov ? `${signCol}ff` : `${signCol}66`}
                strokeWidth={isHov ? '1.5' : '1.2'}
                strokeMiterlimit="2"
 />
              <text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle"
                fontSize="6.5" fill="rgba(255,255,255,0.9)" fontWeight="800">
                {signName}
              </text>
            </g>
          )
        })}

        {/* time picker rings */}
        {birthTime && onBirthTimeChange && (
          <>
            {/* Hour ring (12 segments) */}
            {Array.from({length:12}, (_,i) => {
              const hour = i === 0 ? 12 : i
              const startDeg = i * 30
              const endDeg = (i + 1) * 30
              const isSelected = hour === birthTime.hour
              const [hx, hy] = polarToXY(startDeg + 15, (TIME_H_R1 + TIME_H_R2) / 2)
              return (
                <g key={`hour-${i}`}
                   onClick={() => onBirthTimeChange({ hour, minute: birthTime.minute })}
                   style={{ cursor:'pointer' }}>
                  <path d={arc(startDeg, endDeg, TIME_H_R1, TIME_H_R2)}
                    fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
                    stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'}
                    strokeWidth="0.8" />
                  <text x={hx} y={hy} textAnchor="middle" dominantBaseline="middle"
                    fontSize="6" fontWeight={isSelected ? '700' : '500'}
                    fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}>
                    {hour}
                  </text>
                </g>
              )
            })}

            {/* Minute ring (12 segments, each = 5 min) */}
            {Array.from({length:12}, (_,i) => {
              const minute = i * 5
              const startDeg = i * 30
              const endDeg = (i + 1) * 30
              const isSelected = minute === birthTime.minute
              const [mx, my] = polarToXY(startDeg + 15, (TIME_M_R1 + TIME_M_R2) / 2)
              return (
                <g key={`min-${i}`}
                   onClick={() => onBirthTimeChange({ hour: birthTime.hour, minute })}
                   style={{ cursor:'pointer' }}>
                  <path d={arc(startDeg, endDeg, TIME_M_R1, TIME_M_R2)}
                    fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
                    stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'}
                    strokeWidth="0.8" />
                  {i % 3 === 0 && (
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                      fontSize="5" fontWeight={isSelected ? '700' : '500'}
                      fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}>
                      {String(minute).padStart(2, '0')}
                    </text>
                  )}
                </g>
              )
            })}
          </>
        )}

        {/* date picker rings */}
        {birthDate && onBirthDateChange && (
          <>
            {/* Month ring (12 segments) */}
            {Array.from({length:12}, (_,i) => {
              const month = i + 1
              const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
              const startDeg = i * 30
              const endDeg = (i + 1) * 30
              const isSelected = month === birthDate.month
              const [mx, my] = polarToXY(startDeg + 15, (DATE_M_R1 + DATE_M_R2) / 2)
              return (
                <g key={`month-${i}`}
                   onClick={() => onBirthDateChange({ ...birthDate, month })}
                   style={{ cursor:'pointer' }}>
                  <path d={arc(startDeg, endDeg, DATE_M_R1, DATE_M_R2)}
                    fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
                    stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'}
                    strokeWidth="0.8" />
                  <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                    fontSize="5" fontWeight={isSelected ? '700' : '500'}
                    fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}>
                    {MONTHS[i]}
                  </text>
                </g>
              )
            })}

            {/* Day ring (31 segments) */}
            {Array.from({length:31}, (_,i) => {
              const day = i + 1
              const startDeg = (i / 31) * 360
              const endDeg = ((i + 1) / 31) * 360
              const isSelected = day === birthDate.day
              const [dx, dy] = polarToXY(startDeg + 5.8, (DATE_D_R1 + DATE_D_R2) / 2)
              return (
                <g key={`day-${i}`}
                   onClick={() => onBirthDateChange({ ...birthDate, day })}
                   style={{ cursor:'pointer' }}>
                  <path d={arc(startDeg, endDeg, DATE_D_R1, DATE_D_R2)}
                    fill={isSelected ? 'rgba(168,85,247,0.2)' : 'rgba(168,85,247,0.05)'}
                    stroke={isSelected ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.2)'}
                    strokeWidth="0.6" />
                  {day % 5 === 1 && (
                    <text x={dx} y={dy} textAnchor="middle" dominantBaseline="middle"
                      fontSize="4" fontWeight={isSelected ? '700' : '500'}
                      fill={isSelected ? '#c084fc' : 'rgba(200,168,240,0.6)'}>
                      {day}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Year ring (labeled span) */}
            {(() => {
              const startDeg = 0
              const endDeg = 360
              const [yx, yy] = polarToXY(90, (DATE_Y_R1 + DATE_Y_R2) / 2)
              return (
                <g onClick={() => {/* year selector could be interactive */}}
                   style={{ cursor:'default' }}>
                  <path d={arc(startDeg, endDeg, DATE_Y_R1, DATE_Y_R2)}
                    fill="rgba(168,85,247,0.05)"
                    stroke="rgba(168,85,247,0.2)"
                    strokeWidth="0.8" />
                  <text x={yx} y={yy} textAnchor="middle" dominantBaseline="middle"
                    fontSize="6" fontWeight="600"
                    fill="rgba(200,168,240,0.7)">
                    {birthDate.year}
                  </text>
                </g>
              )
            })()}
          </>
        )}

        {/* house slices */}
        {Array.from({length:12}, (_,i) => {
          const h = i + 1
          const hStartRaw = houseCusps && !isNaN(houseCusps[i])         ? houseCusps[i]                  - ascLong : i * 30
          const hEndRaw   = houseCusps && !isNaN(houseCusps[i===11?0:i+1]) ? houseCusps[i===11?0:i+1] - ascLong : (i+1) * 30
          const startDeg  = ((hStartRaw + 360) % 360) + GAP_DEG / 2
          const endDeg    = ((hEndRaw < hStartRaw ? hEndRaw + 360 : hEndRaw) % 720) - GAP_DEG / 2
          const midDeg    = (startDeg + (endDeg < startDeg ? endDeg + 360 : endDeg)) / 2
          const n         = houseTotal(h)
          const housePlanets = rows.filter(pn => placements[pn]?.house === h)
          const isHov     = hovered?.type === 'house' && hovered.id === h

          return (
            <g key={h}
               onMouseEnter={() => setHovered({ type:'house', id:h, label:`House ${h}`, theme:HOUSE_THEMES[h], desc:HOUSE_LONG[h], planets:housePlanets })}
               onMouseLeave={() => setHovered(null)}
               style={{ cursor:'default' }}>

              <path d={arc(startDeg, endDeg, INNER_R, BASE_R)}
                fill={isHov ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)'}
                stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

              <path d={arc(startDeg, endDeg, HOUSE_R1, HOUSE_R2)}
                fill={isHov ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}
                stroke={isHov ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)'}
                strokeWidth="1.2" />

              {housePlanets.map(pName => {
                const pd   = placements[pName]
                const col  = ELEMENT_COLOR[SIGN_META[pd.sign]?.element] ?? '#fff'
                const ringR = PLANET_RINGS[pName] || 50
                const pDeg  = (pd.longitude - ascLong + 360) % 360
                const [px, py] = polarToXY(pDeg, ringR)
                const isPHov = hovered?.type === 'planet' && hovered.id === pName
                const isPLocked = lockedPoint === pName
                const isHighlighted = (hovered?.type === 'house' && hovered.id === h) || (hovered?.type === 'sign' && hovered.planets?.includes(pName))
                return (
                  <g key={pName}
                     onMouseEnter={e => {
                       e.stopPropagation();
                       setHovered({
                         type:'planet',
                         id:pName,
                         label:PLANET_NAMES[pName] ?? pName,
                         summary:PLANET_SUMMARY[pName],
                         glyph:PLANET_GLYPHS[pName],
                         color:col,
                         desc: getInterpretation(pName)
                       })
                     }}
                     onMouseLeave={() => setHovered(null)}
                     onClick={e => { e.stopPropagation(); setLockedPoint(lockedPoint === pName ? null : pName) }}
                     style={{ cursor:'pointer' }}>
                    <circle cx={px} cy={py} r={isPHov || isPLocked ? 7 : isHighlighted ? 6 : 5}
                      fill={`${col}${isPHov || isPLocked ? '33' : isHighlighted ? '25' : '15'}`}
                      stroke={`${col}${isPHov || isPLocked ? '66' : isHighlighted ? '55' : '33'}`}
                      strokeWidth={isPHov || isPLocked ? '1.5' : isHighlighted ? '1.2' : '0.5'} />
                    <text x={px} y={py} textAnchor="middle" dominantBaseline="middle"
                      fontSize={isPHov ? 10 : 8} fill={col} fontWeight="900" style={{ pointerEvents:'none' }}>
                      {PLANET_GLYPHS[pName]}
                    </text>
                  </g>
                )
              })}

              {(() => {
                const [hx, hy] = polarToXY(midDeg, (HOUSE_R1 + HOUSE_R2) / 2)
                return (
                  <text x={hx} y={hy} textAnchor="middle" dominantBaseline="middle"
                    fontSize="7" fontFamily="monospace" fontWeight="800"
                    fill={n > 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'}>
                    {h}
                  </text>
                )
              })()}

              {h === 1 && (() => {
                const [mx, my] = polarToXY(0, SIGN_R2 + 4)
                return <circle cx={mx} cy={my} r="2.5" fill="rgba(255,255,255,0.5)" />
              })()}
            </g>
          )
        })}

        <circle cx={cx} cy={cy} r="10" fill="#0e0a1e" />
      </svg>
    </div>
    {infoContent && <div style={{ marginTop: '8px' }}>{infoContent}</div>}
    </>
  )
}
