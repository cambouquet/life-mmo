import { useMemo } from 'react'
import { getChangedKeys, detectTrigger, isAnomalous } from './stateGraphUtils.js'

export function useStateGraph(history) {
  return useMemo(() => {
    if (history.length < 1) return { nodes: [], changes: [], triggers: [] }

    const nodes = []
    const changes = []
    const triggers = []

    let lastChangeIndex = 0

    history.forEach((entry, idx) => {
      const prev = idx > 0 ? history[idx - 1] : null
      const changedKeys = getChangedKeys(prev?.parsed, entry.parsed)
      const hasChanges = changedKeys.length > 0

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
        isAnomalous: false,
      })

      if (idx > 0 && hasChanges) {
        changes.push({
          from: idx - 1,
          to: idx,
          keys: changedKeys,
        })

        const trigger = detectTrigger(history[idx - 1].parsed, entry.parsed)
        triggers.push({
          index: idx,
          trigger,
          changedKeys,
        })
      }
    })

    nodes.forEach((node) => {
      node.isAnomalous = isAnomalous(node, nodes)
    })

    return { nodes, changes, triggers }
  }, [history])
}
