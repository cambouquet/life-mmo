const TRIGGER_CHECKS = [
  { check: (p, c) => p.activePage !== c.activePage, label: (p, c) => `page: ${p.activePage} → ${c.activePage}` },
  { check: (p, c) => p.selectedCharacter !== c.selectedCharacter, label: () => 'character selected' },
  { check: (p, c) => p.isEditing !== c.isEditing, label: (p, c) => c.isEditing ? 'edit started' : 'edit ended' },
  { check: (p, c) => p.modalOpen !== c.modalOpen, label: (p, c) => c.modalOpen ? 'modal opened' : 'modal closed' },
  { check: (p, c) => p.scrollPosition !== c.scrollPosition, label: () => 'scroll' },
  { check: (p, c) => p.colors !== c.colors, label: () => 'colors changed' },
  { check: (p, c) => p.name !== c.name, label: () => 'name changed' },
]

export function detectTrigger(prev, current, getChangedKeys) {
  if (!prev || !current) return 'initial'

  const triggers = TRIGGER_CHECKS
    .filter(t => t.check(prev, current))
    .map(t => t.label(prev, current))

  if (triggers.length === 0) {
    const changedCount = getChangedKeys(prev, current).length
    if (changedCount > 0) {
      triggers.push(`${changedCount} properties changed`)
    }
  }

  return triggers.length > 0 ? triggers.join('; ') : 'state updated'
}
