import { useEffect } from 'react'
import { formatTimestamp, formatMessage, shouldFilterReactKey } from './consoleFormatters.js'

export function useConsoleInterception(setLogs) {
  useEffect(() => {
    const orig = { log: console.log, error: console.error, warn: console.warn }

    const addLog = (type, args) => {
      const message = formatMessage(args)
      const ts = formatTimestamp(new Date())
      setTimeout(() => {
        setLogs((prev) => {
          const newLog = { type, message, ts, id: `${performance.now()}-${Math.random()}` }
          return [...prev, newLog].slice(-200)
        })
      }, 0)
    }

    const makeLogger = (orig_fn, type) => (...a) => {
      orig_fn(...a)
      if (shouldFilterReactKey(a[0])) return
      addLog(type, a)
    }

    console.log = makeLogger(orig.log, 'log')
    console.error = makeLogger(orig.error, 'error')
    console.warn = makeLogger(orig.warn, 'warn')
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

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandled)
    document.addEventListener('securitypolicyviolation', onSecurityPolicy)

    return () => {
      console.log = orig.log
      console.error = orig.error
      console.warn = orig.warn
      delete console.action
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandled)
      document.removeEventListener('securitypolicyviolation', onSecurityPolicy)
    }
  }, [setLogs])
}
