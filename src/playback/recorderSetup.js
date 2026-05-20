export function createMediaRecorder(stream) {
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm'
  return new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
}

export function attachStreamEndListener(stream, onStreamEnd) {
  stream.getVideoTracks()[0].addEventListener('ended', onStreamEnd)
}

export function stopMediaRecorder(mr) {
  return new Promise(resolve => {
    mr.onstop = resolve
    mr.stop()
  })
}

export function stopStreamTracks(stream) {
  stream.getTracks().forEach(t => t.stop())
}
