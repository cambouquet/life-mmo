import { downloadVideo } from './galleryUtils.js'
import { GalleryList } from './GalleryList.jsx'
import { useVideoPlayer } from './useVideoPlayer.js'
import './VideoGallery.scss'

export default function VideoGallery({ videos, onClose }) {
  const { selected, setSelected, videoRef, active } = useVideoPlayer(videos)

  return (
    <div className="vgallery-backdrop" onClick={onClose}>
      <div className="vgallery" onClick={e => e.stopPropagation()}>
        <div className="vgallery-header">
          <span className="vgallery-title">Recordings</span>
          <button className="vgallery-close" onClick={onClose}>✕</button>
        </div>

        <div className="vgallery-body">
          <GalleryList videos={videos} selected={selected} onSelect={setSelected} />

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
                  <button className="vgallery-player-dl" onClick={() => downloadVideo(active)}>Download MP4</button>
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
