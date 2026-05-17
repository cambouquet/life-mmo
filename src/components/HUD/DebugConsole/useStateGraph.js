import { useMemo } from 'react'

export function useStateGraph(history) {
  return useMemo(() => {
    if (history.length < 1) return { nodes: [], changes: [], triggers: [] }

    const nodes = []
    const changes = []
    const triggers = [] // Track trigger sequences

    let lastChangeIndex = 0

    history.forEach((entry, idx) => {
      const prev = idx > 0 ? history[idx - 1] : null
      const changedKeys = getChangedKeys(prev?.parsed, entry.parsed)
      const hasChanges = changedKeys.length > 0

      // Track consecutive unchanged states
      let unchangedSequence = 0
      if (!hasChanges && idx > 0) {
        unchangedSequence = idx - lastChangeIndex
      } else if (hasChanges) {
        lastChangeIndex = idx
      }

      nodes.push({
        id: idx,
        index: idx,
        timestamp: entry.timestamp,
        changedKeys,
        hasChanges,
        unchangedSequence,
        isAnomalous: false, // Will be computed after all nodes are created
      })

      if (idx > 0 && hasChanges) {
        changes.push({
          from: idx - 1,
          to: idx,
          keys: changedKeys,
        })

        // Detect what triggered this change by looking at the diff
        const trigger = detectTrigger(history[idx - 1].parsed, entry.parsed)
        triggers.push({
          index: idx,
          trigger,
          changedKeys,
        })
      }
    })

    // Mark anomalous nodes (unusual change patterns)
    nodes.forEach((node) => {
      node.isAnomalous = isAnomalous(node, nodes)
    })

    return { nodes, changes, triggers }
  }, [history])
}

function getChangedKeys(prev, current) {
  if (!prev || !current) return []

  const changed = []
  const allKeys = new Set([...Object.keys(prev || {}), ...Object.keys(current || {})])

  allKeys.forEach((key) => {
    if (key === 'actions') return
    const prevVal = JSON.stringify(prev?.[key])
    const currVal = JSON.stringify(current?.[key])
    if (prevVal !== currVal) {
      changed.push(key)
    }
  })

  return changed
}

function detectTrigger(prev, current) {
  if (!prev || !current) return 'initial'

  // Check for common trigger patterns
  const triggers = []

  // User interaction patterns
  if (prev.activePage !== current.activePage) {
    triggers.push(`page: ${prev.activePage} → ${current.activePage}`)
  }

  if (prev.selectedCharacter !== current.selectedCharacter) {
    triggers.push('character selected')
  }

  if (prev.isEditing !== current.isEditing) {
    triggers.push(current.isEditing ? 'edit started' : 'edit ended')
  }

  if (prev.modalOpen !== current.modalOpen) {
    triggers.push(current.modalOpen ? 'modal opened' : 'modal closed')
  }

  // Check for scroll/position changes
  if (prev.scrollPosition !== current.scrollPosition) {
    triggers.push('scroll')
  }

  // Check for data mutations
  if (prev.colors !== current.colors) {
    triggers.push('colors changed')
  }

  if (prev.name !== current.name) {
    triggers.push('name changed')
  }

  // Generic change detection by key count
  if (triggers.length === 0) {
    const prevKeys = Object.keys(prev || {})
    const currKeys = Object.keys(current || {})
    const changedCount = getChangedKeys(prev, current).length
    if (changedCount > 0) {
      triggers.push(`${changedCount} properties changed`)
    }
  }

  return triggers.length > 0 ? triggers.join('; ') : 'state updated'
}

function isAnomalous(node, nodes) {
  if (node.unchangedSequence > 0) return false // unchanged is normal

  const idx = node.index
  const prev = idx > 0 ? nodes[idx - 1] : null
  const next = idx < nodes.length - 1 ? nodes[idx + 1] : null

  const changeCount = node.changedKeys.length

  // Flag if significantly more changes than neighbors
  let neighborAvg = 0
  let count = 0
  if (prev) {
    neighborAvg += prev.changedKeys.length
    count++
  }
  if (next) {
    neighborAvg += next.changedKeys.length
    count++
  }

  if (count > 0) {
    neighborAvg /= count
    // Anomaly if more than 2x the neighbor average
    return changeCount > neighborAvg * 2 && changeCount > 2
  }

  return false
}
