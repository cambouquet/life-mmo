import { useEffect } from 'react'

export function useGraphKeyboard(panelRef, nodesLength, setSelectedIndex) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!panelRef.current || !panelRef.current.contains(document.activeElement)) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(0, prev - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(nodesLength - 1, prev + 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodesLength, setSelectedIndex, panelRef])
}
