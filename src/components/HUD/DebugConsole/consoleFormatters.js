export function formatTimestamp(date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  const ms = String(date.getMilliseconds()).padStart(3, '0')
  return `${h}:${m}:${s}.${ms}`
}

export function formatMessage(args) {
  return args
    .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
    .join(' ')
}

export function shouldFilterReactKey(msg) {
  return typeof msg === 'string' && msg.includes('Encountered two children with the same key')
}
