import { useState, useEffect, useRef } from 'react'
import { selectLatestVideo, getActiveVideo } from './galleryUtils.js'

export function useVideoPlayer(videos) {
  const [selected, setSelected] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    selectLatestVideo(videos, setSelected)
  }, [videos.length])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = 0
    el.load()
  }, [selected, getActiveVideo(videos, selected)?.url])

  return { selected, setSelected, videoRef, active: getActiveVideo(videos, selected) }
}
