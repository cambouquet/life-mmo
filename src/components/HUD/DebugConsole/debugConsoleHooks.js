import { useState, useEffect, useRef } from 'react'
import { getDebugState, processHistoryEntry } from './stateHistoryHelpers'

export function useStateHistory(isOpen) {
  const [history, setHistory] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      if (window.__screenDebug) {
        const current = getDebugState()
        setHistory((prev) => {
          const final = processHistoryEntry(prev, current)
          setSelectedIndex(final.length - 1)
          return final
        })
      }
    }, 100)
    return () => clearInterval(interval)
  }, [isOpen])

  return { history, selectedIndex, setSelectedIndex }
}

export function useResizeHandle() {
  const [height, setHeight] = useState(380)
  const isResizingRef = useRef(false)

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizingRef.current) return
      const newHeight = window.innerHeight - e.clientY
      setHeight(Math.max(100, Math.min(newHeight, window.innerHeight * 0.9)))
    }
    const onMouseUp = () => {
      isResizingRef.current = false
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return { height, setHeight, isResizingRef }
}

export function useClickOutside(isOpen, setIsOpen, panelRef) {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest('.debug-toggle')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, setIsOpen, panelRef])
}
