export function getColorForChangeCount(count, isSelected, isAnomalous) {
  if (isSelected) {
    return 'rgba(192, 132, 252, 0.8)'
  }

  if (isAnomalous) {
    return 'rgba(251, 191, 36, 0.6)'
  }

  if (count === 0) return 'rgba(100, 100, 120, 0.3)'
  if (count === 1) return 'rgba(96, 168, 255, 0.5)'
  if (count === 2) return 'rgba(168, 85, 247, 0.5)'
  if (count === 3) return 'rgba(192, 132, 252, 0.5)'
  if (count <= 5) return 'rgba(218, 112, 214, 0.6)'
  return 'rgba(239, 68, 68, 0.6)'
}

export const HEATMAP_LEGEND = [
  { label: 'no change', color: 'rgba(100, 100, 120, 0.3)' },
  { label: '1 prop', color: 'rgba(96, 168, 255, 0.5)' },
  { label: '2 props', color: 'rgba(168, 85, 247, 0.5)' },
  { label: '3-5 props', color: 'rgba(218, 112, 214, 0.6)' },
  { label: '6+ props', color: 'rgba(239, 68, 68, 0.6)' },
  { label: 'anomaly', color: 'rgba(251, 191, 36, 0.6)' },
]
