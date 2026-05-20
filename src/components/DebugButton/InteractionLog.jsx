import { useRef, useEffect } from 'react'

export function InteractionLog({ logs }) {
  const logsEndRef = useRef(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="interaction-playground__log">
      {logs.map((log, i) => (
        <div
          key={i}
          className={`interaction-playground__log-entry log-${log.type}`}
        >
          <span className="interaction-playground__log-time">{log.timestamp}</span>
          <span className="interaction-playground__log-message">{log.message}</span>
        </div>
      ))}
      <div ref={logsEndRef} />
    </div>
  )
}
