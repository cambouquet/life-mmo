const KEYS = {}

export function initInput() {
  const onDown = e => { 
    // Ignore input if user is typing in a text field or if focus is inside the debug panel
    const target = e.target;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
    const isDebugPanel = target.closest('.debug-panel');
    
    if (isInput || isDebugPanel) return;

    KEYS[e.code] = true;
    
    // Allow common system shortcuts (Ctrl+C, Ctrl+V, etc.)
    const isControlAction = e.ctrlKey || e.metaKey;
    if (!isControlAction) {
      e.preventDefault();
    }
  }
  const onUp   = e => { 
    if (!e.target.closest('.debug-panel')) {
      KEYS[e.code] = false;
    }
  }
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

export function simulateKey(code, isDown) {
  KEYS[code] = isDown
}

export function inputDir() {
  let dx = 0, dy = 0
  if (KEYS['ArrowLeft']  || KEYS['KeyA']) dx = -1
  if (KEYS['ArrowRight'] || KEYS['KeyD']) dx =  1
  if (KEYS['ArrowUp']    || KEYS['KeyW']) dy = -1
  if (KEYS['ArrowDown']  || KEYS['KeyS']) dy =  1
  return { dx, dy }
}
