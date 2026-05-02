import { useRef, useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { renderFrame } from '../game/render.js'

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
      console.log('[ffmpeg]', message)
      
      // 1. Primary Duration Check
      const durMatch = message.match(/Duration:\s*(\d+):(\d+):(\d+)\.(\d+)/)
      if (durMatch) {
        durationSec = parseInt(durMatch[1]) * 3600
          + parseInt(durMatch[2]) * 60
          + parseInt(durMatch[3])
          + parseInt(durMatch[4]) / 100
        console.log(`[recorder] input duration: ${durationSec.toFixed(2)}s`)
      }

      // 2. Fallback: Secondary Stream Duration Check (Common in live-rec WebM)
      const streamMatch = message.match(/Stream.*:\s*Video:.*,\s*(\d+):(\d+):(\d+)\.(\d+)/)
      if (streamMatch && durationSec === 0) {
        durationSec = parseInt(streamMatch[1]) * 3600
          + parseInt(streamMatch[2]) * 60
          + parseInt(streamMatch[3])
          + parseInt(streamMatch[4]) / 100
        console.log(`[recorder] fallback duration from stream: ${durationSec.toFixed(2)}s`)
      }

      const timeMatch = message.match(/time=\s*(\d+):(\d+):(\d+)\.(\d+)/)
      if (timeMatch) {
        const cur = parseInt(timeMatch[1]) * 3600
          + parseInt(timeMatch[2]) * 60
          + parseInt(timeMatch[3])
          + parseInt(timeMatch[4]) / 100
        
        if (durationSec > 0) {
          const pct = Math.min(99, Math.round((cur / durationSec) * 100))
          console.log(`[recorder] progress: ${cur.toFixed(2)}s / ${durationSec.toFixed(2)}s = ${pct}%`)
          
          setProgress(prev => {
            // Only update if it's an actual increase, avoid "jittering" backwards
            // If we're already at 100 (done), don't go back
            if (prev >= 100) return 100;
            if (pct > prev) return pct;
            return prev;
          })
        } else {
          // Indeterminate progress if duration is missing
          setProgress(prev => {
            if (prev >= 99) return 99;
            return prev + 1;
          })
        }
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

  const start = useCallback((canvas, initialState = {}) => {
    if (!canvas) { console.error('useRecorder.start: no canvas'); return }
    const rootElement = document.querySelector('.game-wrap')
    if (!rootElement) { console.error('useRecorder.start: .game-wrap not found'); return }

    if (statusRef.current === 'recording' || statusRef.current === 'converting') {
      console.warn('useRecorder.start: already recording'); return
    }

    // Set initial state for overlay
    overlayStateRef.current = {
      showEditor: false,
      charColors: null,
      birthData: null,
      ...initialState
    }

    chunksRef.current = []
    setStatus('idle')
    setProgress(0)
    
    // Create a hidden "composition" canvas that merges game + UI
    const compCanvas = document.createElement('canvas')
    const rect = rootElement.getBoundingClientRect()
    compCanvas.width = rect.width
    compCanvas.height = rect.height
    const compCtx = compCanvas.getContext('2d', { alpha: false })
    compCtx.fillStyle = '#000'
    compCtx.fillRect(0, 0, compCanvas.width, compCanvas.height)
    
    // Recording stream from the composition canvas
    const stream = compCanvas.captureStream(30)
    
    // Frame capture loop
    let lastCapture = 0
    let isCapturing = false
    const TARGET_FPS = 30
    const FRAME_INTERVAL = 1000 / TARGET_FPS

    const captureFrame = async (ts) => {
      if (statusRef.current !== 'recording') return
      
      const dt = ts - lastCapture
      if (dt >= FRAME_INTERVAL && !isCapturing) {
        lastCapture = ts
        isCapturing = true

        try {
          const snapshot = await html2canvas(rootElement, {
            backgroundColor: '#06040e',
            scale: 1, 
            logging: false,
            useCORS: true,
            allowTaint: true,
            ignoreElements: (el) => el.classList.contains('vgallery-backdrop') || el.classList.contains('record-btn')
          })
          
          compCtx.drawImage(snapshot, 0, 0, compCanvas.width, compCanvas.height)
        } catch (err) {
          console.error('[recorder] html2canvas error:', err)
        } finally {
          isCapturing = false
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

    const mr = new MediaRecorder(stream, { 
      mimeType, 
      videoBitsPerSecond: 8_000_000 
    })
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
      
      // Use helper for Blob to Uint8Array if FFmpegUtil is missing
      const toUint8Array = async (blob) => {
        const buffer = await blob.arrayBuffer()
        return new Uint8Array(buffer)
      }

      // Clean up any leftover files from a previous run
      for (const f of ['input.webm', 'output.mp4']) {
        try { await ff.deleteFile(f) } catch {}
      }

      const webmBlob = new Blob(chunksRef.current, { type: 'video/webm' })
      console.action(`[recorder] webm size: ${(webmBlob.size / 1024).toFixed(1)} KB, chunks: ${chunksRef.current.length}`)
      if (webmBlob.size < 1000) throw new Error('Recording too short — no data captured')

      // FALLBACK/DEBUG: Also trigger onReady with the raw WebM if MP4 fails or for testing
      // console.log('[recorder] Triggering preview with raw WebM...')
      // onReadyRef.current?.(webmBlob, filename.replace('.mp4', '.webm'))

      console.action('[recorder] Converting blob to Uint8Array...')
      const webmData = await toUint8Array(webmBlob)
      console.action('[recorder] Writing input.webm to WASM FS...')
      await ff.writeFile('input.webm', webmData)

      console.action('[recorder] FFmpeg exec start — re-encoding VP9→H.264 (Max Compatibility)...')
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
      console.log(`[recorder] FFmpeg exec finished with code: ${exitCode}`)

      if (exitCode !== 0) throw new Error(`ffmpeg exited with code ${exitCode}`)

      const data    = await ff.readFile('output.mp4')
      const mp4Blob = new Blob([data.buffer.slice(0)], { type: 'video/mp4' })

      console.action(`[recorder] mp4 size: ${(mp4Blob.size / 1024).toFixed(1)} KB`)

      // Auto-download
      const dlUrl = URL.createObjectURL(mp4Blob)
      const link = document.createElement('a')
      link.href = dlUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(dlUrl), 10_000)

      setStatus('done')
      setProgress(100)

      if (onReadyRef.current) {
        console.action('[recorder] Triggering onReady callback...')
        onReadyRef.current(mp4Blob, filename)
      } else {
        console.warn('[recorder] No onReady callback provided')
      }
    } catch (err) {
      console.error('Recording export failed:', err?.message ?? String(err))
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

  return { start, stop, cancel, updateOverlay, status, progress }
}
