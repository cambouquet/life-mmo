import { useRecorder } from '../../playback/useRecorder.js'

export function useAppRecorder(setShowGallery) {
  const recorder = useRecorder({
    onReady: (blob, filename) => {
      const url = URL.createObjectURL(blob)
      setRecordings(prev => [...prev, { id: Date.now(), url, blob, filename, ts: Date.now() }])
      setShowGallery(true)
    }
  })
  return recorder
}
