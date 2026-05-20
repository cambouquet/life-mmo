import React, { useState, useRef } from 'react'
import { StateTimeline } from './StateTimeline'
import { StateDisplay } from './StateDisplay'
import { useScreenDebugPolling, useTimelineScroll, useArrowKeyNavigation } from './stateTabHooks.js'

export function StateTab({ history, selectedIndex, setSelectedIndex }) {
  const [screenDebug, setScreenDebug] = useState(null)
  const [modalInfo, setModalInfo] = useState(null)
  const timelineRef = useRef(null)
  const panelRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  useScreenDebugPolling(setScreenDebug, setModalInfo)
  useTimelineScroll(timelineRef, selectedIndex)
  useArrowKeyNavigation(panelRef, history, setSelectedIndex)

  if (!screenDebug && history.length === 0) {
    return <div className="debug-data-field"><div className="debug-data-label">—</div></div>
  }

  const currentEntry = selectedIndex >= 0 && history[selectedIndex]
  const displayData = currentEntry ? currentEntry.parsed : screenDebug
  const { actions, ...stateData } = displayData || {}
  const debugText = JSON.stringify(stateData, null, 2)

  return (
    <div ref={panelRef} className="debug-data-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'auto', height: '100%' }} tabIndex={0}>
      <StateTimeline history={history} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} currentEntry={currentEntry} timelineRef={timelineRef} isDragging={isDragging} />
      <StateDisplay stateData={stateData} debugText={debugText} modalInfo={modalInfo} />
    </div>
  )
}
