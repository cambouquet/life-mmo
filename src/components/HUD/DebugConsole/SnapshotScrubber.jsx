import { useRef } from 'react'

export function SnapshotScrubber({ history, selectedIndex, setSelectedIndex, isDragging }) {
  const scrubberBarRef = useRef(null)

  const handleScrubberMouseDown = (e) => {
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

  return (
    <div
      ref={scrubberBarRef}
      style={{
        height: '4px',
        background: 'rgba(168, 85, 247, 0.1)',
        borderRadius: '2px',
        position: 'relative',
        cursor: 'pointer',
        marginBottom: '2px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          height: '100%',
          background: 'rgba(192, 132, 252, 0.4)',
          borderRadius: '2px',
          width: `${((selectedIndex + 1) / history.length) * 100}%`,
          transition: isDragging ? 'none' : 'width 0.12s',
        }}
      />
      <div
        onMouseDown={handleScrubberMouseDown}
        style={{
          position: 'absolute',
          width: '8px',
          height: '10px',
          background: 'rgba(192, 132, 252, 0.8)',
          borderRadius: '1px',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          left: `${((selectedIndex + 1) / history.length) * 100}%`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'left 0.12s',
        }}
      />
    </div>
  )
}
