import { useEffect } from 'react'

export function useConsoleInterception(setLogs) {
  useEffect(() => {
    const orig = {
      log: console.log,
      error: console.error,
      warn: console.warn,
    }

    const addLog = (type, args) => {
      const message = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
        .join(' ')
      const now = new Date()
      const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`
      setTimeout(() => {
        setLogs((prev) => {
          const newLog = { type, message, ts, id: `${performance.now()}-${Math.random()}` }
          return [...prev, newLog].slice(-200)
        })
      }, 0)
    }

    console.log = (...a) => {
      orig.log(...a)
      if (typeof a[0] === 'string' && a[0].includes('Encountered two children with the same key')) return
      addLog('log', a)
    }
    console.error = (...a) => {
      orig.error(...a)
      if (typeof a[0] === 'string' && a[0].includes('Encountered two children with the same key')) return
      addLog('error', a)
    }
    console.warn = (...a) => {
      orig.warn(...a)
      if (typeof a[0] === 'string' && a[0].includes('Encountered two children with the same key')) return
      addLog('warn', a)
    }
    console.action = (...a) => {
      orig.log(...a)
      addLog('action', a)
    }

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
