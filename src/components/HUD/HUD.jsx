import Logo     from './Logo.jsx'
import CharPanel from './CharPanel.jsx'
import LogPanel  from './LogPanel.jsx'
import Clock     from './Clock.jsx'

export default function HUD({ facing, moving, logEntries }) {
  return (
    <div className="hud">
      <Logo />
      <CharPanel facing={facing} moving={moving} />
      <LogPanel entries={logEntries} />
      <Clock />
    </div>
  )
}
