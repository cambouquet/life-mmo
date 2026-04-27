import './RecordButton.scss'

export default function RecordButton({ status, progress, onRecord, onStop }) {
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
      <button
        type="button"
        className={`record-btn record-btn--${status}`}
        onClick={(e) => {
          e.stopPropagation()
          console.log('RecordButton onClick triggered, status:', status)
          if (status === 'idle') {
            console.log('Calling onRecord...')
            onRecord()
          } else {
            console.warn('RecordButton clicked but status is not idle:', status)
          }
        }}
        disabled={busy}
        title={busy ? undefined : 'Record gameplay (MP4)'}
        style={isConverting ? { '--prog': `${progress}%` } : undefined}
      >
        {recLabel()}
      </button>
      {busy && (
        <button className="record-btn record-btn--stop" onClick={onStop} title="Stop recording">
          ■
        </button>
      )}
    </div>
  )
}
