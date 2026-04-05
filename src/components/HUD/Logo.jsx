export default function Logo() {
  return (
    <div className="logo-panel">
      <div className="logo-panel__scene">
        <span className="logo-panel__star" style={{top:'4px',  left:'2px',  fontSize:'7px', opacity:0.9}} >✦</span>
        <span className="logo-panel__star" style={{top:'8px',  right:'4px', fontSize:'5px', opacity:0.55}}>✦</span>
        <span className="logo-panel__star" style={{bottom:'6px',left:'8px', fontSize:'4px', opacity:0.45}}>✦</span>
        <span className="logo-panel__star" style={{top:'2px',  left:'30px', fontSize:'4px', opacity:0.35}}>✦</span>
        <span className="logo-panel__star" style={{bottom:'4px',right:'6px',fontSize:'6px', opacity:0.6}} >✦</span>
        <div className="logo-panel__stack">
          <span className="logo-panel__the">The</span>
          <span className="logo-panel__life">Life</span>
          <span className="logo-panel__game">Game</span>
        </div>
      </div>
    </div>
  )
}
