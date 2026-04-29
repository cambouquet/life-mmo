import { useState, useEffect, useRef } from 'react'
import './VideoGallery.scss'

export default function VideoGallery({ videos, onClose }) {
  const [selected, setSelected] = useState(null)
  const videoRef = useRef(null)

  // Select the latest on open
  useEffect(() => {
    if (videos.length > 0) {
      const latest = videos[videos.length - 1];
      console.log('Gallery opened, selecting latest:', latest.id, latest.url);
      setSelected(latest.id);
    }
  }, [videos.length])

  // Revoke object URLs only on unmount — not when videos array changes,
  // since revoking live URLs breaks playback and download in the same session.
  const videosRef = useRef(videos)
  useEffect(() => { videosRef.current = videos }, [videos])
  useEffect(() => {
    return () => videosRef.current.forEach(v => URL.revokeObjectURL(v.url))
  }, [])

  const active = videos.find(v => v.id === selected)

  function download(v) {
    const a = document.createElement('a')
    a.href = v.url
    a.download = v.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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
                onClick={() => {
                  console.log('Selecting video:', v.url);
                  setSelected(v.id);
                }}
              >
                <div className="vgallery-thumb-wrap">
                  <video className="vgallery-thumb" src={v.url} muted preload="metadata" />
                </div>
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
              <div className="vgallery-player-content" key={active.id}>
                <div className="vgallery-video-container">
                  <video
                    ref={videoRef}
                    className="vgallery-video"
                    src={active.url}
                    controls
                    autoPlay
                    playsInline
                    muted
                  />
                </div>
                <div className="vgallery-player-bar">
                  <span className="vgallery-player-name">{active.filename}</span>
                  <button className="vgallery-player-dl" onClick={() => download(active)}>Download MP4</button>
                </div>
              </div>
            ) : (
              <div className="vgallery-no-video">Select a recording to play</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
