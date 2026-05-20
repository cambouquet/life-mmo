import { useRef, useState, useCallback } from 'react'
import { initFFmpeg } from './ffmpegEngine.js'
import { createRecorderHandlers } from './recorderHandlers.js'

export function useRecorder({ onReady } = {}) {
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const ffmpegRef = useRef(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const statusRef = useRef('idle')

  const loadFfmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current
    const ff = await initFFmpeg(setProgress)
    ffmpegRef.current = ff
    return ff
  }, [])

  const { start, stop, cancel } = useCallback(() =>
    createRecorderHandlers(mediaRecorderRef, chunksRef, ffmpegRef, statusRef, onReadyRef, setStatus, setProgress, loadFfmpeg),
    [loadFfmpeg]
  )()

  return { start, stop, cancel, status, progress }
}
