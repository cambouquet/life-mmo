export function createScrubberHandler(scrubberBarRef, history, setSelectedIndex) {
  return (e) => {
    e.preventDefault()

    const handleMove = (moveE) => {
      if (!scrubberBarRef.current) return
      const rect = scrubberBarRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width, moveE.clientX - rect.left))
      const percent = x / rect.width
      const newIdx = Math.round(percent * (history.length - 1))
      setSelectedIndex(newIdx)
    }

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleUp)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }
}
