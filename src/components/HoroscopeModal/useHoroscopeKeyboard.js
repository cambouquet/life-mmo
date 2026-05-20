import { useEffect } from 'react'

export function useHoroscopeKeyboard(scrollRef, setMode, onClose) {
  useEffect(() => {
    const handler = e => {
      if (e.code === 'Escape') onClose()
      if (e.code === 'F1') setMode(m => (m === 'debug' ? 'reading' : 'debug'))
      if (e.code === 'KeyC' && e.altKey) setMode(m => (m === 'chart' ? 'reading' : 'chart'))

      if (scrollRef.current && (e.code === 'ArrowDown' || e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyS')) {
        const isUp = e.code === 'ArrowUp' || e.code === 'KeyW'
        const amount = isUp ? -40 : 40
        scrollRef.current.scrollBy({ top: amount, behavior: 'auto' })
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, setMode, scrollRef])
}
