import { useEffect }        from 'react'
import { generateHoroscope } from '../../game/horoscope.jsx'

// Generated once per session (same result for the whole day)
const { zodiac, cosmic, guidance, lucky } = generateHoroscope()

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function HoroscopeModal({ onClose }) {
  // Close on Shift or Escape
  useEffect(() => {
    const handler = e => {
      if (e.code === 'Escape' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const now     = new Date()
  const dateStr = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal__header">
          <span className="modal__zodiac">{zodiac.symbol}</span>
          <div>
            <div className="modal__title">The Stars Speak</div>
            <div className="modal__subtitle">{dateStr} &middot; {zodiac.name}</div>
          </div>
          <span className="modal__zodiac">{zodiac.symbol}</span>
        </div>

        <div className="modal__body">
          <div className="modal__section">
            <div className="modal__label">Cosmic Weather</div>
            <div className="modal__text">{cosmic}</div>
          </div>

          <div className="modal__section">
            <div className="modal__label">Guidance</div>
            <div className="modal__text">{guidance}</div>
          </div>

          <div className="modal__section">
            <div className="modal__label">Lucky {lucky.element}</div>
            <div className="modal__text modal__lucky-value">{lucky.value}</div>
          </div>
        </div>

        <div className="modal__footer">
          <button className="modal__close" onClick={onClose}>
            Close &mdash; Shift / Esc
          </button>
        </div>

      </div>
    </div>
  )
}
