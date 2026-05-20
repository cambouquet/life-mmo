import './RecordButton.scss'
import { ICON_SVG } from './RecordButtonConfig.js'

export default function RecordButton({ status, progress, recordingCount, onRecord, onRecordGate, onStop, onOpenGallery, isOpen }) {
  if (!isOpen) return null
  const isRecording = status === 'recording'
  const isConverting = status === 'converting'
  const busy = isRecording || isConverting

  return (
    <div className="record-panel">
      <div className="record-panel__header">
        <h3>Record Scenarios</h3>
      </div>
      <div className="record-panel__content">
        <button className="record-panel__button" onClick={onRecord} title="Record: mirror visit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" /><path d="M9 8a3 3 0 0 1 6 0" />
          </svg>
          Mirror Visit
        </button>
        {onRecordGate && (
          <button className="record-panel__button" onClick={onRecordGate} title="Record: gate run">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7h10v10H7z" /><path d="M12 7v10" /><path d="M7 12h10" />
            </svg>
            Gate Run
          </button>
        )}
        {recordingCount > 0 && (
          <button className="record-panel__button" onClick={onOpenGallery} title={`${recordingCount} recording${recordingCount > 1 ? 's' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="15" rx="2" /><path d="M16 7v-2a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2" />
            </svg>
            Gallery ({recordingCount})
          </button>
        )}
        {busy && (
          <button className="record-panel__button record-panel__button--stop" onClick={onStop} title="Stop recording">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="12" height="16" />
            </svg>
            Stop
          </button>
        )}
      </div>
    </div>
  )
}
