export default function Logo() {
  return (
    <div className="logo-panel">
      <div className="logo-panel__scene">
        <svg className="logo-panel__constellation" viewBox="0 0 120 52" overflow="visible" xmlns="http://www.w3.org/2000/svg">

          {/* Big sparkle */}
          <path d="M103,4 L103.5,12.5 L109,13 L103.5,13.5 L103,22 L102.5,13.5 L97,13 L102.5,12.5Z"
                fill="#ddd6f8" opacity="0.6"/>

          {/* Lone stray */}
          <path d="M14,38 L14.4,42.4 L18,43 L14.4,43.6 L14,48 L13.6,43.6 L10,43 L13.6,42.4Z"
                fill="#a898d0" opacity="0.4"/>

          {/* Faint field dots */}
          <circle cx="52" cy="9"  r="1"   fill="#9070c8" opacity="0.42"/>
          <circle cx="112" cy="34" r="0.8" fill="#7050b0" opacity="0.32"/>
        </svg>

        <div className="logo-panel__stack">
          <span className="logo-panel__the">The</span>
          <span className="logo-panel__life">Life</span>
          <span className="logo-panel__game">Game</span>
        </div>
      </div>
    </div>
  )
}
