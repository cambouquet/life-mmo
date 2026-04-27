import React, { useState, useEffect, useRef } from 'react'
import './DebugConsole.scss'

const CATEGORIES = ['log', 'warn', 'error', 'action']

export default function DebugConsole() {
  const [isOpen,   setIsOpen]   = useState(false)
  const [logs,     setLogs]     = useState([])
  const [hidden,   setHidden]   = useState(new Set())   // categories currently filtered out
  const scrollRef = useRef(null)

  useEffect(() => {
    const orig = {
      log:   console.log,
      error: console.error,
      warn:  console.warn,
    }

    const addLog = (type, args) => {
      const message = args.map(a =>
        typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
      ).join(' ')
      const now = new Date()
      const ts  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}.${String(now.getMilliseconds()).padStart(3,'0')}`
      setLogs(prev => [...prev, { type, message, ts, id: Date.now() + Math.random() }].slice(-200))
    }

    console.log    = (...a) => { orig.log(...a);   addLog('log',    a) }
    console.error  = (...a) => { orig.error(...a); addLog('error',  a) }
    console.warn   = (...a) => { orig.warn(...a);  addLog('warn',   a) }
    console.action = (...a) => { orig.log(...a);   addLog('action', a) }

    const onError = (event) => {
      const msg = event.message || String(event)
      const src = event.filename ? ` (${event.filename}:${event.lineno})` : ''
      addLog('error', [`[window.onerror] ${msg}${src}`])
    }
    const onUnhandled = (event) => {
      const reason = event.reason?.message ?? event.reason ?? 'Unhandled rejection'
      addLog('error', [`[unhandledrejection] ${reason}`])
    }
    const onSecurityPolicy = (event) => {
      addLog('error', [`[CSP/blocked] ${event.blockedURI} — ${event.violatedDirective}`])
    }

    window.addEventListener('error',               onError)
    window.addEventListener('unhandledrejection',  onUnhandled)
    document.addEventListener('securitypolicyviolation', onSecurityPolicy)

    return () => {
      console.log    = orig.log
      console.error  = orig.error
      console.warn   = orig.warn
      delete console.action
      window.removeEventListener('error',              onError)
      window.removeEventListener('unhandledrejection', onUnhandled)
      document.removeEventListener('securitypolicyviolation', onSecurityPolicy)
    }
  }, [])

  useEffect(() => {
    if (isOpen && scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [logs, isOpen])

  const toggleCategory = cat => {
    setHidden(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  const visible = logs.filter(l => !hidden.has(l.type))

  const handleKeyDown = (e) => {
    if (!scrollRef.current) return;
    const step = 40; // pixels to scroll per key press
    if (e.key === 'ArrowUp') {
      scrollRef.current.scrollTop -= step;
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      scrollRef.current.scrollTop += step;
      e.preventDefault();
    }
  }

  return (
    <div className="debug-container">
      {isOpen && (
        <div 
          className="debug-panel" 
          tabIndex={0} 
          onKeyDown={handleKeyDown}
        >
          <div className="debug-header">
            <span>Debug</span>
            <div className="debug-filters">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`debug-filter debug-filter--${cat} ${hidden.has(cat) ? 'debug-filter--off' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
              <button className="debug-clear" onClick={() => setLogs([])}>clear</button>
            </div>
          </div>
          <div className="debug-logs" ref={scrollRef}>
            {visible.length === 0 && <div className="debug-empty">No logs.</div>}
            {visible.map(log => (
              <div key={log.id} className={`debug-log debug-log--${log.type}`}>
                <span className="debug-log-ts">{log.ts}</span>
                <div className="debug-log-content">
                  <span className="debug-log-msg">{log.message}</span>
                  <button 
                    className="debug-log-copy" 
                    title="Copy to clipboard"
                    onClick={() => {
                      navigator.clipboard.writeText(log.message);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        className={`debug-toggle ${isOpen ? 'debug-toggle--open' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        title="Toggle Debug Console"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="14" x="8" y="6" rx="4" />
          <path d="m19 7-3 2" /><path d="m5 7 3 2" />
          <path d="m19 19-3-2" /><path d="m5 19 3-2" />
          <path d="M20 13h-4" /><path d="M4 13h4" />
          <path d="m10 4 1 2" /><path d="m14 4-1 2" />
        </svg>
      </button>
    </div>
  )
}
