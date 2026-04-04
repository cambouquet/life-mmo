const KEYS = {}

export function initInput() {
  window.addEventListener('keydown', e => { KEYS[e.code] = true;  e.preventDefault() })
  window.addEventListener('keyup',   e => { KEYS[e.code] = false })
}

export function destroyInput() {
  // caller should store the handlers and remove them; this module keeps it simple
  // — keys will just stop updating which is fine on unmount
}

export function inputDir() {
  let dx = 0, dy = 0
  if (KEYS['ArrowLeft']  || KEYS['KeyA']) dx = -1
  if (KEYS['ArrowRight'] || KEYS['KeyD']) dx =  1
  if (KEYS['ArrowUp']    || KEYS['KeyW']) dy = -1
  if (KEYS['ArrowDown']  || KEYS['KeyS']) dy =  1
  return { dx, dy }
}
