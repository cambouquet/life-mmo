import { useEffect, useRef } from 'react'
import { drawHead } from '../../game/draw/head.jsx'

export default function CharPanel({ facing, charColors }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let raf;
    let lastBlink = performance.now();
    let blinkDuration = 100; // ms
    let isBlinking = false;

    const tick = (now) => {
      // Logic for random blinking
      // If we aren't blinking, check if it's time to start (every 2-6 seconds)
      if (!isBlinking && now - lastBlink > 2000 + Math.random() * 4000) {
        isBlinking = true;
        lastBlink = now;
      }
      
      // If we are blinking, check if we should stop
      if (isBlinking && now - lastBlink > blinkDuration) {
        isBlinking = false;
        lastBlink = now;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = false
        drawHead(ctx, facing, 'idle', charColors, { isBlinking })
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [facing, charColors])

  return (
    <div className="char-panel">
      <canvas ref={canvasRef} width={32} height={32} />
      <div className="char-panel__info">
        <div className="char-panel__name">Kami</div>
        <div className="char-panel__class">Novice · Lv 1</div>
      </div>
    </div>
  )
}
