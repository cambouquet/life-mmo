import { createMediaRecorder, attachStreamEndListener, stopMediaRecorder, stopStreamTracks } from './recorderSetup.js'
import { initFFmpeg, convertWebmToMp4 } from './ffmpegEngine.js'

export function createRecorderHandlers(
  mediaRecorderRef, chunksRef, ffmpegRef, statusRef, onReadyRef, setStatus, setProgress, loadFfmpeg
) {
  const start = (stream) => {
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
    const mr = createMediaRecorder(stream)
    mr.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    attachStreamEndListener(stream, () => {
      if (statusRef.current === 'recording') cancel()
    })
    mr.start(100)
    mediaRecorderRef.current = mr
    statusRef.current = 'recording'
    setStatus('recording')
    return true
  }

  const stop = async (filename = 'gameplay.mp4') => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') return
    stopStreamTracks(mr.stream)
    statusRef.current = 'idle'
    setStatus('converting')
    setProgress(0)
    await stopMediaRecorder(mr)
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
  }

  const cancel = () => {
    const mr = mediaRecorderRef.current
    if (mr) {
      stopStreamTracks(mr.stream)
      if (mr.state !== 'inactive') mr.stop()
    }
    statusRef.current = 'idle'
    setStatus('idle')
    setProgress(0)
  }

  return { start, stop, cancel }
}
