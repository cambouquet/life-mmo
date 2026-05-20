export function getDebugState() {
  return JSON.stringify(window.__screenDebug, (key, value) => {
    if (key === 'actions') return undefined
    return value
  })
}

export function processHistoryEntry(prev, current) {
  const lastEntry = prev[prev.length - 1]
  if (lastEntry && lastEntry.state === current) return prev
  const newEntry = {
    timestamp: new Date(),
    state: current,
    parsed: JSON.parse(current),
  }
  const updated = [...prev, newEntry]
  return updated.length > 200 ? updated.slice(-200) : updated
}
