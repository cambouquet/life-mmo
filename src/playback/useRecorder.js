import { useRef, useState, useCallback } from 'react'
import { initFFmpeg, convertWebmToMp4 } from './ffmpegEngine.js'

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

  const start = useCallback((stream) => {
    if (statusRef.current === 'recording' || statusRef.current === 'converting') {
      console.warn('useRecorder.start: already recording')
      return false
    }
    if (!stream) {
      console.error('useRecorder.start: no stream')
      return false
    }

    chunksRef.current = []
    setProgress(0)

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'
    const mr = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
    mr.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    stream.getVideoTracks()[0].addEventListener('ended', () => {
      if (statusRef.current === 'recording') cancel()
    })

    mr.start(100)
    mediaRecorderRef.current = mr
    statusRef.current = 'recording'
    setStatus('recording')
    return true
  }, [])

  const stop = useCallback(async (filename = 'gameplay.mp4') => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') return

    mr.stream.getTracks().forEach(t => t.stop())
    statusRef.current = 'idle'
    setStatus('converting')
    setProgress(0)

    await new Promise(resolve => {
      mr.onstop = resolve
      mr.stop()
    })

    try {
      const ff = await loadFfmpeg()
      const webmBlob = new Blob(chunksRef.current, { type: 'video/webm' })
      const mp4Blob = await convertWebmToMp4(ff, webmBlob)

      setStatus('done')
      setProgress(100)
      onReadyRef.current?.(mp4Blob, filename)
    } catch (err) {
      console.error('Recording export failed:', err?.message ?? String(err))
      setStatus('error')
    }
  }, [loadFfmpeg])

  const cancel = useCallback(() => {
    const mr = mediaRecorderRef.current
    if (mr) {
      mr.stream.getTracks().forEach(t => t.stop())
      if (mr.state !== 'inactive') mr.stop()
    }
    statusRef.current = 'idle'
    setStatus('idle')
    setProgress(0)
  }, [])

  const updateOverlay = useCallback(() => {}, [])

  return { start, stop, cancel, updateOverlay, status, progress }
}
