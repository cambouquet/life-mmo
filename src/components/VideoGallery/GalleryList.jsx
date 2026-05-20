import { formatTime, downloadVideo } from './galleryUtils.js'

export function GalleryList({ videos, selected, onSelect }) {
  return (
    <div className="vgallery-list">
      {videos.length === 0 && <div className="vgallery-empty">No recordings yet.</div>}
      {[...videos].reverse().map(v => (
        <div
          key={v.id}
          className={`vgallery-item ${v.id === selected ? 'vgallery-item--active' : ''}`}
          onClick={() => onSelect(v.id)}
        >
          <div className="vgallery-thumb-wrap">
            <video className="vgallery-thumb" muted preload="metadata" playsInline>
              <source src={v.url} type={v.blob?.type} />
            </video>
          </div>
          <div className="vgallery-item-meta">
            <span className="vgallery-item-name">{v.filename}</span>
            <span className="vgallery-item-time">{formatTime(v.ts)}</span>
          </div>
          <button
            className="vgallery-dl"
            title="Download"
            onClick={e => {
              e.stopPropagation()
              downloadVideo(v)
            }}
          >
            ↓
          </button>
        </div>
      ))}
    </div>
  )
}
