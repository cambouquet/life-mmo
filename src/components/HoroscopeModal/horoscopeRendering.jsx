const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function getDateLabel(now) {
  return `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
}

export function renderHeader(zodiac, mode, dateLabel, transitStr, setTransitStr) {
  return (
    <div className="modal__header">
      <span className="modal__zodiac">{zodiac.symbol}</span>
      <div>
        <div className="modal__title">{require('./horoscopeData').MODE_TITLES[mode]}</div>
        <div className="modal__subtitle">
          {mode === 'debug' ? (
            <input type="date" value={transitStr} onChange={e => setTransitStr(e.target.value)} style={{ background: '#1a1030', color: '#c8a8f0', border: '1px solid #4a2878', padding: '2px 6px', fontSize: 11 }} />
          ) : (
            `${dateLabel} · ${zodiac.name}${zodiac.rising ? ` · ↑ ${zodiac.rising}` : ''}`
          )}
        </div>
      </div>
      <span className="modal__zodiac">{zodiac.symbol}</span>
    </div>
  )
}

export function renderFooter(mode, setMode, onClose) {
  return (
    <div className="modal__footer">
      {mode !== 'chart' && <button className="modal__close" onClick={() => setMode('chart')} style={{ marginRight: 8, opacity: 0.55 }}>Chart — Alt+C</button>}
      {mode !== 'reading' && <button className="modal__close" onClick={() => setMode('reading')} style={{ marginRight: 8, opacity: 0.55 }}>Reading</button>}
      {mode !== 'debug' && <button className="modal__close" onClick={() => setMode('debug')} style={{ marginRight: 8, opacity: 0.55 }}>Debug — F1</button>}
      <button className="modal__close" onClick={onClose}>Close — Esc</button>
    </div>
  )
}
