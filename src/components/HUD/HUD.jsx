import Logo     from './Logo.jsx'
import CharPanel from './CharPanel.jsx'
import LogPanel  from './LogPanel.jsx'
import Clock     from './Clock.jsx'

export default function HUD({ facing, moving, logEntries, charColors, charName }) {
  return (
    <div className="hud">
      <Logo />
      <CharPanel facing={facing} moving={moving} charColors={charColors} charName={charName} />
      <LogPanel entries={logEntries} />
      <Clock />
    </div>
  )
}
