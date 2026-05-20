import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { ELEMENT_COLOR } from '../HoroscopeModal/astroConstants.js'
import { SIGN_NAMES, SIGN_DESC_LONG } from './houseWheelData.js'
import { WHEEL_RADIUS } from './houseWheelGeometry.js'

export function SignRing({ placements, ascLong, polarToXY, arc, rows, hovered, setHovered }) {
  const { SIGN_R1, SIGN_R2, GAP_DEG } = WHEEL_RADIUS

  return (
    <>
      {SIGN_NAMES.map((signName, sigIdx) => {
        const signCol = ELEMENT_COLOR[SIGN_META[signName]?.element] ?? '#fff'
        const sStart = (((sigIdx * 30) - ascLong + 360) % 360) + GAP_DEG / 2
        const sEnd = sStart + 30 - GAP_DEG
        const sMid = sStart + 15
        const [sx, sy] = polarToXY(sMid, (SIGN_R1 + SIGN_R2) / 2)
        const isHov = hovered?.type === 'sign' && hovered.id === signName
        const signPlanets = rows.filter(pn => placements[pn]?.sign === signName)

        return (
          <g
            key={signName}
            onMouseEnter={() =>
              setHovered({
                type: 'sign',
                id: signName,
                label: signName,
                desc: SIGN_DESC_LONG[signName],
                color: signCol,
                planets: signPlanets,
              })
            }
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'default' }}
          >
            <path
              d={arc(sStart, sEnd, SIGN_R1, SIGN_R2)}
              fill={isHov ? `${signCol}66` : `${signCol}33`}
              stroke={isHov ? `${signCol}ff` : `${signCol}66`}
              strokeWidth={isHov ? '1.5' : '1.2'}
              strokeMiterlimit="2"
            />
            <text
              x={sx}
              y={sy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="6.5"
              fill="rgba(255,255,255,0.9)"
              fontWeight="800"
            >
              {signName}
            </text>
          </g>
        )
      })}
    </>
  )
}
