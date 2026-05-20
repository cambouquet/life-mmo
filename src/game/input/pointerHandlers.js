import { createOnMouseMove } from './mouseMove.js'
import { createOnMouseDown } from './mouseDown.js'
import { createOnMouseUp } from './mouseUp.js'
import { createOnClick } from './pointerClick.js'
import { createOnWheel } from './mouseWheel.js'

export function createPointerHandlers(canvas, state, refs, zoomRef) {
  return {
    onMouseMove: createOnMouseMove(state, refs, canvas, zoomRef),
    onMouseDown: createOnMouseDown(state, refs, canvas, zoomRef),
    onMouseUp: createOnMouseUp(state),
    onClick: createOnClick(state, refs, canvas, zoomRef),
    onWheel: createOnWheel(state, refs, zoomRef)
  }
}
