import { useState, useEffect, useRef } from 'react'
import './VideoGallery.scss'

export default function VideoGallery({ videos, onClose }) {
  const [selected, setSelected] = useState(null)
  const videoRef = useRef(null)

  // Select the latest on open
  useEffect(() => {
    if (videos.length > 0) {
      setSelected(videos[videos.length - 1].id)
    }
  }, [videos.length])

  const active = videos.find(v => v.id === selected)

  // Load video when selection changes
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    console.log('Video src changed to:', active?.url)
    el.currentTime = 0
    el.load()
  }, [selected, active?.url])

  // URLs are data URLs — nothing to revoke
  // Wait, I switched to Object URLs in App.jsx, I should handle cleanup if I was creating them here,
  // but they are managed in the recordings state in App.jsx.
  // Actually, keeping them as long as the app is open is standard for this kind of "session gallery".

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
                  <video
                    className="vgallery-thumb"
                    muted
                    preload="metadata"
                    playsInline
                  >
                    <source src={v.url} type={v.blob?.type} />
                  </video>
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
                    key={`video-${active.id}`}
                    className="vgallery-video"
                    controls
                    playsInline
                    autoPlay
                    muted
                  >
                    <source src={active.url} type={active.blob?.type || 'video/mp4'} />
                    Your browser does not support the video tag.
                  </video>
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
