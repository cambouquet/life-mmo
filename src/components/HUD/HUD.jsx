import Logo     from './Logo.jsx'
import CharPanel from './CharPanel.jsx'
import LogPanel  from './LogPanel.jsx'
import Clock     from './Clock.jsx'
import Minimap   from './Minimap.jsx'

export default function HUD({ facing, moving, logEntries, charColors, charName, playerPos, exploredTiles, worldData }) {
  return (
    <div className="hud">
      <Logo />
      <CharPanel facing={facing} moving={moving} charColors={charColors} charName={charName} />
      <LogPanel entries={logEntries} />
      <Minimap playerPos={playerPos} exploredTiles={exploredTiles} worldData={worldData} charColors={charColors} />
      <Clock />
    </div>
  )
}
