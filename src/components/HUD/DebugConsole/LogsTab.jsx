import React from 'react'
import { CopyButton } from './CopyButton'

const CATEGORIES = ['log', 'warn', 'error', 'action']

export function LogsTab({ visible, hidden, toggleCategory, setLogs, scrollRef }) {
  return (
    <>
      <div className="debug-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`debug-filter debug-filter--${cat} ${hidden.has(cat) ? 'debug-filter--off' : ''}`}
            onClick={() => toggleCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <button className="debug-clear" onClick={() => setLogs([])}>
          clear
        </button>
      </div>

      <div className="debug-logs" ref={scrollRef}>
        {visible.length === 0 && <div className="debug-empty">No logs.</div>}
        {visible.map((log) => (
          <div key={log.id} className={`debug-log debug-log--${log.type}`}>
            <span className="debug-log-ts">{log.ts}</span>
            <span className="debug-log-msg">{log.message}</span>
            <CopyButton text={log.message} />
          </div>
        ))}
      </div>
    </>
  )
}
