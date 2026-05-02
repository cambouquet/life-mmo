import React, { useState, useEffect, useRef } from 'react'
import './DebugConsole.scss'

const CATEGORIES = ['log', 'warn', 'error', 'action']

const LS_COLORS  = 'life-mmo-colors-v3'
const LS_BIRTH   = 'life-mmo-birth'
const LS_NAME    = 'life-mmo-name'
const LS_SLOT    = (n) => `life-mmo-slot-${n}`
const NUM_SLOTS  = 3

function readLS(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null }
}

function SaveSlots({ getSaveData, onLoad }) {
  const [slots, setSlots] = useState(() =>
    Array.from({ length: NUM_SLOTS }, (_, i) => readLS(LS_SLOT(i)))
  )

  const handleSave = (i) => {
    const data = getSaveData?.()
    if (!data) return
    localStorage.setItem(LS_SLOT(i), JSON.stringify(data))
    setSlots(prev => { const next = [...prev]; next[i] = data; return next })
  }

  const handleLoad = (i) => {
    const slot = slots[i]
    if (!slot) return
    onLoad?.(slot)
  }

  const handleClear = (i) => {
    localStorage.removeItem(LS_SLOT(i))
    setSlots(prev => { const next = [...prev]; next[i] = null; return next })
  }

  return (
    <div className="debug-data-field">
      <div className="debug-data-label">save slots</div>
      <div className="debug-slots">
        {Array.from({ length: NUM_SLOTS }, (_, i) => {
          const slot = slots[i]
          return (
            <div key={i} className="debug-slot">
              <div className="debug-slot-info">
                <span className="debug-slot-num">{i + 1}</span>
                {slot ? (
                  <>
                    <span className="debug-slot-name">{slot.name ?? '(unnamed)'}</span>
                    {slot.savedAt && <span className="debug-slot-date">{new Date(slot.savedAt).toLocaleString([], { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}</span>}
                  </>
                ) : (
                  <span className="debug-slot-empty">empty</span>
                )}
              </div>
              <div className="debug-slot-actions">
                <button className="debug-slot-btn debug-slot-btn--save" onClick={() => handleSave(i)}>save</button>
                <button className="debug-slot-btn debug-slot-btn--load" onClick={() => handleLoad(i)} disabled={!slot}>load</button>
                <button className="debug-slot-btn debug-slot-btn--clear" onClick={() => handleClear(i)} disabled={!slot}>×</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DataTab({ onReset, getSaveData, onLoad }) {
  const [data, setData] = useState({ name: null, colors: null, birth: null })
  const [editColors, setEditColors] = useState('')
  const [editBirth,  setEditBirth]  = useState('')
  const [editName,   setEditName]   = useState('')

  const refresh = () => {
    const name   = readLS(LS_NAME)
    const colors = readLS(LS_COLORS)
    const birth  = readLS(LS_BIRTH)
    setData({ name, colors, birth })
    setEditName(name ?? '')
    setEditColors(colors ? JSON.stringify(colors, null, 2) : '')
    setEditBirth(birth  ? JSON.stringify(birth,  null, 2) : '')
  }

  useEffect(() => { refresh() }, [])

  const save = (key, raw, setter) => {
    try {
      const parsed = JSON.parse(raw)
      localStorage.setItem(key, JSON.stringify(parsed))
      setter(JSON.stringify(parsed, null, 2))
    } catch { /* invalid JSON — ignore */ }
  }

  const saveName = () => {
    const trimmed = editName.trim()
    if (trimmed) localStorage.setItem(LS_NAME, JSON.stringify(trimmed))
    else localStorage.removeItem(LS_NAME)
  }

  const handleReset = () => {
    localStorage.removeItem(LS_NAME)
    localStorage.removeItem(LS_COLORS)
    localStorage.removeItem(LS_BIRTH)
    refresh()
    onReset?.()
  }

  return (
    <div className="debug-data">
      <SaveSlots getSaveData={getSaveData} onLoad={onLoad} />

      <div className="debug-data-field">
        <div className="debug-data-label">name</div>
        <div className="debug-data-row">
          <input
            className="debug-data-input"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="(not set)"
          />
          <button className="debug-data-save" onClick={saveName}>save</button>
        </div>
      </div>

      <div className="debug-data-field">
        <div className="debug-data-label">colors</div>
        <textarea
          className="debug-data-textarea"
          value={editColors}
          onChange={e => setEditColors(e.target.value)}
          rows={7}
          spellCheck={false}
        />
        <button className="debug-data-save" onClick={() => save(LS_COLORS, editColors, setEditColors)}>save</button>
      </div>

      <div className="debug-data-field">
        <div className="debug-data-label">birth</div>
        <textarea
          className="debug-data-textarea"
          value={editBirth}
          onChange={e => setEditBirth(e.target.value)}
          rows={7}
          spellCheck={false}
        />
        <button className="debug-data-save" onClick={() => save(LS_BIRTH, editBirth, setEditBirth)}>save</button>
      </div>

      <button className="debug-reset" onClick={handleReset}>restart game</button>
    </div>
  )
}

export default function DebugConsole({ onReset, getSaveData, onLoad }) {
  const [isOpen,   setIsOpen]   = useState(false)
  const [tab,      setTab]      = useState('logs')
  const [logs,     setLogs]     = useState([])
  const [hidden,   setHidden]   = useState(new Set())
  const [height,   setHeight]   = useState(380)
  const scrollRef = useRef(null)
  const panelRef  = useRef(null)
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest('.debug-toggle')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

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
      setTimeout(() => {
        setLogs(prev => {
          const newLog = { type, message, ts, id: `${performance.now()}-${Math.random()}` }
          return [...prev, newLog].slice(-200)
        })
      }, 0)
    }

    console.log    = (...a) => { orig.log(...a);   if (typeof a[0] === 'string' && a[0].includes('Encountered two children with the same key')) return; addLog('log', a) }
    console.error  = (...a) => { orig.error(...a); if (typeof a[0] === 'string' && a[0].includes('Encountered two children with the same key')) return; addLog('error', a) }
    console.warn   = (...a) => { orig.warn(...a);  if (typeof a[0] === 'string' && a[0].includes('Encountered two children with the same key')) return; addLog('warn', a) }
    console.action = (...a) => { orig.log(...a); addLog('action', a) }

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
    if (isOpen && tab === 'logs' && scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [logs, isOpen, tab])

  const toggleCategory = cat => {
    setHidden(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  const visible = logs.filter(l => !hidden.has(l.type))

  const handleKeyDown = (e) => {
    if (!scrollRef.current) return
    const step = 40
    if (e.key === 'ArrowUp') { scrollRef.current.scrollTop -= step; e.preventDefault() }
    else if (e.key === 'ArrowDown') { scrollRef.current.scrollTop += step; e.preventDefault() }
  }

  return (
    <div className="debug-container" style={{ '--debug-height': `${height}px` }}>
      {isOpen && (
        <div ref={panelRef} className="debug-panel" tabIndex={0} onKeyDown={handleKeyDown}>
          <div
            className="debug-resize-handle"
            onMouseDown={(e) => {
              e.preventDefault()
              isResizingRef.current = true
              document.body.style.cursor = 'ns-resize'
              document.body.style.userSelect = 'none'
            }}
          />
          <div className="debug-header">
            <div className="debug-tabs">
              <button className={`debug-tab ${tab === 'logs' ? 'debug-tab--active' : ''}`} onClick={() => setTab('logs')}>logs</button>
              <button className={`debug-tab ${tab === 'data' ? 'debug-tab--active' : ''}`} onClick={() => setTab('data')}>data</button>
            </div>
            {tab === 'logs' && (
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
            )}
          </div>

          {tab === 'logs' ? (
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
                      onClick={() => navigator.clipboard.writeText(log.message)}
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
          ) : (
            <DataTab onReset={onReset} getSaveData={getSaveData} onLoad={onLoad} />
          )}
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
