const KEYS = {}

export function initInput() {
  const onDown = e => { KEYS[e.code] = true;  e.preventDefault() }
  const onUp   = e => { KEYS[e.code] = false }
  window.addEventListener('keydown', onDown)
  window.addEventListener('keyup',   onUp)
  return () => {
    window.removeEventListener('keydown', onDown)
    window.removeEventListener('keyup',   onUp)
  }
}

export function isKeyDown(code) {
  return !!KEYS[code]
}

export function inputDir() {
  let dx = 0, dy = 0
  if (KEYS['ArrowLeft']  || KEYS['KeyA']) dx = -1
  if (KEYS['ArrowRight'] || KEYS['KeyD']) dx =  1
  if (KEYS['ArrowUp']    || KEYS['KeyW']) dy = -1
  if (KEYS['ArrowDown']  || KEYS['KeyS']) dy =  1
  return { dx, dy }
}
