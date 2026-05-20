import { detectTrigger as detectTriggerImpl } from './triggerDetection'
import { isAnomalous as isAnomalousImpl } from './anomalyDetection'

export function getChangedKeys(prev, current) {
  if (!prev || !current) return []
  const allKeys = new Set([...Object.keys(prev || {}), ...Object.keys(current || {})])
  const changed = []
  allKeys.forEach((key) => {
    if (key === 'actions') return
    const prevVal = JSON.stringify(prev?.[key])
    const currVal = JSON.stringify(current?.[key])
    if (prevVal !== currVal) changed.push(key)
  })
  return changed
}

export function detectTrigger(prev, current) {
  return detectTriggerImpl(prev, current, getChangedKeys)
}

export function isAnomalous(node, nodes) {
  return isAnomalousImpl(node, nodes)
}
