export function isAnomalous(node, nodes) {
  if (node.unchangedSequence > 0) return false

  const idx = node.index
  const prev = idx > 0 ? nodes[idx - 1] : null
  const next = idx < nodes.length - 1 ? nodes[idx + 1] : null
  const changeCount = node.changedKeys.length

  let neighborAvg = 0, count = 0
  if (prev) { neighborAvg += prev.changedKeys.length; count++ }
  if (next) { neighborAvg += next.changedKeys.length; count++ }

  if (count > 0) {
    neighborAvg /= count
    return changeCount > neighborAvg * 2 && changeCount > 2
  }

  return false
}
