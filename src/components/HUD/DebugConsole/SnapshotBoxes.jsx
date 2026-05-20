import { BOXES_CONTAINER } from './snapshotBoxesStyles'
import { SnapshotBox } from './SnapshotBox'

export function SnapshotBoxes({ history, selectedIndex, setSelectedIndex, timelineRef }) {
  return (
    <div ref={timelineRef} style={BOXES_CONTAINER}>
      {history.map((entry, idx) => (
        <SnapshotBox key={idx} idx={idx} entry={entry} isSelected={selectedIndex === idx} setSelectedIndex={setSelectedIndex} />
      ))}
    </div>
  )
}
