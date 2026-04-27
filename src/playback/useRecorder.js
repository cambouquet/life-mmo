import { useRef, useState, useCallback } from 'react'
import html2canvas from 'html2canvas'

// ffmpeg loaded as plain UMD scripts in index.html → window.FFmpegWASM / window.FFmpegUtil
// This bypasses Vite's worker transform which breaks @ffmpeg/ffmpeg's internal worker spawn.

export function useRecorder({ onReady } = {}) {
  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])
  const ffmpegRef        = useRef(null)
  const captureFrameRef  = useRef(null)
  const onReadyRef       = useRef(onReady)
  onReadyRef.current     = onReady
  const [status,   setStatus]   = useState('idle')
  const [progress, setProgress] = useState(0)

  const loadFfmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current

    const { FFmpeg } = window.FFmpegWASM
    const ff = new FFmpeg()

    let durationSec = 0
    ff.on('log', ({ message }) => {
      const durMatch = message.match(/Duration:\s*(\d+):(\d+):(\d+)\.(\d+)/)
      if (durMatch) {
        durationSec = parseInt(durMatch[1]) * 3600
          + parseInt(durMatch[2]) * 60
          + parseInt(durMatch[3])
          + parseInt(durMatch[4]) / 100
      }
      const timeMatch = message.match(/time=(\d+):(\d+):(\d+)\.(\d+)/)
      if (timeMatch && durationSec > 0) {
        const cur = parseInt(timeMatch[1]) * 3600
          + parseInt(timeMatch[2]) * 60
          + parseInt(timeMatch[3])
          + parseInt(timeMatch[4]) / 100
        setProgress(Math.min(99, Math.round((cur / durationSec) * 100)))
      }
    })

    // All files served as plain statics — worker resolves 814.ffmpeg.js relative to ffmpeg.js
    await ff.load({
      coreURL: '/ffmpeg/ffmpeg-core.js',
      wasmURL: '/ffmpeg/ffmpeg-core.wasm',
    })

    ffmpegRef.current = ff
    return ff
  }, [])

  const start = useCallback((canvas, uiOverlay) => {
    if (!canvas) { console.error('useRecorder.start: no canvas'); return }

    chunksRef.current = []
    
    // Create a hidden "composition" canvas that merges game + UI
    const compCanvas = document.createElement('canvas')
    compCanvas.width = canvas.width
    compCanvas.height = canvas.height
    const compCtx = compCanvas.getContext('2d')
    
    // Recording stream from the composition canvas
    const stream = compCanvas.captureStream(30)
    
    // Frame capture loop
    let lastCapture = 0
    const captureFrame = async (ts) => {
      if (statusRef.current !== 'recording') return
      
      // Update at ~30fps
      if (ts - lastCapture >= 33) {
        lastCapture = ts
        
        // 1. Draw game canvas
        compCtx.drawImage(canvas, 0, 0)
        
        // 2. If UI is open, snapshot and draw it
        if (uiOverlay && uiOverlay.children.length > 0) {
          try {
            const uiCanvas = await html2canvas(uiOverlay, {
              backgroundColor: null,
              width: canvas.width,
              height: canvas.height,
              scale: 1, // match canvas pixels
              logging: false,
            })
            compCtx.drawImage(uiCanvas, 0, 0)
          } catch (e) {
            console.warn('UI Capture failed:', e)
          }
        }
      }
      captureFrameRef.current = requestAnimationFrame(captureFrame)
    }
    
    // We need a ref for status because we're in a RAF loop
    statusRef.current = 'recording'
    captureFrameRef.current = requestAnimationFrame(captureFrame)

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'

    const mr = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.start(100)
    mediaRecorderRef.current = mr
    setStatus('recording')
    setProgress(0)
  }, [])

  const statusRef = useRef(status)
  statusRef.current = status

  const stop = useCallback(async (filename = 'gameplay.mp4') => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') return

    cancelAnimationFrame(captureFrameRef.current)
    statusRef.current = 'idle'
    
    setStatus('converting')
    setProgress(0)

    await new Promise(resolve => { mr.onstop = resolve; mr.stop() })

    try {
      const ff = await loadFfmpeg()
      const { fetchFile } = window.FFmpegUtil

      const webmBlob = new Blob(chunksRef.current, { type: 'video/webm' })
      const webmData = await fetchFile(webmBlob)
      await ff.writeFile('input.webm', webmData)

      const exitCode = await ff.exec([
        '-i', 'input.webm',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        'output.mp4',
      ])

      if (exitCode !== 0) throw new Error(`ffmpeg exited with code ${exitCode}`)

      const data    = await ff.readFile('output.mp4')
      const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' })
      onReadyRef.current?.(mp4Blob, filename)

      setProgress(100)
      setStatus('done')
    } catch (err) {
      console.error('Recording export failed:', err)
      setStatus('error')
    }
  }, [loadFfmpeg])

  const cancel = useCallback(() => {
    cancelAnimationFrame(captureFrameRef.current)
    statusRef.current = 'idle'
    
    const mr = mediaRecorderRef.current
    if (mr && mr.state !== 'inactive') mr.stop()
    if (ffmpegRef.current) {
      try { ffmpegRef.current.terminate() } catch {}
      ffmpegRef.current = null
    }
    setStatus('idle')
    setProgress(0)
  }, [])

  return { start, stop, cancel, status, progress }
}
