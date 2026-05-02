import { useRef, useState, useCallback } from 'react'

// ffmpeg loaded as plain UMD scripts in index.html → window.FFmpegWASM

export function useRecorder({ onReady } = {}) {
  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])
  const ffmpegRef        = useRef(null)
  const onReadyRef       = useRef(onReady)
  onReadyRef.current     = onReady

  const [status,   setStatus]   = useState('idle')
  const [progress, setProgress] = useState(0)

  const statusRef = useRef('idle')

  const loadFfmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current
    const { FFmpeg } = window.FFmpegWASM
    const ff = new FFmpeg()
    let durationSec = 0
    ff.on('log', ({ message }) => {
      const durMatch = message.match(/Duration:\s*(\d+):(\d+):(\d+)\.(\d+)/)
      if (durMatch) {
        durationSec = parseInt(durMatch[1]) * 3600 + parseInt(durMatch[2]) * 60
          + parseInt(durMatch[3]) + parseInt(durMatch[4]) / 100
      }
      const streamMatch = message.match(/Stream.*:\s*Video:.*,\s*(\d+):(\d+):(\d+)\.(\d+)/)
      if (streamMatch && durationSec === 0) {
        durationSec = parseInt(streamMatch[1]) * 3600 + parseInt(streamMatch[2]) * 60
          + parseInt(streamMatch[3]) + parseInt(streamMatch[4]) / 100
      }
      const timeMatch = message.match(/time=\s*(\d+):(\d+):(\d+)\.(\d+)/)
      if (timeMatch) {
        const cur = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60
          + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 100
        if (durationSec > 0) {
          const pct = Math.min(99, Math.round((cur / durationSec) * 100))
          setProgress(prev => (prev >= 100 ? 100 : pct > prev ? pct : prev))
        } else {
          setProgress(prev => prev >= 99 ? 99 : prev + 1)
        }
      }
    })
    await ff.load({ coreURL: '/ffmpeg/ffmpeg-core.js', wasmURL: '/ffmpeg/ffmpeg-core.wasm' })
    ffmpegRef.current = ff
    return ff
  }, [])

  const start = useCallback((stream) => {
    if (statusRef.current === 'recording' || statusRef.current === 'converting') {
      console.warn('useRecorder.start: already recording'); return false
    }
    if (!stream) { console.error('useRecorder.start: no stream'); return false }

    chunksRef.current = []
    setProgress(0)

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9' : 'video/webm'
    const mr = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }

    // If the user stops sharing via the browser UI, treat it as cancel
    stream.getVideoTracks()[0].addEventListener('ended', () => {
      if (statusRef.current === 'recording') cancel()
    })

    mr.start(100)
    mediaRecorderRef.current = mr
    statusRef.current = 'recording'
    setStatus('recording')
    return true
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const stop = useCallback(async (filename = 'gameplay.mp4') => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') return

    // Stop all tracks to release the screen share
    mr.stream.getTracks().forEach(t => t.stop())

    statusRef.current = 'idle'
    setStatus('converting')
    setProgress(0)

    await new Promise(resolve => { mr.onstop = resolve; mr.stop() })

    try {
      const ff = await loadFfmpeg()
      for (const f of ['input.webm', 'output.mp4']) { try { await ff.deleteFile(f) } catch {} }

      const webmBlob = new Blob(chunksRef.current, { type: 'video/webm' })
      if (webmBlob.size < 1000) throw new Error('Recording too short — no data captured')

      const webmData = new Uint8Array(await webmBlob.arrayBuffer())
      await ff.writeFile('input.webm', webmData)

      const exitCode = await ff.exec([
        '-i', 'input.webm',
        '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '25',
        '-vf', 'fps=30,pad=ceil(iw/2)*2:ceil(ih/2)*2',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-vsync', 'cfr',
        'output.mp4',
      ])
      if (exitCode !== 0) throw new Error(`ffmpeg exited with code ${exitCode}`)

      const data    = await ff.readFile('output.mp4')
      const mp4Blob = new Blob([data.buffer.slice(0)], { type: 'video/mp4' })

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

  // updateOverlay is no longer needed but kept so callers don't break
  const updateOverlay = useCallback(() => {}, [])

  return { start, stop, cancel, updateOverlay, status, progress }
}
