import React, { useState, useEffect, useRef } from 'react'
import { StateTimeline } from './StateTimeline'
import { StateDisplay } from './StateDisplay'

export function StateTab({ history, setHistory, selectedIndex, setSelectedIndex }) {
  const [screenDebug, setScreenDebug] = useState(null)
  const [modalInfo, setModalInfo] = useState(null)
  const timelineRef = useRef(null)
  const panelRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.__screenDebug) {
        setScreenDebug(window.__screenDebug)
      }

      const modal = document.querySelector('.char-editor-modal')
      if (modal) {
        setModalInfo({
          scrollLeft: modal.scrollLeft,
          clientWidth: modal.clientWidth,
          scrollWidth: modal.scrollWidth,
          offsetHeight: modal.offsetHeight,
        })
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (timelineRef.current && selectedIndex >= 0) {
      const dots = timelineRef.current.querySelectorAll('[data-snapshot]')
      const selectedDot = dots[selectedIndex]
      if (selectedDot) {
        selectedDot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [selectedIndex])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!panelRef.current || !panelRef.current.contains(document.activeElement)) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(history.length - 1, prev + 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [history.length])

  if (!screenDebug && history.length === 0) {
    return (
      <div className="debug-data-field">
        <div className="debug-data-label">—</div>
      </div>
    )
  }

  const currentEntry = selectedIndex >= 0 && history[selectedIndex]
  const displayData = currentEntry ? currentEntry.parsed : screenDebug
  const { actions, ...stateData } = displayData || {}
  const debugText = JSON.stringify(stateData, null, 2)

  return (
    <div
      ref={panelRef}
      className="debug-data-field"
      style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'auto', height: '100%' }}
      tabIndex={0}
    >
      <StateTimeline
        history={history}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        currentEntry={currentEntry}
        timelineRef={timelineRef}
        isDragging={isDragging}
      />

      <StateDisplay stateData={stateData} debugText={debugText} modalInfo={modalInfo} />
    </div>
  )
}
