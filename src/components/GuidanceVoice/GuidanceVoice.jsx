import { useState, useEffect } from 'react'

export default function GuidanceVoice({ text }) {
  const [shown,  setShown]  = useState(text)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (text === shown && !fading) return
    if (!text) {
      setFading(true)
      const t = setTimeout(() => { setShown(null); setFading(false) }, 400)
      return () => clearTimeout(t)
    }
    setFading(true)
    const t = setTimeout(() => { setShown(text); setFading(false) }, 350)
    return () => clearTimeout(t)
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!shown) return null
  return <div className={`guidance${fading ? ' guidance--out' : ' guidance--in'}`}>{shown}</div>
}
