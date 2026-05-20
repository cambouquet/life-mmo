export function formatSnapshotAge(now, timestamp) {
  const totalSeconds = Math.floor((now - timestamp) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

export function getPluralSnapshot(count) {
  return count > 1 ? 's' : ''
}
