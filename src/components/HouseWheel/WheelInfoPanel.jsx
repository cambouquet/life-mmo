import React from 'react'
import { SIGN_META } from '../../game/astro/horoscope.js'
import { ELEMENT_COLOR, PLANET_GLYPHS, PLANET_NAMES } from '../HoroscopeModal/astroConstants.js'

export function WheelInfoPanel({ lockedPoint, hovered, placements, HOUSE_THEMES, HOUSE_NAMES, HOUSE_LONG, SIGN_DESC_LONG, PLANET_SUMMARY }) {
  if (!lockedPoint && !hovered) return null

  const getInterpretation = pName => {
    const pd = placements[pName]
    if (!pd) return ''
    const deg   = Math.floor(pd.degrees)
    const decan = deg <= 9 ? '1st decan' : deg <= 19 ? '2nd decan' : '3rd decan'
    const hName = HOUSE_NAMES[pd.house] ?? `House ${pd.house}`
    const hLong = HOUSE_LONG[pd.house] ?? ''
    const sLong = SIGN_DESC_LONG[pd.sign] ?? pd.sign
    return `${pName} in ${pd.sign} at ${deg}° (${decan}), ${hName}. ${sLong} ${hLong}`
  }

  const active = (hovered?.type === 'planet' && hovered.id === lockedPoint)
    ? { ...hovered, locked: true }
    : (hovered || {
        type: 'planet',
        id: lockedPoint,
        label: PLANET_NAMES[lockedPoint] ?? lockedPoint,
        glyph: PLANET_GLYPHS[lockedPoint],
        color: ELEMENT_COLOR[SIGN_META[placements[lockedPoint]?.sign]?.element] ?? '#fff',
        desc: getInterpretation(lockedPoint),
        summary: PLANET_SUMMARY[lockedPoint],
        locked: true
      })

  return (
    <div style={{ color:'#e8d4ff', fontFamily:'inherit', lineHeight:'1.6', width:'100%' }}>
      {active.type === 'planet' ? (<>
        <div style={{ color:active.color, fontWeight:700, fontSize:13 }}>{active.glyph} {active.label}{(active.locked || (lockedPoint === active.id)) && placements[active.id]?.sign ? (() => { const pd = placements[active.id]; const deg = Math.floor(pd.degrees); const theme = HOUSE_THEMES[pd.house]; return ` · ${pd.sign} ${deg}°${pd.house ? ` · H${pd.house}${theme ? ` (${theme})` : ''}` : ''}` })() : ''}</div>
        <div style={{ fontSize:11, color:'rgba(232,212,255,0.6)', fontStyle:'italic', marginBottom: (active.locked || lockedPoint === active.id) ? 4 : 0, lineHeight:'1.4' }}>{active.summary}</div>
        {(active.locked || lockedPoint === active.id) && <div style={{ fontSize:11, color:'rgba(232,212,255,0.8)', lineHeight:'1.5' }}>{active.desc}</div>}
      </>) : active.type === 'sign' ? (<>
        <div style={{ color:active.color, fontWeight:700, fontSize:13, marginBottom:4 }}>{active.label}</div>
        <div style={{ fontSize:11, color:'rgba(232,212,255,0.8)', lineHeight:'1.4', marginBottom:8 }}>{active.desc}</div>
        {active.planets && active.planets.length > 0 && (
          <div style={{ fontSize:10, color:'rgba(232,212,255,0.7)', marginTop:8, paddingTop:8, borderTop:'1px solid rgba(232,212,255,0.2)' }}>
            <div style={{ fontWeight:600, marginBottom:4 }}>Placements in {active.label}:</div>
            {active.planets.map(pName => {
              const pd = placements[pName]
              const col = ELEMENT_COLOR[SIGN_META[pd.sign]?.element] ?? '#fff'
              const deg = Math.floor(pd.degrees)
              const theme = HOUSE_THEMES[pd.house]
              return (
                <div key={pName} style={{ display:'flex', justifyContent:'space-between', paddingLeft:8, marginBottom:3 }}>
                  <span style={{ color:col }}>{PLANET_GLYPHS[pName]} {PLANET_NAMES[pName] ?? pName}</span>
                  <span style={{ color:'rgba(232,212,255,0.5)', fontSize:9 }}>H{pd.house}{theme ? ` (${theme})` : ''}</span>
                </div>
              )
            })}
          </div>
        )}
      </>) : (<>
        <div style={{ color:'#e8d4ff', fontWeight:700, fontSize:13, marginBottom:4 }}>{HOUSE_NAMES[active.id]}</div>
        <div style={{ fontSize:11, color:'rgba(232,212,255,0.8)', lineHeight:'1.4', marginBottom:8 }}>{active.desc}</div>
        {active.planets && active.planets.length > 0 && (
          <div style={{ fontSize:10, color:'rgba(232,212,255,0.7)', marginTop:8, paddingTop:8, borderTop:'1px solid rgba(232,212,255,0.2)' }}>
            <div style={{ fontWeight:600, marginBottom:4 }}>Placements in House {active.id}:</div>
            {active.planets.map(pName => {
              const pd = placements[pName]
              const col = ELEMENT_COLOR[SIGN_META[pd.sign]?.element] ?? '#fff'
              const deg = Math.floor(pd.degrees)
              return (
                <div key={pName} style={{ display:'flex', justifyContent:'space-between', paddingLeft:8, marginBottom:3 }}>
                  <span style={{ color:col }}>{PLANET_GLYPHS[pName]} {PLANET_NAMES[pName] ?? pName}</span>
                  <span style={{ color:'rgba(232,212,255,0.5)', fontSize:9 }}>{pd.sign} {deg}°</span>
                </div>
              )
            })}
          </div>
        )}
      </>)}
    </div>
  )
}
