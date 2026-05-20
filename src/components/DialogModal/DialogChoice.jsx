import { forwardRef } from 'react'

export const DialogChoice = forwardRef(({ choice, isFocused, index, onChoice, onMouseEnter }, ref) => (
  <button
    ref={ref}
    className={`dialog__choice${isFocused ? ' dialog__choice--focused' : ''}`}
    onClick={() => onChoice(choice)}
    onMouseEnter={() => onMouseEnter(index)}
  >
    {choice.text}
  </button>
))
