import { useRef, useState, useCallback } from 'react'
import { drawEditorOverlay } from '../game/draw/ui.jsx'

// ffmpeg loaded as plain UMD scripts in index.html → window.FFmpegWASM / window.FFmpegUtil
// This bypasses Vite's worker transform which breaks @ffmpeg/ffmpeg's internal worker spawn.

export function useRecorder({ onReady } = {}) {
  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])
  const ffmpegRef        = useRef(null)
  const rafIdRef         = useRef(null)
  const onReadyRef       = useRef(onReady)
  onReadyRef.current     = onReady
  const [status,   setStatus]   = useState('idle')
  const [progress, setProgress] = useState(0)

  const overlayStateRef = useRef({
    showEditor: false,
    charColors: null,
    birthData: null
  })

  const updateOverlay = useCallback((next) => {
    overlayStateRef.current = { ...overlayStateRef.current, ...next }
  }, [])

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

      const streamMatch = message.match(/Stream.*:\s*Video:.*,\s*(\d+):(\d+):(\d+)\.(\d+)/)
      if (streamMatch && durationSec === 0) {
        durationSec = parseInt(streamMatch[1]) * 3600
          + parseInt(streamMatch[2]) * 60
          + parseInt(streamMatch[3])
          + parseInt(streamMatch[4]) / 100
      }

      const timeMatch = message.match(/time=\s*(\d+):(\d+):(\d+)\.(\d+)/)
      if (timeMatch) {
        const cur = parseInt(timeMatch[1]) * 3600
          + parseInt(timeMatch[2]) * 60
          + parseInt(timeMatch[3])
          + parseInt(timeMatch[4]) / 100

        if (durationSec > 0) {
          const pct = Math.min(99, Math.round((cur / durationSec) * 100))
          setProgress(prev => (prev >= 100 ? 100 : pct > prev ? pct : prev))
        } else {
          setProgress(prev => (prev >= 99 ? 99 : prev + 1))
        }
      }
    })

    await ff.load({
      coreURL: '/ffmpeg/ffmpeg-core.js',
      wasmURL: '/ffmpeg/ffmpeg-core.wasm',
    })

    ffmpegRef.current = ff
    return ff
  }, [])

  const statusRef = useRef(status)
  statusRef.current = status

  const start = useCallback((gameCanvas, initialState = {}) => {
    if (!gameCanvas) { console.error('useRecorder.start: no canvas'); return }

    if (statusRef.current === 'recording' || statusRef.current === 'converting') {
      console.warn('useRecorder.start: already recording'); return
    }

    overlayStateRef.current = { showEditor: false, charColors: null, birthData: null, ...initialState }
    chunksRef.current = []
    setProgress(0)

    // Match the game canvas size exactly
    const compCanvas = document.createElement('canvas')
    compCanvas.width  = gameCanvas.width
    compCanvas.height = gameCanvas.height
    const compCtx = compCanvas.getContext('2d', { alpha: false })

    const stream = compCanvas.captureStream(30)

    const TARGET_FPS     = 30
    const FRAME_INTERVAL = 1000 / TARGET_FPS
    let lastCapture = 0

    const captureFrame = (ts) => {
      if (statusRef.current !== 'recording') return

      if (ts - lastCapture >= FRAME_INTERVAL) {
        lastCapture = ts

        // Blit the game canvas directly — zero DOM traversal
        compCtx.drawImage(gameCanvas, 0, 0)

        // Draw editor overlay on top if visible
        const { showEditor, charColors, birthData } = overlayStateRef.current
        if (showEditor && charColors && birthData) {
          drawEditorOverlay(compCtx, charColors, birthData)
        }
      }

      rafIdRef.current = requestAnimationFrame(captureFrame)
    }

    statusRef.current = 'recording'
    setStatus('recording')
    rafIdRef.current = requestAnimationFrame(captureFrame)

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'

    const mr = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.start(100)
    mediaRecorderRef.current = mr
  }, [])

  const stop = useCallback(async (filename = 'gameplay.mp4') => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') return

    cancelAnimationFrame(rafIdRef.current)
    statusRef.current = 'idle'

    setStatus('converting')
    setProgress(0)

    await new Promise(resolve => { mr.onstop = resolve; mr.stop() })

    try {
      const ff = await loadFfmpeg()

      for (const f of ['input.webm', 'output.mp4']) {
        try { await ff.deleteFile(f) } catch {}
      }

      const webmBlob = new Blob(chunksRef.current, { type: 'video/webm' })
      console.action(`[recorder] webm size: ${(webmBlob.size / 1024).toFixed(1)} KB, chunks: ${chunksRef.current.length}`)
      if (webmBlob.size < 1000) throw new Error('Recording too short — no data captured')

      const webmData = await (async (blob) => new Uint8Array(await blob.arrayBuffer()))(webmBlob)
      await ff.writeFile('input.webm', webmData)

      const exitCode = await ff.exec([
        '-i', 'input.webm',
        '-r', '30',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '25',
        '-vf', 'fps=30,pad=ceil(iw/2)*2:ceil(ih/2)*2',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-vsync', 'cfr',
        'output.mp4',
      ])

      if (exitCode !== 0) throw new Error(`ffmpeg exited with code ${exitCode}`)

      const data    = await ff.readFile('output.mp4')
      const mp4Blob = new Blob([data.buffer.slice(0)], { type: 'video/mp4' })
      console.action(`[recorder] mp4 size: ${(mp4Blob.size / 1024).toFixed(1)} KB`)

      setStatus('done')
      setProgress(100)

      onReadyRef.current?.(mp4Blob, filename)
    } catch (err) {
      console.error('Recording export failed:', err?.message ?? String(err))
      setStatus('error')
    }
  }, [loadFfmpeg])

  const cancel = useCallback(() => {
    cancelAnimationFrame(rafIdRef.current)
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

  return { start, stop, cancel, updateOverlay, status, progress }
}
