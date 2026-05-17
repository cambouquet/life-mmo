import React, { useState, useEffect, useRef } from 'react'
import './DebugConsole.scss'
import { CopyButton } from './DebugConsole/CopyButton'
import { StateTab } from './DebugConsole/StateTab'
import { DataTab } from './DebugConsole/DataTab'
import { ActionsTab } from './DebugConsole/ActionsTab'
import { LogsTab } from './DebugConsole/LogsTab'
import { useConsoleInterception } from './DebugConsole/useConsoleInterception'
import { GraphTab } from './DebugConsole/GraphTab'

export default function DebugConsole({ onReset, getSaveData, onLoad }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState('logs')
  const [logs, setLogs] = useState([])
  const [hidden, setHidden] = useState(new Set())
  const [height, setHeight] = useState(380)
  const [history, setHistory] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const scrollRef = useRef(null)
  const panelRef = useRef(null)
  const isResizingRef = useRef(false)

  useConsoleInterception(setLogs)

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
    if (isOpen && tab === 'logs' && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [logs, isOpen, tab])

  const toggleCategory = (cat) => {
    setHidden((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  const visible = logs.filter((l) => !hidden.has(l.type))

  const handleKeyDown = (e) => {
    if (!scrollRef.current) return
    const step = 40
    if (e.key === 'ArrowUp') {
      scrollRef.current.scrollTop -= step
      e.preventDefault()
    } else if (e.key === 'ArrowDown') {
      scrollRef.current.scrollTop += step
      e.preventDefault()
    }
  }

  const copyAllText = (() => {
    const parts = []

    if (visible.length > 0) {
      parts.push('=== LOGS ===')
      parts.push(visible.map((l) => `[${l.ts}] ${l.type.toUpperCase()}: ${l.message}`).join('\n'))
    }

    if (history.length > 0) {
      const currentEntry = selectedIndex >= 0 ? history[selectedIndex] : history[history.length - 1]
      if (currentEntry) {
        parts.push('=== STATE ===')
        const { actions, ...stateData } = currentEntry.parsed || {}
        parts.push(JSON.stringify(stateData, null, 2))
      }
    }

    if (window.__screenDebug?.actions) {
      parts.push('=== ACTIONS ===')
      parts.push(Object.keys(window.__screenDebug.actions).join('\n'))
    }

    return parts.join('\n\n')
  })()

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
            <div className="debug-header-top debug-row">
              <div className="debug-tabs">
                <button
                  className={`debug-tab ${tab === 'logs' ? 'debug-tab--active' : ''}`}
                  onClick={() => setTab('logs')}
                >
                  logs
                </button>
                <button
                  className={`debug-tab ${tab === 'data' ? 'debug-tab--active' : ''}`}
                  onClick={() => setTab('data')}
                >
                  data
                </button>
                <button
                  className={`debug-tab ${tab === 'state' ? 'debug-tab--active' : ''}`}
                  onClick={() => setTab('state')}
                >
                  state
                </button>
                <button
                  className={`debug-tab ${tab === 'graph' ? 'debug-tab--active' : ''}`}
                  onClick={() => setTab('graph')}
                >
                  graph
                </button>
                <button
                  className={`debug-tab ${tab === 'actions' ? 'debug-tab--active' : ''}`}
                  onClick={() => setTab('actions')}
                >
                  actions
                </button>
              </div>
              <CopyButton text={copyAllText} title="Copy all (logs, state, actions)" />
            </div>
            {tab === 'logs' && (
              <LogsTab
                visible={visible}
                hidden={hidden}
                toggleCategory={toggleCategory}
                setLogs={setLogs}
                scrollRef={scrollRef}
              />
            )}
          </div>

          {tab === 'logs' ? (
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
          ) : tab === 'data' ? (
            <DataTab onReset={onReset} getSaveData={getSaveData} onLoad={onLoad} />
          ) : tab === 'state' ? (
            <StateTab history={history} setHistory={setHistory} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
          ) : tab === 'graph' ? (
            <GraphTab history={history} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
          ) : tab === 'actions' ? (
            <ActionsTab />
          ) : null}
        </div>
      )}
      <button
        className={`debug-toggle ${isOpen ? 'debug-toggle--open' : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        title="Toggle Debug Console"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="14" x="8" y="6" rx="4" />
          <path d="m19 7-3 2" />
          <path d="m5 7 3 2" />
          <path d="m19 19-3-2" />
          <path d="m5 19 3-2" />
          <path d="M20 13h-4" />
          <path d="M4 13h4" />
          <path d="m10 4 1 2" />
          <path d="m14 4-1 2" />
        </svg>
      </button>
    </div>
  )
}
