import { ActionButton } from './ActionButton.jsx'

export function CharacterSection({ screenDebug, executeAction }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: '#c084fc', marginBottom: '6px', fontWeight: 'bold' }}>
        CHARACTER
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <ActionButton label="randomize colors" onClick={() => executeAction('randomizeColors')} />
        <ActionButton label="log natal data" onClick={() => executeAction('logNatalData')} />
        {screenDebug.actions?.debugScroll && (
          <ActionButton label="debug scroll" onClick={() => executeAction('debugScroll')} />
        )}
      </div>
    </div>
  )
}
