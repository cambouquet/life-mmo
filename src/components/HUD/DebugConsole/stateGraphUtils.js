export function getChangedKeys(prev, current) {
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

export function detectTrigger(prev, current) {
  if (!prev || !current) return 'initial'

  const triggers = []

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

  if (prev.scrollPosition !== current.scrollPosition) {
    triggers.push('scroll')
  }

  if (prev.colors !== current.colors) {
    triggers.push('colors changed')
  }

  if (prev.name !== current.name) {
    triggers.push('name changed')
  }

  if (triggers.length === 0) {
    const changedCount = getChangedKeys(prev, current).length
    if (changedCount > 0) {
      triggers.push(`${changedCount} properties changed`)
    }
  }

  return triggers.length > 0 ? triggers.join('; ') : 'state updated'
}

export function isAnomalous(node, nodes) {
  if (node.unchangedSequence > 0) return false

  const idx = node.index
  const prev = idx > 0 ? nodes[idx - 1] : null
  const next = idx < nodes.length - 1 ? nodes[idx + 1] : null

  const changeCount = node.changedKeys.length

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
    return changeCount > neighborAvg * 2 && changeCount > 2
  }

  return false
}
