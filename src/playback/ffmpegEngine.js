export async function initFFmpeg(setProgress) {
  const { FFmpeg } = window.FFmpegWASM
  const ff = new FFmpeg()

  let durationSec = 0
  ff.on('log', ({ message }) => {
    const durMatch = message.match(/Duration:\s*(\d+):(\d+):(\d+)\.(\d+)/)
    if (durMatch) {
      durationSec = parseInt(durMatch[1]) * 3600 + parseInt(durMatch[2]) * 60 + parseInt(durMatch[3]) + parseInt(durMatch[4]) / 100
    }

    const streamMatch = message.match(/Stream.*:\s*Video:.*,\s*(\d+):(\d+):(\d+)\.(\d+)/)
    if (streamMatch && durationSec === 0) {
      durationSec = parseInt(streamMatch[1]) * 3600 + parseInt(streamMatch[2]) * 60 + parseInt(streamMatch[3]) + parseInt(streamMatch[4]) / 100
    }

    const timeMatch = message.match(/time=\s*(\d+):(\d+):(\d+)\.(\d+)/)
    if (timeMatch) {
      const cur = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 100
      if (durationSec > 0) {
        const pct = Math.min(99, Math.round((cur / durationSec) * 100))
        setProgress(prev => (prev >= 100 ? 100 : pct > prev ? pct : prev))
      } else {
        setProgress(prev => prev >= 99 ? 99 : prev + 1)
      }
    }
  })

  await ff.load({ coreURL: '/ffmpeg/ffmpeg-core.js', wasmURL: '/ffmpeg/ffmpeg-core.wasm' })
  return ff
}

export async function convertWebmToMp4(ff, webmBlob) {
  for (const f of ['input.webm', 'output.mp4']) {
    try {
      await ff.deleteFile(f)
    } catch {}
  }

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

  const data = await ff.readFile('output.mp4')
  return new Blob([data.buffer.slice(0)], { type: 'video/mp4' })
}
