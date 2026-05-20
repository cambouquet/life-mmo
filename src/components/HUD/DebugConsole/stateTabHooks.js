import { useEffect } from 'react'

export function useScreenDebugPolling(setScreenDebug, setModalInfo) {
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
  }, [setScreenDebug, setModalInfo])
}

export function useTimelineScroll(timelineRef, selectedIndex) {
  useEffect(() => {
    if (timelineRef.current && selectedIndex >= 0) {
      const dots = timelineRef.current.querySelectorAll('[data-snapshot]')
      const selectedDot = dots[selectedIndex]
      if (selectedDot) {
        selectedDot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [selectedIndex])
}

export function useArrowKeyNavigation(panelRef, history, setSelectedIndex) {
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
  }, [history.length, panelRef, setSelectedIndex])
}
