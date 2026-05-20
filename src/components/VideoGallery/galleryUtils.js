export function downloadVideo(v) {
  const a = document.createElement('a')
  a.href = v.url
  a.download = v.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function formatTime(ms) {
  const d = new Date(ms)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function getActiveVideo(videos, selected) {
  return videos.find(v => v.id === selected)
}

export function selectLatestVideo(videos, setSelected) {
  if (videos.length > 0) {
    setSelected(videos[videos.length - 1].id)
  }
}
