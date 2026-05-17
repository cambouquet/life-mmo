import React, { useState, useEffect } from 'react'

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
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {screenDebug.pages && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', color: '#c084fc', marginBottom: '6px', fontWeight: 'bold' }}>
                  NAVIGATE
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {screenDebug.pages.map((page) => (
                    <button
                      key={page}
                      onClick={() => executeAction('goToPage', page)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        background:
                          screenDebug.activePage === page
                            ? 'rgba(168, 85, 247, 0.4)'
                            : 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        color: '#c084fc',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => (e.target.style.background = 'rgba(168, 85, 247, 0.3)')}
                      onMouseLeave={(e) =>
                        (e.target.style.background =
                          screenDebug.activePage === page
                            ? 'rgba(168, 85, 247, 0.4)'
                            : 'rgba(168, 85, 247, 0.15)')
                      }
                    >
                      → {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div style={{ fontSize: '11px', color: '#c084fc', marginBottom: '6px', fontWeight: 'bold' }}>
                CHARACTER
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  onClick={() => executeAction('randomizeColors')}
                  style={{
                    padding: '4px 8px',
                    fontSize: '10px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#c084fc',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = 'rgba(168, 85, 247, 0.3)')}
                  onMouseLeave={(e) => (e.target.style.background = 'rgba(168, 85, 247, 0.15)')}
                >
                  randomize colors
                </button>
                <button
                  onClick={() => executeAction('logNatalData')}
                  style={{
                    padding: '4px 8px',
                    fontSize: '10px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#c084fc',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    width: '100%',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = 'rgba(168, 85, 247, 0.3)')}
                  onMouseLeave={(e) => (e.target.style.background = 'rgba(168, 85, 247, 0.15)')}
                >
                  log natal data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
