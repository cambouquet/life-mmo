import './RecordButton.scss'

export default function RecordButton({ status, progress, recordingCount, onRecord, onRecordGate, onStop, onOpenGallery }) {
  const isRecording  = status === 'recording'
  const isConverting = status === 'converting'
  const busy         = isRecording || isConverting

  function recLabel() {
    if (isRecording)  return '●'
    if (isConverting) return progress > 0 ? `Converting ${progress}%` : 'Converting…'
    return '●'
  }

  return (
    <div className="record-wrap">
      {recordingCount > 0 && !busy && (
        <button
          className="record-gallery-btn"
          onClick={onOpenGallery}
          title={`${recordingCount} recording${recordingCount > 1 ? 's' : ''}`}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="10" height="8" rx="1.5" />
            <path d="M11 6l4-2v8l-4-2" />
          </svg>
          <span className="record-gallery-count">{recordingCount}</span>
        </button>
      )}
      <button
        type="button"
        className={`record-btn record-btn--${status}`}
        onClick={(e) => {
          e.stopPropagation()
          console.log('RecordButton onClick triggered, status:', status)
          onRecord()
        }}
        disabled={busy}
        title={busy ? undefined : 'Record: mirror visit'}
        style={isConverting ? { '--prog': `${progress}%` } : undefined}
      >
        {recLabel()}
      </button>
      {!busy && onRecordGate && (
        <button
          type="button"
          className={`record-btn record-btn--${status} record-btn--gate`}
          onClick={(e) => { e.stopPropagation(); onRecordGate() }}
          title="Record: gate run"
        >
          ⬡
        </button>
      )}
      {busy && (
        <button className="record-btn record-btn--stop" onClick={onStop} title="Stop recording">
          ■
        </button>
      )}
    </div>
  )
}
