import { anomalySectionStyle, anomalyHeaderStyle, textStyle, snapshotSectionStyle, purpleHeaderStyle, tagStyle } from './snapshotStyles'
import { getPluralSnapshot, formatSnapshotAge } from './snapshotUtils'
import { TRIGGER_TEXT_STYLE, NO_CHANGE_STYLE, CHANGED_KEYS_CONTAINER, STATS_CONTAINER, STATS_ROW, STATS_LABEL, STATS_VALUE } from './snapshotInfoStyles'

export function AnomalySection({ selectedNode }) {
  if (!selectedNode.isAnomalous) return null
  return (
    <div style={anomalySectionStyle}>
      <div style={anomalyHeaderStyle}>⚠️ Anomaly detected</div>
      <div style={textStyle}>{selectedNode.changedKeys.length} properties changed (2x+ neighbors' average)</div>
    </div>
  )
}

export function TriggerSection({ selectedTrigger, selectedNode }) {
  if (!selectedTrigger && selectedNode.unchangedSequence <= 0) return null
  return (
    <div style={snapshotSectionStyle}>
      <div style={purpleHeaderStyle}>{selectedTrigger ? 'Triggered by' : 'No change'}</div>
      {selectedTrigger ? (
        <div style={TRIGGER_TEXT_STYLE}>{selectedTrigger.trigger}</div>
      ) : (
        <div style={NO_CHANGE_STYLE}>State is identical to previous {selectedNode.unchangedSequence} snapshot{getPluralSnapshot(selectedNode.unchangedSequence)}.</div>
      )}
    </div>
  )
}

export function ChangedKeysSection({ selectedNode }) {
  if (selectedNode.changedKeys.length === 0) return null
  return (
    <div style={snapshotSectionStyle}>
      <div style={purpleHeaderStyle}>Properties changed ({selectedNode.changedKeys.length})</div>
      <div style={CHANGED_KEYS_CONTAINER}>
        {selectedNode.changedKeys.map((key) => (
          <span key={key} style={tagStyle}>{key}</span>
        ))}
      </div>
    </div>
  )
}

export function SnapshotStats({ selectedNode, now, history, displayIndex }) {
  return (
    <div style={{ ...STATS_CONTAINER, ...snapshotSectionStyle }}>
      <div style={STATS_ROW}>
        <span style={STATS_LABEL}>Snapshot age:</span>
        <span style={STATS_VALUE}>{selectedNode ? formatSnapshotAge(now, selectedNode.timestamp) : '0s'}</span>
      </div>
      <div style={STATS_ROW}>
        <span style={STATS_LABEL}>Index:</span>
        <span style={STATS_VALUE}>{displayIndex + 1} / {history.length}</span>
      </div>
      {selectedNode.unchangedSequence > 0 && (
        <div style={STATS_ROW}>
          <span style={STATS_LABEL}>Held unchanged:</span>
          <span style={STATS_VALUE}>{selectedNode.unchangedSequence} snapshot{getPluralSnapshot(selectedNode.unchangedSequence)}</span>
        </div>
      )}
    </div>
  )
}
