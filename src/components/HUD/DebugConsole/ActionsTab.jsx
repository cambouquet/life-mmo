import { useState, useEffect } from 'react'
import { NavigateSection } from './NavigateSection.jsx'
import { CharacterSection } from './CharacterSection.jsx'

export function ActionsTab() {
  const [screenDebug, setScreenDebug] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.__screenDebug) {
        setScreenDebug(window.__screenDebug)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const executeAction = (actionName, ...args) => {
    if (!screenDebug?.actions?.[actionName]) return
    try {
      screenDebug.actions[actionName](...args)
      console.log(`✓ ${actionName}`)
    } catch (err) {
      console.error(`✗ ${actionName}:`, err.message)
    }
  }

  if (!screenDebug) {
    return (
      <div className="debug-data-field">
        <div className="debug-data-label">—</div>
      </div>
    )
  }

  const { actions } = screenDebug

  return (
    <div className="debug-data-field" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {actions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavigateSection screenDebug={screenDebug} executeAction={executeAction} />
          <CharacterSection screenDebug={screenDebug} executeAction={executeAction} />
        </div>
      )}
    </div>
  )
}
