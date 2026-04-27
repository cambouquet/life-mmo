import { useState, useEffect, useRef } from 'react'
import './VideoGallery.scss'

export default function VideoGallery({ videos, onClose }) {
  const [selected, setSelected] = useState(null)
  const videoRef = useRef(null)

  // Select the latest on open
  useEffect(() => {
    if (videos.length > 0) setSelected(videos[videos.length - 1].id)
  }, [])

  // Revoke object URLs on unmount to free memory
  useEffect(() => {
    return () => videos.forEach(v => URL.revokeObjectURL(v.url))
  }, [videos])

  const active = videos.find(v => v.id === selected)

  function download(v) {
    Object.assign(document.createElement('a'), { href: v.url, download: v.filename }).click()
  }

  function fmt(ms) {
    const d = new Date(ms)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div className="vgallery-backdrop" onClick={onClose}>
      <div className="vgallery" onClick={e => e.stopPropagation()}>
        <div className="vgallery-header">
          <span className="vgallery-title">Recordings</span>
          <button className="vgallery-close" onClick={onClose}>✕</button>
        </div>

        <div className="vgallery-body">
          <div className="vgallery-list">
            {videos.length === 0 && <div className="vgallery-empty">No recordings yet.</div>}
            {[...videos].reverse().map(v => (
              <div
                key={v.id}
                className={`vgallery-item ${v.id === selected ? 'vgallery-item--active' : ''}`}
                onClick={() => setSelected(v.id)}
              >
                <video className="vgallery-thumb" src={v.url} muted preload="metadata" />
                <div className="vgallery-item-meta">
                  <span className="vgallery-item-name">{v.filename}</span>
                  <span className="vgallery-item-time">{fmt(v.ts)}</span>
                </div>
                <button className="vgallery-dl" title="Download" onClick={e => { e.stopPropagation(); download(v) }}>↓</button>
              </div>
            ))}
          </div>

          <div className="vgallery-player">
            {active ? (
              <>
                <video
                  ref={videoRef}
                  key={active.id}
                  className="vgallery-video"
                  src={active.url}
                  controls
                  autoPlay
                />
                <div className="vgallery-player-bar">
                  <span className="vgallery-player-name">{active.filename}</span>
                  <button className="vgallery-player-dl" onClick={() => download(active)}>Download MP4</button>
                </div>
              </>
            ) : (
              <div className="vgallery-no-video">Select a recording to play</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
