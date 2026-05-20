export function buildCopyText(visible, history, selectedIndex) {
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
}

export function toggleCategory(hidden, cat) {
  const next = new Set(hidden)
  next.has(cat) ? next.delete(cat) : next.add(cat)
  return next
}
