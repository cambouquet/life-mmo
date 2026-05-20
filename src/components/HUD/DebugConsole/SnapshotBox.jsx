import { getBoxStyle, HOVER_BG, HOVER_COLOR, DEFAULT_BG, DEFAULT_COLOR } from './snapshotBoxesStyles'

export function SnapshotBox({ idx, entry, isSelected, setSelectedIndex }) {
  return (
    <div key={idx} data-snapshot={idx} onClick={() => setSelectedIndex(idx)} style={getBoxStyle(isSelected)}
      title={entry.timestamp.toLocaleTimeString()}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = HOVER_BG
          e.currentTarget.style.color = HOVER_COLOR
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = DEFAULT_BG
          e.currentTarget.style.color = DEFAULT_COLOR
        }
      }}
    >
      {idx + 1}
    </div>
  )
}
