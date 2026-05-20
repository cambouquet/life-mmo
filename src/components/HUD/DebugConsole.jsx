import { useState, useRef } from 'react'
import './DebugConsole.scss'
import { CopyButton } from './DebugConsole/CopyButton'
import { DataTab } from './DebugConsole/DataTab'
import { ActionsTab } from './DebugConsole/ActionsTab'
import { LogsTab } from './DebugConsole/LogsTab'
import { GraphTab } from './DebugConsole/GraphTab'
import { useConsoleInterception } from './DebugConsole/useConsoleInterception'
import { useStateHistory, useResizeHandle, useClickOutside } from './DebugConsole/debugConsoleHooks.js'
import { buildCopyText, toggleCategory } from './DebugConsole/debugConsoleUtils.js'
import { DebugTabs } from './DebugConsole/DebugTabs.jsx'
import { DebugToggle } from './DebugConsole/DebugToggle.jsx'
import { createKeyDownHandler, createResizeMouseDown } from './DebugConsole/debugConsoleHandlers.js'

export default function DebugConsole({ onReset, getSaveData, onLoad }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tab, setTab] = useState('logs')
  const [logs, setLogs] = useState([])
  const [hidden, setHidden] = useState(new Set())
  const scrollRef = useRef(null)
  const panelRef = useRef(null)

  useConsoleInterception(setLogs)
  const { history, selectedIndex, setSelectedIndex } = useStateHistory(isOpen)
  const { height, isResizingRef } = useResizeHandle()
  useClickOutside(isOpen, setIsOpen, panelRef)

  const visible = logs.filter((l) => !hidden.has(l.type))
  const copyAllText = buildCopyText(visible, history, selectedIndex)
  const handleKeyDown = createKeyDownHandler(scrollRef)
  const handleResizeMouseDown = createResizeMouseDown(isResizingRef)

  return (
    <div className="debug-container" style={{ '--debug-height': `${height}px` }}>
      {isOpen && (
        <div ref={panelRef} className="debug-panel" tabIndex={0} onKeyDown={handleKeyDown}>
          <div className="debug-resize-handle" onMouseDown={handleResizeMouseDown} />
          <div className="debug-header">
            <div className="debug-header-top debug-row">
              <DebugTabs tab={tab} setTab={setTab} />
              <CopyButton text={copyAllText} title="Copy all (logs, state, actions)" />
            </div>
            {tab === 'logs' && (<LogsTab visible={visible} hidden={hidden} toggleCategory={(cat) => setHidden(toggleCategory(hidden, cat))} setLogs={setLogs} scrollRef={scrollRef} />)}
          </div>
          {tab === 'logs' ? (
            <div className="debug-logs" ref={scrollRef}>
              {visible.length === 0 && <div className="debug-empty">No logs.</div>}
              {visible.map((log) => (<div key={log.id} className={`debug-log debug-log--${log.type}`}><span className="debug-log-ts">{log.ts}</span><span className="debug-log-msg">{log.message}</span><CopyButton text={log.message} /></div>))}
            </div>
          ) : tab === 'data' ? (
            <DataTab onReset={onReset} getSaveData={getSaveData} onLoad={onLoad} />
          ) : tab === 'state' ? (
            <GraphTab history={history} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
          ) : tab === 'actions' ? (
            <ActionsTab />
          ) : null}
        </div>
      )}
      <DebugToggle isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
    </div>
  )
}
